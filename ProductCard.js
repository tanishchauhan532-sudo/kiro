import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { FiHeart, FiStar, FiShoppingCart } from 'react-icons/fi';
import { AiFillHeart } from 'react-icons/ai';
import useStore from '../store/useStore';
import API from '../lib/api';
import toast from 'react-hot-toast';

export default function ProductCard({ product }) {
  const { user, isWishlisted, toggleWishlist, fetchCart } = useStore();

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Please login first'); return; }
    try {
      await API.post('/cart/add', { productId: product._id, quantity: 1 });
      await fetchCart();
      toast.success('Added to cart!');
    } catch { toast.error('Failed to add to cart'); }
  };

  const handleWishlist = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Please login first'); return; }
    await toggleWishlist(product._id);
  };

  const wishlisted = isWishlisted(product._id);

  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
      <Link href={`/products/${product._id}`}>
        <div className="glass-card overflow-hidden group cursor-pointer h-full flex flex-col">
          {/* Image */}
          <div className="relative aspect-square overflow-hidden bg-white/5">
            <img
              src={product.images?.[0] || 'https://via.placeholder.com/300'}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {product.discount > 0 && (
              <span className="absolute top-2 left-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold px-2 py-1 rounded-lg">
                -{product.discount}%
              </span>
            )}
            {product.isTrending && (
              <span className="absolute top-2 right-10 bg-amber-500/90 text-white text-xs font-bold px-2 py-1 rounded-lg">
                🔥 Hot
              </span>
            )}
            <button onClick={handleWishlist}
              className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-black/70 rounded-lg transition-colors">
              {wishlisted ? <AiFillHeart size={16} className="text-pink-500" /> : <FiHeart size={16} className="text-gray-300" />}
            </button>
          </div>

          {/* Info */}
          <div className="p-3 flex flex-col flex-1">
            <p className="text-xs text-purple-400 mb-1">{product.category}</p>
            <h3 className="text-sm font-medium text-white line-clamp-2 flex-1">{product.name}</h3>

            {/* Rating */}
            <div className="flex items-center gap-1 mt-2">
              <FiStar size={12} className="text-amber-400 fill-amber-400" />
              <span className="text-xs text-gray-400">{product.ratings} ({product.numReviews})</span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-2 mt-2">
              <span className="text-lg font-bold text-white">₹{product.price.toLocaleString()}</span>
              {product.originalPrice > product.price && (
                <span className="text-xs text-gray-500 line-through">₹{product.originalPrice.toLocaleString()}</span>
              )}
            </div>

            <button onClick={handleAddToCart}
              className="mt-3 w-full flex items-center justify-center gap-2 bg-purple-600/20 hover:bg-purple-600/40 border border-purple-500/30 text-purple-300 text-sm py-2 rounded-xl transition-all">
              <FiShoppingCart size={14} />
              Add to Cart
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
