import React from "react";
import { Subscription } from "../../data/subscriptions";
import { IonButton, IonCard } from "@ionic/react";
import { useCurrentUser } from "../../hooks/useCurrentUser";
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
  const { currentUser } = useCurrentUser();

  return (
    <div className="mx-auto my-8 p-2">
      <h1 className="text-3xl text-center font-bold my-6">Your Current Plan</h1>

      <h1 className="text-3xl text-center font-bold my-6">
        Your Subscriptions
      </h1>
      <div className="w-full md:w-3/4 mx-auto">
        {subscriptions.map((sub) => (
          <div
            key={sub.id}
            className="subscription-item bg-white shadow-md rounded p-4 border border-gray-200"
          >
            <div className="mb-2">
              <span className="font-semibold">Subscription ID: </span>{" "}
              {sub.stripe_subscription_id}
            </div>
            <div className="mb-2 flex justify-between">
              <div>
                <span className="font-semibold">Created At:</span>{" "}
                {sub.created_at}
              </div>
              <div>
                <span className="font-semibold">Price:</span> $
                {calculatePrice(sub.price_in_cents || 0)} per {sub.interval}
              </div>
            </div>
            <div className="mb-2">
              <span className="font-semibold">Status:</span> {sub.status}
            </div>
            <div className="mb-2">
              <span className="font-semibold">Expires: </span>
              {sub.expires_at}
            </div>
            <div className="mt-4">
              {currentUser?.plan_status === "active" && <AccountLink />}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubscriptionList;
