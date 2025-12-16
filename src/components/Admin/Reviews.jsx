import React, { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    let mounted = true;

    const loadReviews = async () => {
      setLoading(true);
      setErrorMsg('');

      // Ensure user is authenticated
      const { data: auth } = await supabase.auth.getUser();
      if (!auth?.user) {
        setErrorMsg('You must be logged in to view reviews.');
        setLoading(false);
        return;
      }

      // Fetch reviews with product name
      const { data, error } = await supabase
        .from('reviews')
.select(`
  id,
  name,
  rating,
  comment,
  created_at,
  product_id,
  products (
    name
  )
`)

        .order('created_at', { ascending: false });

      if (error) {
        console.error('REVIEWS FETCH ERROR:', error);
        setErrorMsg(error.message);
        setLoading(false);
        return;
      }

      if (mounted) {
        setReviews(data || []);
        setLoading(false);
      }
    };

    loadReviews();
    return () => { mounted = false; };
  }, []);

  const deleteReview = async (id) => {
    if (!confirm('Delete this review?')) return;

    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', id);

    if (error) {
      alert(error.message);
      return;
    }

    setReviews(prev => prev.filter(r => r.id !== id));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-2">Customer Reviews</h1>

      {loading && (
        <div className="bg-white p-6 rounded-lg text-gray-500">
          Loading reviews…
        </div>
      )}

      {!loading && errorMsg && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg">
          {errorMsg}
        </div>
      )}

      {!loading && !errorMsg && reviews.length === 0 && (
        <div className="bg-white p-6 rounded-lg text-gray-500">
          No reviews found.
        </div>
      )}

      <div className="space-y-4">
        {reviews.map(review => (
          <div
            key={review.id}
            className="bg-white rounded-lg p-4 shadow-sm flex justify-between"
          >
            <div>
              <div className="flex gap-2 items-center mb-1">
                <h3 className="font-semibold">
                  {review.name || 'Anonymous'}
                </h3>
                <span className="text-xs text-gray-500">
                  • {new Date(review.created_at).toLocaleString()}
                </span>
              </div>

              <div className="text-sm text-gray-700">
                Product:{' '}
                <span className="font-medium">
                  {review.products?.name || review.product_id}
                </span>
              </div>

              <div className="text-sm text-gray-700">
                Rating: <strong>{review.rating}/5</strong>
              </div>

              {review.comment && (
                <p className="mt-2 text-sm text-gray-600">
                  {review.comment}
                </p>
              )}
            </div>

            <button
              onClick={() => deleteReview(review.id)}
              className="p-2 h-fit bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reviews;
