import { ShoppingBag, User, Settings, Clock } from 'lucide-react';

export const ActivityCard = ({ activities }) => {
  const getIcon = (type) => {
    switch (type) {
      case 'sale':
        return <ShoppingBag className="text-black" size={16} />;
      case 'user':
        return <User className="text-black" size={16} />;
      case 'system':
        return <Settings className="text-black" size={16} />;
      default:
        return <Clock className="text-black" size={16} />;
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 h-96">
      <h2 className="text-xl font-semibold text-black mb-6">Recent Activity</h2>
      
      <div className="space-y-4 overflow-y-auto max-h-80">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-start gap-3 p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="p-2 bg-gray-100 rounded-full border border-gray-200">
              {getIcon(activity.type)}
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-black text-sm font-medium mb-1">
                {activity.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-xs">{activity.time}</span>
                {activity.amount && (
                  <span className="text-black text-sm font-semibold">
                    {activity.amount}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-200">
        <button className="w-full text-black hover:text-gray-600 text-sm font-medium transition-colors">
          View All Activities →
        </button>
      </div>
    </div>
  );
};