document.addEventListener("DOMContentLoaded", () => {
  console.log("app.js chargé ✅");

  function applyTheme(config) {
    console.log("🎨 Application du thème", config);
  
    // Fond
    if (config.bgColor) {
      document.body.style.backgroundColor = config.bgColor;
    }
  
    // Boutons (y compris ceux ajoutés plus tard)
    if (config.buttonColor) {
      document.querySelectorAll("button").forEach(btn => {
        btn.style.backgroundColor = config.buttonColor;
        btn.style.color = "#fff";
      });
    }
  }


  // ====== CHARGEMENT CONFIG BOUTIQUE ======
  const config = JSON.parse(localStorage.getItem("shopConfig")) || {
    title: "Ma boutique",
    bgColor: "#f5f5f5",
    buttonColor: "#0078ff"
  };
  
  console.log("Config chargée :", config);
  
  // Titre
  const titleEl = document.getElementById("shop-title");
  if (titleEl && config.title) {
    titleEl.innerText = config.title;
  }
  
  // Couleurs
  // ====== APPLICATION DU THÈME (FORCE TELEGRAM) ======
  if (config.bgColor) {
    document.body.style.backgroundColor = config.bgColor;
  }
  
  if (config.buttonColor) {
    document.querySelectorAll("button").forEach(btn => {
      btn.style.backgroundColor = config.buttonColor;
    });
  }
  
  // Logo
  if (config.logo) {
    const logo = document.getElementById("shop-logo");
    if (logo) {
      logo.src = config.logo;
      logo.classList.remove("hidden");
    }
  }

  // Sécurité : Telegram seulement si dispo
  let tg = null;
  if (window.Telegram && window.Telegram.WebApp) {
    tg = Telegram.WebApp;
    tg.ready();
  }

  const products = [
    { id: 1, name: "Produit A", video: "videos/video1.MP4" },
    { id: 2, name: "Produit B", video: "videos/video2.MP4" }
  ];

  const container = document.getElementById("products");

  let cart = [];
  let currentProduct = null;
  let quantity = 1;

  // Affichage produits
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
  setTimeout(() => applyTheme(config), 0);
});
