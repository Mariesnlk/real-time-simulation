const AccountManager = require('./AccountManager');

// @description: AccountIndexer class to index accounts
// @param: accountManager: account manager object
class AccountIndexer {
  constructor() {
    this.accountManager = new AccountManager();
  }

  // @description: take account update
  // @param: accountUpdate: account update object
  async ingestAccountUpdate(accountUpdate) {
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

    await this.accountManager.setCallbackTimer(account);
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

module.exports = AccountIndexer;
