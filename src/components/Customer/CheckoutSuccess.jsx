import React, { useEffect, useState } from 'react';
import { CheckCircle, Package, Clock, MapPin, Phone, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ReceiptModal from './ReceiptModal';

const CheckoutSuccess = ({ order, onClose }) => {
  const [showConfetti, setShowConfetti] = useState(true);
  const [showReceipt, setShowReceipt] = useState(true); // Auto-open receipt on mount

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            >
              {['🍩', '🎉', '✨', '🎊'][Math.floor(Math.random() * 4)]}
            </div>
          ))}
        </div>
      )}

      <div className="bg-white rounded-2xl max-w-2xl w-full max-height-[90vh] overflow-y-auto shadow-2xl">
        {/* Success Header */}
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white p-8 text-center rounded-t-2xl">
          <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <CheckCircle className="w-12 h-12" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Order Confirmed! 🎉</h1>
          <p className="text-green-100 text-lg">Thank you for choosing Simple Dough!</p>

          <div className="mt-4 bg-white bg-opacity-20 rounded-lg p-3 inline-block">
            <p className="text-sm">Order Number</p>
            <p className="text-2xl font-bold">#{order.id.slice(-8)}</p>
          </div>
        </div>

        {/* Order Details */}
        <div className="p-8 space-y-6">
          {/* Status Timeline */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-600" />
              Order Status
            </h3>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-green-700">Order Received</span>
              </div>
              <div className="flex-1 h-0.5 bg-gray-300"></div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                <span className="text-sm text-gray-500">Preparing</span>
              </div>
              <div className="flex-1 h-0.5 bg-gray-300"></div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                <span className="text-sm text-gray-500">Ready</span>
              </div>
            </div>

            <p className="text-sm text-amber-700 mt-3">
              We'll notify you when your delicious donuts are ready!
            </p>
          </div>

          {/* Delivery Information */}
          <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              {(order.deliveryMethod || order.delivery_method) === 'delivery'
                ? <MapPin className="w-5 h-5 text-blue-600" />
                : <Package className="w-5 h-5 text-blue-600" />
              }
              {(order.deliveryMethod || order.delivery_method) === 'delivery' ? 'Delivery Details' : 'Pickup Details'}
            </h3>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-gray-700">{order.phone}</span>
              </div>

              {(order.deliveryMethod || order.delivery_method) === 'delivery' ? (
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-700">{order.deliveryAddress || order.delivery_address}</p>
                    <p className="text-xs text-blue-600 mt-1">Estimated delivery: 30–45 minutes</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-3">
                  <Package className="w-4 h-4 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-700">Simple Dough Store</p>
                    <p className="text-xs text-blue-600 mt-1">Ready for pickup in 15–20 minutes</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h3>

            <div className="space-y-3">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 p-3 bg-white rounded-lg">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{item.product.name}</h4>
                    {item.customizations.flavors?.length > 0 && (
                      <p className="text-xs text-gray-600">
                        Flavors: {item.customizations.flavors.join(', ')}
                      </p>
                    )}
                    <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                  </div>
                  <span className="font-semibold text-gray-900">₱{item.totalPrice}</span>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="border-t mt-4 pt-4">
              <div className="flex justify-between items-center text-sm mb-2">
                <span>Subtotal:</span>
                <span>
                  ₱{(order.total || order.total_amount) - ((order.deliveryMethod || order.delivery_method) === 'delivery' ? 50 : 0)}
                </span>
              </div>

              {(order.deliveryMethod || order.delivery_method) === 'delivery' && (
                <div className="flex justify-between items-center text-sm mb-2">
                  <span>Delivery Fee:</span>
                  <span>₱50</span>
                </div>
              )}

              <div className="flex justify-between items-center text-lg font-bold text-amber-600">
                <span>Total:</span>
                <span>₱{order.total || order.total_amount}</span>
              </div>

              <div className="flex justify-between items-center text-sm text-gray-600 mt-1">
                <span>Payment Method:</span>
                <span>{(order.paymentMethod || order.payment_method || 'CASH').toUpperCase()}</span>
              </div>
            </div>
          </div>

          {/* Post-Order Reviews (submit reviews only for items in this order) */}
          <div className="bg-white rounded-xl p-6 border border-amber-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Leave Reviews for Your Items</h3>
            <OrderItemReviews order={order} />
          </div>

          {/* Special Instructions */}
          {order.notes && (
            <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Special Instructions</h3>
              <p className="text-sm text-gray-700">{order.notes}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => setShowReceipt(true)}
              className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-105 flex items-center justify-center gap-2"
            >
              View Receipt
            </button>

            <Link
              to="/menu"
              className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 px-6 rounded-lg font-semibold hover:from-amber-600 hover:to-orange-600 transition-all transform hover:scale-105 flex items-center justify-center gap-2"
            >
              Order More Donuts
            </Link>
          </div>

          <button
            onClick={onClose}
            className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Continue Shopping
          </button>
        </div>

        {/* Footer */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white p-6 text-center rounded-b-2xl">
          <p className="text-sm">
            🍩 Thank you for choosing Simple Dough! We're preparing your fresh donuts with love.
            Follow us for updates and special offers!
          </p>
        </div>
      </div>

      {/* Auto-open Receipt Modal */}
      {showReceipt && (
        <ReceiptModal
          order={order}
          onClose={() => setShowReceipt(false)}
        />
      )}
    </div>
  );
};

export default CheckoutSuccess;

// Helper component to handle per-item reviews on the success page
const OrderItemReviews = ({ order }) => {
  const { user } = useAuth();
  const [allReviews, setAllReviews] = useState(() => JSON.parse(localStorage.getItem('simple-dough-reviews') || '[]'));
  const [inputs, setInputs] = useState(() => {
    const map = {};
    (order.items || []).forEach(item => {
      const id = item.product.id;
      map[id] = { rating: 5, comment: '' };
    });
    return map;
  });

  const hasReviewed = (productId) => {
    return allReviews.some(r => String(r.productId) === String(productId) && r.orderId === order.id && (r.userId === user?.id || r.userId === null));
  };

  const submitReview = (productId) => {
    const input = inputs[productId] || { rating: 5, comment: '' };
    const newReview = {
      id: Date.now().toString(),
      productId: productId,
      orderId: order.id,
      userId: user?.id || null,
      name: user?.name || 'Anonymous',
      rating: Number(input.rating),
      comment: (input.comment || '').trim(),
      createdAt: new Date().toISOString()
    };

    const updated = [newReview, ...allReviews];
    localStorage.setItem('simple-dough-reviews', JSON.stringify(updated));
    setAllReviews(updated);
    alert('Thanks — your review was saved.');
  };

  const setField = (productId, field, value) => {
    setInputs(prev => ({ ...prev, [productId]: { ...prev[productId], [field]: value } }));
  };

  return (
    <div className="space-y-4">
      {(order.items || []).map((item, idx) => {
        const pid = item.product.id;
        return (
          <div key={idx} className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-start gap-4">
              <img src={item.product.image} alt={item.product.name} className="w-14 h-14 object-cover rounded" />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{item.product.name}</h4>
                  <span className="text-sm text-gray-600">Qty: {item.quantity}</span>
                </div>

                {hasReviewed(pid) ? (
                  <div className="text-sm text-gray-600">You have already reviewed this item for this order.</div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <label className="text-sm text-gray-600">Rating</label>
                      <select
                        value={inputs[pid]?.rating}
                        onChange={(e) => setField(pid, 'rating', e.target.value)}
                        className="px-3 py-2 border rounded-lg"
                      >
                        <option value={5}>5 - Excellent</option>
                        <option value={4}>4 - Very good</option>
                        <option value={3}>3 - Good</option>
                        <option value={2}>2 - Fair</option>
                        <option value={1}>1 - Poor</option>
                      </select>
                    </div>
                    <textarea
                      value={inputs[pid]?.comment}
                      onChange={(e) => setField(pid, 'comment', e.target.value)}
                      placeholder="Write an optional comment (max 500 chars)"
                      maxLength={500}
                      className="w-full p-3 border rounded-lg text-sm"
                      rows={2}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => submitReview(pid)}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                      >
                        Submit Review
                      </button>
                      <button
                        onClick={() => setField(pid, 'rating', 5) || setField(pid, 'comment', '')}
                        className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
