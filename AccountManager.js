const Account = require('./Account');

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

module.exports = AccountManager;
