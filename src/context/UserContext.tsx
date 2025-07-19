import { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext<any>(null);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        // You can fetch user info from localStorage or API here
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

export const useUser = () => useContext(UserContext);
