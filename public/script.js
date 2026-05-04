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
        <button onclick="buy(${product.id})">Satın Al</button>
      `;

      productsDiv.appendChild(card);
    });
  } catch (error) {
    console.error(error);
    productsDiv.innerHTML = "❌ Sunucu bağlantı hatası";
  }
}

let selectedProduct = null;

function buy(id) {
  selectedProduct = id;
  document.getElementById("buyBox").style.display = "block";
}

function confirmBuy() {
  const name = document.getElementById("customerName").value;

  fetch("/start-payment", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      productId: selectedProduct,
      customerName: name
    })
  })
    .then(res => res.json())
    .then(data => {
      if (data.paymentPageUrl) {
        window.location.href = data.paymentPageUrl;
      } else {
        alert("Stok yok ❌");
      }
    });
}

window.onload = loadProducts;
