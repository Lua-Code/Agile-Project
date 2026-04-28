import { useEffect } from "react";
import api from "../Api/axios";
import { useAuthContext } from "./useAuthContext";

export const useAuthInit = () => {
  const { dispatch } = useAuthContext();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data } = await api.get("/auth/me");

        dispatch({
          type: "LOGIN",
          payload: data.user,
        });
      } catch (err) {
        dispatch({ type: "LOGOUT" });
      }
    };

    checkUser();
  }, [dispatch]);
};