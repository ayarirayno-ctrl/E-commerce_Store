import { z } from 'zod';

const productSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.number().min(0, 'Price must be positive'),
  comparePrice: z.number().min(0).optional(),
  category: z.string().min(1, 'Category is required'),
  stock: z.number().min(0, 'Stock must be positive'),
  images: z.array(z.object({
    url: z.string().url('Image URL must be valid'),
    public_id: z.string(),
    isMain: z.boolean().optional()
  })).optional(),
  sku: z.string().min(1, 'SKU is required'),
  isActive: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
  attributes: z.array(z.object({
    name: z.string(),
    value: z.string()
  })).optional()
});

export const validateProduct = (data: unknown) => {
  try {
    const validatedData = productSchema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { 
        success: false, 
        errors: error.errors.map((e: any) => ({
          path: e.path.join('.'),
          message: e.message
        }))
      };
    }
    return { 
      success: false, 
      errors: [{ path: '', message: 'Invalid data' }]
    };
  }
};