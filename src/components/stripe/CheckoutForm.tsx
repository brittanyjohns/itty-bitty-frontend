import React, { useState } from "react";
import { BASE_URL, userHeaders } from "../../data/constants";

import { useStripe, useElements } from "@stripe/react-stripe-js";

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();

  if (stripe == null || elements == null) {
    return <div>Loading...</div>;
  }
  const [errorMessage, setErrorMessage] = useState<any>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (elements == null) {
      return;
    }

    // Trigger form validation and wallet collection
    const { error: submitError } = await elements.submit();
    if (submitError) {
      // Show error to your customer
      setErrorMessage(submitError.message);
      return;
    }

    // Create the PaymentIntent and obtain clientSecret from your server endpoint
    const res = await fetch(`${BASE_URL}create_customer`, {
      method: "POST",
      headers: userHeaders,
    });
    const customer = await res.json();
    console.log("customer", customer);

    // const { client_secret: clientSecret } = await res.json();

    // const { error } = await stripe.confirmPayment({
    //   //`Elements` instance that was used to create the Payment Element
    //   elements,
    //   clientSecret,
    //   confirmParams: {
    //     return_url: "https://example.com/order/123/complete",
    //   },
    // });

    // if (error) {
    //   // This point will only be reached if there is an immediate error when
    //   // confirming the payment. Show error to your customer (for example, payment
    //   // details incomplete)
    //   setErrorMessage(error.message);
    // } else {
    //   // Your customer will be redirected to your `return_url`. For some payment
    //   // methods like iDEAL, your customer will be redirected to an intermediate
    //   // site first to authorize the payment, then redirected to the `return_url`.
    // }
  };

  return (
    <form onSubmit={handleSubmit}>
      <button type="submit" disabled={!stripe || !elements}>
        Pay
      </button>
      {/* Show error message to your customers */}
      {errorMessage && <div>{errorMessage}</div>}
    </form>
  );
};

export default CheckoutForm;
