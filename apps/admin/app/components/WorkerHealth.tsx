interface Worker {
  name: string;
  status: 'Healthy' | 'Degraded' | 'Down';
  uptime: string;
  lastCheck: string;
}

const mockWorkers: Worker[] = [
  { name: 'identity-worker', status: 'Healthy', uptime: '14d 3h', lastCheck: '2026-05-07 21:50' },
  { name: 'verification-processor', status: 'Healthy', uptime: '7d 12h', lastCheck: '2026-05-07 21:48' },
  { name: 'notification-sender', status: 'Degraded', uptime: '2d 5h', lastCheck: '2026-05-07 21:45' },
];

export default function WorkerHealth() {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Worker Health</h2>
      <div className="space-y-4">
        {mockWorkers.map((worker) => (
          <div key={worker.name} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">{worker.name}</p>
              <p className="text-sm text-gray-500">Last check: {worker.lastCheck}</p>
            </div>
            <div className="text-right">
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                worker.status === 'Healthy' ? 'bg-green-100 text-green-800' :
                worker.status === 'Degraded' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {worker.status}
              </span>
              <p className="text-sm text-gray-500 mt-1">Uptime: {worker.uptime}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
