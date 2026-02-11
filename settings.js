let config = {};

// Charger config existante
fetch("https://85dc-2a01-cb0d-294-e200-9eb-d022-9b6d-e6aa.ngrok-free.app/get-config")
  .then(res => res.json())
  .then(data => {
    config = data;

    document.getElementById("title").value = config.title || "";
    document.getElementById("bgColor").value = config.bgColor || "#f5f5f5";
    document.getElementById("buttonColor").value = config.buttonColor || "#0078ff";
  });

document.getElementById("logo").addEventListener("change", e => {
  const reader = new FileReader();
  reader.onload = () => {
    config.logo = reader.result;
  };
  reader.readAsDataURL(e.target.files[0]);
});

function save() {
  config.title = document.getElementById("title").value;
  config.bgColor = document.getElementById("bgColor").value;
  config.buttonColor = document.getElementById("buttonColor").value;

  fetch("https://85dc-2a01-cb0d-294-e200-9eb-d022-9b6d-e6aa.ngrok-free.app/save-config", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(config)
  })
  .then(res => res.json())
  .then(() => {
    alert("Paramètres sauvegardés globalement ✅");
  })
  .catch(err => console.error(err));
}
