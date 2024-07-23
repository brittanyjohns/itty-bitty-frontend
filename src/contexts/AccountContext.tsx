// AccountContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { getCurrentAccount, ChildAccount } from "../data/child_accounts";

import { getPlatforms } from "@ionic/react";
import { useMediaQuery } from "react-responsive";
// Define the shape of the context

export interface AccountContextType {
  currentAccount: ChildAccount | null;
  setCurrentAccount: React.Dispatch<React.SetStateAction<ChildAccount | null>>;
  isDesktop: boolean;
  isWideScreen: boolean;
  platforms: string[];
}

// Create the context with an initial undefined value
export const AccountContext = createContext<AccountContextType | undefined>(
  undefined
);

interface AccountProviderProps {
  children: ReactNode;
}

export const AccountProvider: React.FC<AccountProviderProps> = ({
  children,
}) => {
  const [currentAccount, setCurrentAccount] = useState<ChildAccount | null>(
    null
  );
  const isWideScreen = useMediaQuery({ query: "(min-width: 768px)" });
  const platforms = getPlatforms();
  const isDesktop = platforms.includes("desktop");
  const fetchAccount = async () => {
    console.log("Fetching account");
    // Assuming you have a function to fetch the current account
    const account = await getCurrentAccount();

    if (account) {
      setCurrentAccount(account);
      console.log("Current account", account);
    }
    if (!account) {
      setCurrentAccount(null);
      console.log("No account found");
    }
    return account;
  };
  useEffect(() => {
    // Fetch the current account here and set it
    fetchAccount();
  }, []);

  return (
    <AccountContext.Provider
      value={{
        currentAccount,
        setCurrentAccount,
        isDesktop,
        isWideScreen,
        platforms,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
};
