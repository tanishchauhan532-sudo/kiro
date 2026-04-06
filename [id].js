import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { FiShoppingCart, FiHeart, FiStar, FiTruck, FiShield, FiArrowLeft, FiMinus, FiPlus } from 'react-icons/fi';
import { AiFillHeart, AiFillStar } from 'react-icons/ai';
import Link from 'next/link';
import toast from 'react-hot-toast';
import API from '../../lib/api';
import useStore from '../../store/useStore';
import StarRating from '../../components/StarRating';
import ProductCard from '../../components/ProductCard';

export default function ProductDetail() {
  const router = useRouter();
  const { id } = router.query;
  const { user, isWishlisted, toggleWishlist, fetchCart } = useStore();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [related, setRelated] = useState([]);
  const [selectedImg, setSelectedImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [reviewForm, setReviewForm] = useState({ rating: 5, title: '', comment: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetch = async () => {
      try {
        const [p, r] = await Promise.all([API.get(`/products/${id}`), API.get(`/reviews/${id}`)]);
        setProduct(p.data.product);
        setReviews(r.data.reviews);
        const rel = await API.get(`/products?category=${p.data.product.category}&limit=4`);
        setRelated(rel.data.products.filter((x) => x._id !== id));
      } catch { router.push('/products'); }
      setLoading(false);
    };
    fetch();
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) { toast.error('Please login first'); return; }
    try {
      await API.post('/cart/add', { productId: id, quantity: qty });
      await fetchCart();
      toast.success(`${qty} item(s) added to cart!`);
    } catch { toast.error('Failed to add to cart'); }
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
    router.push('/cart');
  };

  const handleReview = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Please login first'); return; }
    setSubmitting(true);
    try {
      const { data } = await API.post(`/reviews/${id}`, reviewForm);
      setReviews((r) => [data.review, ...r]);
      toast.success('Review submitted!');
      setReviewForm({ rating: 5, title: '', comment: '' });
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to submit review'); }
    setSubmitting(false);
  };

  if (loading) return (
    <div className="min-h-screen pt-24 flex items-center justify-center">
      <div className="w-12 h-12 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!product) return null;

  const wishlisted = isWishlisted(product._id);

  return (
    <>
      <Head><title>{product.name} - Treandspot</title></Head>
      <main className="min-h-screen pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4">
          <Link href="/products" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 text-sm">
            <FiArrowLeft size={16} /> Back to Products
          </Link>

          <div className="grid md:grid-cols-2 gap-10 mb-16">
            {/* Images */}
            <div>
              <motion.div className="glass-card overflow-hidden rounded-2xl aspect-square mb-3">
                <img src={product.images?.[selectedImg] || 'https://via.placeholder.com/500'}
                  alt={product.name} className="w-full h-full object-cover" />
              </motion.div>
              <div className="flex gap-2">
                {product.images?.map((img, i) => (
                  <button key={i} onClick={() => setSelectedImg(i)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${selectedImg === i ? 'border-purple-500' : 'border-white/10'}`}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Details */}
            <div>
              <span className="text-purple-400 text-sm">{product.category}</span>
              <h1 className="text-2xl md:text-3xl font-bold text-white mt-1 mb-3">{product.name}</h1>

              <div className="flex items-center gap-3 mb-4">
                <StarRating rating={product.ratings} />
                <span className="text-gray-400 text-sm">{product.ratings} ({product.numReviews} reviews)</span>
              </div>

              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-4xl font-black text-white">₹{product.price.toLocaleString()}</span>
                {product.originalPrice > product.price && (
                  <>
                    <span className="text-gray-500 line-through text-lg">₹{product.originalPrice.toLocaleString()}</span>
                    <span className="bg-green-500/20 text-green-400 text-sm font-bold px-2 py-1 rounded-lg">{product.discount}% OFF</span>
                  </>
                )}
              </div>

              <p className="text-gray-400 text-sm mb-6 leading-relaxed">{product.description}</p>

              {/* Stock */}
              <div className="flex items-center gap-2 mb-6">
                <div className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-green-400' : 'bg-red-400'}`} />
                <span className={`text-sm ${product.stock > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {product.stock > 0 ? `In Stock (${product.stock} left)` : 'Out of Stock'}
                </span>
              </div>

              {/* Quantity */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-gray-300 text-sm">Quantity:</span>
                <div className="flex items-center gap-2 glass-card px-3 py-2">
                  <button onClick={() => setQty(Math.max(1, qty - 1))} className="text-gray-400 hover:text-white"><FiMinus size={16} /></button>
                  <span className="text-white font-medium w-8 text-center">{qty}</span>
                  <button onClick={() => setQty(Math.min(product.stock, qty + 1))} className="text-gray-400 hover:text-white"><FiPlus size={16} /></button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mb-6">
                <button onClick={handleAddToCart} disabled={product.stock === 0}
                  className="flex-1 flex items-center justify-center gap-2 btn-outline py-3 disabled:opacity-50">
                  <FiShoppingCart size={18} /> Add to Cart
                </button>
                <button onClick={handleBuyNow} disabled={product.stock === 0}
                  className="flex-1 btn-primary py-3 disabled:opacity-50">
                  Buy Now
                </button>
                <button onClick={() => toggleWishlist(product._id)}
                  className="p-3 glass-card hover:border-pink-500/50 transition-colors">
                  {wishlisted ? <AiFillHeart size={20} className="text-pink-500" /> : <FiHeart size={20} className="text-gray-400" />}
                </button>
              </div>

              {/* Trust badges */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: FiTruck, text: 'Free delivery above ₹499' },
                  { icon: FiShield, text: '7-day easy returns' },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="glass-card p-3 flex items-center gap-2">
                    <Icon size={16} className="text-purple-400" />
                    <span className="text-xs text-gray-400">{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Reviews */}
          <div className="mb-16">
            <h2 className="section-title mb-6">Customer Reviews</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {/* Review Form */}
              <div className="glass-card p-6">
                <h3 className="font-semibold text-white mb-4">Write a Review</h3>
                <form onSubmit={handleReview} className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">Rating</label>
                    <StarRating rating={reviewForm.rating} size={24} interactive onChange={(r) => setReviewForm((f) => ({ ...f, rating: r }))} />
                  </div>
                  <input type="text" placeholder="Review title" value={reviewForm.title}
                    onChange={(e) => setReviewForm((f) => ({ ...f, title: e.target.value }))}
                    className="input-field w-full" required />
                  <textarea placeholder="Share your experience..." value={reviewForm.comment}
                    onChange={(e) => setReviewForm((f) => ({ ...f, comment: e.target.value }))}
                    className="input-field w-full h-24 resize-none" required />
                  <button type="submit" disabled={submitting} className="btn-primary w-full">
                    {submitting ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              </div>

              {/* Reviews List */}
              <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                {reviews.length === 0 ? (
                  <p className="text-gray-400 text-sm">No reviews yet. Be the first!</p>
                ) : reviews.map((r) => (
                  <div key={r._id} className="glass-card p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-sm font-bold">
                        {r.user?.name?.[0]?.toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{r.user?.name}</p>
                        <StarRating rating={r.rating} size={12} />
                      </div>
                    </div>
                    <p className="text-sm font-medium text-white mb-1">{r.title}</p>
                    <p className="text-xs text-gray-400">{r.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Related Products */}
          {related.length > 0 && (
            <div>
              <h2 className="section-title mb-6">Related Products</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {related.slice(0, 4).map((p) => <ProductCard key={p._id} product={p} />)}
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
