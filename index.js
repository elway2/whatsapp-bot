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
// RECEPTION ET REPONSE MESSAGE
// --------------------
app.post("/webhook", async (req, res) => {
  console.log("📬 Webhook payload reçu :", JSON.stringify(req.body, null, 2));

  const message = req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

  if (!message) {
    console.log("⚠️ Aucun message détecté dans le payload");
    return res.sendStatus(200);
  }

  const from = message.from;
  const text = message.text?.body || "";

  console.log(`📩 Message reçu de ${from}: "${text}"`);

  try {
    const response = await axios.post(
      `https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: "whatsapp",
        to: from,
        text: { body: `Tu as dit: ${text}` },
      },
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Message envoyé avec succès !");
    console.log("💬 Réponse API :", JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error("❌ Erreur lors de l'envoi du message !");
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", JSON.stringify(error.response.data, null, 2));
    } else {
      console.error("Erreur:", error.message);
    }
  }

  res.sendStatus(200);
});

// --------------------
// LANCEMENT SERVEUR
// --------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Bot lancé sur le port ${PORT}`);
});
