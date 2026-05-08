'use client';

import { useState } from 'react';
import type { Partner, WorkshopStatus } from '../../src/types/partner';
import { PartnerModal } from './PartnerModal';

interface PartnersTableProps {
  partners: Array<Partner & { listings_count: number }>;
}

const WORKSHOP_STATUS_COLORS: Record<string, string> = {
  not_started: 'bg-gray-100 text-gray-800',
  in_progress: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
};

export function PartnersTable({ partners }: PartnersTableProps) {
  const [partnersList, setPartnersList] = useState(partners);
  const [editingPartner, setEditingPartner] = useState<(Partner & { listings_count: number }) | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStatusChange = async (partnerId: string, newStatus: WorkshopStatus) => {
    setIsUpdating(true);
    setError(null);
    const response = await fetch(`/api/partners/${partnerId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ workshop_status: newStatus }),
    });
    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      setError(payload.error || 'Failed to update workshop status');
      setIsUpdating(false);
      return;
    }

    setPartnersList((prev) =>
      prev.map((partner) =>
        partner.id === partnerId ? { ...partner, workshop_status: newStatus } : partner,
      ),
    );
    setIsUpdating(false);
  };

  const handleDelete = async (partnerId: string, partnerName: string) => {
    if (!confirm(`Are you sure you want to delete partner "${partnerName}"?`)) return;
    setIsUpdating(true);
    setError(null);
    const response = await fetch(`/api/partners/${partnerId}`, { method: 'DELETE' });
    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      setError(payload.error || 'Failed to delete partner');
      setIsUpdating(false);
      return;
    }

    setPartnersList((prev) => prev.filter((partner) => partner.id !== partnerId));
    setIsUpdating(false);
  };

  const formatType = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {editingPartner && (
        <PartnerModal
          mode="edit"
          partnerId={editingPartner.id}
          initialData={editingPartner}
          onClose={() => setEditingPartner(null)}
          onSuccess={() => window.location.reload()}
        />
      )}

      <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Partner
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Type
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Contact
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Workshop Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Listings
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Created
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {partnersList.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                No partners found. Create your first partner to get started.
              </td>
            </tr>
          ) : (
            partnersList.map(partner => (
              <tr key={partner.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{partner.name}</div>
                  {partner.notes && (
                    <div className="text-sm text-gray-500 truncate max-w-xs">{partner.notes}</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                    {formatType(partner.type)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{partner.contact_name || '-'}</div>
                  <div className="text-sm text-gray-500">{partner.contact_email || '-'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={partner.workshop_status}
                    onChange={(e) => handleStatusChange(partner.id, e.target.value as WorkshopStatus)}
                    disabled={isUpdating}
                    className={`text-xs font-semibold rounded-full px-2 py-1 border-0 ${WORKSHOP_STATUS_COLORS[partner.workshop_status] || 'bg-gray-100'}`}
                  >
                    <option value="not_started">Not Started</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {partner.listings_count ?? 0} listings
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(partner.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  <button
                    onClick={() => setEditingPartner(partner)}
                    disabled={isUpdating}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(partner.id, partner.name)}
                    disabled={isUpdating}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      </div>
    </div>
  );
}
