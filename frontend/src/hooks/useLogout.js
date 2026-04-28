import api from "../Api/axios";
import { useAuthContext } from "./useAuthContext";

export const useLogout = () => {
  const { dispatch } = useAuthContext();

  const logout = async () => {
    try {
      await api.post(
        "/auth/logout",
        {},
        { withCredentials: true }
      );

      dispatch({ type: "LOGOUT" });
    } catch (err) {
      console.log("Logout failed", err);
    }
  };

  return { logout };
};