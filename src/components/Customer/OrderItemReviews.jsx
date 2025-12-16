import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabaseClient';

const OrderItemReviews = ({ order }) => {
  const { user } = useAuth();
  const [allReviews, setAllReviews] = useState([]);
  const [inputs, setInputs] = useState(() => {
    const map = {};
    (order.items || []).forEach(item => {
      const id = item.product.id;
      map[id] = { rating: 5, comment: '' };
    });
    return map;
  });

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        if (supabase) {
          const { data, error } = await supabase
            .from('reviews')
            .select('*')
            .or(`order_id.eq.${order.id},order_id.is.null`)
            .order('created_at', { ascending: false });
          if (!error && mounted) {
            setAllReviews(data || []);
            return;
          }
        }
      } catch (e) {
        // ignore and fallback
      }

      const local = JSON.parse(localStorage.getItem('simple-dough-reviews') || '[]');
      if (mounted) setAllReviews(local);
    };
    load();
    return () => { mounted = false };
  }, [order.id]);

  const hasReviewed = (productId) => {
    return allReviews.some(r => String(r.product_id || r.productId) === String(productId) && (r.order_id === order.id || r.orderId === order.id) && (r.user_id === user?.id || r.userId === null));
  };

  const submitReview = async (productId) => {
    const input = inputs[productId] || { rating: 5, comment: '' };
    const payload = {
      product_id: productId,
      order_id: order.id,
      user_id: user?.id || null,
      name: user?.name || 'Anonymous',
      rating: Number(input.rating),
      comment: (input.comment || '').trim(),
      created_at: new Date().toISOString()
    };

    try {
      if (supabase) {
        const { data, error } = await supabase.from('reviews').insert(payload).select().single();
        if (error) throw error;
        const updated = [data, ...allReviews];
        setAllReviews(updated);
        alert('Thanks — your review was saved.');
        return;
      }
    } catch (e) {
      console.error('Supabase save failed, falling back to localStorage', e.message || e);
    }

    const newReview = {
      id: Date.now().toString(),
      productId: productId,
      product_id: productId,
      orderId: order.id,
      order_id: order.id,
      userId: user?.id || null,
      user_id: user?.id || null,
      name: user?.name || 'Anonymous',
      rating: Number(input.rating),
      comment: (input.comment || '').trim(),
      createdAt: new Date().toISOString(),
      created_at: new Date().toISOString()
    };

    const updated = [newReview, ...allReviews];
    localStorage.setItem('simple-dough-reviews', JSON.stringify(updated));
    setAllReviews(updated);
    alert('Thanks — your review was saved (offline).');
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

export default OrderItemReviews;
