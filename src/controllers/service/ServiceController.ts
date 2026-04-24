import { Request, Response } from 'express';
import { ServiceService } from '../../services/service/ServiceService';

interface AuthRequest extends Request {
  user_id?: string;
}

export class ServiceController {
  private serviceService = new ServiceService();

  async create(req: Request, res: Response) {
    const { providerId, subcategoryId, name, description, price } = req.body;
    try {
      const service = await this.serviceService.create({ 
        providerId: Number(providerId), 
        subcategoryId: Number(subcategoryId), 
        name, description, price 
      });
      return res.status(201).json(service);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async delete(req: AuthRequest, res: Response) {
    const serviceId = Number(req.params.serviceId);
    const userId = Number(req.user_id); 
    
    if (!userId) return res.status(401).json({ error: "User not authenticated" });

    try {
      await this.serviceService.delete(serviceId, userId);
      return res.status(204).send();
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async detail(req: Request, res: Response) {
    const serviceId = Number(req.params.serviceId);
    try {
      const service = await this.serviceService.detail(serviceId);
      return res.status(200).json(service);
    } catch (error: any) {
      return res.status(404).json({ error: error.message });
    }
  }

  async listAll(req: Request, res: Response) {
    try {
      const services = await this.serviceService.listAll();
      return res.status(200).json(services);
    } catch (error: any) {
      return res.status(500).json({ error: 'An unexpected error occurred' });
    }
  }

  async listByCategory(req: Request, res: Response) {
    const categoryId = Number(req.params.categoryId);
    try {
      const services = await this.serviceService.listByCategory(categoryId);
      return res.status(200).json(services);
    } catch (error: any) {
      const status = error.message === 'Category not found' ? 404 : 500;
      return res.status(status).json({ error: error.message || 'An unexpected error occurred' });
    }
  }

  async update(req: Request, res: Response) {
    const serviceId = Number(req.params.serviceId);
    const { name, description, price, subcategoryId } = req.body;
    try {
      const updatedService = await this.serviceService.update({
        serviceId, name, description, price, subcategoryId: subcategoryId ? Number(subcategoryId) : undefined
      });
      return res.status(200).json(updatedService);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}