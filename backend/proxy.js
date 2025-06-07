const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch"); // Assure-toi d'avoir installé node-fetch v2

const app = express();
const PORT = 3001;

// 🔐 Clé API – Ne jamais la publier dans un repo public
const API_TOKEN = "3a5acbf450f1468b97b0d799aa487bcf";

app.use(cors());

// 🎯 Route 1 – Liste des compétitions
app.get("/competitions", async (req, res) => {
  try {
    const response = await fetch("https://api.football-data.org/v4/competitions", {
      headers: {
        "X-Auth-Token": API_TOKEN
      }
    });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Erreur proxy /competitions", details: error.message });
  }
});

// 🎯 Route 2 – Classement d'une ligue
app.get("/standings/:code", async (req, res) => {
  try {
    const leagueCode = req.params.code;
    const response = await fetch(`https://api.football-data.org/v4/competitions/${leagueCode}/standings`, {
      headers: {
        "X-Auth-Token": API_TOKEN
      }
    });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Erreur proxy /standings", details: error.message });
  }
});

// ✅ Lancer le serveur
app.listen(PORT, () => {
  console.log(`✅ Proxy lancé sur http://localhost:${PORT}`);
});
