import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { Navigate } from "react-router-dom";

const UserRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isUser, setIsUser] = useState(false);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      // ✅ Check PATIENT table (IMPORTANT)
      const { data, error } = await supabase
        .from("patients")
        .select("id")
        .eq("id", user.id)
        .maybeSingle();

      if (error) {
        console.error("User check error:", error);
      }

      if (data) {
        setIsUser(true);
      }

    } catch (err) {
      console.error("Unexpected error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;

  // 🔴 Not logged in OR not patient
  if (!isUser) return <Navigate to="/signin" />;

  return children;
};

export default UserRoute;