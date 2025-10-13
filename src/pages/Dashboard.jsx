import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  ShoppingCart, 
  Activity,
  Calendar,
  BarChart3,
  PieChart,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

const Dashboard = () => {
  const { t } = useTranslation();
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  // Sample data for metrics
  const metrics = [
    {
      title: 'Total Revenue',
      value: '€45,231',
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10'
    },
    {
      title: 'Active Users',
      value: '2,345',
      change: '+8.2%',
      trend: 'up',
      icon: Users,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10'
    },
    {
      title: 'Total Orders',
      value: '1,234',
      change: '-3.1%',
      trend: 'down',
      icon: ShoppingCart,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10'
    },
    {
      title: 'Conversion Rate',
      value: '3.24%',
      change: '+0.5%',
      trend: 'up',
      icon: Activity,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10'
    }
  ];

  // Sample data for recent activity
  const recentActivity = [
    { id: 1, action: 'New order placed', user: 'John Doe', time: '2 minutes ago', amount: '€234.50' },
    { id: 2, action: 'User registration', user: 'Jane Smith', time: '15 minutes ago', amount: null },
    { id: 3, action: 'Payment received', user: 'Mike Johnson', time: '1 hour ago', amount: '€456.00' },
    { id: 4, action: 'New order placed', user: 'Sarah Williams', time: '2 hours ago', amount: '€123.75' },
    { id: 5, action: 'Subscription renewed', user: 'Tom Brown', time: '3 hours ago', amount: '€99.00' },
  ];

  // Sample data for top products
  const topProducts = [
    { id: 1, name: 'Product A', sales: 1234, revenue: '€12,340', trend: '+15%' },
    { id: 2, name: 'Product B', sales: 987, revenue: '€9,870', trend: '+8%' },
    { id: 3, name: 'Product C', sales: 756, revenue: '€7,560', trend: '-2%' },
    { id: 4, name: 'Product D', sales: 543, revenue: '€5,430', trend: '+12%' },
    { id: 5, name: 'Product E', sales: 432, revenue: '€4,320', trend: '+5%' },
  ];

  // Sample chart data for the week
  const weeklyData = [
    { day: 'Mon', value: 65 },
    { day: 'Tue', value: 78 },
    { day: 'Wed', value: 90 },
    { day: 'Thu', value: 72 },
    { day: 'Fri', value: 85 },
    { day: 'Sat', value: 95 },
    { day: 'Sun', value: 88 },
  ];

  const maxValue = Math.max(...weeklyData.map(d => d.value));

  return (
    <div className="p-6" style={{background: 'transparent'}}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
          <p className="text-sm text-subtle mt-1">Overview of your business analytics</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-subtle" />
          <select 
            value={selectedPeriod} 
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="input text-sm px-3 py-1.5"
          >
            <option value="week">Last 7 days</option>
            <option value="month">Last 30 days</option>
            <option value="quarter">Last 90 days</option>
            <option value="year">Last year</option>
          </select>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          const TrendIcon = metric.trend === 'up' ? ArrowUpRight : ArrowDownRight;
          
          return (
            <div 
              key={index}
              style={{ background: 'hsl(var(--panel))' }}
              className="border border-border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                  <Icon className={`w-5 h-5 ${metric.color}`} />
                </div>
                <div className={`flex items-center gap-1 text-xs font-medium ${metric.trend === 'up' ? 'text-success' : 'text-error'}`}>
                  <TrendIcon className="w-3 h-3" />
                  {metric.change}
                </div>
              </div>
              
              <div className="text-2xl font-bold text-foreground mb-1">{metric.value}</div>
              <div className="text-sm text-subtle">{metric.title}</div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Weekly Bar Chart */}
        <div 
          style={{ background: 'hsl(var(--panel))' }}
          className="lg:col-span-2 border border-border rounded-lg p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Weekly Performance</h2>
              <p className="text-sm text-subtle mt-1">Sales activity over the last 7 days</p>
            </div>
            <BarChart3 className="w-5 h-5 text-accent" />
          </div>
          
          <div className="flex items-end justify-between gap-3 h-64 px-4">
            {weeklyData.map((data, index) => (
              <div key={index} className="flex flex-col items-center flex-1 gap-2 h-full">
                <div className="w-full flex items-end justify-center flex-1">
                  <div 
                    className="w-full bg-gradient-to-t from-accent to-accent/70 rounded-t-lg transition-all hover:from-accent/90 hover:to-accent/60 cursor-pointer relative group shadow-lg"
                    style={{ 
                      height: `${(data.value / maxValue) * 100}%`,
                      minHeight: '30px',
                      maxWidth: '60px'
                    }}
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-foreground text-background text-xs font-semibold px-2 py-1 rounded shadow-lg whitespace-nowrap z-10">
                      {data.value}%
                    </div>
                  </div>
                </div>
                <span className="text-xs text-subtle font-medium mt-2">{data.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue Distribution Pie Chart */}
        <div 
          style={{ background: 'hsl(var(--panel))' }}
          className="border border-border rounded-lg p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Revenue by Category</h2>
              <p className="text-sm text-subtle mt-1">Distribution breakdown</p>
            </div>
            <PieChart className="w-5 h-5 text-accent" />
          </div>
          
          {/* Pie Chart SVG */}
          <div className="flex items-center justify-center mb-4">
            <svg width="180" height="180" viewBox="0 0 180 180" className="transform -rotate-90">
              {/* Product Sales - 35% */}
              <circle
                cx="90"
                cy="90"
                r="70"
                fill="none"
                stroke="hsl(var(--accent))"
                strokeWidth="40"
                strokeDasharray="154 440"
                strokeDashoffset="0"
                className="transition-all duration-300 hover:stroke-width-45"
              />
              {/* Services - 30% */}
              <circle
                cx="90"
                cy="90"
                r="70"
                fill="none"
                stroke="#10b981"
                strokeWidth="40"
                strokeDasharray="132 440"
                strokeDashoffset="-154"
                className="transition-all duration-300 hover:stroke-width-45"
              />
              {/* Subscriptions - 25% */}
              <circle
                cx="90"
                cy="90"
                r="70"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="40"
                strokeDasharray="110 440"
                strokeDashoffset="-286"
                className="transition-all duration-300 hover:stroke-width-45"
              />
              {/* Other - 10% */}
              <circle
                cx="90"
                cy="90"
                r="70"
                fill="none"
                stroke="#6366f1"
                strokeWidth="40"
                strokeDasharray="44 440"
                strokeDashoffset="-396"
                className="transition-all duration-300 hover:stroke-width-45"
              />
            </svg>
          </div>
          
          {/* Legend */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'hsl(var(--accent))' }}></div>
                <span className="text-sm text-foreground">Product Sales</span>
              </div>
              <span className="text-sm font-semibold text-foreground">35%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-sm text-foreground">Services</span>
              </div>
              <span className="text-sm font-semibold text-foreground">30%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                <span className="text-sm text-foreground">Subscriptions</span>
              </div>
              <span className="text-sm font-semibold text-foreground">25%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                <span className="text-sm text-foreground">Other</span>
              </div>
              <span className="text-sm font-semibold text-foreground">10%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Products Section */}
      <div 
        style={{ background: 'hsl(var(--panel))' }}
        className="border border-border rounded-lg p-6 mb-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Top Products</h2>
          <BarChart3 className="w-5 h-5 text-accent" />
        </div>
        
        <div className="space-y-3">
          {topProducts.map((product, index) => (
            <div key={product.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-xs font-bold text-accent">
                  {index + 1}
                </div>
                <div>
                  <div className="text-sm font-medium text-foreground">{product.name}</div>
                  <div className="text-xs text-subtle">{product.sales} sales</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-foreground">{product.revenue}</div>
                <div className={`text-xs ${product.trend.startsWith('+') ? 'text-success' : 'text-error'}`}>
                  {product.trend}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div 
        style={{ background: 'hsl(var(--panel))' }}
        className="border border-border rounded-lg p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Recent Activity</h2>
          <button className="text-sm text-accent hover:text-accent/80 transition-colors">
            View all
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-sm font-medium text-subtle">Action</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-subtle">User</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-subtle">Time</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-subtle">Amount</th>
              </tr>
            </thead>
            <tbody>
              {recentActivity.map((activity) => (
                <tr key={activity.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                  <td className="py-3 px-4 text-sm text-foreground">{activity.action}</td>
                  <td className="py-3 px-4 text-sm text-foreground font-medium">{activity.user}</td>
                  <td className="py-3 px-4 text-sm text-subtle">{activity.time}</td>
                  <td className="py-3 px-4 text-sm text-right font-semibold text-foreground">
                    {activity.amount || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
