// ---------------------------
// IMPORTS
// ---------------------------
require("dotenv").config();

const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Set storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images"); // folder where images are saved
  },
  filename: (req, file, cb) => {
    // Keep original name or generate a unique one
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// ---------------------------
// APP INIT
// ---------------------------
const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // allows JSON in req.body

// ---------------------------
// DATABASE CONNECTION
// ---------------------------
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});


db.connect((err) => {
  if (err) {
    console.error("DB connection error:", err);
  } else {
    console.log("✅ Connected to MySQL database");
  }
});

// ---------------------------
// ROUTES
// ---------------------------
app.use("/images", express.static("public/images"));

// ----- MENU ITEMS -----
app.get("/menu", (req, res) => {
  db.query("SELECT * FROM menu_items", (err, results) => {
    if (err) {
      console.error(err);
      return res.json({ success: false, message: "Failed to fetch menu" });
    }
    res.json(results);
  });
});

// ----- REGISTER -----
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.json({ success: false, message: "All fields are required" });
  }

  db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
    if (err) return res.json({ success: false, message: "Database error" });

    if (results.length > 0) {
      return res.json({ success: false, message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    db.query(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword],
      (err2, result) => {
        if (err2) return res.json({ success: false, message: "Registration failed" });
        res.json({ success: true, message: "User registered successfully", user: { id: result.insertId, name, email } });
      }
    );
  });
});

// ----- LOGIN -----
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({ success: false, message: "All fields are required" });
  }

  db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
    if (err) return res.json({ success: false, message: "Database error" });

    if (results.length === 0) {
      return res.json({ success: false, message: "User not found" });
    }

    const user = results[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.json({ success: false, message: "Incorrect password" });
    }

    res.json({ success: true, message: "Login successful", user: { id: user.id, name: user.name, email: user.email } });
  });
});

app.post("/cart", (req, res) => {
  console.log("📦 Incoming cart save:", req.body);

  const { user_id, cart } = req.body;

  if (!user_id || !Array.isArray(cart)) {
    console.error("❌ Invalid cart data:", req.body);
    return res.status(400).json({ success: false, message: "Invalid cart" });
  }

  db.query("DELETE FROM carts WHERE user_id = ?", [user_id], (err) => {
    if (err) {
      console.error("❌ Cart delete error:", err);
      return res.status(500).json({ message: "Delete failed" });
    }

    if (cart.length === 0) return res.json({ success: true });

    const items = cart.map(item => {
      console.log("➡ Saving item:", item);
      return [
        user_id,
        item.menuId,
        Number(item.quantity),
        Number(item.price)
      ];
    });

    const sql =
      "INSERT INTO carts (user_id, menu_item_id, quantity, price) VALUES ?";

    db.query(sql, [items], (err2) => {
      if (err2) {
        console.error("❌ Cart insert error:", err2);
        return res.status(500).json({ message: "Insert failed" });
      }

      res.json({ success: true });
    });
  });
});




app.get("/cart/:userId", (req, res) => {
  console.log("📥 Fetch cart for user:", req.params.userId);

  const sql = `
    SELECT 
      carts.id AS cartId,
      carts.menu_item_id AS menuId,
      menu_items.name,
      carts.price,
      menu_items.img,
      carts.quantity
    FROM carts
    JOIN menu_items ON carts.menu_item_id = menu_items.id
    WHERE carts.user_id = ?
  `;

  db.query(sql, [req.params.userId], (err, result) => {
    if (err) {
      console.error("❌ Cart fetch error:", err);
      return res.status(500).json({ message: "Server error" });
    }
    res.json(result);
  });
});



