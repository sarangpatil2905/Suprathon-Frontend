import React, { createContext, useContext, useState, useEffect } from "react";

// You can define a proper User type instead of `any`
type User = any;

interface UserContextType {
    userData: User | null;
    setUserData: React.Dispatch<React.SetStateAction<User | null>>;
}

// Create context
const UserContext = createContext<UserContextType | null>(null);

// Context Provider
export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const [userData, setUserData] = useState<User | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("userData");
        if (storedUser) {
            setUserData(JSON.parse(storedUser));
        }
    }, []);

    return (
        <UserContext.Provider value={{ userData, setUserData }}>
            {children}
        </UserContext.Provider>
    );
};

// Custom hook to access context
export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
};
