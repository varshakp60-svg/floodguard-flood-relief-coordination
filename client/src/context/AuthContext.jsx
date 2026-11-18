
import React, {
  createContext,
  useContext,
  useState
} from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {

  // Restore the previous login when the page refreshes
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("floodUser");

      return savedUser ? JSON.parse(savedUser) : null;
    } catch (error) {
      console.error("Unable to restore login:", error);
      localStorage.removeItem("floodUser");
      return null;
    }
  });

  const login = (userData, token) => {
    const newUser = {
      ...userData,
      role:
        userData.role.charAt(0).toUpperCase() +
        userData.role.slice(1),
      token
    };

    localStorage.setItem(
      "floodUser",
      JSON.stringify(newUser)
    );

    setUser(newUser);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("floodUser");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
