import React from "react";
import { useCurrentUser } from "../../hooks/useCurrentUser";

const SubscriptionLink = () => {
  const { currentUser } = useCurrentUser();
  const userSubscribed = currentUser?.plan_status === "active";
  const stripeCustomerId = currentUser?.stripe_customer_id;
  const paidPlan = currentUser?.plan_type === "Pro";
  //   const weeklyPlan = planId == "1";
  const testProUrl = "https://buy.stripe.com/test_4gw6p639d3jI6S4dQQ";
  const paramiterizedEmail = encodeURIComponent(currentUser?.email || "");
  const urlWithUser = `${testProUrl}?prefilled_email=${paramiterizedEmail}&prefilled_name=${currentUser?.name}&client_reference_id=${currentUser?.uuid}`;

  return (
    <>
      {(!paidPlan || !userSubscribed) && (
        <a
          href={urlWithUser}
          target="_blank"
          rel="noreferrer"
          className="p-5 border"
        >
          Pro Plan - Monthly
        </a>
      )}
    </>
  );
};

export default SubscriptionLink;
