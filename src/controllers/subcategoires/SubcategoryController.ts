import { Request, Response } from 'express';
import { SubcategoryService } from '../../services/subcategoires/SubcategoryService';

export class SubcategoryController {
  private subcategoryService = new SubcategoryService();

  async create(req: Request, res: Response) {
    const { categoryId, name } = req.body;
    try {
      const subcategory = await this.subcategoryService.create({ categoryId: Number(categoryId), name });
      return res.status(201).json(subcategory);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async delete(req: Request, res: Response) {
    const subcategoryId = Number(req.params.subcategoryId);
    try {
      const result = await this.subcategoryService.delete(subcategoryId);
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async listAll(req: Request, res: Response) {
    try {
      const subcategories = await this.subcategoryService.listAll();
      return res.status(200).json(subcategories);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async listByCategory(req: Request, res: Response) {
    const categoryId = Number(req.params.categoryId);
    try {
      const subcategories = await this.subcategoryService.listByCategory(categoryId);
      return res.status(200).json(subcategories);
    } catch (error: any) {
      return res.status(404).json({ error: error.message });
    }
  }

  async listById(req: Request, res: Response) {
    const subcategoryId = Number(req.params.subcategoryId);
    try {
      const subcategory = await this.subcategoryService.listById(subcategoryId);
      return res.status(200).json(subcategory);
    } catch (error: any) {
      return res.status(404).json({ error: error.message });
    }
  }

  async listByName(req: Request, res: Response) {
    const { name } = req.params;
    try {
      const subcategories = await this.subcategoryService.listByName(name);
      return res.status(200).json(subcategories);
    } catch (error: any) {
      return res.status(404).json({ error: error.message });
    }
  }

  async listServices(req: Request, res: Response) {
    const subcategoryId = Number(req.params.subcategoryId);
    try {
      const services = await this.subcategoryService.listServicesBySubcategory(subcategoryId);
      return res.status(200).json(services);
    } catch (error: any) {
      return res.status(404).json({ error: error.message });
    }
  }

  async update(req: Request, res: Response) {
    const subcategoryId = Number(req.params.subcategoryId);
    const { name } = req.body;
    try {
      const updatedSubcategory = await this.subcategoryService.update({ subcategoryId, name });
      return res.status(200).json(updatedSubcategory);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}