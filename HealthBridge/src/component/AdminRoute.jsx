import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

const AdminRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("admins")
        .select("id")
        .eq("id", user.id)
        .single();

      setIsAdmin(!error && data);
      setLoading(false);
    };

    checkAdmin();
  }, []);

  if (loading) return <div>Loading...</div>;

  return isAdmin ? children : <Navigate to="/admin-login" />;
};

export default AdminRoute;