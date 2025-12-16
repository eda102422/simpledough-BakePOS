import React, { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

const ReviewsAdmin = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        if (supabase) {
          const { data, error } = await supabase.from('reviews').select('*').order('created_at', { ascending: false });
          if (!error && mounted) {
            setReviews(data || []);
            setLoading(false);
            return;
          }
        }
      } catch (e) {
        console.error('Supabase fetch failed, falling back to localStorage', e.message || e);
      }

      // fallback to localStorage
      const local = JSON.parse(localStorage.getItem('simple-dough-reviews') || '[]');
      if (mounted) {
        setReviews(local);
        setLoading(false);
      }
    };
    load();
    return () => { mounted = false };
  }, []);

  const deleteReview = async (id) => {
    if (!confirm('Delete this review?')) return;
    try {
      if (supabase) {
        const { error } = await supabase.from('reviews').delete().eq('id', id);
        if (!error) {
          setReviews(prev => prev.filter(r => String(r.id) !== String(id)));
          return;
        }
        throw error;
      }
    } catch (e) {
      console.error('Supabase delete failed, falling back to localStorage', e.message || e);
    }

    // fallback removal from localStorage
    const updated = reviews.filter(r => String(r.id) !== String(id));
    localStorage.setItem('simple-dough-reviews', JSON.stringify(updated));
    setReviews(updated);
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Customer Reviews</h1>
        <p className="text-sm text-gray-600">Manage and moderate customer reviews{supabase ? ' (Supabase)' : ' (localStorage fallback)'}.</p>
      </div>

      {loading ? (
        <div className="bg-white rounded-lg p-6 text-gray-500">Loading reviews…</div>
      ) : reviews.length === 0 ? (
        <div className="bg-white rounded-lg p-6 text-gray-500">No reviews yet.</div>
      ) : (
        <div className="space-y-4">
          {reviews.map(review => (
            <div key={review.id} className="bg-white rounded-lg p-4 shadow-sm flex items-start justify-between">
              <div className="min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-semibold truncate">{review.name || 'Anonymous'}</h3>
                  <span className="text-xs text-gray-500">• {new Date(review.created_at || review.createdAt).toLocaleString()}</span>
                </div>
                <div className="text-sm text-gray-700 mb-2">Product: <span className="font-medium">{review.product_id || review.productId}</span></div>
                <div className="text-sm text-gray-700">Rating: <span className="font-semibold">{review.rating}/5</span></div>
                {review.comment && <p className="mt-2 text-sm text-gray-600 break-words">{review.comment}</p>}
              </div>
              <div className="ml-4 flex-shrink-0">
                <button onClick={() => deleteReview(review.id)} className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewsAdmin;
