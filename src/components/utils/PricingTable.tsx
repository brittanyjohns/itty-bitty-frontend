import * as React from "react";
import {
  STRIPE_PRICING_TABLE_ID,
  STRIPE_PUBLIC_KEY,
} from "../../data/constants";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { useHistory } from "react-router";
import {
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonButton,
  IonIcon,
} from "@ionic/react";
import { checkmarkCircleOutline } from "ionicons/icons";

// If using TypeScript, add the following snippet to your file as well.
declare global {
  namespace JSX {
    interface IntrinsicElements {
      "stripe-pricing-table": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
    }
  }
}
interface PricingTableProps {
  showHeader?: boolean;
}
function PricingTable({ showHeader = true }: PricingTableProps) {
  const { currentUser } = useCurrentUser();
  const history = useHistory();
  // Paste the stripe-pricing-table snippet in your React component
  return (
    <div className="relative fixed-bg ion-padding">
      {showHeader && (
        <div className="text-cente bg-black bg-opacity-90 p-4 py-9 font-sanserif text-center">
          <h1 className="text-xl md:text-2xl font-bold text-white">
            Find the plan that's right for you.
          </h1>
          <p className="mt-4 text-sm md:text-xl text-white">
            Join the growing community of users who enhance their communication
            with SpeakAnyWay.
          </p>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-3">
        {currentUser && currentUser.plan_type === "free" && (
          <IonCard className="h-fit">
            <IonCardHeader className="text-center">
              <div className="text-3xl font-bold">Free Forever</div>
            </IonCardHeader>
            <IonCardContent className="text-center">
              <p>
                Create up to unlimited custom boards, use images from our
                library or upload your own, and more.
              </p>
              <div className="text-2xl font-bold my-2 text-green-500 font-bold text-lg bg-green-100 p-2 rounded-lg">
                Your Current Plan
              </div>
              <p className="mt-2">All basic features</p>
              <ul className="mt-4 text-left text-sm md:text-base">
                <li>
                  <IonIcon icon={checkmarkCircleOutline} className="mr-2" />
                  Unlimited Custom Boards
                </li>
                <li>
                  <IonIcon icon={checkmarkCircleOutline} className="mr-2" />
                  Upload Your Own Images
                </li>
                <li>
                  <IonIcon icon={checkmarkCircleOutline} className="mr-2" />
                  Access to Image Library
                </li>
                <li>
                  <IonIcon icon={checkmarkCircleOutline} className="mr-2" />
                  Basic Voice Output
                </li>
                <li>
                  <IonIcon icon={checkmarkCircleOutline} className="mr-2" />
                  Available on all devices
                </li>
              </ul>
              <IonButton
                className="mt-4"
                expand="full"
                color="success"
                onClick={() => history.push("/boards")}
              >
                Get Started Now!
              </IonButton>
            </IonCardContent>
          </IonCard>
        )}
        {!currentUser && (
          <IonCard className="h-fit">
            <IonCardHeader className="text-center">
              <div className="text-3xl font-bold">Free</div>
            </IonCardHeader>
            <IonCardContent className="text-center">
              <p>
                Create up to unlimited custom boards, use images from our
                library or upload your own, and more.
              </p>
              <div className="text-2xl font-bold my-4">Free Forever</div>
              <p className="mt-2">All basic features</p>
              <IonButton
                className="mt-4"
                expand="full"
                color="success"
                onClick={() => history.push("/sign-up")}
              >
                Get Started
              </IonButton>
            </IonCardContent>
          </IonCard>
        )}

        <IonCard className="h-fit">
          <IonCardHeader className="text-center">
            <div className="text-3xl font-bold">Pro</div>
          </IonCardHeader>
          <IonCardContent className="text-center">
            {currentUser && (
              <stripe-pricing-table
                pricing-table-id={STRIPE_PRICING_TABLE_ID}
                publishable-key={STRIPE_PUBLIC_KEY}
                client-reference-id={currentUser?.uuid}
                customer-email={currentUser?.email}
              ></stripe-pricing-table>
            )}
            {!currentUser && (
              <div>
                <p>
                  Enjoy an ad-free experience & unlock premium features like the
                  Menu Reader & AI-generated images.
                </p>
                <div className="text-2xl font-bold my-4">$4.99/mo</div>
                <p className="mt-2">
                  Or $49/year{" "}
                  <span className="text-xs font-bold">
                    - That's 2 months free!
                  </span>
                </p>
                <p className="mt-2 text-lg font-md">
                  Includes all basic features
                </p>
                <IonButton
                  className="mt-4"
                  expand="full"
                  color="primary"
                  onClick={() => history.push("/sign-up/pro")}
                >
                  Sign Up Now
                </IonButton>
              </div>
            )}
          </IonCardContent>
        </IonCard>

        <IonCard className="h-fit">
          <IonCardHeader className="text-center">
            <div className="text-3xl font-bold">Professional+</div>
          </IonCardHeader>
          <IonCardContent className="text-center">
            <p>
              Ideal for therapists, educators, and organizations that need to
              manage multiple users.
            </p>
            <p className="mt-4 font-bold"></p>
            <div className="text-2xl font-bold my-4">Contact Us</div>
            <p className="mt-2">Custom solutions tailored to your needs.</p>
            <IonButton
              className="mt-4"
              expand="full"
              color="dark"
              onClick={() => history.push("/contact-us")}
            >
              Get in Touch
            </IonButton>
          </IonCardContent>
        </IonCard>
      </div>
    </div>
  );
}

export default PricingTable;
