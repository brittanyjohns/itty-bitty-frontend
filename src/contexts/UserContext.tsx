// UserContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { getCurrentUser, isUserSignedIn, User } from "../data/users";

import { getPlatforms } from "@ionic/react";
import { useMediaQuery } from "react-responsive";
import {
  ChildAccount,
  getCurrentAccount,
  isAccountSignedIn,
} from "../data/child_accounts";
// Define the shape of the context

export interface UserContextType {
  currentUser: User | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>;
  isDesktop: boolean;
  isWideScreen: boolean;
  platforms: string[];
  currentAccount: ChildAccount | null;
  setCurrentAccount: React.Dispatch<React.SetStateAction<ChildAccount | null>>;
}

// Create the context with an initial undefined value
export const UserContext = createContext<UserContextType | undefined>(
  undefined
);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentAccount, setCurrentAccount] = useState<ChildAccount | null>(
    null
  );
  const isWideScreen = useMediaQuery({ query: "(min-width: 768px)" });
  const platforms = getPlatforms();
  const isDesktop = platforms.includes("desktop");
  const fetchUser = async () => {
    // Assuming you have a function to fetch the current user
    const user = await getCurrentUser();

    if (user) {
      setCurrentUser(user);
      console.log("Current user", user);
    }
    if (!user) {
      setCurrentUser(null);
      console.log("No user found");
    }
    return user;
  };
  const fetchAccount = async () => {
    // Assuming you have a function to fetch the current user
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
    // Fetch the current user here and set it
    if (isUserSignedIn()) {
      fetchUser();

      console.log("User signed in");
      return;
    }
    setCurrentUser(null);
    console.log("No user signed in");
    if (isAccountSignedIn()) {
      fetchAccount();
      console.log("Account signed in");
      return;
    }
    setCurrentAccount(null);
    console.log("No account signed in");
  }, []);

  return (
    <UserContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        setCurrentAccount,
        currentAccount,
        isDesktop,
        isWideScreen,
        platforms,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
