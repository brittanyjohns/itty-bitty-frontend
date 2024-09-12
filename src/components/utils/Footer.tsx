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
    <footer className="bg-gray-900 text-white py-2 px-4 md:pl-8 lg:pl-8">
      <div className="flex flex-col md:flex-row lg:flex-row justify-between items-start">
        {/* Company Info */}
        <div className="text-white mt-4 pt-4">
          <h2 className="text-xl font-bold mb-4">SpeakAnyWay</h2>
          <p className="mb-4">Empowering communication, one step at a time.</p>
          <p>
            &copy; {new Date().getFullYear()} SpeakAnyWay. All rights reserved.
          </p>
        </div>

        {/* Quick Links */}
        <div className="text-white mt-4 py-4">
          <h2 className="text-xl font-semibold mb-4">Quick Links</h2>
          <ul className="list-[square] list-inside">
            <li className="mb-2">
              <a href="/about" className="hover:underline text-white">
                About Us
              </a>
            </li>
            <li className="mb-2">
              <a href="/pricing" className="hover:underline text-white">
                Pricing
              </a>
            </li>
            <li className="mb-2">
              <a href="/contact-us" className="hover:underline text-white">
                Contact
              </a>
            </li>
            <li className="mb-2">
              <a href="/privacy" className="hover:underline text-white">
                Privacy Policy
              </a>
            </li>
            <li className="mb-2">
              <a href="/terms" className="hover:underline text-white">
                Terms of Service
              </a>
            </li>
          </ul>
        </div>

        {/* Social Media */}
        <div className="text-white mt-4 py-4">
          <h2 className="text-xl font-semibold mb-4">Follow Us</h2>
          <div className="flex space-x-4">
            <a
              href="https://facebook.com/speakanywayaac"
              className="hover:text-blue-600 text-white"
            >
              <IonIcon icon={logoFacebook} className="text-2xl" />
            </a>

            <a
              href="https://linkedin.com/company/speakanyway"
              className="hover:text-blue-600 text-white"
            >
              <IonIcon icon={logoLinkedin} className="text-2xl" />
            </a>
            <a
              href="https://facebook.com/speakanywayaac"
              className="hover:text-blue-600 text-white"
            >
              <IonIcon icon={logoInstagram} className="text-2xl" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
