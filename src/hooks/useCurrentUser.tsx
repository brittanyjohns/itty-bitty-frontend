// useCurrentUser.ts
import { useContext } from 'react';
import { UserContextType, UserContext } from '../contexts/UserContext';

export const useCurrentUser = (): UserContextType => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useCurrentUser must be used within a UserProvider');
    }
    return context;
};