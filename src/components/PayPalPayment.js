import React, { useEffect, useState } from "react";

function PayPalPayment({ amount, onSuccess, onCancel, onError }) {
  const [approvalUrl, setApprovalUrl] = useState(null);

  useEffect(() => {
    const createOrder = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/paypal/create-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount }),
        });
        const data = await res.json();
        if (data.approveUrl) {
          setApprovalUrl(data.approveUrl);
          // Redirect user to PayPal approval page
          window.location.href = data.approveUrl;
        } else {
          onError(new Error("No approval URL returned from server"));
        }
      } catch (error) {
        onError(error);
      }
    };

    createOrder();
  }, [amount, onError]);

  // This component does not render anything because the user is redirected
  return null;
}

export default PayPalPayment;
