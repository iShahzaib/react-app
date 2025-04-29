import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const user = localStorage.getItem("loggedInUser");
        setIsLoggedIn(!!user);
    }, []);

    const login = () => {
        localStorage.setItem('isAuthenticated', 'true'); // <-- Save login
        localStorage.setItem("loggedInUser", "true");
        setIsLoggedIn(true);
    };

    const logout = () => {
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem("loggedInUser");
        setIsLoggedIn(false);
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);