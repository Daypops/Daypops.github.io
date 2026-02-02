document.addEventListener("DOMContentLoaded", () => {
  const tg = Telegram.WebApp;
  tg.ready();

  const products = [
    { id: 1, name: "Produit A", video: "videos/video1.MP4" },
    { id: 2, name: "Produit B", video: "videos/video2.MP4" },
    { id: 3, name: "Produit C", video: "videos/video3.mp4" },
    { id: 4, name: "Produit D", video: "videos/video4.mp4" },
    { id: 5, name: "Produit E", video: "videos/video5.mp4" }
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
    div.onclick = () => openModal(p);
    container.appendChild(div);
  });

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
      li.innerText = `${i.qty} x ${i.name}`;
      list.appendChild(li);
    });
  }

  window.sendOrder = function() {
    if (cart.length === 0) {
      alert("Panier vide");
      return;
    }

    tg.sendData(JSON.stringify({ cart }));
    tg.close();
  };
});
