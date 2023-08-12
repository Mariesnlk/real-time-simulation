// file system module to work with json file
const fs = require("fs");

const AccountIndexer = require("./AccountIndexer");

const accountUpdates = require("./coding-challenge-input.json");

const accountIndexer = new AccountIndexer();

// simulate real-time updates
async function simulateUpdates() {
  for (const accountUpdate of accountUpdates) {
    const randomDelay = Math.floor(Math.random() * 1000);
    await new Promise((resolve) => setTimeout(resolve, randomDelay));
    await accountIndexer.ingestAccountUpdate(accountUpdate);
  }
}

// simulate the shutdown after all updates have been processed
async function simulateShutdown() {
  await simulateUpdates();
  setTimeout(() => accountIndexer.shutdown(), 10000);
}

simulateShutdown();
