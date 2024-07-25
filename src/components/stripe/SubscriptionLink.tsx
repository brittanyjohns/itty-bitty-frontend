import { useCurrentUser } from "../../hooks/useCurrentUser";
import { STRIPE_PAYMENT_LINK_URL } from "../../data/constants";

const SubscriptionLink = () => {
  const { currentUser } = useCurrentUser();
  const userSubscribed = currentUser?.plan_status === "active";
  const paidPlan = currentUser?.plan_type === "Pro";
  //   const weeklyPlan = planId == "1";
  const subscriptionLinkUrl = STRIPE_PAYMENT_LINK_URL;
  const paramiterizedEmail = encodeURIComponent(currentUser?.email || "");
  const urlWithUser = `${subscriptionLinkUrl}?prefilled_email=${paramiterizedEmail}&prefilled_name=${currentUser?.name}&client_reference_id=${currentUser?.uuid}`;

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
