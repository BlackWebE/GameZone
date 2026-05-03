// Ürünleri çek
fetch("/products")
  .then(res => res.json())
  .then(data => {
    const container = document.querySelector(".products");
    container.innerHTML = "";

    data.forEach(p => {
      container.innerHTML += `
        <div class="product">
          <img src="${p.image}" width="200">
          <h3>${p.name}</h3>
          <p>${p.price}₺</p>
          <p>Stok: ${p.stock}</p>
          <input placeholder="Adınız">
          <input placeholder="Telefon">
          <button onclick="buy(${p.id})">Satın Al</button>
        </div>
      `;
    });
  })
  .catch(() => {
    document.querySelector(".products").innerHTML = "❌ Sunucu bağlantı hatası";
  });

// Satın alma
function buy(id) {
  fetch("/start-payment", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ productId: id })
  })
    .then(res => res.json())
    .then(data => {
      if (data.url) {
        window.location.href = data.url; // iyzico sayfasına gider
      } else {
        alert("❌ Ödeme başlatılamadı");
      }
    });
}