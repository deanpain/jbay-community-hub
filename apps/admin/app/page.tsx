import WorkerHealth from './components/WorkerHealth';
import StatsCards from './components/StatsCards';
import VerificationsFeed from './components/VerificationsFeed';

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">J-Bay Community Hub Admin</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatsCards />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <VerificationsFeed />
        <WorkerHealth />
      </div>
    </main>
  );
}
