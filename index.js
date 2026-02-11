import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

// Variables d'environnement
const TOKEN = process.env.TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

// --------------------
// PAGE D'ACCUEIL
// --------------------
app.get("/", (req, res) => {
  res.send("🚀 Le bot WhatsApp est en ligne !");
});

// --------------------
// VERIFICATION WEBHOOK
// --------------------
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token === VERIFY_TOKEN) {
    console.log("✅ Webhook vérifié avec succès !");
    res.status(200).send(challenge);
  } else {
    console.log("❌ Échec vérification webhook");
    res.sendStatus(403);
  }
});

// --------------------
// RECEPTION MESSAGE
// --------------------
app.post("/webhook", async (req, res) => {
  console.log("📬 Webhook payload:", JSON.stringify(req.body, null, 2));
  res.sendStatus(200);
});


// --------------------
// LANCEMENT SERVEUR
// --------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Bot lancé sur le port ${PORT}`);
});
