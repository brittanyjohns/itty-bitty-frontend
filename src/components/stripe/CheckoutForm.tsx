import { IonCard } from "@ionic/react";
import { PaymentElement } from "@stripe/react-stripe-js";

const CheckoutForm = () => {
  return (
    <IonCard>
      <form>
        <PaymentElement />
        <button>Submit</button>
      </form>
    </IonCard>
  );
};

export default CheckoutForm;
