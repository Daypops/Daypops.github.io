document.addEventListener("DOMContentLoaded", () => {
  console.log("app.js chargé ✅");

  // Sécurité : Telegram seulement si dispo
  let tg = null;
  if (window.Telegram && window.Telegram.WebApp) {
    tg = Telegram.WebApp;
    tg.ready();
  }

  // ====== PARTIE ADMIN ======
  const ADMIN_ID = 123456789; // Remplace par ton ID Telegram
  let userId = tg?.initDataUnsafe?.user?.id;

  if (userId === ADMIN_ID) {
    // Rediriger vers la page admin ou afficher l'interface admin directement
    console.log("Admin connecté !");
    document.body.innerHTML = `
      <h1>Admin : Ajouter un produit</h1>
      <form id="product-form">
        <label>Nom du produit :</label>
        <input type="text" id="product-name" required>
        <label>Vidéo :</label>
        <input type="file" id="product-video" accept="video/*" required>
        <label>Prix et quantités :</label>
        <div>
          x1: <input type="number" id="price-x1" required> €
          x5: <input type="number" id="price-x5" required> €
          x10: <input type="number" id="price-x10" required> €
        </div>
        <button type="submit">Ajouter le produit</button>
      </form>
      <h2>Produits existants</h2>
      <ul id="product-list"></ul>
    `;

    let products = JSON.parse(localStorage.getItem("products") || "[]");

    function renderProducts() {
      const list = document.getElementById("product-list");
      list.innerHTML = "";
      products.forEach(p => {
        const li = document.createElement("li");
        li.textContent = `${p.name} - x1:${p.prices[1]}€, x5:${p.prices[5]}€, x10:${p.prices[10]}€`;
        list.appendChild(li);
      });
    }

    document.getElementById("product-form").addEventListener("submit", async (e) => {
      e.preventDefault();
      const name = document.getElementById("product-name").value;
      const videoFile = document.getElementById("product-video").files[0];

      // Upload vidéo côté serveur
      const formData = new FormData();
      formData.append("video", videoFile);

      const res = await fetch("/upload", { method: "POST", body: formData });
      const data = await res.json();
      const videoUrl = data.videoUrl;

      const prices = {
        1: parseFloat(document.getElementById("price-x1").value),
        5: parseFloat(document.getElementById("price-x5").value),
        10: parseFloat(document.getElementById("price-x10").value)
      };

      products.push({ name, video: videoUrl, prices });
      localStorage.setItem("products", JSON.stringify(products));
      renderProducts();
      e.target.reset();
    });

    renderProducts();
    return; // On ne charge pas la partie "client normal" pour l'admin
  }

  // ====== PARTIE CLIENT NORMAL ======
  let products = JSON.parse(localStorage.getItem("products") || "[]");

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
});
