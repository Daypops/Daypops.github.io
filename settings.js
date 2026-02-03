const config = JSON.parse(localStorage.getItem("shopConfig")) || {};

document.getElementById("title").value = config.title || "";
document.getElementById("bgColor").value = config.bgColor || "#f5f5f5";
document.getElementById("buttonColor").value = config.buttonColor || "#0078ff";

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

  localStorage.setItem("shopConfig", JSON.stringify(config));
  alert("Paramètres enregistrés ✅");
}
