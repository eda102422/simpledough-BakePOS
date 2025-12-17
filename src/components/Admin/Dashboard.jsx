import React, { useState, useEffect } from "react";
import {
  BarChart3,
  ShoppingCart,
  Users,
  TrendingUp,
  AlertTriangle,
  Package,
} from "lucide-react";
import { useInventory } from "../../context/InventoryContext";
import { PRODUCTS } from "../../data/products";
import InventoryManagement from "./InventoryManagement";
import OrderManagement from "./OrderManagement";
import Reports from "./Reports";
import Reviews from "./Reviews"; // ✅ ADD THIS
import { DashboardTabs } from "../../components/Layout/DashboardTabs";
import { supabase } from "../../lib/supabaseClient";

const Dashboard = () => {
  const { inventory, getLowStockProducts } = useInventory();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({
    todayOrders: 0,
    todayRevenue: 0,
    totalCustomers: 1,
    avgOrderValue: 0,
  });

  useEffect(() => {
    let mounted = true;
    const fetchOrders = async () => {
      try {
        const { data, error } = await supabase
          .from("orders")
          .select(`
            *,
            order_items (
              *,
              products (id, name)
            )
          `)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching orders:", error);
          return;
        }

        const mapped = (data || []).map(order => ({
          id: order.id,
          customerId: order.customer_id,
          createdAt: order.created_at,
          status: order.status,
          total: Number(order.total_amount || 0),
          paymentMethod: order.payment_method || "unknown",
          items: (order.order_items || []).map(item => ({
            id: item.id,
            quantity: item.quantity,
            totalPrice: Number(item.price || 0),
            product: {
              id: item.products?.id,
              name: item.products?.name || "Unknown",
            },
          })),
        }));

        if (mounted) setOrders(mapped);
      } catch (err) {
        console.error("Dashboard order load error:", err);
      }
    };

    fetchOrders();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const today = new Date().toDateString();
    const todayOrders = orders.filter(
      o => new Date(o.createdAt).toDateString() === today
    );

    const todayRevenue = todayOrders.reduce((s, o) => s + o.total, 0);

    setStats({
      todayOrders: todayOrders.length,
      todayRevenue,
      totalCustomers: new Set(orders.map(o => o.customerId)).size,
      avgOrderValue:
        todayOrders.length > 0 ? todayRevenue / todayOrders.length : 0,
    });
  }, [orders]);

  const lowStockProducts = getLowStockProducts();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <DashboardTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* DASHBOARD */}
      {activeTab === "dashboard" && (
        <div className="mt-8">
          <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
          {/* dashboard UI stays the same */}
        </div>
      )}

      {/* INVENTORY */}
      {activeTab === "inventory" && <InventoryManagement />}

      {/* ORDERS */}
      {activeTab === "orders" && <OrderManagement />}

      {/* REPORTS */}
      {activeTab === "reports" && <Reports />}

      {/* ✅ REVIEWS (THIS WAS MISSING) */}
      {activeTab === "reviews" && <Reviews />}
    </div>
  );
};

export default Dashboard;
