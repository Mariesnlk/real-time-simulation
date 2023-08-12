const { AccountIndexer } = require("../AccountIndexer");
const fs = require("fs");

jest.useFakeTimers();

describe("blockchain simulation tests", () => {
  const accountUpdates = require("../coding-challenge-input.json");

  let accountIndexer;

  beforeEach(() => {
    accountIndexer = new AccountIndexer();
  });

  afterEach(() => {
    accountIndexer.shutdown();
  });

  //   test("should ingest account updates with random delays", async () => {
  //     expect.assertions(accountUpdates.length);

  //     const ingestPromises = accountUpdates.map((accountUpdate) => {
  //       const { id, version } = accountUpdate;
  //       const randomDelay = Math.floor(Math.random() * 1000);

  //       return new Promise((resolve) => {
  //         setTimeout(() => {
  //           accountIndexer.ingestAccountUpdate(accountUpdate);
  //           expect(accountIndexer.accountManager.accounts.has(id)).toBe(true);
  //           expect(accountIndexer.accountManager.accounts.get(id).version).toBe(
  //             version
  //           );
  //           resolve();
  //         }, randomDelay);
  //       });
  //     });

  //     // Wait for all ingestPromises to complete
  //     await Promise.all(ingestPromises);

  //     // Wait for the timers to run
  //     await new Promise((resolve) => process.nextTick(resolve)); // Wait for any pending promises to resolve
  //     jest.runAllTimers();
  //   });

  //   test("should cancel old callback for an account if a new version is ingested", async () => {
  //     const accountUpdate1 = accountUpdates[0];
  //     const accountUpdate2 = { ...accountUpdate1, version: 6 };
  //     const accountUpdate3 = { ...accountUpdate1, version: 7 };

  //     const randomDelay1 = Math.floor(Math.random() * 1000);
  //     const randomDelay2 = Math.floor(Math.random() * 1000);

  //     setTimeout(
  //       () => accountIndexer.ingestAccountUpdate(accountUpdate1),
  //       randomDelay1
  //     );
  //     setTimeout(
  //       () => accountIndexer.ingestAccountUpdate(accountUpdate2),
  //       randomDelay2
  //     );
  //     jest.runAllTimers();

  //     expect(
  //       accountIndexer.accountManager.accounts.get(accountUpdate1.id)
  //         .callbackTimer
  //     ).toBe(null);
  //     expect(
  //       accountIndexer.accountManager.accounts.get(accountUpdate2.id)
  //         .callbackTimer
  //     ).not.toBe(null);
  //     expect(
  //       accountIndexer.accountManager.accounts.get(accountUpdate3.id)
  //         .callbackTimer
  //     ).toBe(null);
  //   });

  //   test("should ignore duplicate account updates", async () => {
  //     expect.assertions(accountUpdates.length);

  //     accountUpdates.forEach((accountUpdate) => {
  //       const { id, version } = accountUpdate;
  //       const randomDelay1 = Math.floor(Math.random() * 1000);
  //       const randomDelay2 = Math.floor(Math.random() * 1000);

  //       // First ingestion
  //       setTimeout(() => {
  //         accountIndexer.ingestAccountUpdate(accountUpdate);
  //         expect(accountIndexer.accountManager.accounts.has(id)).toBe(true);
  //         expect(accountIndexer.accountManager.accounts.get(id).version).toBe(
  //           version
  //         );
  //       }, randomDelay1);

  //       // Second ingestion (should be ignored)
  //       setTimeout(() => {
  //         accountIndexer.ingestAccountUpdate(accountUpdate);
  //         expect(accountIndexer.accountManager.accounts.has(id)).toBe(true);
  //         expect(accountIndexer.accountManager.accounts.get(id).version).toBe(
  //           version
  //         );
  //       }, randomDelay2);
  //     });

  //     jest.runAllTimers();
  //   });

  //   test("should cancel the old callback when a new account with higher version and callback time is ingested", async () => {
  //     const accountUpdate1 = accountUpdates[0];
  //     const accountUpdate2 = {
  //       ...accountUpdate1,
  //       version: 6,
  //       callbackTimeMs: 2000,
  //     };

  //     const randomDelay1 = Math.floor(Math.random() * 1000);
  //     const randomDelay2 = Math.floor(Math.random() * 1000);

  //     // First ingestion with random delay
  //     setTimeout(
  //       () => accountIndexer.ingestAccountUpdate(accountUpdate1),
  //       randomDelay1
  //     );

  //     // Second ingestion with higher version and shorter callback time (should cancel the old callback)
  //     setTimeout(
  //       () => accountIndexer.ingestAccountUpdate(accountUpdate2),
  //       randomDelay2
  //     );

  //     jest.runAllTimers();

  //     expect(
  //       accountIndexer.accountManager.accounts.get(accountUpdate1.id)
  //         .callbackTimer
  //     ).toBe(null);
  //     expect(
  //       accountIndexer.accountManager.accounts.get(accountUpdate2.id)
  //         .callbackTimer
  //     ).not.toBe(null);
  //   });

  //   test("should handle callbacks when callback time has expired", async () => {
  //     const accountUpdate = accountUpdates[0];
  //     const randomDelay = Math.floor(Math.random() * 1000);

  //     setTimeout(
  //       () => accountIndexer.ingestAccountUpdate(accountUpdate),
  //       randomDelay
  //     );

  //     // Fast-forward time to the callbackTimeMs
  //     jest.advanceTimersByTime(accountUpdate.callbackTimeMs);

  //     expect(
  //       accountIndexer.accountManager.accounts.get(accountUpdate.id).callbackTimer
  //     ).toBe(null);
  //   });

  //   test("should handle callbacks even if new account with higher version is ingested after callback time has expired", async () => {
  //     const accountUpdate1 = accountUpdates[0];
  //     const accountUpdate2 = {
  //       ...accountUpdate1,
  //       version: 6,
  //       callbackTimeMs: 2000,
  //     };

  //     const randomDelay1 = Math.floor(Math.random() * 1000);
  //     const randomDelay2 = Math.floor(Math.random() * 1000);

  //     // First ingestion with random delay
  //     setTimeout(
  //       () => accountIndexer.ingestAccountUpdate(accountUpdate1),
  //       randomDelay1
  //     );

  //     // Fast-forward time to the callbackTimeMs of the first account
  //     jest.advanceTimersByTime(accountUpdate1.callbackTimeMs);

  //     // Second ingestion with higher version and shorter callback time (should trigger new callback)
  //     setTimeout(
  //       () => accountIndexer.ingestAccountUpdate(accountUpdate2),
  //       randomDelay2
  //     );

  //     jest.runAllTimers();

  //     expect(
  //       accountIndexer.accountManager.accounts.get(accountUpdate1.id)
  //         .callbackTimer
  //     ).toBe(null);
  //     expect(
  //       accountIndexer.accountManager.accounts.get(accountUpdate2.id)
  //         .callbackTimer
  //     ).not.toBe(null);
  //   });

  test("should gracefully shut down the system and log highest token-value accounts by AccountType", async () => {
    const ingestPromises = accountUpdates.map((accountUpdate) => {
      const randomDelay = Math.floor(Math.random() * 1000);
      return new Promise((resolve) => {
        setTimeout(() => {
          accountIndexer.ingestAccountUpdate(accountUpdate);
          resolve();
        }, randomDelay);
      });
    });

    // Wait for all ingestPromises to complete
    await Promise.all(ingestPromises);

    // Fast-forward time to allow all updates to be processed
    jest.runAllTimers();

    const highestTokenAccounts =
      accountIndexer.accountManager.getHighestTokenAccountsByType();
    const spyLog = jest.spyOn(console, "log");

    await accountIndexer.shutdown();

    expect(spyLog).toHaveBeenCalledWith(
      "Highest Token Accounts by AccountType:"
    );
    for (const account of highestTokenAccounts) {
      expect(spyLog).toHaveBeenCalledWith(
        `Account Type: ${account.accountType}, Account ID: ${account.id}, Tokens: ${account.tokens}`
      );
    }

    // Wait for the shutdown process to complete before finishing the test
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(spyLog).toHaveBeenCalledWith(
      "Shutting down the system gracefully..."
    );
    spyLog.mockRestore();
  });
});
