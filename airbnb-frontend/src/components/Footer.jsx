import React from "react";
import { Globe, Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-100 border-t border-gray-200 text-gray-700 text-sm mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Support */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-3">Support</h4>
          <ul className="space-y-2.5 text-xs text-gray-600">
            <li><a href="#help" className="hover:underline">Help Centre</a></li>
            <li><a href="#aircover" className="hover:underline">AirCover</a></li>
            <li><a href="#anti-discrimination" className="hover:underline">Anti-discrimination</a></li>
            <li><a href="#disability" className="hover:underline">Disability support</a></li>
            <li><a href="#cancellation" className="hover:underline">Cancellation options</a></li>
            <li><a href="#neighbourhood" className="hover:underline">Report neighbourhood concern</a></li>
          </ul>
        </div>

        {/* Hosting */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-3">Hosting</h4>
          <ul className="space-y-2.5 text-xs text-gray-600">
            <li><a href="#host" className="hover:underline">Airbnb your home</a></li>
            <li><a href="#aircover-host" className="hover:underline">AirCover for Hosts</a></li>
            <li><a href="#resources" className="hover:underline">Hosting resources</a></li>
            <li><a href="#community-forum" className="hover:underline">Community forum</a></li>
            <li><a href="#responsible-hosting" className="hover:underline">Hosting responsibly</a></li>
            <li><a href="#free-class" className="hover:underline">Join a free Hosting class</a></li>
          </ul>
        </div>

        {/* Airbnb */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-3">Airbnb</h4>
          <ul className="space-y-2.5 text-xs text-gray-600">
            <li><a href="#newsroom" className="hover:underline">Newsroom</a></li>
            <li><a href="#features" className="hover:underline">New features</a></li>
            <li><a href="#careers" className="hover:underline">Careers</a></li>
            <li><a href="#investors" className="hover:underline">Investors</a></li>
            <li><a href="#giftcards" className="hover:underline">Gift cards</a></li>
            <li><a href="#emergency" className="hover:underline">Airbnb.org emergency stays</a></li>
          </ul>
        </div>

        {/* Social / Currency */}
        <div className="flex flex-col justify-between">
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Inspiring travel</h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              Explore thousands of unique homes, beachfront villas, cozy cabins, and extraordinary experiences around the world.
            </p>
          </div>
          
          <div className="mt-6 flex flex-wrap items-center gap-4 text-xs font-semibold text-gray-800">
            <button className="flex items-center gap-1.5 hover:underline bg-transparent cursor-pointer">
              <Globe size={16} />
              <span>English (IN)</span>
            </button>
            <button className="hover:underline bg-transparent cursor-pointer">
              ₹ INR
            </button>
          </div>
        </div>

      </div>

      {/* Bottom Legal Bar */}
      <div className="border-t border-gray-200 py-6 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-600">
          <div className="flex flex-wrap items-center gap-2 text-center md:text-left">
            <span>© 2026 Airbnb, Inc.</span>
            <span>·</span>
            <a href="#privacy" className="hover:underline">Privacy</a>
            <span>·</span>
            <a href="#terms" className="hover:underline">Terms</a>
            <span>·</span>
            <a href="#sitemap" className="hover:underline">Sitemap</a>
            <span>·</span>
            <a href="#company" className="hover:underline">Company details</a>
          </div>

          <div className="flex items-center gap-1 text-gray-500">
            <span>Made with</span>
            <Heart size={12} className="text-red-500 fill-red-500 inline" />
            <span>for Airbnb travelers</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
