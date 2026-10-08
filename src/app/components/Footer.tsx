'use client';

import Link from 'next/link';
import Logo from './Logo';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Brand Info with Logo */}
          <div className="space-y-4">
            <Logo size="md" />
            <p className="text-sm text-gray-400">
              Real-time power outage tracking, schedule management, and instant alerts for secure electricity distribution.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-amber-400 transition-colors underline">Home</Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-amber-400 transition-colors underline">About Us</Link>
              </li>
              <li>
                <Link href="/schedules" className="hover:text-amber-400 transition-colors underline">Schedules</Link>
              </li>
              <li>
                <Link href="/outages" className="hover:text-amber-400 transition-colors underline">Outages</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-amber-400 transition-colors underline">Contact</Link>
              </li>
            </ul>
          </div>

          {/* Legal / Resources */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="hover:text-amber-400 transition-colors underline">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-amber-400 transition-colors underline">Terms of Service</Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-amber-400 transition-colors underline">FAQ & Support</Link>
              </li>
            </ul>
          </div>

       {/* Support Info & Demo Contact */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Support & Contact</h4>
            <div className="space-y-1 text-sm text-gray-300">
              <p>
                <span className="font-medium text-white">Email:</span> support@loadshedding.com
              </p>
              <p>
                <span className="font-medium text-white">Helpline:</span> +880 1700-000000
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar with Real-colored Social Icons & Gray Hover */}
        <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between text-sm text-gray-500">
          <p>&copy; {currentYear} LoadShedding & Power Management. All rights reserved.</p>
          
          {/* Social Icons with Real Brand Colors & Gray Hover */}
          <div className="flex items-center space-x-5 mt-4 sm:mt-0">
            {/* GitHub */}
            <a 
              href="https://github.com/Fahmida0010" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-white hover:text-gray-400 transition-colors"
              aria-label="GitHub"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
              </svg>
            </a>

            {/* Facebook */}
            <a 
              href="https://www.facebook.com/nihsanga.cetana" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-[#1877F2] hover:text-gray-400 transition-colors"
              aria-label="Facebook"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>

            {/* LinkedIn */}
            <a 
              href="https://www.linkedin.com/in/fahmida-akter-tanjina/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-[#0A66C2] hover:text-gray-400 transition-colors"
              aria-label="LinkedIn"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451c.979 0 1.778-.773 1.778-1.729V1.73C24 .774 23.205 0 22.225 0z"/>
              </svg>
            </a>

            {/* YouTube */}
            <a 
              href="https://www.youtube.com/@ciencefiction" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-[#e91111] hover:text-gray-400
               transition-colors"
              aria-label="YouTube"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}