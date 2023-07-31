// file system module to work with json file
const fs = require("fs");

// encapsulate data with code to work on that data
// declaration

// @description: Account class to store account details
// @param: id: unique identifier of the account
// @param: accountType: type of the account
// @param: data: data of the account
// @param: tokens: amount of tokens in the account
// @param: version: version of the account on chain; if two updates for the same account come in, the old version should be erased
// @param: callbackTimeMs: time at which we’d like to print the contents of the account to console after it’s been ingested
class Account {
  constructor(id, accountType, tokens, callbackTimeMs, data, version) {
    this.id = id;
    this.accountType = accountType;
    this.data = data;
    this.tokens = tokens;
    this.callbackTimeMs = callbackTimeMs;
    this.version = version;
    this.callbackTimer = null;
  }
}

// @description: AccountManager class to manage accounts
// @param: accounts: map of accounts
class AccountManager {
  constructor() {
    this.accounts = new Map();
  }

  // @description: add or update account
  // @param: accountUpdate: account update object
  // @return: true if account is new, false if account is already present
  addOrUpdateAccount(accountUpdate) {
    const { id, accountType, data, tokens, version, callbackTimeMs } =
      accountUpdate;
    if (!this.accounts.has(id) || this.accounts.get(id).version < version) {
      const account = new Account(
        id,
        accountType,
        data,
        tokens,
        version,
        callbackTimeMs
      );
      this.accounts.set(id, account);
      return true;
    }
    return false;
  }

  // @description: get highest token accounts by type
  // @return: array of highest token accounts
  getHighestTokenAccountsByType() {
    const accountsByType = new Map();
    for (const account of this.accounts.values()) {
      if (!accountsByType.has(account.accountType)) {
        accountsByType.set(account.accountType, account);
      } else {
        const existingAccount = accountsByType.get(account.accountType);
        if (account.version > existingAccount.version) {
          accountsByType.set(account.accountType, account);
        }
      }
    }

    const highestTokenAccounts = Array.from(accountsByType.values()).sort(
      (a, b) => b.tokens - a.tokens
    );

    return highestTokenAccounts;
  }

  // @description: set callback timer
  // @param: account: account object
  setCallbackTimer(account) {
    account.callbackTimer = setTimeout(() => {
      console.log(
        `Callback fired for accountId: ${account.id} (version: ${account.version})`
      );
      account.callbackTimer = null;
    }, account.callbackTimeMs);
  }

  // @description: cancel old callback
  // @param: account: account object
  cancelOldCallback(account) {
    if (account.callbackTimer) {
      clearTimeout(account.callbackTimer);
      account.callbackTimer = null;
      console.log(
        `Old callback canceled for accountId: ${account.id} (version: ${account.version})`
      );
    }
  }
}

// @description: AccountIndexer class to index accounts
// @param: accountManager: account manager object
class AccountIndexer {
  constructor() {
    this.accountManager = new AccountManager();
  }

  // @description: take account update
  // @param: accountUpdate: account update object
  ingestAccountUpdate(accountUpdate) {
    const isNewAccount = this.accountManager.addOrUpdateAccount(accountUpdate);
    if (isNewAccount) {
      console.log(
        `Indexed: accountId: ${accountUpdate.id} (version: ${accountUpdate.version})`
      );
    } else {
      console.log(
        `Ignored duplicate account update: accountId: ${accountUpdate.id} (version: ${accountUpdate.version})`
      );
    }

    const account = this.accountManager.accounts.get(accountUpdate.id);
    if (!isNewAccount) {
      this.accountManager.cancelOldCallback(account);
    }
    this.accountManager.setCallbackTimer(account);
  }

  // @description: shutdown the system gracefully
  shutdown() {
    const highestTokenAccounts =
      this.accountManager.getHighestTokenAccountsByType();
    console.log("Highest Token Accounts by AccountType:");
    for (const account of highestTokenAccounts) {
      console.log(
        `Account Type: ${account.accountType}, Account ID: ${account.id}, Tokens: ${account.tokens}`
      );
    }
    console.log("Shutting down the system gracefully...");
  }
}

// read account updates from a JSON file and emulate real-time updates
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
