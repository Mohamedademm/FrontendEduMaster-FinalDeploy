import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const Verification = () => {
  const location = useLocation();
  const [message, setMessage] = useState("Vérification en cours...");

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("token");

    const verifyEmail = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/auth/verify-email?token=${token}`);
        const data = await response.json();
        if (response.ok) {
          setMessage(data.message || "E-mail vérifié avec succès.");
        } else {
          setMessage(data.error || "Erreur lors de la vérification de l'e-mail.");
        }
      } catch (error) {
        setMessage("Erreur réseau lors de la vérification.");
      }
    };

    if (token) {
      verifyEmail();
    } else {
      setMessage("Token de vérification manquant.");
    }
  }, [location.search]);

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h2>Vérification de l'e-mail</h2>
      <p>{message}</p>
    </div>
  );
};

export default Verification;