interface StatCardProps {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
}

export default function StatsCard({ title, value, change, isPositive }: StatCardProps) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h3 className="text-sm font-medium text-gray-500 mb-2">{title}</h3>
      <p className="text-3xl font-bold text-gray-900 mb-2">{value}</p>
      <p className={`text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {isPositive ? '↑' : '↓'} {change} from last month
      </p>
    </div>
  );
}

export function StatsCards() {
  const stats = [
    { title: 'Total Residents', value: '1,247', change: '12%', isPositive: true },
    { title: 'Active Verifications', value: '89', change: '5%', isPositive: true },
    { title: 'Worker Uptime', value: '99.2%', change: '0.3%', isPositive: true },
  ];

  return (
    <>
      {stats.map((stat) => (
        <StatsCard key={stat.title} {...stat} />
      ))}
    </>
  );
}
