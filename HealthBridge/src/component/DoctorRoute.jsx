import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

const DoctorRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isDoctor, setIsDoctor] = useState(false);

  useEffect(() => {
    const checkDoctor = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();

        console.log("User:", user);

        if (!user) {
          setLoading(false);
          return;
        }

        // ✅ NO maybeSingle
        const { data, error } = await supabase
          .from("doctors")
          .select("id")
          .eq("id", user.id);

        if (error) {
          console.error("DoctorRoute error:", error);
        }

        console.log("DoctorRoute data:", data);

        // ✅ Safe check
        setIsDoctor(data && data.length > 0);

      } catch (err) {
        console.error("Route Error:", err);
      } finally {
        setLoading(false);
      }
    };

    checkDoctor();
  }, []);

  if (loading) return <div>Loading...</div>;

  if (!isDoctor) {
    return <Navigate to="/doctor-signin" replace />;
  }

  return children;
};

export default DoctorRoute;