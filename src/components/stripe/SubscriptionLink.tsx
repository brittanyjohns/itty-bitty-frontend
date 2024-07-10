import { useCurrentUser } from "../../hooks/useCurrentUser";
import {
  STRIPE_PAYMENT_LINK_URL,
  STRIPE_CUSTOMER_PORTAL_URL,
} from "../../data/users";

const SubscriptionLink = () => {
  const { currentUser } = useCurrentUser();
  const userSubscribed = currentUser?.plan_status === "active";
  const paidPlan = currentUser?.plan_type === "Pro";
  const testProUrl = STRIPE_PAYMENT_LINK_URL;
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
      {(!paidPlan || !userSubscribed) && (
        <a
          href={STRIPE_CUSTOMER_PORTAL_URL}
          target="_blank"
          rel="noreferrer"
          className="p-5 border"
        >
          Manage Subscription
        </a>
      )}
    </>
  );
};

export default SubscriptionLink;
