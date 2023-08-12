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

module.exports = Account;
