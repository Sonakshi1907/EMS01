import { createContext, useContext, useState } from "react";
import { getFromStorage } from "../utils/localStorage.js";

const defaultAuthContext = {
    currentUser: null,
    setCurrentUser: () => {},
    login: () => ({ success: false, message: "Auth provider is not available" }),
};

export const AuthContext = createContext(defaultAuthContext);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);

    const login = (email, password) => {
        const users = getFromStorage("users") || [];

        const user = users.find(
            (user) =>
                user.email === email &&
                user.password === password
        );

        if (!user) {
            return {
                success: false,
                message: "Invalid email or password"
            };
        }

        setCurrentUser(user);

        return {
            success: true,
            user
        };
    };

    return (
        <AuthContext.Provider
            value={{
                currentUser,
                setCurrentUser,
                login
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used inside AuthProvider");
    }

    return context;
};

export default AuthContext;