require("dotenv").config();

const express = require("express");
const cors = require("cors");
const Iyzipay = require("iyzipay");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

// iyzico ayar
const iyzipay = new Iyzipay({
  apiKey: process.env.IYZICO_API_KEY,
  secretKey: process.env.IYZICO_SECRET_KEY,
  uri: process.env.IYZICO_URI
});

app.get("/products", (req, res) => {
  res.json([
    {
      id: 1,
      name: "GTA 5",
      price: 299,
      stock: 1,
      image: "https://upload.wikimedia.org/wikipedia/en/a/a5/Grand_Theft_Auto_V.png"
    }
  ]);
});

// 🔥 ÖDEME BAŞLAT
app.post("/start-payment", (req, res) => {
  const request = {
    locale: Iyzipay.LOCALE.TR,
    conversationId: "gamezone-" + Date.now(),
    price: "299",
    paidPrice: "299",
    currency: Iyzipay.CURRENCY.TRY,
    basketId: "GTA5",
    paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,

    // 🔴 ŞU AN LOCAL TEST (KESİN ÇALIŞIR)
    callbackUrl: "https://senin-siten.onrender.com/payment-callback",

    buyer: {
      id: "1",
      name: "Emre",
      surname: "Gungor",
      gsmNumber: "+905350000000",
      email: "test@test.com",
      identityNumber: "11111111111",
      registrationAddress: "Konya",
      city: "Konya",
      country: "Turkey",
      zipCode: "42000",
      ip: "85.34.78.112"
    },

    shippingAddress: {
      contactName: "Emre Gungor",
      city: "Konya",
      country: "Turkey",
      address: "Konya",
      zipCode: "42000"
    },

    billingAddress: {
      contactName: "Emre Gungor",
      city: "Konya",
      country: "Turkey",
      address: "Konya",
      zipCode: "42000"
    },

    basketItems: [
      {
        id: "1",
        name: "GTA 5",
        category1: "Oyun",
        itemType: Iyzipay.BASKET_ITEM_TYPE.VIRTUAL,
        price: "299"
      }
    ]
  };

  iyzipay.checkoutFormInitialize.create(request, (err, result) => {
    if (err) return res.json({ success: false, message: err.message });

    if (result.status === "success") {
      return res.json({
        success: true,
        paymentPageUrl: result.paymentPageUrl
      });
    }

    res.json({ success: false, message: result.errorMessage });
  });
});


// 🔥 CALLBACK (KEY BURADA VERİLİR)
app.all("/payment-callback", (req, res) => {
  const key = "GTA5-" + Math.random().toString(36).substring(2, 12).toUpperCase();

  res.send(`
    <body style="background:#0b1020;color:white;font-family:Arial;text-align:center;padding:50px">
      <h1>✅ Ödeme Başarılı</h1>
      <h2>🎮 Keyiniz:</h2>
      <h1 style="color:#22c55e">${key}</h1>
      <a href="/" style="color:white">Siteye dön</a>
    </body>
  `);
});

// 🚀 SERVER
const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
  console.log("GameZone çalışıyor");
});