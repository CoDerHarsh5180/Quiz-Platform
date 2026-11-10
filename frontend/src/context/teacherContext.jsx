import { createContext, useContext } from "react";
import { useState, useEffect } from "react";
import { showData } from "../Api/authApi";
const TeacherContext = createContext(null);

export const TeacherProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);


    const [loginForm, setLoginForm] = useState(false)
    const [registerForm, setRegisterForm] = useState(false)
    const [createTestForm, setCreateTestForm] = useState(false)


    useEffect(() => {
        showData()
            .then((data) => {
                setUser(data?.data || data);   // handle both {data:{...}} and raw object
                setLoading(false);
            })
            .catch((e) => {
                // Not logged in, or backend unreachable — that's fine, show the app anyway
                console.log("Auth check:", e.message || "Not authenticated");
                setUser(null);
                setLoading(false);
            });
    }, []);

    return (
        <TeacherContext.Provider value={{ user, loading , loginForm, setLoginForm, registerForm, setRegisterForm, createTestForm, setCreateTestForm }}>
            {children}
        </TeacherContext.Provider>
    );
}
export const useAuth = ()=> useContext(TeacherContext);