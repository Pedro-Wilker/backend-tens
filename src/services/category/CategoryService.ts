import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import 'multer';

const prisma = new PrismaClient();

const uploadDir = process.env.UPLOAD_DIR || path.resolve(__dirname, '..', '..', 'uploads');

interface CreateCategoryRequest { name: string; file?: Express.Multer.File; }
interface UpdateCategoryRequest { id: number; name?: string; file?: Express.Multer.File; }

export class CategoryService {
  
  async create({ name, file }: CreateCategoryRequest) {
    if (!name) throw new Error("Category name is required");
    if (!file) throw new Error("Image is required");

    const categoryAlreadyExists = await prisma.category.findUnique({ where: { name } });
    if (categoryAlreadyExists) throw new Error("Category already exists");

    const category = await prisma.category.create({
      data: { name, imageUrl: file.filename },
    });

    return { ...category, imageUrl: `/uploads/${category.imageUrl}` };
  }

  async listAll() {
    const categories = await prisma.category.findMany({
      select: {
        id: true, name: true, imageUrl: true,
        subcategories: {
          select: {
            id: true, name: true,
            services: {
              select: {
                id: true, name: true, description: true, price: true,
                provider: { select: { id: true, name: true } },
                subcategory: { select: { id: true, name: true } },
                createdAt: true, updatedAt: true,
                serviceDetails: { select: { id: true, photoUrl: true, description: true } },
                ratings: { select: { rating: true } },
              },
            },
          },
        },
      },
    });

    const transformedCategories = categories.map((category) => {
      const processedSubcategories = category.subcategories.map((subcategory) => {
        const processedServices = subcategory.services.map((service) => {
          const totalRatings = service.ratings.length;
          const sumRatings = service.ratings.reduce((sum, r) => sum + r.rating, 0);
          const averageRating = totalRatings > 0 ? sumRatings / totalRatings : 0;
          
          return {
            ...service,
            averageRating: parseFloat(averageRating.toFixed(2))
          };
        });

        return {
          ...subcategory,
          services: processedServices.sort((a, b) => b.averageRating - a.averageRating)
        };
      });

      return {
        id: category.id,
        name: category.name,
        imageUrl: category.imageUrl ? `/uploads/${category.imageUrl}` : null,
        subcategories: processedSubcategories,
      };
    });

    return transformedCategories.filter((c) => c.imageUrl !== null);
  }

  async listCarousel() {
    return await prisma.category.findMany({
      select: { id: true, name: true, imageUrl: true },
    });
  }

  async detail(categoryId: number) {
    if (!categoryId) throw new Error("Invalid category ID");

    const category = await prisma.category.findUnique({
      where: { id: categoryId },
      select: {
        id: true, name: true, imageUrl: true, createdAt: true, updatedAt: true,
        subcategories: {
          select: {
            id: true, name: true, createdAt: true, updatedAt: true,
            services: {
              select: {
                id: true, name: true, description: true, price: true,
                provider: { select: { id: true, name: true } },
                subcategory: { select: { id: true, name: true } },
                createdAt: true, updatedAt: true,
                _count: { select: { ratings: true } },
                ratings: { select: { rating: true } },
                serviceDetails: { select: { id: true, photoUrl: true, description: true } },
              },
            },
          },
        },
      },
    });

    if (!category) throw new Error("Category not found");

    const processedSubcategories = category.subcategories.map((subcategory) => {
      const services = subcategory.services.map((service) => {
        const totalRatings = service.ratings.length;
        const sumRatings = service.ratings.reduce((sum, r) => sum + r.rating, 0);
        const averageRating = totalRatings > 0 ? sumRatings / totalRatings : 0;
        return { ...service, averageRating: parseFloat(averageRating.toFixed(2)) };
      });
      return { ...subcategory, services: services.sort((a, b) => b.averageRating - a.averageRating) };
    });

    return {
      id: category.id,
      name: category.name,
      imageUrl: category.imageUrl ? `/uploads/${category.imageUrl}` : null,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
      subcategories: processedSubcategories,
    };
  }

  async getByName(name: string) {
    const category = await prisma.category.findFirst({
      where: { name: { contains: name, mode: 'insensitive' } }, 
      include: { subcategories: true }
    });

    if (!category) throw new Error("Category not found");
    return category;
  }

  async update({ id, name, file }: UpdateCategoryRequest) {
    if (!id) throw new Error("Category ID is required");

    const category = await prisma.category.findUnique({ where: { id } });
    if (!category) throw new Error("Category not found");

    let newImageUrl = category.imageUrl;

    if (file) {
      if (category.imageUrl) {
        const oldImagePath = path.join(uploadDir, category.imageUrl);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath); 
        }
      }
      newImageUrl = file.filename;
    }

    if (name && name !== category.name) {
      const nameExists = await prisma.category.findUnique({ where: { name } });
      if (nameExists && nameExists.id !== id) throw new Error("Category name already in use");
    }

    const updatedCategory = await prisma.category.update({
      where: { id },
      data: { name: name ?? category.name, imageUrl: newImageUrl },
    });

    return { ...updatedCategory, imageUrl: `/uploads/${updatedCategory.imageUrl}` };
  }

  async delete(categoryId: number) {
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
      include: { subcategories: true },
    });

    if (!category) throw new Error("Category not found");

    const hasServices = await prisma.service.findFirst({
      where: { subcategoryId: { in: category.subcategories.map(sub => sub.id) } },
    });

    if (hasServices) {
      throw new Error("Cannot delete category with subcategories that have services");
    }

    if (category.imageUrl) {
        const imagePath = path.join(uploadDir, category.imageUrl);
        if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    }

    await prisma.category.delete({ where: { id: categoryId } });
    return { message: "Category deleted successfully" };
  }
}