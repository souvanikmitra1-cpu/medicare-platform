import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Checkout({ cart }) {
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    pincode: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("cod");

  const total = cart.reduce(
    (sum, medicine) => sum + medicine.price,
    0
  );

  const handleChange = (e) => {
    setAddress({
      ...address,
      [e.target.name]: e.target.value,
    });
  };

  const placeOrder = async (e) => {
  e.preventDefault();

  if (
    !address.name ||
    !address.phone ||
    !address.email ||
    !address.address ||
    !address.city ||
    !address.pincode
  ) {
    alert("Please fill in all delivery details.");
    return;
  }

  try {
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
    const response = await fetch(`${API_URL}/api/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        customer: address,
        items: cart,
        paymentMethod: paymentMethod,
      }),
    });

    const data = await response.json();

    if (response.ok) {
  console.log("Order response:", data);
   navigate("/order-confirmation", {
    state: {
      order: data.order,
    },
  });
}else {
      alert("Failed to place order.");
    }
  } catch (error) {
    console.error("Order error:", error);
    alert("Unable to connect to the server.");
  }
};

  return (
    <div>

      <header className="header">

        <div
          className="logo"
          onClick={() => navigate("/")}
          style={{ cursor: "pointer" }}
        >
          Medi<span>Care</span>
        </div>

        <div className="header-actions">

          <button
            className="login-btn"
            onClick={() => navigate("/")}
          >
            Home
          </button>

        </div>

      </header>

      <main className="checkout-page">

        <button
          className="back-button"
          onClick={() => navigate("/cart")}
        >
          ← Back to Cart
        </button>

        <h1>Checkout</h1>

        <div className="checkout-container">

          <form
            className="checkout-form"
            onSubmit={placeOrder}
          >

            <h2>Delivery Details</h2>

            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={address.name}
              onChange={handleChange}
            />

            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={address.phone}
              onChange={handleChange}
            />
            <input
  type="email"
  name="email"
  placeholder="Email Address"
  value={address.email}
  onChange={handleChange}
/>

            <textarea
              name="address"
              placeholder="Full Address"
              value={address.address}
              onChange={handleChange}
              rows="4"
            />

            <input
              type="text"
              name="city"
              placeholder="City"
              value={address.city}
              onChange={handleChange}
            />

            <input
              type="text"
              name="pincode"
              placeholder="PIN Code"
              value={address.pincode}
              onChange={handleChange}
            />

            <h2>Payment Method</h2>

            <label className="payment-option">

              <input
                type="radio"
                value="cod"
                checked={paymentMethod === "cod"}
                onChange={(e) =>
                  setPaymentMethod(e.target.value)
                }
              />

              Cash on Delivery

            </label>

            <label className="payment-option">

              <input
                type="radio"
                value="online"
                checked={paymentMethod === "online"}
                onChange={(e) =>
                  setPaymentMethod(e.target.value)
                }
              />

              Online Payment (Demo)

            </label>

            <button
              type="submit"
              className="checkout-btn"
            >
              Place Order
            </button>

          </form>

          <div className="checkout-summary">

            <h2>Order Summary</h2>

            {cart.map((medicine, index) => (

              <div
                className="summary-row"
                key={index}
              >

                <span>
                  {medicine.name}
                </span>

                <span>
                  ₹{medicine.price}
                </span>

              </div>

            ))}

            <hr />

            <div className="summary-total">

              <span>Total</span>

              <strong>
                ₹{total}
              </strong>

            </div>

          </div>

        </div>

      </main>

    </div>
  );
}

export default Checkout;