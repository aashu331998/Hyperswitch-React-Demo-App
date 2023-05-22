import { useState } from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";

const PayButton = ({ disabled, isProcessing }) => {
  return (
    <button
      disabled={disabled}
      id="submit"
      style={{
        marginTop: 40,
        fontSize: 16,
        fontWeight: 200,
        letterSpacing: 0.9,
      }}
    >
      <span>{isProcessing ? "Processing ... " : "Pay $2500.00"}</span>
    </button>
  );
};
const CheckoutForm = ({ return_url, background, options }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) {
      // stripe-js has not yet loaded.
      // Make sure to disable form submission until stripe-js has loaded.
      return;
    }
    setIsLoading(true);
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Make sure to change this to your payment completion page
        return_url: return_url,
      },
    });
    // This point will only be reached if there is an immediate error occurring while confirming the payment. Otherwise, your customer will be redirected to your `return_url`
    // For some payment flows such as Sofort, iDEAL, your customer will be redirected to an intermediate page to complete authorization of the payment, and then redirected to the `return_url`.
    if (error.type === "validation_error") {
      setMessage(error.message);
    } else {
      setMessage("An unexpected error occurred.");
    }
    setIsLoading(false);
  };

  return (
    <form
      style={{
        border: "#f6f9fc solid 0px",
        background: background,
        borderRadius: "8px",
        padding: "50px",
        margin: "20px 0",
        maxWidth: "560px",
        width: "100%",
        boxShadow: "0 30px 50px -20px rgb(50 50 93 / 25%)",
      }}
      onSubmit={handleSubmit}
    >
      <PaymentElement id="unified-checkout" options={options} />
      <PayButton
        disabled={isLoading || !stripe || !elements}
        isProcessing={isLoading}
      />
      {/* Show any error or success messages */}
      {message && (
        <div
          style={{
            fontSize: "16px",
            fontWeight: 400,
            color: "#ff0000",
          }}
        >
          {message}
        </div>
      )}
    </form>
  );
};

export default CheckoutForm;
