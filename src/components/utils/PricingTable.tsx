import * as React from "react";
import { STRIPE_PRICING_TABLE_ID, STRIPE_PUBLIC_KEY } from "../../data/users";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { useHistory } from "react-router";
import {
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonButton,
} from "@ionic/react";

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
function PricingTable() {
  const { currentUser } = useCurrentUser();
  const history = useHistory();
  // Paste the stripe-pricing-table snippet in your React component
  return (
    <div>
      <div className="flex flex-col justify-center items-center text-center shadow-overlay">
        <h1 className="text-xl md:text-5xl font-bold text-white">
          Find the plan that's right for you.
        </h1>
        <p className="mt-4 text-sm md:text-xl text-white">
          Join the growing community of users who enhance their communication
          with SpeakAnyWay.
        </p>
      </div>
      <div className="relative fixed-bg">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 absolute bottom-20 left-0 right-0 mb-10">
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
                color="primary"
                onClick={() => history.push("/sign-up")}
              >
                Get Started
              </IonButton>
            </IonCardContent>
          </IonCard>

          <IonCard className="h-fit">
            <IonCardHeader className="text-center">
              <div className="text-3xl font-bold">Pro</div>
            </IonCardHeader>
            <IonCardContent className="text-center">
              <stripe-pricing-table
                pricing-table-id={STRIPE_PRICING_TABLE_ID}
                publishable-key={STRIPE_PUBLIC_KEY}
                client-reference-id={currentUser?.uuid}
                customer-email={currentUser?.email}
              ></stripe-pricing-table>
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
    </div>
  );
}

export default PricingTable;
