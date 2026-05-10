# System Architecture — J-Bay Community Hub

## End-to-End Data Flow (Satellites → User Interface)

```mermaid
flowchart TB
    subgraph Satellites["🛰️ Satellite Data Sources"]
        S1[Sentinel-2 (10m optical)]
        S2[Sentinel-1 (SAR)]
        S3[Google Earth Engine]
        S4[Google Maps Static API]
    end

    subgraph DataProcessing["⚙️ Data Processing Layer"]
        DP1[coastline_angle.py<br/>Coastline geometry]
        DP2[SurfSpot detection<br/>ML models + imagery]
        DP3[Pool detection<br/>Computer vision]
        DP4[Wind/swell matching<br/>Open-Meteo Marine]
    end

    subgraph Backend["🔧 Backend Services"]
        IDW[identity-worker<br/>Altron/DHA batch]
        API[services/api<br/>BFF + health]
        SUP[Supabase<br/>Postgres + Auth]
        RENDER[Render free tier<br/>identity-worker host]
    end

    subgraph Frontend["📱 User Interfaces"]
        MOB[apps/mobile<br/>Expo/React Native]
        ADM[Admin Dashboard<br/>React + Supabase]
        VERCEL[Vercel deployment<br/>Admin UI]
    end

    subgraph Blockchain["🔗 Midnight Blockchain"]
        COMP[Midnight Compact<br/>Listings + Treasury]
        LACE[Lace Wallet<br/>Browser extension]
        MIDN[Midnames VCs<br/>did:midnight]
    end

    subgraph External["🌐 External APIs"]
        SURF[Surfline API<br/>Surf forecasts]
        OPM[Open-Meteo Marine<br/>Wind/swell data]
        ALTRON[Altron Sandbox<br/>Identity verification]
        DHA[DHA (Department of Home Affairs)<br/>Citizen verification]
    end

    %% Satellite to Processing
    S1 -->|"10m imagery"| DP2
    S1 -->|"10m imagery"| DP3
    S2 -->|"SAR imagery"| DP2
    S3 -->|"GEE processing"| DP1
    S3 -->|"GEE processing"| DP2
    S4 -->|"static maps"| DP3

    %% Processing to Backend
    DP1 -->|"coastline angles"| SUP
    DP2 -->|"surf spot metadata"| SUP
    DP3 -->|"pool locations"| SUP
    DP4 -->|"conditions match"| SUP

    %% External APIs to Processing/Backend
    SURF -->|"surf forecasts"| DP4
    OPM -->|"marine data"| DP4
    DP4 -->|"matched conditions"| SUP

    %% Identity flow
    MOB -->|"user credential request"| IDW
    IDW -->|"encrypted batch"| RENDER
    RENDER -->|"batch submit"| ALTRON
    ALTRON -->|"verification result"| DHA
    DHA -->|"verified credential"| MIDN
    MIDN -->|"VC issued"| LACE
    LACE -->|"proof presentation"| MOB

    %% Frontend to Backend
    MOB -->|"listings, auth"| API
    API -->|"data access"| SUP
    MOB -->|"treasury, governance"| COMP
    ADM -->|"admin, analytics"| API
    ADM -->|"data management"| SUP
    ADM -->|"deployment"| VERCEL

    %% Admin UI deployment
    ADM -->|"hosted on"| VERCEL

    %% Notes
    classDef satellite fill:#e1f5fe,stroke:#0288d1
    classDef processing fill:#f3e5f5,stroke:#7b1fa2
    classDef backend fill:#e8f5e8,stroke:#388e3c
    classDef frontend fill:#fff3e0,stroke:#f57c00
    classDef blockchain fill:#fce4ec,stroke:#c2185b
    classDef external fill:#f5f5f5,stroke:#616161

    class S1,S2,S3,S4 satellite
    class DP1,DP2,DP3,DP4 processing
    class IDW,API,SUP,RENDER backend
    class MOB,ADM,VERCEL frontend
    class COMP,LACE,MIDN blockchain
    class SURF,OPM,ALTRON,DHA external
```

## Component Responsibilities

| Layer | Component | Responsibility |
|-------|-------------|-----------------|
| **Satellite Data** | Sentinel-2, Sentinel-1, GEE | Raw imagery for surf spot detection, coastline analysis, pool detection |
| **Data Processing** | Python scripts (coastline_angle.py, ML models) | Transform raw imagery into usable data: coastline angles, surf spot locations, pool detections, wind/swell matches |
| **Backend** | identity-worker, services/api, Supabase | Identity batch processing, API endpoints, data persistence |
| **Frontend** | apps/mobile (Expo), Admin Dashboard (React) | Resident UX, wallet connectivity, admin management |
| **Blockchain** | Midnight Compact, Lace, Midnames | Smart contracts for listings/treasury, wallet integration, verifiable credentials |
| **External** | Surfline, Open-Meteo, Altron, DHA | Surf forecasts, marine data, identity verification |

## Key Data Flows

1. **Satellite → Surf Spot Detection**: Sentinel-2 imagery → ML processing → surf spot metadata stored in Supabase
2. **Satellite → Coastline Analysis**: Google Earth Engine → coastline_angle.py → coastline geometry in Supabase
3. **Satellite → Pool Detection**: Google Maps Static + Sentinel-2 → computer vision → pool locations in Supabase
4. **Marine Data → Condition Matching**: Surfline + Open-Meteo → wind/swell matching → condition reports in Supabase
5. **User → Identity Verification**: Mobile app → identity-worker → Altron/DHA batch → Midnames VC → Lace wallet
6. **User → Listings**: Mobile app → API → Supabase → listings displayed; treasury actions via Midnight Compact

## Trust Boundaries

- **Mobile app**: No raw ID numbers or DHA payloads persisted in logs/analytics
- **Identity worker**: Handles ciphertext only; decryption keys in HSM/KMS-backed environments
- **Midnight chain**: Exposes only commitments, treasury rules, auditable tallies — not individual behavioral graphs

## Deployment Architecture

- **identity-worker**: Deployed on Render free tier (see `render.yaml`)
- **Admin Dashboard**: Hosted on Vercel (see `apps/admin` deployment config)
- **Mobile App**: Expo build → TestFlight pilot (iOS) / EAS build
- **Supabase**: Managed Postgres (Neon for dev, Supabase cloud for prod)
- **Midnight**: Compact contracts on Midnight testnet/mainnet

## References

- Identity batching ADR: [`docs/adr/0001-async-identity-batch-altron-dha.md`](../adr/0001-async-identity-batch-altron-dha.md)
- Lace + Expo ADR: [`docs/adr/0003-lace-expo-metro-wallet-integration.md`](../adr/0003-lace-expo-metro-wallet-integration.md)
- MVP feature set: [`docs/architecture/mvp-feature-set.md`](mvp-feature-set.md)
- Catalyst milestones: [`docs/catalyst/milestone-checklist.md`](../catalyst/milestone-checklist.md)