// ----- ADD MENU ITEM -----
app.post("/menu", upload.single("image"), (req, res) => {
  console.log("========== /menu POST Request Received ==========");
  console.log("Request body:", req.body);
  console.log("Request file:", req.file);
  console.log("Request headers:", req.headers);

  const { name, price } = req.body;
  const image = req.file;

  if (!name || !price) {
    console.log("❌ Missing name or price");
    return res.status(400).json({ 
      success: false, 
      message: "Name and price are required" 
    });
  }

  if (!image) {
    console.log("❌ No image uploaded");
    return res.status(400).json({ 
      success: false, 
      message: "Image is required" 
    });
  }

  console.log(`✅ Received: ${name}, $${price}, image: ${image.filename}`);
  
  const imgFilename = image.filename;
  const sql = "INSERT INTO menu_items (name, price, img) VALUES (?, ?, ?)";
  const values = [name, parseFloat(price), imgFilename];
  
  console.log("Executing SQL:", sql, "with values:", values);

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("❌ Database error:", err);
      console.error("SQL Error Code:", err.code);
      console.error("SQL Error Message:", err.sqlMessage);
      return res.status(500).json({ 
        success: false, 
        message: `Database error: ${err.sqlMessage || err.message}` 
      });
    }

    console.log("✅ Database insert successful. ID:", result.insertId);
    
    // Verify the file was actually saved
    const imagePath = path.join(__dirname, 'public/images', imgFilename);
    if (fs.existsSync(imagePath)) {
      console.log("✅ Image file saved successfully at:", imagePath);
    } else {
      console.log("⚠️ Warning: Image file not found at:", imagePath);
    }

    res.json({
      success: true,
      message: "Menu item added successfully",
      menuItem: { 
        id: result.insertId, 
        name, 
        price, 
        img: imgFilename 
      },
    });
  });
});

// ----- DELETE MENU ITEM -----
app.delete("/menu/:id", (req, res) => {
  const menuId = req.params.id;

  // Accept userEmail from query param (most reliable) or body (fallback)
  const userEmail = req.query.userEmail || req.body.userEmail;

  console.log("DELETE /menu/:id called with menuId:", menuId, "userEmail:", userEmail);

  if (!userEmail) {
    return res.status(400).json({ success: false, message: "User email required" });
  }

  if (userEmail !== process.env.ADMIN_EMAIL) {
    return res.status(403).json({ success: false, message: "Unauthorized" });
  }

  const sql = "DELETE FROM menu_items WHERE id = ?";
  db.query(sql, [menuId], (err, result) => {
    if (err) {
      console.error("Delete menu item error:", err);
      return res.status(500).json({ success: false, message: "Server error" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Menu item not found" });
    }

    res.json({ success: true, message: "Menu item deleted" });
  });
});



// ----- GET ALL REVIEWS -----
app.get("/reviews", (req, res) => {
  const sql = "SELECT r.id, r.user_id, r.name, r.review, u.email FROM reviews r LEFT JOIN users u ON r.user_id = u.id ORDER BY r.id DESC";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Fetch reviews error:", err);
      return res.status(500).json({ success: false, message: "Server error" });
    }
    res.json(results);
  });
});

// ----- ADD REVIEW -----
app.post("/reviews", (req, res) => {
  const { user_id, name, review } = req.body;

  if (!user_id || !review || !name) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  const sql = "INSERT INTO reviews (user_id, name, review) VALUES (?, ?, ?)";
  db.query(sql, [user_id, name, review], (err, result) => {
    if (err) {
      console.error("Insert review error:", err);
      return res.status(500).json({ success: false, message: "Server error" });
    }

    res.json({ success: true, message: "Review added", reviewId: result.insertId });
  });
});

// ----- DELETE REVIEW -----
app.delete("/reviews/:id", (req, res) => {
  const reviewId = req.params.id;
  const { user_id } = req.body;

  if (!user_id) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  // Only delete if the review belongs to the logged-in user
  const sql = "DELETE FROM reviews WHERE id = ? AND user_id = ?";

  db.query(sql, [reviewId, user_id], (err, result) => {
    if (err) {
      console.error("Delete review error:", err);
      return res.status(500).json({ success: false, message: "Server error" });
    }

    if (result.affectedRows === 0) {
      return res.status(403).json({ success: false, message: "Not allowed to delete this review" });
    }

    res.json({ success: true, message: "Review deleted" });
  });
});



// ---------------------------
// START SERVER
// ---------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
