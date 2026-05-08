'use client';

import { useState } from 'react';
import { PartnerModal } from './PartnerModal';

export function CreatePartnerButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        + New Partner
      </button>

      {isOpen && (
        <PartnerModal
          mode="create"
          onClose={() => setIsOpen(false)}
          onSuccess={() => {
            setIsOpen(false);
            window.location.reload();
          }}
        />
      )}
    </>
  );
}
