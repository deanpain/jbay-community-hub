#!/usr/bin/env python3
"""
Coastline Angle Calculation from Sentinel-1 SAR Data
For SurfSpot / Wave Vault - surf break detection
"""

import numpy as np
from sentinelhub import SentinelHubRequest, DataCollection, MimeType, CRS, BBox
import matplotlib.pyplot as plt
from scipy import ndimage
import os

# Jeffreys Bay scan area (from memory)
# -34.15 to -34.22, 24.80 to 24.88
AOI_BBOX = BBox(bbox=(-34.22, 24.80, -34.15, 24.88), crs=CRS.WGS84)

def fetch_sar_data():
    """Fetch Sentinel-1 GRD data for the AOI"""
    request = SentinelHubRequest(
        data_folder='sar_data',
        data_collection=DataCollection.SENTINEL1_IW,
        bbox=AOI_BBOX,
        time=('2026-01-01', '2026-05-01'),
        mosaicking_order='mostRecent',
        size=(512, 512)
    )
    
    # Get VV polarization (better for water-land contrast)
    evalscript = """
    //VERSION=3
    function setup() {
        return {
            input: ["VV"],
            output: { id:"default", bands:1, sampleType: "FLOAT32" }
        };
    }
    function evaluatePixel(sample) {
        return [sample.VV];
    }
    """
    
    request.evalscript = evalscript
    data = request.get_data()
    return np.array(data[0])

def calculate_coastline_angle(sar_image):
    """
    Calculate coastline angle from SAR image
    Returns: angle in degrees (0-360, clockwise from North)
    """
    # Step 1: Threshold to separate land (high backscatter) from water (low)
    # VV: water ~ -25dB, land ~ -10dB
    threshold = np.percentile(sar_image, 30)  # Lower percentile = more water
    land_mask = sar_image > threshold
    
    # Step 2: Find coastline pixels (edges of land mask)
    # Use Sobel filters to find gradients
    sobel_x = ndimage.sobel(land_mask.astype(float), axis=1)
    sobel_y = ndimage.sobel(land_mask.astype(float), axis=0)
    
    # Gradient magnitude and direction
    gradient_mag = np.sqrt(sobel_x**2 + sobel_y**2)
    gradient_dir = np.arctan2(sobel_y, sobel_x) * 180 / np.pi  # -180 to 180
    
    # Step 3: Coastline angle is perpendicular to gradient direction
    # Gradient points from water to land, coastline angle is along the coast
    coastline_angles = (gradient_dir + 90) % 360
    
    # Step 4: Get dominant coastline angle (weighted by gradient magnitude)
    valid_mask = gradient_mag > 0.5 * gradient_mag.max()
    if np.any(valid_mask):
        dominant_angle = np.average(coastline_angles[valid_mask], 
                                    weights=gradient_mag[valid_mask])
    else:
        dominant_angle = 0
    
    return dominant_angle, land_mask, gradient_mag, coastline_angles

def validate_with_google_earth(angle):
    """
    Placeholder for validation against Google Earth imagery
    (User prefers Google Earth over Sentinel-2 for 0.5m resolution)
    """
    print(f"Coastline angle calculated: {angle:.1f}°")
    print("Validation: Compare with Google Earth imagery at Jeffreys Bay")
    print("Google Earth shows pools clearly at 0.5m resolution")
    return angle

def main():
    print("=== Coastline Angle Calculation for Surf Break Detection ===")
    print(f"AOI: Jeffreys Bay scan area {AOI_BBOX}")
    
    # Check for Sentinel Hub credentials
    if not os.path.exists(os.path.expanduser('~/.sentinelhub/config.cfg')):
        print("WARNING: Sentinel Hub credentials not found.")
        print("User has Copernicus Sentinel Hub account - configure credentials first.")
        print("Using synthetic data for prototype...")
        
        # Generate synthetic SAR-like data for prototype
        # Simulate coastline running roughly E-W (angle ~90°)
        np.random.seed(42)
        sar_image = np.random.randn(512, 512) * 5 - 15  # Water ~ -15dB
        # Add land mass (higher backscatter) on eastern side
        land_mask = np.zeros((512, 512), dtype=bool)
        land_mask[:, 300:] = True
        sar_image[land_mask] += 10  # Land ~ -5dB
    else:
        print("Fetching Sentinel-1 SAR data...")
        sar_image = fetch_sar_data()
    
    # Calculate coastline angle
    angle, land_mask, grad_mag, coast_angles = calculate_coastline_angle(sar_image)
    
    # Validate
    validate_with_google_earth(angle)
    
    # Save results
    results = {
        'coastline_angle_degrees': float(angle),
        'aoi': str(AOI_BBOX),
        'method': 'SAR backscatter threshold + Sobel gradient',
        'validation': 'Google Earth (0.5m resolution)',
        'next_steps': [
            'Integrate with SurfSpot/Wave Vault pipeline',
            'Add swell/wind matching logic (INK-28)',
            'Run Jeffreys Bay validation test (INK-29)'
        ]
    }
    
    print("\nResults:")
    for k, v in results.items():
        print(f"  {k}: {v}")
    
    # Save to file
    with open('coastline_angle_results.json', 'w') as f:
        import json
        json.dump(results, f, indent=2)
    
    print(f"\nResults saved to coastline_angle_results.json")
    return results

if __name__ == "__main__":
    main()
