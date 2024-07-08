// SubscriptionList.tsx
import React, { useEffect, useRef } from "react";
import { Subscription } from "../../data/subscriptions";
import { IonButton } from "@ionic/react";
import AccountLink from "./AccountLink";
interface SubscriptionListProps {
  subscriptions: Subscription[];
}
const SubscriptionList: React.FC<SubscriptionListProps> = ({
  subscriptions,
}) => {
  const calculatePrice = (price: number) => {
    return (price / 100).toFixed(2);
  };

  return (
    <div className="gallery-container">
      <div className="list-container w-full md:w-1/2 mx-auto">
        <h1 className="text-2xl text-center my-3">Your Subscriptions</h1>

        {subscriptions.map((sub) => (
          <div key={sub.id} className="subscription-item p-2 border-b">
            <div className="subscription-item__title">ID: {sub.id}</div>
            <div className="subscription-item__description font-bold">
              {sub.stripe_subscription_id}
            </div>
            <div className="subscription-item__price">
              PRICE: ${calculatePrice(sub.price_in_cents || 0)} per{" "}
              {sub.interval}
            </div>
            <div className="subscription-item__status">
              STATUS: {sub.status}
            </div>

            <div className="subscription-item__updated">
              Expires At: {sub.expires_at}
            </div>

            <div className="subscription-item__button"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubscriptionList;
