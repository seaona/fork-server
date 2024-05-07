const express = require("express");
const {
    setStorage,
    stopServer,
} = require('./anvil/network-configs/mainnet')
const LocalNetwork = require('./anvil/anvil-setup');

const app = express();
const port = process.env.PORT || 3001;
let anvil; // Declare anvil instance outside to access in both routes

const options = {
    blockTime: 2,
    chainId: 1,
    port: 8545,
    forkUrl: `https://mainnet.infura.io/v3/b6bf7d3508c941499b10025c0776eaf8`,
    forkBlockNumber: 19460144,
  };


app.use(express.json());

app.post("/start-server", async (req, res) => {
    try {
    anvil = new LocalNetwork();
    await anvil.start(options);
    res.status(200).send("Anvil server started successfully");
    console.log('Anvil server started successfully.');
    } catch (error) {
      console.error("Error starting server:", error);
      res.status(500).send("Internal server error.");
    }
});

app.post("/stop-server", async (req, res) => {
    try {
      await stopServer(anvil);
      res.status(200).send("Server stopped successfully.");
    } catch (error) {
      console.error("Error stopping server:", error);
      res.status(500).send("Internal server error.");
    }
  });

app.post("/seed-address", async (req, res) => {
  try {
    const { address } = req.body;
    await setStorage(anvil, address);

    res.status(200).send("Storage set successfully.");
  } catch (error) {
    console.error("Error setting storage:", error);
    res.status(500).send("Internal server error.");
  }
});

async function startServer() {
    app.listen(port, () => console.log(`Example app listening on port ${port}!`));
}

startServer();