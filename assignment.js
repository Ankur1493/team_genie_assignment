class Transactions {
  constructor() {
    this.transactionsByTime = new Map();
    this.globalTransactionIds = new Set();
  }

  formatTime(time) {
    const date = new Date(time);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  storeTransaction(id, time, transactionInfo) {
    if (this.globalTransactionIds.has(id)) {
      console.log(`transaction id - ${id} is a global duplicate`);
      return;
    }

    const minuteKey = this.formatTime(time);

    if (!this.transactionsByTime.has(minuteKey)) {
      this.transactionsByTime.set(minuteKey, new Map());
    }

    const transactionMap = this.transactionsByTime.get(minuteKey);
    transactionMap.set(id, transactionInfo);

    this.globalTransactionIds.add(id);

    console.log(`transaction id - ${id} and time - ${time} is unique`);
  }

  purgeOldTransactions() {
    const now = Date.now();
    const oneHourAgo = new Date(now - 60 * 60 * 1000);

    const oldMinuteKey = this.formatTime(oneHourAgo);

    if (this.transactionsByTime.has(oldMinuteKey)) {
      this.transactionsByTime.delete(oldMinuteKey);
      console.log(`Purged transactions for time: ${oldMinuteKey}`);
    } else {
      console.log(`No transactions to purge for time: ${oldMinuteKey}`);
    }
  }
}

const system = new Transactions();

system.storeTransaction(11, Date.now() - 60 * 60 * 1000, { amount: 100, type: 'debit' });
system.storeTransaction(2, Date.now() - 3900000, { amount: 200, type: 'credit' });
system.storeTransaction(3, Date.now() - 60 * 60 * 1000, { amount: 100, type: 'debit' });
system.storeTransaction(1, Date.now() - 3900000, { amount: 100, type: 'debit' });

system.storeTransaction(7, Date.now() - 1500000, { amount: 100, type: 'debit' });
system.storeTransaction(13, Date.now() - 1500000, { amount: 200, type: 'credit' });
system.storeTransaction(3, Date.now() - 1500000, { amount: 150, type: 'debit' });
system.storeTransaction(4, Date.now() - 1500000, { amount: 100, type: 'debit' });

system.storeTransaction(5, Date.now() - 100000, { amount: 100, type: 'debit' });
system.storeTransaction(2, Date.now() - 100000, { amount: 200, type: 'credit' });
system.storeTransaction(9, Date.now() - 100000, { amount: 150, type: 'debit' });

system.storeTransaction(6, Date.now(), { amount: 100, type: 'debit' }); // Now
system.storeTransaction(3, Date.now(), { amount: 200, type: 'credit' });
system.storeTransaction(121, Date.now(), { amount: 150, type: 'debit' });

console.log("Before purging:");
console.log(system.transactionsByTime);

system.purgeOldTransactions();

console.log("After purging:");
console.log(system.transactionsByTime);

