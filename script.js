const API = "http://localhost:3002";

async function loadProducts() {
  const productsDiv = document.getElementById("products");
  productsDiv.innerHTML = "Yükleniyor...";

  try {
    const res = await fetch(`${API}/products`);
    const products = await res.json();

    productsDiv.innerHTML = "";

    products.forEach(product => {
      const card = document.createElement("div");
      card.className = "product-card";

      card.innerHTML = `
        <img src="${product.image}" alt="${product.name}">
        <h3>${product.name}</h3>
        <p class="price">${product.price}₺</p>
        <p class="stock">Stok: ${product.stock}</p>

        <input id="name-${product.id}" placeholder="Adınız">
        <input id="phone-${product.id}" placeholder="Telefon">

        <button onclick="completePayment(${product.id})" ${product.stock <= 0 ? "disabled" : ""}>
          ${product.stock <= 0 ? "Stok Yok" : "Satın Al"}
        </button>
      `;

      productsDiv.appendChild(card);
    });
  } catch (err) {
    productsDiv.innerHTML = "❌ Sunucu bağlantı hatası";
  }
}

function completePayment(productId) {
  fetch("http://localhost:3002/start-payment", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ productId })
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        window.location.href = data.paymentPageUrl;
      } else {
        alert("Ödeme başlatılamadı: " + data.message);
      }
    });
}

loadProducts();
