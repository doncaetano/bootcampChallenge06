import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import Category from '../models/Category';
import TransactionRepository from '../repositories/TransactionsRepository';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: Category;
}

class CreateTransactionService {
  public async execute(request: Request): Promise<Transaction> {
    const { title, type, value, category } = request;

    const transactionRepository = getCustomRepository(TransactionRepository);

    if (type === 'outcome') {
      const balance = await transactionRepository.getBalance();
      if (balance.total - value < 0) {
        throw new AppError('Saldo menor que o valor da retirada', 400);
      }
    }

    const transaction = transactionRepository.create({
      title,
      value,
      type,
      category_id: category.id,
    });

    await transactionRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
