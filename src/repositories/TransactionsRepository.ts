import { EntityRepository, Repository, getRepository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactionsRepository = getRepository(Transaction);

    const transactions = await transactionsRepository.find();

    const income = transactions
      .filter(x => x.type === 'income')
      .reduce((total, transaction) => {
        return total + +transaction.value;
      }, 0);

    const outcome = transactions
      .filter(x => x.type === 'outcome')
      .reduce((total, transaction) => {
        return total + +transaction.value;
      }, 0);

    const total = income - outcome;

    return { income, outcome, total };
  }
}

export default TransactionsRepository;
