document.addEventListener("DOMContentLoaded", () => {
  console.log("app.js chargé ✅");

  const sheetUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRVsxi4Wz_wnVaqEeliFCdkVwARAp2EwYHht9-VUmf7mcx_Eo3EqaUAgS2kBkXhOmJ0zSp9wZWEZkWx/pub?output=tsv";

  fetch(sheetUrl)
  .then(res => res.text())
  .then(text => {
    const lines = text.trim().split("\n");
    const headers = lines[0].split("\t");
    
    let latestLine = null;
    let latestDate = 0;

    for (let i = 1; i < lines.length; i++) {
      const cells = lines[i].split("\t");
      const row = {};
      headers.forEach((h, j) => row[h.trim()] = cells[j].trim());
      
      const date = new Date(row["Horodateur"]).getTime();
      if (date > latestDate) {
        latestDate = date;
        latestLine = row;
      }
    }

    console.log("Dernière config :", latestLine);

    // Appliquer titre et thème
    if (latestLine["Titre de la Boutique"]) {
      document.getElementById("shop-title").innerText = latestLine["Titre de la Boutique"];
    }
    if (latestLine["Couleur du fond"]) {
      document.body.style.backgroundColor = latestLine["Couleur du fond"];
    }
    if (latestLine["Couleur des boutons"]) {
      document.querySelectorAll("button").forEach(btn => {
        btn.style.backgroundColor = latestLine["Couleur des boutons"];
        btn.style.color = "#fff";
      });
    }
  })
  .catch(err => console.error("Erreur fetch config Google Sheets :", err));


  // ====== PRODUITS ======
  const products = [
    { id: 1, name: "Produit A", video: "videos/video1.MP4" },
    { id: 2, name: "Produit B", video: "videos/video2.MP4" }
  ];

  const container = document.getElementById("products");
  let cart = [];
  let currentProduct = null;
  let quantity = 1;
  let tg = window.Telegram && window.Telegram.WebApp ? Telegram.WebApp : null;

  products.forEach(p => {
    const div = document.createElement("div");
    div.className = "product";
    div.innerHTML = `
      <video src="${p.video}" muted autoplay loop playsinline></video>
      <p>${p.name}</p>
    `;
    div.addEventListener("click", () => openModal(p));
    container.appendChild(div);
  });

  // ====== FONCTIONS GLOBALES ======
  window.openModal = function(product) {
    currentProduct = product;
    quantity = 1;
    document.getElementById("modal-video").src = product.video;
    document.getElementById("modal-name").innerText = product.name;
    document.getElementById("qty").innerText = quantity;
    document.getElementById("modal").classList.remove("hidden");
  };

  window.closeModal = function() {
    document.getElementById("modal").classList.add("hidden");
  };

  window.changeQty = function(v) {
    quantity = Math.max(1, quantity + v);
    document.getElementById("qty").innerText = quantity;
  };

  window.addToCart = function() {
    cart.push({ name: currentProduct.name, qty: quantity });
    updateCart();
    closeModal();
  };

  function updateCart() {
    const list = document.getElementById("cart-list");
    list.innerHTML = "";
    cart.forEach(i => {
      const li = document.createElement("li");
      li.textContent = `${i.qty} x ${i.name}`;
      list.appendChild(li);
    });
  }

  window.sendOrder = function() {
    if (cart.length === 0) {
      alert("Panier vide");
      return;
    }

    if (tg) {
      tg.sendData(JSON.stringify({ cart }));
      tg.close();
    } else {
      console.log("Commande (hors Telegram) :", cart);
      alert("Commande envoyée (mode test)");
    }
  };
});
