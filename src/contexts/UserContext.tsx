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
export const platforms = getPlatforms();
export const isDesktop = platforms.includes("desktop");
// Define the shape of the context

export interface UserContextType {
  currentUser: User | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>;
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
  const fetchUser = async () => {
    // Assuming you have a function to fetch the current user
    const user = await getCurrentUser();

    if (user) {
      user.platforms = platforms;
      user.isDesktop = isDesktop;
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
    <UserContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </UserContext.Provider>
  );
};
