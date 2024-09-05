import React from "react";
import { IonIcon } from "@ionic/react";
import {
  logoFacebook,
  logoTwitter,
  logoLinkedin,
  logoInstagram,
} from "ionicons/icons";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-4 px-2">
      <div className=" mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Company Info */}
        <div>
          <h2 className="text-xl font-bold mb-4">SpeakAnyWay</h2>
          <p className="mb-4">Empowering communication, one step at a time.</p>
          <p>
            &copy; {new Date().getFullYear()} SpeakAnyWay. All rights reserved.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Quick Links</h2>
          <ul>
            <li className="mb-2">
              <a href="/about" className="hover:underline">
                About Us
              </a>
            </li>
            <li className="mb-2">
              <a href="/pricing" className="hover:underline">
                Pricing
              </a>
            </li>
            {/* <li className="mb-2">
              <a href="/blog" className="hover:underline">
                Blog
              </a>
            </li> */}
            <li className="mb-2">
              <a href="/contact-us" className="hover:underline">
                Contact
              </a>
            </li>
            <li className="mb-2">
              <a href="/privacy" className="hover:underline">
                Privacy Policy
              </a>
            </li>
            <li className="mb-2">
              <a href="/terms" className="hover:underline">
                Terms of Service
              </a>
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Newsletter</h2>
          <p className="mb-4">Subscribe to get the latest updates.</p>
          <form className="flex flex-col space-y-3">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-4 py-2 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <IonIcon
              icon="send"
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-white transition-colors duration-200 cursor-pointer"
            />
          </form>
        </div>

        {/* Social Media */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Follow Us</h2>
          <div className="flex space-x-4">
            <a
              href="https://facebook.com/speakanyway"
              className="hover:text-blue-400"
            >
              <IonIcon icon={logoFacebook} className="text-2xl" />
            </a>
            <a
              href="https://twitter.com/speakanyway"
              className="hover:text-blue-400"
            >
              <IonIcon icon={logoTwitter} className="text-2xl" />
            </a>
            <a
              href="https://linkedin.com/company/speakanyway"
              className="hover:text-blue-400"
            >
              <IonIcon icon={logoLinkedin} className="text-2xl" />
            </a>
            <a
              href="https://instagram.com/speakanyway"
              className="hover:text-pink-400"
            >
              <IonIcon icon={logoInstagram} className="text-2xl" />
            </a>
          </div>
        </div>
      </div>
      <div className="mt-8 text-center text-gray-500">
        <p className="text-md">
          Built by <span className="text-xs">❤️ </span>
          <a
            href="https://brittanyjohns.dev"
            className="hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            Brittany Johns
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
