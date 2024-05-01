// UserContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { getCurrentUser, User } from "../data/users";

import { getPlatforms } from "@ionic/react";
import { useMediaQuery } from "react-responsive";
// Define the shape of the context

export interface UserContextType {
  currentUser: User | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>;
  isDesktop: boolean;
  isWideScreen: boolean;
  platforms: string[];
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
  useEffect(() => {
    // Fetch the current user here and set it
    fetchUser();
  }, []);

  return (
    <UserContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        isDesktop,
        isWideScreen,
        platforms,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
