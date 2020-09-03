import { Router } from 'express';
import { getCustomRepository } from 'typeorm';
import multer from 'multer';
import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
import VerifyCategoryService from '../services/VerifyCategoryService';
import TransactionRepository from '../repositories/TransactionsRepository';
import ImportTransactionsService from '../services/ImportTransactionsService';
import uploadConfig from '../config/upload';

const upload = multer(uploadConfig);

const transactionsRouter = Router();

transactionsRouter.get('/', async (request, response) => {
  const transactionCustomRepository = getCustomRepository(
    TransactionRepository,
  );

  const balance = await transactionCustomRepository.getBalance();

  const transactions = await transactionCustomRepository.find();

  return response.json({ transactions, balance });
});

transactionsRouter.post('/', async (request, response) => {
  const { title, value, type, category } = request.body;

  const createTransactionService = new CreateTransactionService();
  const verifyCaregoryService = new VerifyCategoryService();

  const categoryObj = await verifyCaregoryService.execute({
    categoryName: category,
  });

  const transaction = await createTransactionService.execute({
    title,
    value,
    type,
    category: categoryObj,
  });

  return response.json(transaction);
});

transactionsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;

  const deleteTransactionService = new DeleteTransactionService();

  deleteTransactionService.execute(id);

  return response.status(204).send();
});

transactionsRouter.post(
  '/import',
  upload.single('file'),
  async (request, response) => {
    const importTransactionService = new ImportTransactionsService();
    const transactions = await importTransactionService.execute(
      request.file.path,
    );

    return response.json(transactions);
  },
);

export default transactionsRouter;
