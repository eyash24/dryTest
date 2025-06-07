import { MetricCard } from '../testCards/metricCard';
import { ChartCard } from '../testCards/chartCard';
import { ActivityCard } from '../testCards/ActivityCard';
import { TrendingUp, Users, DollarSign, ShoppingCart, Eye, BarChart3 } from 'lucide-react';

const Dashboard = () => {
  const metrics = [
    {
      title: "Total Revenue",
      value: "$124,563",
      change: "+12.5%",
      icon: DollarSign
    },
    {
      title: "Active Users",
      value: "8,492",
      change: "+8.2%",
      icon: Users
    },
    {
      title: "Orders",
      value: "1,847",
      change: "+15.3%",
      icon: ShoppingCart
    },
    {
      title: "Page Views",
      value: "45,231",
      change: "+5.7%",
      icon: Eye
    }
  ];

  const activities = [
    {
      id: 1,
      type: "sale",
      description: "New order #1847 from Sarah Johnson",
      time: "2 minutes ago",
      amount: "$89.99"
    },
    {
      id: 2,
      type: "user",
      description: "New user registration: Michael Chen",
      time: "5 minutes ago",
      amount: null
    },
    {
      id: 3,
      type: "sale",
      description: "Order #1846 completed",
      time: "12 minutes ago",
      amount: "$156.50"
    },
    {
      id: 4,
      type: "system",
      description: "Database backup completed successfully",
      time: "1 hour ago",
      amount: null
    }
  ];

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-black mb-2 flex items-center gap-3">
            <BarChart3 className="text-black" size={40} />
            Analytics Dashboard
          </h1>
          <p className="text-gray-600 text-lg">
            Welcome back! Here's what's happening with your business today.
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric, index) => (
            <MetricCard
              key={metric.title}
              {...metric}
            />
          ))}
        </div>

        {/* Charts and Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart Section */}
          <div className="lg:col-span-2">
            <ChartCard />
          </div>

          {/* Activity Feed */}
          <div className="lg:col-span-1">
            <ActivityCard activities={activities} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;