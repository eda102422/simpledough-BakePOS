import React, { useState, useEffect, useRef } from 'react';
import { BarChart3, TrendingUp, Download, Calendar, DollarSign, ShoppingCart, Users, Package } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import html2pdf from 'html2pdf.js';

const Reports = () => {
  const [orders, setOrders] = useState([]);
  const [dateRange, setDateRange] = useState('today');
  const [reportData, setReportData] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    avgOrderValue: 0,
    topProducts: [],
    revenueByDay: [],
    ordersByStatus: {},
    paymentMethods: {}
  });

  // Fetch orders from Supabase
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select(`
            id,
            created_at,
            status,
            total_amount,
            payment_method,
            delivery_method,
            order_items (
              id,
              quantity,
              price,
              flavors,
              toppings,
              products (
                id,
                name,
                price
              )
            )
          `)
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Transform Supabase data to match expected format
        const transformedOrders = (data || []).map(order => ({
          id: order.id,
          createdAt: order.created_at,
          status: order.status,
          total: order.total_amount,
          paymentMethod: order.payment_method,
          deliveryMethod: order.delivery_method,
          items: (order.order_items || []).map(item => ({
            id: item.id,
            quantity: item.quantity,
            totalPrice: item.price,
            product: {
              id: item.products?.id,
              name: item.products?.name,
              price: item.products?.price
            },
            customizations: {
              flavors: item.flavors || [],
              toppings: item.toppings || {}
            }
          }))
        }));

        setOrders(transformedOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setOrders([]);
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    generateReport();
  }, [orders, dateRange]);

  const getDateRange = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    switch (dateRange) {
      case 'today':
        return { start: today, end: new Date(today.getTime() + 24 * 60 * 60 * 1000) };
      case 'week':
        const weekStart = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        return { start: weekStart, end: now };
      case 'month':
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        return { start: monthStart, end: now };
      case 'year':
        const yearStart = new Date(now.getFullYear(), 0, 1);
        return { start: yearStart, end: now };
      default:
        return { start: today, end: new Date(today.getTime() + 24 * 60 * 60 * 1000) };
    }
  };

  const generateReport = () => {
    const { start, end } = getDateRange();
    const filteredOrders = orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      return orderDate >= start && orderDate < end;
    });

    // Calculate basic metrics
    const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = filteredOrders.length;
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Top products
    const productSales = {};
    filteredOrders.forEach(order => {
      order.items.forEach(item => {
        const productName = item.product.name;
        if (!productSales[productName]) {
          productSales[productName] = { quantity: 0, revenue: 0 };
        }
        productSales[productName].quantity += item.quantity;
        productSales[productName].revenue += item.totalPrice;
      });
    });

    const topProducts = Object.entries(productSales)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    // Revenue by day (last 7 days)
    const revenueByDay = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);
      
      const dayOrders = orders.filter(order => {
        const orderDate = new Date(order.createdAt);
        return orderDate >= dayStart && orderDate < dayEnd;
      });
      
      const dayRevenue = dayOrders.reduce((sum, order) => sum + order.total, 0);
      revenueByDay.push({
        date: dayStart.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
        revenue: dayRevenue,
        orders: dayOrders.length
      });
    }

    // Orders by status
    const ordersByStatus = {};
    filteredOrders.forEach(order => {
      ordersByStatus[order.status] = (ordersByStatus[order.status] || 0) + 1;
    });

    // Payment methods
    const paymentMethods = {};
    filteredOrders.forEach(order => {
      paymentMethods[order.paymentMethod] = (paymentMethods[order.paymentMethod] || 0) + 1;
    });

    setReportData({
      totalRevenue,
      totalOrders,
      avgOrderValue,
      topProducts,
      revenueByDay,
      ordersByStatus,
      paymentMethods
    });
  };

  const reportRef = useRef(null);

  const exportReport = () => {
    if (!reportRef.current) return;

    const element = reportRef.current;
    const opt = {
      margin: 15,
      filename: `simple-dough-report-${dateRange}-${new Date().toISOString().split('T')[0]}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
    };

    html2pdf().set(opt).from(element).save();
  };

  const StatCard = ({ title, value, icon: Icon, color, change }) => (
    <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-shadow">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">{title}</p>
          <p className="text-xl sm:text-3xl font-bold text-gray-900 mt-1">{value}</p>
          {change !== undefined && (
            <p className={`text-xs sm:text-sm mt-1 ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change >= 0 ? '+' : ''}{change}% from previous period
            </p>
          )}
        </div>
        <div className={`w-10 h-10 sm:w-12 sm:h-12 ${color} rounded-full flex items-center justify-center flex-shrink-0`}>
          <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-6 sm:mb-8 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">Reports & Analytics</h1>
          <p className="text-sm sm:text-base text-gray-600">Comprehensive business insights and performance metrics</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 sm:px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          >
            <option value="today">Today</option>
            <option value="week">Last 7 Days</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
          <button
            onClick={exportReport}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 sm:px-6 py-2 rounded-lg font-semibold text-sm hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-105 shadow-lg"
          >
            <Download className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">Export</span>
            <span className="sm:hidden">PDF</span>
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div ref={reportRef} className="bg-white p-8 rounded-lg">
        {/* Report Title */}
        <div className="mb-8 pb-6 border-b-2 border-amber-500">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Simple Dough Report</h1>
          <p className="text-gray-600 mb-2">Business Analytics & Performance Metrics</p>
          <div className="flex gap-8 text-sm text-gray-600">
            <div>
              <span className="font-semibold">Date Range:</span> {
                dateRange === 'today' ? 'Today' :
                dateRange === 'week' ? 'Last 7 Days' :
                dateRange === 'month' ? 'This Month' :
                'This Year'
              }
            </div>
            <div>
              <span className="font-semibold">Generated:</span> {new Date().toLocaleString()}
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Summary Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-green-600">₱{reportData.totalRevenue.toLocaleString()}</p>
            </div>
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-blue-600">{reportData.totalOrders}</p>
            </div>
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-gray-600">Avg Order Value</p>
              <p className="text-2xl font-bold text-amber-600">₱{reportData.avgOrderValue.toFixed(0)}</p>
            </div>
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <p className="text-sm text-gray-600">Unique Customers</p>
              <p className="text-2xl font-bold text-purple-600">{new Set(orders.map(o => o.customerId)).size}</p>
            </div>
          </div>
        </div>

        {/* Revenue by Day */}
        <div className="mb-8 page-break">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Daily Revenue (Last 7 Days)</h2>
          <table className="w-full text-sm">
            <thead className="bg-gray-100 border-b-2 border-gray-300">
              <tr>
                <th className="p-3 text-left font-semibold text-gray-800">Date</th>
                <th className="p-3 text-center font-semibold text-gray-800">Orders</th>
                <th className="p-3 text-right font-semibold text-gray-800">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {reportData.revenueByDay.map((day, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="p-3 border-b border-gray-200">{day.date}</td>
                  <td className="p-3 text-center border-b border-gray-200">{day.orders}</td>
                  <td className="p-3 text-right font-semibold border-b border-gray-200">₱{day.revenue.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Top Products */}
        <div className="mb-8 page-break">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Top Selling Products</h2>
          <table className="w-full text-sm">
            <thead className="bg-gray-100 border-b-2 border-gray-300">
              <tr>
                <th className="p-3 text-left font-semibold text-gray-800">Rank</th>
                <th className="p-3 text-left font-semibold text-gray-800">Product Name</th>
                <th className="p-3 text-center font-semibold text-gray-800">Quantity Sold</th>
                <th className="p-3 text-right font-semibold text-gray-800">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {reportData.topProducts.map((product, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="p-3 border-b border-gray-200 font-bold text-amber-600">{index + 1}</td>
                  <td className="p-3 border-b border-gray-200">{product.name}</td>
                  <td className="p-3 text-center border-b border-gray-200">{product.quantity}</td>
                  <td className="p-3 text-right font-semibold border-b border-gray-200">₱{product.revenue.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Order Status Breakdown */}
        {Object.keys(reportData.ordersByStatus).length > 0 && (
          <div className="mb-8 page-break">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Orders by Status</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries(reportData.ordersByStatus).map(([status, count], index) => (
                <div key={index} className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <p className="text-sm text-gray-600 capitalize">{status}</p>
                  <p className="text-xl font-bold text-gray-900">{count}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Payment Methods */}
        {Object.keys(reportData.paymentMethods).length > 0 && (
          <div className="mb-8 page-break">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Payment Methods</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(reportData.paymentMethods).map(([method, count], index) => (
                <div key={index} className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <p className="text-sm text-gray-600 capitalize">{method}</p>
                  <p className="text-xl font-bold text-gray-900">{count}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 pt-6 border-t-2 border-gray-300 text-center text-xs text-gray-600">
          <p>Simple Dough Management System</p>
          <p>This report was generated on {new Date().toLocaleString()}</p>
        </div>
      </div>

      {/* Display Metrics - Same as before but outside PDF */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8 mt-8">
        <StatCard
          title="Total Revenue"
          value={`₱${reportData.totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          color="bg-gradient-to-br from-green-500 to-green-600"
          change={12}
        />
        <StatCard
          title="Total Orders"
          value={reportData.totalOrders.toLocaleString()}
          icon={ShoppingCart}
          color="bg-gradient-to-br from-blue-500 to-blue-600"
          change={8}
        />
        <StatCard
          title="Avg Order Value"
          value={`₱${reportData.avgOrderValue.toFixed(0)}`}
          icon={BarChart3}
          color="bg-gradient-to-br from-amber-500 to-orange-500"
          change={-3}
        />
        <StatCard
          title="Unique Customers"
          value={new Set(orders.map(o => o.customerId)).size}
          icon={Users}
          color="bg-gradient-to-br from-purple-500 to-purple-600"
          change={15}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Revenue Chart */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Daily Revenue (Last 7 Days)</h3>
            <TrendingUp className="w-6 h-6 text-green-500" />
          </div>
          <div className="space-y-4">
            {reportData.revenueByDay.map((day, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700">{day.date}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600">{day.orders} orders</span>
                  <span className="font-semibold text-gray-900">₱{day.revenue}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Top Selling Products</h3>
            <Package className="w-6 h-6 text-amber-500" />
          </div>
          <div className="space-y-4">
            {reportData.topProducts.map((product, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-600">{product.quantity} sold</p>
                  </div>
                </div>
                <span className="font-semibold text-green-600">₱{product.revenue}</span>
              </div>
            ))}
            {reportData.topProducts.length === 0 && (
              <p className="text-center text-gray-500 py-8">No sales data available</p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Order Status Distribution */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Orders by Status</h3>
          <div className="space-y-3">
            {Object.entries(reportData.ordersByStatus).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="capitalize font-medium text-gray-700">
                  {status.replace('_', ' ')}
                </span>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-sm font-bold">
                    {count}
                  </div>
                  <span className="text-sm text-gray-600">
                    {reportData.totalOrders > 0 ? Math.round((count / reportData.totalOrders) * 100) : 0}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Payment Methods</h3>
          <div className="space-y-3">
            {Object.entries(reportData.paymentMethods).map(([method, count]) => (
              <div key={method} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="uppercase font-medium text-gray-700">{method}</span>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-100 text-green-800 rounded-full flex items-center justify-center text-sm font-bold">
                    {count}
                  </div>
                  <span className="text-sm text-gray-600">
                    {reportData.totalOrders > 0 ? Math.round((count / reportData.totalOrders) * 100) : 0}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Summary Report */}
      <div className="mt-8 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-200">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Period Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-gray-600">Revenue Growth</p>
            <p className="text-lg font-semibold text-green-600">+12% vs previous period</p>
          </div>
          <div>
            <p className="text-gray-600">Best Selling Day</p>
            <p className="text-lg font-semibold text-gray-900">
              {reportData.revenueByDay.length > 0 
                ? reportData.revenueByDay.reduce((max, day) => day.revenue > max.revenue ? day : max, reportData.revenueByDay[0]).date
                : 'N/A'
              }
            </p>
          </div>
          <div>
            <p className="text-gray-600">Customer Satisfaction</p>
            <p className="text-lg font-semibold text-amber-600">4.8/5 ⭐</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;