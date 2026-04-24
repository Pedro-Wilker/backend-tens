import { Request, Response } from 'express';
import { CategoryService } from '../../services/category/CategoryService';

export class CategoryController {
  private categoryService = new CategoryService();

  async create(req: Request, res: Response) {
    const { name } = req.body;
    const file = req.file;

    try {
      const category = await this.categoryService.create({ name, file });
      return res.status(201).json(category);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async listAll(req: Request, res: Response) {
    try {
      const categories = await this.categoryService.listAll();
      return res.status(200).json(categories);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async listCarousel(req: Request, res: Response) {
    try {
      const categories = await this.categoryService.listCarousel();
      const formattedCategories = categories.map(cat => ({
          ...cat,
          imageUrl: cat.imageUrl ? `/uploads/${cat.imageUrl}` : null
      }));
      return res.status(200).json(formattedCategories);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async detail(req: Request, res: Response) {
    const categoryId = Number(req.params.categoryId);
    try {
      const category = await this.categoryService.detail(categoryId);
      return res.status(200).json(category);
    } catch (error: any) {
      if (error.message === "Category not found") {
        return res.status(404).json({ error: error.message });
      }
      return res.status(500).json({ error: error.message });
    }
  }

  async getByName(req: Request, res: Response) {
    const { name } = req.params;
    try {
      const category = await this.categoryService.getByName(name);
      return res.status(200).json(category);
    } catch (error: any) {
      return res.status(404).json({ error: error.message });
    }
  }

  async update(req: Request, res: Response) {
    const categoryId = Number(req.params.categoryId);
    const { name } = req.body;
    const file = req.file;

    try {
      const updatedCategory = await this.categoryService.update({ id: categoryId, name, file });
      return res.status(200).json(updatedCategory);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async delete(req: Request, res: Response) {
    const categoryId = Number(req.params.categoryId);
    try {
      const result = await this.categoryService.delete(categoryId);
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}