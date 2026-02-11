let config = {};

// URL du Web App
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzSs8ekXGgMF_CUMyPnA5sG2VrpdFkS02oSC3UvljIiRb9Sps1Srwq0f_Bpcn_KuuafnQ/exec";

// Charger la config depuis Google Sheets
fetch(SCRIPT_URL)
  .then(res => res.json())
  .then(data => {
    config = data;
    document.getElementById("title").value = config.title || "";
    document.getElementById("bgColor").value = config.bgColor || "#f5f5f5";
    document.getElementById("buttonColor").value = config.buttonColor || "#0078ff";
  })
  .catch(err => console.error("Erreur chargement config :", err));

// Sauvegarder la config dans la feuille
function save() {
  config.title = document.getElementById("title").value;
  config.bgColor = document.getElementById("bgColor").value;
  config.buttonColor = document.getElementById("buttonColor").value;

  fetch(SCRIPT_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(config)
  })
  .then(res => res.json())
  .then(() => alert("Paramètres sauvegardés globalement ✅"))
  .catch(err => console.error("Erreur sauvegarde config :", err));
}
