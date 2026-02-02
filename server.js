// server.js
import express from "express";
import multer from "multer";
import path from "path";

const app = express();
const PORT = 3000;

// Dossier où les vidéos seront stockées
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // nom unique
  },
});
const upload = multer({ storage });

app.use(express.static("public"));
app.use(express.json());

// Route pour uploader une vidéo
app.post("/upload", upload.single("video"), (req, res) => {
  if (!req.file) return res.status(400).send("Aucun fichier reçu");
  res.json({ videoUrl: `/uploads/${req.file.filename}` });
});

app.listen(PORT, () => console.log(`Serveur lancé sur http://localhost:${PORT}`));
