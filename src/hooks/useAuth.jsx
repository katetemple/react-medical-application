import { createContext, useContext, useState, useEffect } from "react";
import axios from "@/config/api";

// Create Auth Context to store auth state
const AuthContext = createContext();

// Custom hook to use auth context
export const useAuth = () => {
    return useContext(AuthContext);
};

// Auth Provider component to wrap the app and provide auth state
// children is a prop that represents the nested components
export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(() => {
        if(localStorage.getItem('token')){
            return localStorage.getItem('token');
        }
        else {
            return null;
        }
    });

    const [user, setUser] = useState(null);

    useEffect(() => {
        if(localStorage.getItem("user")){
            setUser(JSON.parse(localStorage.getItem("user")));
        }
    }, []);

    const onRegister = async (first_name, last_name, email, password) => {
        const options = {
            method: "POST",
            url: "/register",
            data: {
                first_name,
                last_name,
                email,
                password
            },
        };


        try {
            await axios.request(options);

            await onLogin(email, password);
            return null;
        } catch (err) {
            console.log(err.response.data)
            return err.response?.data;
        }
    };

    const onLogin = async (email, password) => {
        const options = {
            method: "POST",
            url: "/login",
            data: {
                email,
                password
            }
        };

        try {
            let response = await axios.request(options);
            console.log(response.data);
            localStorage.setItem("token", response.data.token);
            setToken(response.data.token);

            console.log("setting user", {
                email: response.data.email,
                first_name: response.data.first_name,
                last_name: response.data.last_name
            })
            const userData = {
                email: response.data.email,
                first_name: response.data.first_name,
                last_name: response.data.last_name,
            }
            setUser(userData);
            localStorage.setItem("user", JSON.stringify(userData));

        } catch (err) {
            console.log(err.response.data);
        }
    };

    const onLogout = () => {
        setToken(null);
        localStorage.removeItem("user");
        setUser(null);
        localStorage.removeItem("token");
    };

    const value = {
        token,
        user,
        onLogin,
        onLogout,
        onRegister
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>

};