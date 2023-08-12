// file system module to work with json file
const fs = require("fs");

const AccountIndexer = require('./AccountIndexer');

const accountUpdates = require("./coding-challenge-input.json");

const accountIndexer = new AccountIndexer();

// simulate real-time updates
for (const accountUpdate of accountUpdates) {
  const randomDelay = Math.floor(Math.random() * 1000);
  setTimeout(
    () => accountIndexer.ingestAccountUpdate(accountUpdate),
    randomDelay
  );
}

// simulate the shutdown after all updates have been processed
setTimeout(() => accountIndexer.shutdown(), 10000);
