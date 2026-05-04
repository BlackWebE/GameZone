async function loadProducts() {
  const productsDiv = document.getElementById("products");

  if (!productsDiv) {
    console.error("products alanı bulunamadı");
    return;
  }

  productsDiv.innerHTML = "Yükleniyor...";

  try {
    const res = await fetch("/products");
    const products = await res.json();

    productsDiv.innerHTML = "";

    products.forEach(product => {
      const card = document.createElement("div");
      card.className = "game-card";

      card.innerHTML = `
        <img src="${product.image}" alt="${product.name}">
        <h3>${product.name}</h3>
        <p>${product.price}₺</p>
        <p>Stok: ${product.stock}</p>
        <button onclick="completePayment(${product.id})">Satın Al</button>
      `;

      productsDiv.appendChild(card);
    });
  } catch (error) {
    console.error(error);
    productsDiv.innerHTML = "❌ Sunucu bağlantı hatası";
  }
}

async function completePayment(id) {
  const customerName = prompt("Adını yaz:");

  if (!customerName) {
    alert("İsim girmelisin");
    return;
  }

  try {
    const res = await fetch("/start-payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ productId: id, customerName: customerName })
    });

    const data = await res.json();

    if (data.paymentPageUrl) {
      window.location.href = data.paymentPageUrl;
    } else {
      alert("Stok yok ❌");
    }
  } catch (error) {
    console.error(error);
    alert("Ödeme başlatılamadı");
  }
}

window.onload = loadProducts;
