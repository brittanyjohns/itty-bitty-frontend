import { IonButton } from "@ionic/react";
import { createBillingPortalSession } from "../../data/subscriptions";
import { User } from "../../data/users";
import { useCurrentUser } from "../../hooks/useCurrentUser";

interface AccountLinkProps {
  user?: User | null;
}

const AccountLink = ({ user }: AccountLinkProps) => {
  const { currentUser } = useCurrentUser();
  const userRecord = user || currentUser;
  const userSubscribed = userRecord?.plan_status === "active";
  const stripeCustomerId = userRecord?.stripe_customer_id;
  const testPortalUrl =
    "https://billing.stripe.com/p/login/test_bIY28A1jI4VH1sk4gg";
  const urlWithUser = testPortalUrl;

  const handleGoToBilling = async () => {
    const result = await createBillingPortalSession();
    if (result && result?.url) {
      window.location.href = result.url;
    } else {
      console.error("Error creating billing portal session");
    }
  };

  return (
    <>
      {stripeCustomerId && userSubscribed && (
        <IonButton onClick={handleGoToBilling}>Manage Subscription</IonButton>
      )}
    </>
  );
};

export default AccountLink;
