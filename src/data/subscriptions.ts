import { BASE_URL, userHeaders } from "./constants";

export interface Subscription {
  id: string;
  user_id: string;
  expires_at?: string;
  plan_id?: string;
  price_in_cents?: number;
  status?: string;
  stripe_client_reference_id?: string;
  stripe_customer_id?: string;
  stripe_invoice_id?: string;
  stripe_payment_status?: string;
  stripe_plan_id?: string;
  stripe_subscription_id?: string;
  updated_at?: string;
  interval?: string;
  interval_count?: number;
  created_at?: string;
}

export const getSubscription = (id: string) => {
  const subscription = fetch(`${BASE_URL}subscriptions/${id}`, {
    headers: userHeaders,
  })
    .then((response) => response.json())
    .then((data) => data)
    .catch((error) => console.error("Error fetching subscription: ", error));

  return subscription;
};

export const getSubscriptions = () => {
  const subscriptions = fetch(`${BASE_URL}subscriptions`, {
    headers: userHeaders,
  })
    .then((response) => response.json())
    .then((data) => data)
    .catch((error) => console.error("Error fetching subscriptions: ", error));

  return subscriptions;
};

// export const cancelSubscription = (id: string) => {
//     const subscription = fetch(`${BASE_URL}subscriptions/${id}/cancel`, { headers: userHeaders })
//         .then(response => response.json())
//         .then(data => data)
//         .catch(error => console.error('Error canceling subscription: ', error));

//     return subscription;
// }

export const createBillingPortalSession = async () => {
  const response = await fetch(`${BASE_URL}subscriptions/billing_portal`, {
    method: "POST",
    headers: userHeaders,
    body: JSON.stringify({}),
  });

  const session = await response.json();

  return session;
};
