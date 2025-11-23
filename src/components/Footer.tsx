import { Heart, Shield, Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black text-white">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* About Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Heart className="w-6 h-6 text-pink-400" fill="currentColor" />
              <h3 className="text-xl">ZEN-MIND</h3>
            </div>
            <p className="text-purple-200 text-sm leading-relaxed">
              Your trusted companion for mental wellness. Providing 24/7 AI support and professional therapy connections for teens.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="#features" className="text-purple-200 hover:text-white text-sm transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#about" className="text-purple-200 hover:text-white text-sm transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#therapists" className="text-purple-200 hover:text-white text-sm transition-colors">
                  Find a Therapist
                </a>
              </li>
              <li>
                <a href="#resources" className="text-purple-200 hover:text-white text-sm transition-colors">
                  Resources
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg mb-4">Support</h4>
            <ul className="space-y-2">
              <li>
                <a href="#crisis" className="text-purple-200 hover:text-white text-sm transition-colors">
                  Crisis Support
                </a>
              </li>
              <li>
                <a href="#faq" className="text-purple-200 hover:text-white text-sm transition-colors">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#privacy" className="text-purple-200 hover:text-white text-sm transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#terms" className="text-purple-200 hover:text-white text-sm transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-purple-200 text-sm">
                <Mail className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>zenmindteam@gmail.com</span>
              </li>
              <li className="flex items-start gap-2 text-purple-200 text-sm">
                <Phone className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>+91 0123456789</span>
              </li>
              <li className="flex items-start gap-2 text-purple-200 text-sm">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>Available nationwide</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Shield className="w-4 h-4" />
              <span>Your privacy and security are our top priority</span>
            </div>
            <div className="text-sm text-gray-400">
              © {currentYear} ZEN-MIND. All rights reserved.
            </div>
          </div>

          {/* Crisis Hotline */}
          <div className="mt-6 p-4 bg-pink-500/20 rounded-xl border border-pink-400/30 text-center">
            <p className="text-sm text-pink-200 mb-1">
              <strong>In Crisis? You're not alone.</strong>
            </p>
            <p className="text-xs text-pink-100">
              AASRA (24x7 Helpline): <a href="tel:+919820466726" className="hover:underline">+91 98204 66726</a> | 
              Vandrevala Foundation: <a href="tel:18602662345" className="hover:underline">1860 2662 345</a> | 
              iCall (Mon-Sat, 8AM-10PM): <a href="tel:+912225521111" className="hover:underline">+91 22 2552 1111</a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}