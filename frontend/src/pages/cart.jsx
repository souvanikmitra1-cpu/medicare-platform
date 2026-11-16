import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Cart({ cart }) {
  const navigate = useNavigate();

  const [quantities, setQuantities] = useState(() => {
    const result = {};

    cart.forEach((medicine) => {
      result[medicine.id] = (result[medicine.id] || 0) + 1;
    });

    return result;
  });

  const increaseQuantity = (id) => {
    setQuantities((previous) => ({
      ...previous,
      [id]: (previous[id] || 0) + 1,
    }));
  };

  const decreaseQuantity = (id) => {
    setQuantities((previous) => ({
      ...previous,
      [id]: Math.max(1, (previous[id] || 1) - 1),
    }));
  };

  const total = cart.reduce(
    (sum, medicine) =>
      sum + medicine.price * (quantities[medicine.id] || 1),
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

        <div className="header-actions">

          <button
            className="login-btn"
            type="button"
            onClick={() => navigate("/")}
          >
            Home
          </button>

        </div>

      </header>

      <main className="cart-page">
        

        <button
          className="back-button"
          type="button"
          onClick={() => navigate("/")}
        >
          ← Continue Shopping
        </button>

        <h1>Your Cart</h1>

        {cart.length === 0 ? (

          <div className="empty-cart">

            <div className="empty-cart-icon">
              🛒
            </div>

            <h2>Your cart is empty</h2>

            <p>
              Add some medicines to your cart.
            </p>

            <button
              className="add-cart-large"
              type="button"
              onClick={() => navigate("/")}
            >
              Browse Medicines
            </button>

          </div>

        ) : (

          <div className="cart-container">

            <div className="cart-items">

              {cart.map((medicine) => (

                <div
                  className="cart-item"
                  key={medicine.id}
                >

                  <div className="cart-item-image">
                    💊
                  </div>

                  <div className="cart-item-info">

                    <h3>
                      {medicine.name}
                    </h3>

                    <p>
                      {medicine.manufacturer}
                    </p>

                    <strong>
                      ₹{medicine.price}
                    </strong>

                    <div className="cart-quantity">

                      <button
                        type="button"
                        onClick={() =>
                          decreaseQuantity(medicine.id)
                        }
                      >
                        −
                      </button>

                      <span>
                        {quantities[medicine.id] || 1}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          increaseQuantity(medicine.id)
                        }
                      >
                        +
                      </button>

                    </div>

                  </div>

                </div>

              ))}

            </div>

            <div className="cart-summary">

              <h2>Order Summary</h2>

              <div className="summary-row">
                <span>Items</span>

                <span>
                  {Object.values(quantities).reduce(
                    (sum, quantity) => sum + quantity,
                    0
                  )}
                </span>
              </div>

              <div className="summary-row">
                <span>Subtotal</span>

                <span>
                  ₹{total}
                </span>
              </div>

              <div className="summary-row">
                <span>Delivery</span>

                <span>FREE</span>
              </div>

              <hr />

              <div className="summary-total">
                <span>Total</span>

                <strong>
                  ₹{total}
                </strong>
              </div>

             <button
  type="button"
  className="checkout-btn"
  onClick={() => navigate("/checkout")}
>
  Proceed to Checkout
</button>

            </div>

          </div>

        )}

      </main>

    </div>
  );
}

export default Cart;