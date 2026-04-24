import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface CreateSubcategoryRequest { categoryId: number; name: string; }
interface UpdateSubcategoryRequest { subcategoryId: number; name: string; }

export class SubcategoryService {

  private formatServicesWithRatings(services: any[]) {
    return services.map((service) => {
      const totalRatings = service.ratings?.length || 0;
      const sumRatings = service.ratings?.reduce((sum: number, r: any) => sum + r.rating, 0) || 0;
      const averageRating = totalRatings > 0 ? sumRatings / totalRatings : 0;

      const formattedDetails = service.serviceDetails?.map((detail: any) => {
        let cleanPhotoUrl = detail.photoUrl || "placeholder.jpg";
        
        if (cleanPhotoUrl.startsWith("/uploads/")) cleanPhotoUrl = cleanPhotoUrl.replace("/uploads/", "");
        if (cleanPhotoUrl.startsWith("/public/images/")) cleanPhotoUrl = cleanPhotoUrl.replace("/public/images/", "");
        
        return { ...detail, photoUrl: `/uploads/${cleanPhotoUrl}`.replace("//", "/") };
      }) || [];

      return {
        ...service,
        serviceDetails: formattedDetails,
        averageRating: parseFloat(averageRating.toFixed(2))
      };
    }).sort((a, b) => b.averageRating - a.averageRating);
  }

  async create({ categoryId, name }: CreateSubcategoryRequest) {
    if (!categoryId) throw new Error("Category ID is required");
    if (!name) throw new Error("Subcategory name is required");

    const categoryExists = await prisma.category.findUnique({ where: { id: categoryId } });
    if (!categoryExists) throw new Error("Category not found");

    const subcategoryAlreadyExists = await prisma.subcategory.findFirst({
      where: { name, categoryId },
    });

    if (subcategoryAlreadyExists) {
      throw new Error("Subcategory name already exists in this category");
    }

    return await prisma.subcategory.create({
      data: { name, categoryId },
    });
  }

  async delete(subcategoryId: number) {
    const subcategory = await prisma.subcategory.findUnique({
      where: { id: subcategoryId },
      include: { services: true },
    });

    if (!subcategory) throw new Error("Subcategory not found");
    if (subcategory.services.length > 0) {
      throw new Error("Cannot delete subcategory with associated services");
    }

    await prisma.subcategory.delete({ where: { id: subcategoryId } });
    return { message: "Subcategory deleted successfully" };
  }

  async listAll() {
    const subcategories = await prisma.subcategory.findMany({
      include: {
        services: {
          include: {
            provider: { select: { id: true, name: true } },
            subcategory: { select: { id: true, name: true } },
            serviceDetails: { select: { id: true, photoUrl: true, description: true } },
            ratings: { select: { id: true, rating: true, user: { select: { id: true, name: true } }, createdAt: true } },
            comments: { select: { id: true, text: true, user: { select: { id: true, name: true } }, createdAt: true } },
          }
        }
      }
    });

    return subcategories.map(sub => ({
      ...sub,
      services: this.formatServicesWithRatings(sub.services)
    }));
  }

  async listByCategory(categoryId: number) {
    const categoryExists = await prisma.category.findUnique({ where: { id: categoryId } });
    if (!categoryExists) throw new Error("Category not found");

    return await prisma.subcategory.findMany({
      where: { categoryId },
      select: { id: true, name: true },
    });
  }

  async listById(subcategoryId: number) {
    const subcategory = await prisma.subcategory.findUnique({
      where: { id: subcategoryId },
      include: {
        services: {
          include: {
            provider: { select: { id: true, name: true } },
            subcategory: { select: { id: true, name: true } },
            serviceDetails: { select: { id: true, photoUrl: true, description: true } },
            ratings: { select: { id: true, rating: true, user: { select: { id: true, name: true } }, createdAt: true } },
            comments: { select: { id: true, text: true, user: { select: { id: true, name: true } }, createdAt: true } },
          }
        }
      }
    });

    if (!subcategory) throw new Error("Subcategory not found");

    return {
      ...subcategory,
      services: this.formatServicesWithRatings(subcategory.services)
    };
  }

  async listByName(name: string) {
    const subcategories = await prisma.subcategory.findMany({
      where: { name: { contains: name, mode: 'insensitive' } },
      include: {
        services: {
          include: {
            provider: { select: { id: true, name: true } },
            subcategory: { select: { id: true, name: true } },
            serviceDetails: { select: { id: true, photoUrl: true, description: true } },
            ratings: { select: { id: true, rating: true, user: { select: { id: true, name: true } }, createdAt: true } },
            comments: { select: { id: true, text: true, user: { select: { id: true, name: true } }, createdAt: true } },
          }
        }
      }
    });

    if (subcategories.length === 0) {
      throw new Error("Nenhuma subcategoria encontrada com o nome fornecido");
    }

    return subcategories.map(sub => ({
      ...sub,
      services: this.formatServicesWithRatings(sub.services)
    }));
  }

  async listServicesBySubcategory(subcategoryId: number) {
    const subcategoryExists = await prisma.subcategory.findUnique({ where: { id: subcategoryId } });
    if (!subcategoryExists) throw new Error("Subcategory not found");

    const services = await prisma.service.findMany({
      where: { subcategoryId },
      include: {
        provider: { select: { id: true, name: true } },
        subcategory: { select: { id: true, name: true } },
        serviceDetails: { select: { id: true, photoUrl: true, description: true } },
        comments: { select: { id: true, text: true, user: { select: { id: true, name: true } }, createdAt: true } },
        ratings: { select: { id: true, rating: true, user: { select: { id: true, name: true } }, createdAt: true } },
        _count: { select: { ratings: true } }
      }
    });

    return this.formatServicesWithRatings(services);
  }

  async update({ subcategoryId, name }: UpdateSubcategoryRequest) {
    if (!subcategoryId) throw new Error("Subcategory ID is required");
    if (!name) throw new Error("Name must be provided to update");

    const subcategory = await prisma.subcategory.findUnique({ where: { id: subcategoryId } });
    if (!subcategory) throw new Error("Subcategory not found");

    if (name !== subcategory.name) {
      const subcategoryAlreadyExists = await prisma.subcategory.findFirst({
        where: { name, categoryId: subcategory.categoryId },
      });
      if (subcategoryAlreadyExists) throw new Error("Subcategory name already exists in this category");
    }

    return await prisma.subcategory.update({
      where: { id: subcategoryId },
      data: { name },
    });
  }
}