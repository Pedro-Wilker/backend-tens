import { Request, Response } from 'express';
import { ServiceDetailService } from '../../services/serviceDetail/ServiceDetailService';
import 'multer';

interface AuthRequest extends Request {
  user_id?: string;
}

export class ServiceDetailController {
  private serviceDetailService = new ServiceDetailService();

  async create(req: Request, res: Response) {
    const serviceId = Number(req.body.serviceId);
    const description = req.body.description || "";
   
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    const photoDetails = files.map((file) => ({
      file,
      description: description || undefined,
    }));

    try {
      const serviceDetail = await this.serviceDetailService.create({ serviceId, photoDetails });
      return res.status(201).json(serviceDetail);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async delete(req: AuthRequest, res: Response) {
    const serviceId = Number(req.params.serviceId);
    const detailId = Number(req.params.detailId);
    const userId = Number(req.user_id);

    if (!userId) return res.status(401).json({ error: "User not authenticated" });

    try {
      await this.serviceDetailService.delete({ serviceId, detailId, userId });
      return res.status(204).send();
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async list(req: Request, res: Response) {
    const serviceId = Number(req.params.serviceId);

    try {
      const serviceDetails = await this.serviceDetailService.listByService(serviceId);
      return res.status(200).json(serviceDetails);
    } catch (error: any) {
      return res.status(404).json({ error: error.message });
    }
  }

  async update(req: Request, res: Response) {
    const serviceId = Number(req.params.serviceId);
    const description = req.body.description || "";
    const files = req.files as Express.Multer.File[];

    if (!serviceId) return res.status(400).json({ error: "Service ID is required" });
    
    if (!files || files.length === 0) {
      return res.status(400).json({ error: "No new files provided for update" });
    }

    const photoDetails = files.map((file) => ({ file, description }));

    try {
      const updatedDetails = await this.serviceDetailService.update({ serviceId, photoDetails });
      return res.status(200).json(updatedDetails);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}