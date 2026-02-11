document.addEventListener("DOMContentLoaded", () => {
  console.log("app.js chargé ✅");

  function applyTheme(config) {
    if (config.bgColor) {
      document.documentElement.style.setProperty("--bg-color", config.bgColor);
      document.body.style.backgroundColor = config.bgColor;
    }
    if (config.buttonColor) {
      document.documentElement.style.setProperty("--button-color", config.buttonColor);
      document.querySelectorAll("button").forEach(btn => {
        btn.style.backgroundColor = config.buttonColor;
        btn.style.color = "#fff";
      });
    }
  }

  const csvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRVsxi4Wz_wnVaqEeliFCdkVwARAp2EwYHht9-VUmf7mcx_Eo3EqaUAgS2kBkXhOmJ0zSp9wZWEZkWx/pub?output=csv";

  fetch(csvUrl)
    .then(res => res.text())
    .then(text => {
      // Transformer le CSV en JSON
      const lines = text.trim().split("\n");
      const result = {};
      lines.forEach(line => {
        const [key, value] = line.split(","); // clé,valeur
        result[key.trim()] = value.trim();
      });

      console.log("Config depuis Google Sheets :", result);

      // Appliquer titre et thème
      const titleEl = document.getElementById("shop-title");
      if (titleEl && result.title) titleEl.innerText = result.title;

      applyTheme(result);

      // Logo si présent
      if (result.logo) {
        const logo = document.getElementById("shop-logo");
        if (logo) {
          logo.src = result.logo;
          logo.classList.remove("hidden");
        }
      }
    })
    .catch(err => console.error("Erreur fetch CSV :", err));
});
  
  // ====== PRODUITS ======
  const products = [
    { id: 1, name: "Produit A", video: "videos/video1.MP4" },
    { id: 2, name: "Produit B", video: "videos/video2.MP4" }
  ];

  const container = document.getElementById("products");
  let cart = [];
  let currentProduct = null;
  let quantity = 1;

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
