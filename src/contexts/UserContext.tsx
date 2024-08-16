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
  smallScreen: boolean;
  mediumScreen: boolean;
  largeScreen: boolean;
  screenSize: string;
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

  const platforms = getPlatforms();
  const isDesktop = platforms.includes("desktop");

  // Media queries
  const isWideScreen = useMediaQuery({ query: "(min-width: 768px)" });
  const smallScreen = useMediaQuery({ query: "(max-width: 599px)" });
  const mediumScreen = useMediaQuery({
    query: "(min-width: 600px) and (max-width: 1199px)",
  });
  const largeScreen = useMediaQuery({ query: "(min-width: 1200px)" });

  // Determine screen size label
  const screenSize = smallScreen ? "sm" : mediumScreen ? "md" : "lg";

  const fetchUser = async () => {
    const user = await getCurrentUser();
    if (user) setCurrentUser(user);
    else setCurrentUser(null);
    return user;
  };

  const fetchAccount = async () => {
    const account = await getCurrentAccount();
    if (account) setCurrentAccount(account);
    else setCurrentAccount(null);
    return account;
  };

  useEffect(() => {
    if (isUserSignedIn()) {
      fetchUser();
    } else {
      setCurrentUser(null);
    }

    if (isAccountSignedIn()) {
      fetchAccount();
    } else {
      setCurrentAccount(null);
    }
  }, []);

  return (
    <UserContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        setCurrentAccount,
        currentAccount,
        isDesktop,
        platforms,
        smallScreen,
        mediumScreen,
        largeScreen,
        screenSize,
        isWideScreen,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

// Hook for easy access to the context
export const useCurrentUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useCurrentUser must be used within a UserProvider");
  }
  return context;
};
