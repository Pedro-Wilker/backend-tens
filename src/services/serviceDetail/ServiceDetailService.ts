import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import 'multer'; 

const prisma = new PrismaClient();
const uploadDir = process.env.UPLOAD_DIR || path.resolve(__dirname, '..', '..', 'uploads');

interface PhotoInput { file: Express.Multer.File; description?: string; }
interface CreateSDRequest { serviceId: number; photoDetails: PhotoInput[]; }
interface UpdateSDRequest { serviceId: number; photoDetails: PhotoInput[]; }
interface DeleteSDRequest { serviceId: number; detailId: number; userId: number; }

export class ServiceDetailService {

  private formatUrl(photoUrl: string | null) {
    let cleanPhotoUrl = photoUrl || "placeholder.jpg";
    if (cleanPhotoUrl.startsWith("/uploads/")) cleanPhotoUrl = cleanPhotoUrl.replace("/uploads/", "");
    if (cleanPhotoUrl.startsWith("/public/images/")) cleanPhotoUrl = cleanPhotoUrl.replace("/public/images/", "");
    return `/uploads/${cleanPhotoUrl}`.replace("//", "/");
  }

  async create({ serviceId, photoDetails }: CreateSDRequest) {
    if (!serviceId) throw new Error("Service ID is required");
    if (!photoDetails || photoDetails.length === 0) throw new Error("At least one photo is required");

    const serviceExists = await prisma.service.findUnique({ where: { id: serviceId } });
    if (!serviceExists) throw new Error("Service not found");

    const createdDetails = await Promise.all(
      photoDetails.map((photo) =>
        prisma.serviceDetail.create({
          data: {
            serviceId,
            photoUrl: photo.file.filename,
            description: photo.description,
          },
        })
      )
    );

    return createdDetails.map((detail) => ({
      ...detail,
      photoUrl: this.formatUrl(detail.photoUrl),
    }));
  }

  async delete({ serviceId, detailId, userId }: DeleteSDRequest) {
    if (!serviceId || !detailId) throw new Error("Service ID and Detail ID are required");

    const serviceDetail = await prisma.serviceDetail.findUnique({
      where: { id: detailId, serviceId },
      include: { service: { select: { providerId: true } } },
    });

    if (!serviceDetail) throw new Error("Service detail not found");
    if (serviceDetail.service.providerId !== userId) {
      throw new Error("You are not authorized to delete this photo");
    }

    if (serviceDetail.photoUrl) {
      const fileName = serviceDetail.photoUrl.split("/").pop() || serviceDetail.photoUrl;
      const imagePath = path.join(uploadDir, fileName);
      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    }

    await prisma.serviceDetail.delete({ where: { id: detailId } });
    return { message: "Photo deleted successfully" };
  }

  async listByService(serviceId: number) {
    if (!serviceId) throw new Error("Service ID is required");

    const serviceExists = await prisma.service.findUnique({ where: { id: serviceId } });
    if (!serviceExists) throw new Error("Service not found");

    const serviceDetails = await prisma.serviceDetail.findMany({
      where: { serviceId },
      select: { id: true, photoUrl: true, description: true, createdAt: true, updatedAt: true },
    });

    if (serviceDetails.length === 0) return [];

    return serviceDetails.map((detail) => ({
      ...detail,
      photoUrl: this.formatUrl(detail.photoUrl),
    }));
  }

  async update({ serviceId, photoDetails }: UpdateSDRequest) {
    if (!serviceId) throw new Error("Service ID is required");
    if (!photoDetails || photoDetails.length === 0) throw new Error("At least one photo is required");

    const serviceExists = await prisma.service.findUnique({ where: { id: serviceId } });
    if (!serviceExists) throw new Error("Service not found");

    const existingDetails = await prisma.serviceDetail.findMany({ where: { serviceId } });

    for (const detail of existingDetails) {
      const oldImagePath = path.join(uploadDir, detail.photoUrl);
      if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
    }

    await prisma.serviceDetail.deleteMany({ where: { serviceId } });

    const updatedDetails = await Promise.all(
      photoDetails.filter(photo => photo.file).map((photo) =>
        prisma.serviceDetail.create({
          data: {
            serviceId,
            photoUrl: photo.file.filename,
            description: photo.description,
          },
        })
      )
    );

    return updatedDetails.map((detail) => ({
      ...detail,
      photoUrl: this.formatUrl(detail.photoUrl),
    }));
  }
}