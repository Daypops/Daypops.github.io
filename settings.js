let config = {};

// URL de ta feuille Google Sheets publiée en CSV
const csvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRVsxi4Wz_wnVaqEeliFCdkVwARAp2EwYHht9-VUmf7mcx_Eo3EqaUAgS2kBkXhOmJ0zSp9wZWEZkWx/pub?output=csv";

// Charger la config depuis Google Sheets
fetch(csvUrl)
  .then(res => res.text())
  .then(text => {
    // Transformer le CSV en JSON simple
    const lines = text.trim().split("\n");
    lines.forEach(line => {
      const [key, value] = line.split(",");
      config[key.trim()] = value.trim();
    });

    // Initialiser les champs du formulaire
    document.getElementById("title").value = config.title || "";
    document.getElementById("bgColor").value = config.bgColor || "#f5f5f5";
    document.getElementById("buttonColor").value = config.buttonColor || "#0078ff";
  })
  .catch(err => console.error("Erreur chargement config :", err));

// Fonction pour "sauvegarder"
// ⚠️ Google Sheets publié en lecture seule, donc on ne peut pas l’écrire directement
// Ici, on sauvegarde uniquement dans localStorage pour l’instant
function save() {
  config.title = document.getElementById("title").value;
  config.bgColor = document.getElementById("bgColor").value;
  config.buttonColor = document.getElementById("buttonColor").value;

  localStorage.setItem("shopConfig", JSON.stringify(config));
  alert("Paramètres sauvegardés localement ✅\n⚠️ Pour appliquer globalement, il faut mettre à jour la feuille Google Sheets manuellement.");
}
