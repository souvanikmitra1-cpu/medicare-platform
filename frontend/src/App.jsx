import { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";

import "./App.css";
import MedicineDetails from "./pages/MedicineDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";

const medicines = [
  {
    id: 1,
    name: "Paracetamol 500mg",
    manufacturer: "Example Healthcare",
    price: 25,
    category: "Medicines",
  },
  {
    id: 2,
    name: "Vitamin C Tablets",
    manufacturer: "Example Healthcare",
    price: 120,
    category: "Vitamins",
  },
  {
    id: 3,
    name: "ORS Powder",
    manufacturer: "Example Healthcare",
    price: 35,
    category: "Medicines",
  },
  {
    id: 4,
    name: "Multivitamin Tablets",
    manufacturer: "Example Healthcare",
    price: 180,
    category: "Vitamins",
  },
  {
    id: 5,
    name: "Ibuprofen 400mg",
    manufacturer: "Example Healthcare",
    price: 45,
    category: "Medicines",
  },
  {
    id: 6,
    name: "Calcium Tablets",
    manufacturer: "Example Healthcare",
    price: 150,
    category: "Vitamins",
  },
];

function HomePage({ cart, addToCart }) {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const filteredMedicines = medicines.filter((medicine) =>
    medicine.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>

      {/* HEADER */}
      <header className="header">

        <div className="logo">
          Medi<span>Care</span>
        </div>

        <nav className="nav">
          <a href="#categories">Categories</a>
          <a href="#medicines">Medicines</a>
          <a href="#about">About</a>
        </nav>

        <div className="header-actions">

          <button className="login-btn">
            Login
          </button>

         <button
  className="cart-btn"
  onClick={() => navigate("/cart")}
>
  🛒 Cart ({cart.length})
</button>

        </div>

      </header>


      {/* HERO */}
      <section className="hero">

        <div className="hero-content">

          <h1>
            Your Health,
            <br />
            <span>Delivered to Your Door</span>
          </h1>

          <p>
            Order medicines, healthcare products and
            wellness essentials from MediCare.
          </p>

          {/* SEARCH */}
          <div className="search-box">

            <span>🔍</span>

            <input
              type="text"
              placeholder="Search medicines..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

          </div>

        </div>

      </section>


      {/* PRESCRIPTION */}
      <section className="prescription">

        <div>

          <h2>Have a Prescription?</h2>

          <p>
            Upload your prescription and we'll help
            you find the medicines you need.
          </p>

        </div>

        <button className="upload-btn">
          📄 Upload Prescription
        </button>

      </section>


      {/* CATEGORIES */}
      <section
        className="section"
        id="categories"
      >

        <h2>Shop by Category</h2>

        <div className="categories">

          <div className="category-card">
            💊
            <h3>Medicines</h3>
            <p>Everyday medicines</p>
          </div>

          <div className="category-card">
            🍊
            <h3>Vitamins</h3>
            <p>Health supplements</p>
          </div>

          <div className="category-card">
            🧴
            <h3>Personal Care</h3>
            <p>Daily care products</p>
          </div>

          <div className="category-card">
            🩺
            <h3>Healthcare</h3>
            <p>Healthcare essentials</p>
          </div>

        </div>

      </section>


      {/* MEDICINES */}
      <section
        className="section"
        id="medicines"
      >

        <h2>Popular Medicines</h2>

        <div className="medicine-grid">

          {filteredMedicines.map((medicine) => (

            <div
              className="medicine-card"
              key={medicine.id}
              onClick={() =>
                navigate(`/medicine/${medicine.id}`)
              }
              style={{ cursor: "pointer" }}
            >

              <div className="medicine-image">
                💊
              </div>

              <span className="medicine-category">
                {medicine.category}
              </span>

              <h3>
                {medicine.name}
              </h3>

              <p>
                {medicine.manufacturer}
              </p>

              <div className="medicine-bottom">

                <strong>
                  ₹{medicine.price}
                </strong>

                <button
                  className="add-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(medicine);
                  }}
                >
                  Add
                </button>

              </div>

            </div>

          ))}

        </div>

      </section>


      {/* FOOTER */}
      <footer
        className="footer"
        id="about"
      >

        <h2>MediCare</h2>

        <p>
          Your trusted demo healthcare marketplace.
        </p>

        <p>
          © 2026 MediCare
        </p>

      </footer>

    </div>
  );
}


function App() {

  const [cart, setCart] = useState([]);

  const addToCart = (medicine) => {
    setCart((previousCart) => [
      ...previousCart,
      medicine,
    ]);
  };

  return (

    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={
            <HomePage
              cart={cart}
              addToCart={addToCart}
            />
          }
        />

        <Route
          path="/medicine/:id"
          element={
            <MedicineDetails
              addToCart={addToCart}
            />
          }
        />
        <Route
  path="/cart"
  element={
    <Cart
      cart={cart}
    />
  }
/>
<Route
  path="/checkout"
  element={
    <Checkout
      cart={cart}
    />
  }
/>
<Route
  path="/order-confirmation"
  element={<OrderConfirmation />}
/>

      </Routes>

    </BrowserRouter>

  );
}

export default App;