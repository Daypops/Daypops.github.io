let config = {};

// URL de ton Apps Script déployé en tant qu'API Web
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyH_LDM0tz5y0FDOUnc-R6DRU8t7bnzOxdu1VWEDdHifwK9qmIVvkwucgAATKSyAdIXCA/exec"; // <-- remplace par l'URL de ton Apps Script

// Charger la config depuis la Google Sheet via Apps Script
fetch(SCRIPT_URL)
  .then(res => res.json())
  .then(data => {
    config = data;

    // Initialiser les champs du formulaire
    document.getElementById("title").value = config.title || "";
    document.getElementById("bgColor").value = config.bgColor || "#f5f5f5";
    document.getElementById("buttonColor").value = config.buttonColor || "#0078ff";
  })
  .catch(err => console.error("Erreur chargement config :", err));

// ⚠️ On oublie le logo pour l'instant

// Fonction pour sauvegarder les modifications
function save() {
  // Récupérer les valeurs du formulaire
  config.title = document.getElementById("title").value;
  config.bgColor = document.getElementById("bgColor").value;
  config.buttonColor = document.getElementById("buttonColor").value;

  // Envoyer la config au Apps Script pour mise à jour globale
  fetch(SCRIPT_URL, {
    method: "POST",
    body: JSON.stringify(config),
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(res => res.json())
    .then(() => {
      alert("Paramètres sauvegardés globalement ✅");
    })
    .catch(err => {
      console.error("Erreur sauvegarde config :", err);
      alert("Erreur lors de la sauvegarde globale. Les paramètres sont sauvegardés localement.");
      localStorage.setItem("shopConfig", JSON.stringify(config));
    });
}
