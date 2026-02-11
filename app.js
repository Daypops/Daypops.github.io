document.addEventListener("DOMContentLoaded", () => {
  console.log("app.js chargé ✅");

  const sheetUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRVsxi4Wz_wnVaqEeliFCdkVwARAp2EwYHht9-VUmf7mcx_Eo3EqaUAgS2kBkXhOmJ0zSp9wZWEZkWx/pub?output=csv";

  fetch(sheetUrl)
    .then(res => res.text())
    .then(text => {
      const lines = text.trim().split("\n");

      // Découper les en-têtes
      const headers = lines[0].split("\t"); // TAB car ton export semble tabulé

      // Prendre la dernière ligne (la plus récente)
      const lastLine = lines[lines.length - 1].split("\t");

      const config = {};
      headers.forEach((h, i) => config[h.trim()] = lastLine[i].trim());

      console.log("Config depuis Google Sheets :", config);

      // Appliquer titre
      const titleEl = document.getElementById("shop-title");
      if (titleEl && config["Titre de la Boutique"]) titleEl.innerText = config["Titre de la Boutique"];

      // Appliquer thème
      if (config["Couleur du fond"]) {
        document.body.style.backgroundColor = config["Couleur du fond"];
      }

      if (config["Couleur des boutons"]) {
        document.querySelectorAll("button").forEach(btn => {
          btn.style.backgroundColor = config["Couleur des boutons"];
          btn.style.color = "#fff";
        });
      }
    })
    .catch(err => console.error("Erreur fetch config Google Sheets :", err));
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
    })
    .catch(err => console.error("Erreur fetch CSV :", err));
});
