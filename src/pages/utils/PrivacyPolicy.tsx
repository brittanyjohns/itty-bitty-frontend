import React from "react";
import { IonContent, IonPage } from "@ionic/react";
import SideMenu from "../../components/main_menu/SideMenu";
import StaticMenu from "../../components/main_menu/StaticMenu";
import MainHeader from "../MainHeader";
import { useCurrentUser } from "../../hooks/useCurrentUser";

const PrivacyPolicy: React.FC = () => {
  const { isWideScreen, currentAccount, currentUser } = useCurrentUser();
  return (
    <>
      <SideMenu
        pageTitle="Privacy Policy"
        isWideScreen={isWideScreen}
        currentUser={currentUser}
        currentAccount={currentAccount}
      />
      <StaticMenu
        pageTitle="Privacy Policy"
        isWideScreen={isWideScreen}
        currentUser={currentUser}
        currentAccount={currentAccount}
      />

      <IonPage id="main-content">
        <MainHeader
          pageTitle="Privacy Policy"
          isWideScreen={isWideScreen}
          showMenuButton={!isWideScreen}
        />
        <IonContent className="ion-padding">
          <h1>Privacy Policy</h1>
          <p>Effective Date: August 1, 2024</p>

          <h2>1. Introduction</h2>
          <p>
            Welcome to SpeakAnyWay! Your privacy is critically important to us.
            This Privacy Policy explains how we collect, use, and protect your
            information when you use our AAC (Augmentative and Alternative
            Communication) application and website.
          </p>

          <h2>2. Information We Collect</h2>
          <p>
            We collect various types of information in connection with the
            services we provide, including:
          </p>
          <ul>
            <li>
              Personal Information: Information that can be used to identify
              you, such as your name, email address, and other contact details.
            </li>
            <li>
              Usage Data: Information about how you use our AAC application and
              website, including word clicks, navigation patterns, and
              interactions. This helps us improve our software and user
              experience.
            </li>
            <li>
              Cookies: Small files stored on your device that help us understand
              your preferences and enhance your experience.
            </li>
          </ul>

          <h2>3. How We Use Your Information</h2>
          <p>
            We use the information we collect for various purposes, including:
          </p>
          <ul>
            <li>To provide and maintain our AAC services.</li>
            <li>
              To personalize your experience and tailor content to your
              communication needs.
            </li>
            <li>
              To analyze usage patterns and improve our application and website,
              making SpeakAnyWay more effective for all users.
            </li>
            <li>To communicate with you and provide customer support.</li>
          </ul>

          <h2>4. Cookies and Tracking Technologies</h2>
          <p>
            We use cookies and similar tracking technologies to track activity
            on our service and store certain information. Cookies help us
            understand how our AAC application and website are used, allowing us
            to enhance and personalize your experience.
          </p>
          <p>
            You can instruct your browser to refuse all cookies or to indicate
            when a cookie is being sent. However, if you do not accept cookies,
            you may not be able to use some portions of our service.
          </p>

          <h2>5. Sharing Your Information</h2>
          <p>
            We do not share your personal information with third parties except
            as necessary to provide our AAC services, comply with legal
            obligations, or protect our rights.
          </p>

          <h2>6. Data Security</h2>
          <p>
            We take reasonable measures to protect your information from
            unauthorized access, use, or disclosure. However, no internet-based
            service can be 100% secure, and we cannot guarantee the absolute
            security of your data. We continuously strive to implement and
            update our security practices to keep your information safe.
          </p>

          <h2>7. Your Rights</h2>
          <p>
            You have the right to access, update, or delete your personal
            information. To exercise these rights, please contact us at
            support@speakanyway.com.
          </p>

          <h2>8. Changes to This Privacy Policy</h2>
          <p>
            We may update our Privacy Policy from time to time. We will notify
            you of any changes by posting the new Privacy Policy on this page
            and updating the "Effective Date" at the top.
          </p>
          <p>
            You are advised to review this Privacy Policy periodically for any
            changes. Changes to this Privacy Policy are effective when they are
            posted on this page.
          </p>

          <h2>9. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact
            us:
          </p>
          <ul>
            <li>By email: support@speakanyway.com</li>
            <li>
              By visiting this page on our website: [Insert Website Contact Page
              URL]
            </li>
            <li>By phone number: [Insert Phone Number]</li>
            <li>By mail: [Insert Physical Address]</li>
          </ul>
        </IonContent>
      </IonPage>
    </>
  );
};

export default PrivacyPolicy;
