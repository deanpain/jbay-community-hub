interface Verification {
  id: string;
  resident: string;
  type: 'ID' | 'Address' | 'Income';
  status: 'Approved' | 'Pending' | 'Rejected';
  date: string;
}

const mockVerifications: Verification[] = [
  { id: '1', resident: 'James M.', type: 'ID', status: 'Approved', date: '2026-05-07' },
  { id: '2', resident: 'Sarah K.', type: 'Address', status: 'Pending', date: '2026-05-06' },
  { id: '3', resident: 'Thomas L.', type: 'Income', status: 'Approved', date: '2026-05-05' },
  { id: '4', resident: 'Lisa V.', type: 'ID', status: 'Rejected', date: '2026-05-04' },
];

export default function VerificationsFeed() {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Verifications</h2>
      <div className="space-y-4">
        {mockVerifications.map((v) => (
          <div key={v.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">{v.resident}</p>
              <p className="text-sm text-gray-500">{v.type} Verification</p>
            </div>
            <div className="text-right">
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                v.status === 'Approved' ? 'bg-green-100 text-green-800' :
                v.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {v.status}
              </span>
              <p className="text-sm text-gray-500 mt-1">{v.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
