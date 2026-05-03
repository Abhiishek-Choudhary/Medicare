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

    const updateAccount = (user, userRole) => {
        if (user) {
            localStorage.setItem('medicare_user', JSON.stringify(user));
            localStorage.setItem('medicare_role', userRole);
        } else {
            localStorage.removeItem('medicare_user');
            localStorage.removeItem('medicare_role');
        }
        setAccount(user);
        setRole(userRole || null);
    };

    return (
        <DataContext.Provider value={{ account, role, setAccount: updateAccount }}>
            {children}
        </DataContext.Provider>
    );
};

export default DataProvider;
