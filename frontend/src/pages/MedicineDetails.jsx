import { useParams, useNavigate } from "react-router-dom";

const medicines = [
  {
    id: 1,
    name: "Paracetamol 500mg",
    manufacturer: "Example Healthcare",
    price: 25,
    category: "Medicines",
    composition: "Paracetamol 500 mg",
    description:
      "Example product information for our demo medicine catalogue.",
    prescriptionRequired: false,
  },
  {
    id: 2,
    name: "Vitamin C Tablets",
    manufacturer: "Example Healthcare",
    price: 120,
    category: "Vitamins",
    composition: "Vitamin C",
    description:
      "Example product information for our demo medicine catalogue.",
    prescriptionRequired: false,
  },
  {
    id: 3,
    name: "ORS Powder",
    manufacturer: "Example Healthcare",
    price: 35,
    category: "Medicines",
    composition: "Oral Rehydration Salts",
    description:
      "Example product information for our demo medicine catalogue.",
    prescriptionRequired: false,
  },
  {
    id: 4,
    name: "Multivitamin Tablets",
    manufacturer: "Example Healthcare",
    price: 180,
    category: "Vitamins",
    composition: "Multivitamin formulation",
    description:
      "Example product information for our demo medicine catalogue.",
    prescriptionRequired: false,
  },
];

function MedicineDetails({ addToCart }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const medicine = medicines.find(
    (item) => item.id === Number(id)
  );

  if (!medicine) {
    return (
      <div style={{ padding: "50px" }}>
        <h2>Medicine not found</h2>

        <button onClick={() => navigate("/")}>
          Go Home
        </button>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(medicine);
    alert(`${medicine.name} added to cart`);
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

      <main className="medicine-details">

        <button
          className="back-button"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>

        <div className="details-container">

          <div className="details-image">
            💊
          </div>

          <div className="details-info">

            <span className="medicine-tag">
              {medicine.category}
            </span>

            <h1>
              {medicine.name}
            </h1>

            <p className="manufacturer">
              By {medicine.manufacturer}
            </p>

            <hr />

            <h2>
              ₹{medicine.price}
            </h2>

            <p>
              <strong>Composition:</strong>{" "}
              {medicine.composition}
            </p>

            <p>
              <strong>Description:</strong>{" "}
              {medicine.description}
            </p>

            <div className="quantity">

              <button>-</button>

              <span>1</span>

              <button>+</button>

            </div>

            <button
              className="add-cart-large"
              onClick={handleAddToCart}
            >
              🛒 Add to Cart
            </button>

          </div>

        </div>

      </main>

    </div>
  );
}

export default MedicineDetails;