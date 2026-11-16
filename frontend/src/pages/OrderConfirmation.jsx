import { useLocation, useNavigate } from "react-router-dom";

function OrderConfirmation() {
  const navigate = useNavigate();
  const location = useLocation();

  const order = location.state?.order;

  if (!order) {
    return (
      <div style={{ padding: "50px", textAlign: "center" }}>
        <h2>Order information not found</h2>

        <button
          className="checkout-btn"
          onClick={() => navigate("/")}
        >
          Go Home
        </button>
      </div>
    );
  }

  const total = order.items.reduce(
    (sum, medicine) => sum + medicine.price,
    0
  );

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
      </header>

      <main className="checkout-page">
        <div className="checkout-form">
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "60px" }}>✅</div>

            <h1>Order Confirmed!</h1>

            <p>
              Thank you for ordering from MediCare.
            </p>

            <p>
              Your order has been successfully placed.
            </p>
          </div>

          <hr />

          <h2>Order Details</h2>

          <p>
            <strong>Order ID:</strong> {order.orderId}
          </p>

          <p>
            <strong>Customer:</strong>{" "}
            {order.customer.name}
          </p>

          <p>
            <strong>Email:</strong>{" "}
            {order.customer.email}
          </p>

          <p>
            <strong>Phone:</strong>{" "}
            {order.customer.phone}
          </p>

          <p>
            <strong>Delivery Address:</strong>{" "}
            {order.customer.address},{" "}
            {order.customer.city} -{" "}
            {order.customer.pincode}
          </p>

          <p>
            <strong>Payment:</strong>{" "}
            {order.paymentMethod === "cod"
              ? "Cash on Delivery"
              : "Online Payment"}
          </p>

          <hr />

          <h2>Medicines</h2>

          {order.items.map((medicine, index) => (
            <div
              className="summary-row"
              key={index}
            >
              <span>{medicine.name}</span>
              <span>₹{medicine.price}</span>
            </div>
          ))}

          <hr />

          <div className="summary-total">
            <span>Total</span>
            <strong>₹{total}</strong>
          </div>

          <button
            className="checkout-btn"
            onClick={() => navigate("/")}
          >
            Continue Shopping
          </button>
        </div>
      </main>
    </div>
  );
}

export default OrderConfirmation;