// src/components/Layout/DashboardTabs.jsx
import React from "react";
import { BarChart3, Package, ShoppingCart, TrendingUp, MessageSquare } from "lucide-react";

export const DashboardTabs = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: "dashboard", name: "Dashboard", icon: BarChart3 },
    { id: "inventory", name: "Manage Inventory", icon: Package },
    { id: "orders", name: "View All Orders", icon: ShoppingCart },
    { id: "reports", name: "Generate Reports", icon: TrendingUp },
    { id: "reviews", name: "Reviews", icon: MessageSquare },
  ];

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2 sm:py-4">
      <nav className="border-b border-gray-200 overflow-x-auto">
        <div className="-mb-px flex gap-2 sm:gap-8 min-w-min sm:min-w-0">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1 sm:gap-2 py-3 sm:py-4 px-2 sm:px-2 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap ${
                  activeTab === tab.id
                    ? "border-amber-500 text-amber-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">{tab.name}</span>
                <span className="sm:hidden text-xs">{tab.name.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};
