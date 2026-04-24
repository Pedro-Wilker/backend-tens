import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();
const uploadDir = process.env.UPLOAD_DIR || path.resolve(__dirname, '..', '..', 'uploads');

interface CreateServiceRequest { providerId: number; subcategoryId: number; name: string; description?: string; price?: number; }
interface UpdateServiceRequest { serviceId: number; name?: string; description?: string; price?: number; subcategoryId?: number; }

export class ServiceService {

  private formatServices(services: any | any[]) {
    const isArray = Array.isArray(services);
    const targetServices = isArray ? services : [services];

    const formatted = targetServices.map((service: any) => {
      const totalRatings = service.ratings?.length || 0;
      const sumRatings = service.ratings?.reduce((sum: number, r: any) => sum + r.rating, 0) || 0;
      const averageRating = totalRatings > 0 ? sumRatings / totalRatings : 0;

      const serviceDetails = service.serviceDetails?.map((detail: any) => {
        let cleanPhotoUrl = detail.photoUrl || "placeholder.jpg";
        if (cleanPhotoUrl.startsWith("/uploads/")) cleanPhotoUrl = cleanPhotoUrl.replace("/uploads/", "");
        if (cleanPhotoUrl.startsWith("/public/images/")) cleanPhotoUrl = cleanPhotoUrl.replace("/public/images/", "");
        
        return { ...detail, photoUrl: `/uploads/${cleanPhotoUrl}`.replace("//", "/") };
      }) || [];

      return {
        ...service,
        serviceDetails,
        serviceAverageRating: parseFloat(averageRating.toFixed(2))
      };
    });

    return isArray ? formatted.sort((a, b) => b.serviceAverageRating - a.serviceAverageRating) : formatted[0];
  }

  async create({ providerId, subcategoryId, name, description, price }: CreateServiceRequest) {
    if (!providerId || !subcategoryId) throw new Error("Provider ID and Subcategory ID are required");
    if (!name) throw new Error("Service name is required");
    if (price != null && (typeof price !== "number" || isNaN(price) || price < 0)) {
      throw new Error("Price must be a valid non-negative number");
    }

    const providerExists = await prisma.user.findUnique({ where: { id: providerId } });
    if (!providerExists) throw new Error("Provider not found");

    const subcategoryExists = await prisma.subcategory.findUnique({ where: { id: subcategoryId } });
    if (!subcategoryExists) throw new Error("Subcategory not found");

    const serviceAlreadyExists = await prisma.service.findFirst({
      where: { providerId, subcategoryId, name },
    });
    if (serviceAlreadyExists) throw new Error("Service name already exists for this provider and subcategory");

    return await prisma.service.create({
      data: { providerId, subcategoryId, name, description, price: price ?? null },
      include: {
        provider: { select: { id: true, name: true } },
        subcategory: { select: { id: true, name: true } }
      }
    });
  }

  async delete(serviceId: number, userId: number) {
    if (!serviceId) throw new Error("Service ID is required");

    const service = await prisma.service.findUnique({
      where: { id: serviceId },
      include: { serviceDetails: true },
    });

    if (!service) throw new Error("Service not found");
    if (service.providerId !== userId) throw new Error("You are not authorized to delete this service");

    if (service.serviceDetails.length > 0) {
      for (const detail of service.serviceDetails) {
        if (detail.photoUrl) {
          const fileName = detail.photoUrl.split("/").pop() || detail.photoUrl;
          const imagePath = path.join(uploadDir, fileName);
          if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
        }
      }
    }

    await prisma.$transaction([
      prisma.serviceDetail.deleteMany({ where: { serviceId } }),
      prisma.rating.deleteMany({ where: { serviceId } }),
      prisma.comment.deleteMany({ where: { serviceId } }),
      prisma.service.delete({ where: { id: serviceId } }),
    ]);

    return { message: "Service deleted successfully" };
  }

  async detail(serviceId: number) {
    if (!serviceId) throw new Error("Service ID is required");

    const service = await prisma.service.findUnique({
      where: { id: serviceId },
      include: {
        provider: { select: { id: true, name: true, number: true, email: true, analfabeto: true } },
        subcategory: { select: { id: true, name: true } },
        serviceDetails: true,
        ratings: { select: { id: true, rating: true, user: { select: { id: true, name: true } }, createdAt: true } },
        comments: {
          select: {
            id: true, text: true, createdAt: true,
            user: { select: { id: true, name: true } },
            subcomments: {
              select: { id: true, text: true, createdAt: true, user: { select: { id: true, name: true } } },
              orderBy: { createdAt: "desc" }
            }
          },
          orderBy: { createdAt: "desc" }
        }
      },
    });

    if (!service) throw new Error("Service not found");
    return this.formatServices(service);
  }

  async listAll() {
    const services = await prisma.service.findMany({
      include: {
        provider: { select: { id: true, name: true } },
        subcategory: { select: { id: true, name: true } },
        serviceDetails: true,
        ratings: { select: { id: true, rating: true, user: { select: { id: true, name: true } }, createdAt: true } },
        comments: { select: { id: true, text: true, user: { select: { id: true, name: true } }, createdAt: true } },
        _count: { select: { ratings: true } }
      }
    });
    return this.formatServices(services);
  }

  async listByCategory(categoryId: number) {
    const categoryExists = await prisma.category.findUnique({ where: { id: categoryId } });
    if (!categoryExists) throw new Error("Category not found");

    const services = await prisma.service.findMany({
      where: { subcategory: { categoryId } },
      include: {
        provider: { select: { id: true, name: true } },
        subcategory: { select: { id: true, name: true } },
        serviceDetails: true,
        ratings: { select: { id: true, rating: true, user: { select: { id: true, name: true } }, createdAt: true } },
        comments: { select: { id: true, text: true, user: { select: { id: true, name: true } }, createdAt: true } },
        _count: { select: { ratings: true } }
      }
    });
    return this.formatServices(services);
  }

  async update({ serviceId, name, description, price, subcategoryId }: UpdateServiceRequest) {
    if (!serviceId) throw new Error("Service ID is required");
    if (!name && !description && price == null && !subcategoryId) {
      throw new Error("At least one field must be provided to update");
    }

    const service = await prisma.service.findUnique({ where: { id: serviceId } });
    if (!service) throw new Error("Service not found");

    if (price != null && (typeof price !== "number" || isNaN(price) || price < 0)) {
      throw new Error("Price must be a valid non-negative number");
    }

    if (subcategoryId) {
      const subcategoryExists = await prisma.subcategory.findUnique({ where: { id: subcategoryId } });
      if (!subcategoryExists) throw new Error("Subcategory not found");
    }

    if (name && name !== service.name) {
      const serviceAlreadyExists = await prisma.service.findFirst({
        where: { providerId: service.providerId, subcategoryId: subcategoryId || service.subcategoryId, name },
      });
      if (serviceAlreadyExists) throw new Error("Service name already exists for this provider and subcategory");
    }

    const updatedService = await prisma.service.update({
      where: { id: serviceId },
      data: { name, description, price, subcategoryId },
      include: {
        provider: { select: { id: true, name: true } },
        subcategory: { select: { id: true, name: true } },
        serviceDetails: true,
        ratings: { select: { id: true, rating: true, user: { select: { id: true, name: true } }, createdAt: true } },
        comments: { select: { id: true, text: true, user: { select: { id: true, name: true } }, createdAt: true } },
      }
    });

    return this.formatServices(updatedService);
  }
}