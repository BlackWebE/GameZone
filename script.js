async function loadProducts() {
  const productsDiv = document.getElementById("products");
  productsDiv.innerHTML = "Yükleniyor...";

  try {
    const res = await fetch("/products");
    const products = await res.json();

    productsDiv.innerHTML = "";

    products.forEach(product => {
      const card = document.createElement("div");

      card.innerHTML = `
        <img src="${product.image}" width="200">
        <h3>${product.name}</h3>
        <p>${product.price}₺</p>
        <p>Stok: ${product.stock}</p>
        <button onclick="completePayment(${product.id})">Satın Al</button>
      `;

      productsDiv.appendChild(card);
    });

  } catch {
    productsDiv.innerHTML = "❌ Sunucu bağlantı hatası";
  }
}

async function completePayment(id) {
  const res = await fetch("/start-payment", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ productId: id })
  });

  const data = await res.json();

  if (data.paymentPageUrl) {
    window.location.href = data.paymentPageUrl;
  } else {
    alert("Ödeme başlatılamadı");
  }
}

window.onload = loadProducts;