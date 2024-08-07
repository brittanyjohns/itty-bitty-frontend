// {currentUser && currentUser?.plan_type !== "free" && (
//     <>
//       <h1 className="text-2xl">Dashboard</h1>

//       <SubscriptionList subscriptions={subscriptions} />
//       <AccountLink />
//     </>
//   )}

import { IonButton, IonButtons, IonIcon } from "@ionic/react";
import { eyeOffOutline, eyeOutline } from "ionicons/icons";
import React, { useState } from "react";
import { User } from "../../data/users";
import SubscriptionList from "../stripe/SubscriptionList";
import AccountLink from "../stripe/AccountLink";
interface AccountContentProps {
  subscriptions: any;
  currentUser: User | null;
}
const AccountContent: React.FC<AccountContentProps> = ({
  subscriptions,
  currentUser,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  const toggleAccountContent = () => {
    setIsVisible(!isVisible);
  };

  return (
    <div className="w-full mx-auto">
      {isVisible && (
        <div className="px-2 pb-2 rounded-lg shadow-md bg-white">
          <div className="flex flex-col gap-2 text-sm">
            {currentUser && currentUser?.plan_type !== "free" && (
              <>
                <h1 className="text-2xl">Dashboard</h1>

                <SubscriptionList subscriptions={subscriptions} />
                <AccountLink />
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountContent;
