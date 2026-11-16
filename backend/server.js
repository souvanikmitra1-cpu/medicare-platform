require("dotenv").config();

const express = require("express");
const cors = require("cors");
const pool = require("./config/db");
const transporter = require("./config/email");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Verify Email Server Configuration
transporter.verify((error, success) => {
  if (error) {
    console.log("Email configuration warning:", error.message);
  } else {
    console.log("Email server is ready!");
  }
});

// Root Endpoint
app.get("/", (req, res) => {
  res.json({
    message: "MediCare Backend is running!",
    status: "active",
    architecture: "Stateless HTTP with PostgreSQL Persistence",
  });
});

// Health Check Endpoint (Required for Cloud Monitoring & Container Probes)
app.get("/api/health", async (req, res) => {
  try {
    const dbCheck = await pool.query("SELECT NOW()");
    res.status(200).json({
      status: "healthy",
      service: "medicare-backend",
      database: "connected",
      dbTimestamp: dbCheck.rows[0].now,
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Health check database failure:", err.message);
    res.status(503).json({
      status: "unhealthy",
      service: "medicare-backend",
      database: "disconnected",
      error: err.message,
      timestamp: new Date().toISOString(),
    });
  }
});

// List All Medicines (Persistent from PostgreSQL)
app.get("/api/medicines", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM medicines ORDER BY medicine_id ASC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching medicines:", err.message);
    res.status(500).json({ error: "Failed to fetch medicines" });
  }
});

// List Recent Orders (Proves Stateless Persistence across container restarts)
app.get("/api/orders", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT o.order_id, o.order_date, o.total_amount, o.order_status, o.delivery_address,
             u.full_name, u.email, u.phone,
             p.payment_method, p.payment_status
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.user_id
      LEFT JOIN payments p ON o.order_id = p.order_id
      ORDER BY o.order_id DESC
      LIMIT 25
    `);
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching orders:", err.message);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// Create Order (Stateless Transactional Order Placement)
app.post("/api/orders", async (req, res) => {
  const { customer, items, paymentMethod } = req.body;

  if (!customer || !customer.email || !items || items.length === 0) {
    return res.status(400).json({ error: "Invalid order payload. Customer and items are required." });
  }

  const client = await pool.connect();

  try {
    // 1. Begin Database Transaction
    await client.query("BEGIN");

    // 2. Find or Register User
    let userRes = await client.query(
      "SELECT user_id FROM users WHERE email = $1",
      [customer.email]
    );

    let userId;
    if (userRes.rows.length > 0) {
      userId = userRes.rows[0].user_id;
      await client.query(
        `UPDATE users
         SET full_name = $1, phone = $2, address = $3, city = $4, pincode = $5
         WHERE user_id = $6`,
        [customer.name, customer.phone, customer.address, customer.city, customer.pincode, userId]
      );
    } else {
      const newUserRes = await client.query(
        `INSERT INTO users (full_name, email, phone, password_hash, address, city, pincode)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING user_id`,
        [customer.name, customer.email, customer.phone, "GUEST_CHECKOUT", customer.address, customer.city, customer.pincode]
      );
      userId = newUserRes.rows[0].user_id;
    }

    // 3. Compute Total Amount
    const totalAmount = items.reduce((sum, item) => sum + Number(item.price || 0), 0);
    const pharmacyId = 1; // Default to registered MediCare Pharmacy
    const fullAddress = `${customer.address}, ${customer.city} - ${customer.pincode}`;

    // 4. Insert Order Record
    const orderRes = await client.query(
      `INSERT INTO orders (user_id, pharmacy_id, total_amount, delivery_address, order_status)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING order_id, order_date`,
      [userId, pharmacyId, totalAmount, fullAddress, "Pending"]
    );

    const dbOrderId = orderRes.rows[0].order_id;
    const orderId = `MED-${dbOrderId}`; // Formatted Order Reference
    const orderDate = orderRes.rows[0].order_date;

    // 5. Insert Order Items
    for (const item of items) {
      // Validate medicine ID against available sample IDs (1-5) or fallback to 1
      const medId = item.id && item.id <= 5 ? item.id : 1;
      await client.query(
        `INSERT INTO order_items (order_id, medicine_id, quantity, unit_price)
         VALUES ($1, $2, $3, $4)`,
        [dbOrderId, medId, item.quantity || 1, Number(item.price || 0)]
      );
    }

    // 6. Record Payment
    const transactionId = `TXN-${Date.now()}-${dbOrderId}`;
    await client.query(
      `INSERT INTO payments (order_id, payment_method, payment_status, transaction_id, amount)
       VALUES ($1, $2, $3, $4, $5)`,
      [dbOrderId, paymentMethod || "COD", "Pending", transactionId, totalAmount]
    );

    // 7. Commit Transaction
    await client.query("COMMIT");

    const newOrder = {
      ...req.body,
      orderId: orderId,
      dbOrderId: dbOrderId,
      orderDate: orderDate,
      totalAmount: totalAmount,
    };

    console.log(`[Order Placed] Order ID: ${orderId} saved to PostgreSQL.`);

    // 8. Send Confirmation Email (Asynchronous notification)
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: customer.email,
        subject: `MediCare Order Confirmation - ${orderId}`,
        html: `
          <h2>Thank you for your order!</h2>
          <p>Hello <strong>${customer.name}</strong>,</p>
          <p>Your MediCare order has been successfully placed and saved to our cloud database.</p>
          <h3>Order Details</h3>
          <p>
            <strong>Order ID:</strong> ${orderId}<br>
            <strong>Payment Method:</strong> ${paymentMethod || "COD"}<br>
            <strong>Delivery Address:</strong> ${fullAddress}
          </p>
          <h3>Medicines</h3>
          <ul>
            ${items.map(item => `<li>${item.name} - ₹${item.price}</li>`).join("")}
          </ul>
          <h3>Total: ₹${totalAmount}</h3>
          <p>Thank you for choosing <strong>MediCare</strong>.</p>
        `,
      });
      console.log(`[Email Sent] Confirmation email delivered for ${orderId}`);
    } catch (emailErr) {
      console.warn(`[Email Warning] Could not send confirmation email: ${emailErr.message}`);
    }

    // 9. Respond to Client
    return res.status(201).json({
      message: "Order created and persisted successfully in PostgreSQL",
      order: newOrder,
    });

  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Order transaction error:", err);
    return res.status(500).json({
      error: "Failed to place order due to database transaction error",
      details: err.message,
    });
  } finally {
    client.release();
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`MediCare backend running on http://localhost:${PORT}`);
  console.log(`Health check ready at: http://localhost:${PORT}/api/health`);
});
