import Link from 'next/link';
import { FiInstagram, FiTwitter, FiFacebook, FiYoutube } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="bg-black/50 border-t border-white/10 mt-20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-black neon-text mb-4">Treandspot</h3>
            <p className="text-gray-400 text-sm">Shop the future. Affordable trending products delivered to your door.</p>
            <div className="flex gap-3 mt-4">
              {[FiInstagram, FiTwitter, FiFacebook, FiYoutube].map((Icon, i) => (
                <a key={i} href="#" className="p-2 bg-white/5 hover:bg-purple-500/20 rounded-lg text-gray-400 hover:text-purple-400 transition-colors">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-3">Shop</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              {['Electronics', 'Fashion', 'Home Essentials', 'Gadgets', 'Beauty', 'Sports'].map((c) => (
                <li key={c}><Link href={`/products?category=${c}`} className="hover:text-purple-400 transition-colors">{c}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-3">Account</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              {[['Profile', '/dashboard'], ['Orders', '/dashboard/orders'], ['Wishlist', '/wishlist'], ['Cart', '/cart']].map(([label, href]) => (
                <li key={label}><Link href={href} className="hover:text-purple-400 transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-3">Support</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              {['Help Center', 'Returns', 'Track Order', 'Contact Us'].map((item) => (
                <li key={item}><a href="#" className="hover:text-purple-400 transition-colors">{item}</a></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 mt-8 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">© 2024 Treandspot. All rights reserved.</p>
          <div className="flex gap-4 text-xs text-gray-500">
            <a href="#" className="hover:text-gray-300">Privacy Policy</a>
            <a href="#" className="hover:text-gray-300">Terms of Service</a>
            <a href="#" className="hover:text-gray-300">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
