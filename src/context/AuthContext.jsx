import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  const login = async (data) => {
    try {
      const response = await axios.post("/auth/token", {
        userName: data.user,
        password: data.password,
      });
      const { token, userId } = response.data;
      setToken(token);
      setUserId(userId);

      //save token and userId to localstorage
      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);

      navigate("/schedule");
    } catch (error) {
      //handle login failure
      throw new Error("login failed");
    }
  };

  const logout = () => {
    //clear localstorage
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    //clear token and userId from state
    setToken(null);
    setUserId(null);
  };

  useEffect(() => {
    //check for existing token and userId in localStorage during component mount
    const storedToken = localStorage.getItem("token");
    const storedUserId = localStorage.getItem("userId");

    if (storedToken && storedUserId) {
      setToken(storedToken);
      setUserId(storedUserId);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ token, userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if(!context){
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
