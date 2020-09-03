import { getRepository } from 'typeorm';
import Category from '../models/Category';

interface Request {
  categoryName: string;
}

class VerifyCategoryService {
  public async execute({ categoryName }: Request): Promise<Category> {
    const categoryRepository = getRepository(Category);

    let newCategory = await categoryRepository.findOne({
      where: { title: categoryName },
    });

    if (!newCategory) {
      newCategory = categoryRepository.create({
        title: categoryName,
      });

      await categoryRepository.save(newCategory);
    }

    return newCategory;
  }
}

export default VerifyCategoryService;
