import { createContext, useState } from "react";

export const DataContext = createContext(null);

const DataProvider = ({ children }) => {
    const [account, setAccount] = useState(() => {
        const saved = localStorage.getItem('medicare_user');
        return saved ? JSON.parse(saved) : null;
    });

    const [role, setRole] = useState(() => {
        return localStorage.getItem('medicare_role') || null;
    });

    const [token, setToken] = useState(() => localStorage.getItem('medicare_token'));

    const updateAccount = (user, userRole, userToken) => {
        if (user) {
            localStorage.setItem('medicare_user', JSON.stringify(user));
            localStorage.setItem('medicare_role', userRole);
            if (userToken) localStorage.setItem('medicare_token', userToken);
        } else {
            localStorage.removeItem('medicare_user');
            localStorage.removeItem('medicare_role');
            localStorage.removeItem('medicare_token');
        }
        setAccount(user);
        setRole(userRole || null);
        setToken(userToken || null);
    };

    return (
        <DataContext.Provider value={{ account, role, token, setAccount: updateAccount }}>
            {children}
        </DataContext.Provider>
    );
};

export default DataProvider;
