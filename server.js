
require("dotenv").config();
console.log("URI:", process.env.IYZICO_URI);

const express = require("express");
const cors = require("cors");
const fs = require("fs");
// const Iyzipay = require("iyzipay");

const path = require("path");

const ordersFile = path.join(__dirname, "orders.json");

let orders = [];

if (fs.existsSync(ordersFile)) {
  orders = JSON.parse(fs.readFileSync(ordersFile, "utf8"));
}

function saveOrders() {
  fs.writeFileSync(ordersFile, JSON.stringify(orders, null, 2));
}

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// iyzico ayar
/*
const iyzipay = new Iyzipay({
  apiKey: process.env.IYIZICO_API_KEY,
  secretKey: process.env.IYIZICO_SECRET_KEY,
  uri: "https://sandbox-api.iyzipay.com"
});
*/

// ✅ ÜRÜNLER BURADA OLACAK
let products = [
  {
    id: 1,
    name: "GTA 5",
    price: 500,
    image: "https://cdn.cloudflare.steamstatic.com/steam/apps/271590/header.jpg",
    keys: [
      "GTA5-AAA111",
      "GTA5-BBB222",
      "GTA5-CCC333"
    ]
  },
  {
    id: 2,
    name: "Cyberpunk",
    price: 400,
    image: "https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/header.jpg",
    keys: [
      "CYBER-111",
      "CYBER-222"
    ]
  }
];


const ORDERS_FILE = "orders.json";

if (fs.existsSync(ORDERS_FILE)) {
  orders = JSON.parse(fs.readFileSync(ORDERS_FILE, "utf8"));
}

function saveOrders() {
  fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2));
}


const DB_FILE = "products.json";

if (fs.existsSync(DB_FILE)) {
  products = JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
}

function saveProducts() {
  fs.writeFileSync(DB_FILE, JSON.stringify(products, null, 2));
}

// ✅ ÜRÜNLERİ GÖNDER
app.get("/products", (req, res) => {
  res.json(products.map(p => ({
    id: p.id,
    name: p.name,
    price: p.price,
    image: p.image,
    stock: p.keys.length
  })));
});

// ✅ ÖDEME BAŞLAT
app.post("/start-payment", (req, res) => {
  const { productId, customerName } = req.body;
  const product = products.find(p => p.id === productId);

  if (!product || product.keys.length === 0) {
    return res.json({ success: false });
  }

  // fake ödeme linki (test için)
  res.json({
    paymentPageUrl: `/payment-success?productId=${productId}&customerName=${encodeURIComponent(customerName)}`
  });
});

// ✅ ÖDEME TAMAMLANDI → KEY VER
app.get("/payment-success", (req, res) => {
  const productId = parseInt(req.query.productId);
  const customerName = req.query.customerName || "İsimsiz";

  const product = products.find(p => p.id === productId);

  if (!product || product.keys.length === 0) {
    return res.send("Key yok ❌");
  }

  const key = product.keys.shift();
  orders.push({
  productName: product.name,
  buyerName: customerName,
  price: product.price,
  key: key,
  date: new Date().toLocaleString("tr-TR")
});

saveOrders();
saveProducts();

  res.redirect(`/success.html?key=${encodeURIComponent(key)}`);
});

app.post("/add-key", (req, res) => {
  const { productId, key, password } = req.body;

  if (password !== "1234") {
    return res.json({ success: false });
  }

  const product = products.find(p => p.id == productId);

  if (!product) {
    return res.json({ success: false });
  }

  product.keys.push(key);
  saveProducts();

  res.json({ success: true });
});

app.get("/orders", (req, res) => {
  res.json(orders);
});

const path = require("path");

// public klasörünü aç
app.use(express.static(path.join(__dirname, "public")));

// ana sayfa
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(3002, () => {
  console.log("🚀 Server running on http://localhost:3002");
});