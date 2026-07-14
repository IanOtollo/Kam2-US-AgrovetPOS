import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {
    activeOnly: v.optional(v.boolean()),
    brandId: v.optional(v.id("brands")),
    categoryId: v.optional(v.id("categories")),
  },
  handler: async (ctx, args) => {
    let products = await ctx.db.query("products").collect();

    if (args.activeOnly) products = products.filter((p) => p.isActive);
    if (args.brandId) products = products.filter((p) => p.brandId === args.brandId);
    if (args.categoryId) products = products.filter((p) => p.categoryId === args.categoryId);

    const allBrands = await ctx.db.query("brands").collect();
    const allCategories = await ctx.db.query("categories").collect();
    const allVariants = await ctx.db.query("productVariants").collect();

    const brandMap = new Map(allBrands.map(b => [b._id, b.name]));
    const categoryMap = new Map(allCategories.map(c => [c._id, c.name]));

    const variantsByProduct = new Map<string, typeof allVariants>();
    for (const v of allVariants) {
      if (!v.isActive) continue;
      if (!variantsByProduct.has(v.productId)) {
        variantsByProduct.set(v.productId, []);
      }
      variantsByProduct.get(v.productId)!.push(v);
    }

    const enriched = products.map((p) => {
      const variants = variantsByProduct.get(p._id) || [];
      return {
        ...p,
        brandName: p.brandId ? (brandMap.get(p.brandId) ?? "") : "",
        categoryName: categoryMap.get(p.categoryId) ?? "",
        variants,
        variantCount: variants.length,
      };
    });

    return enriched;
  },
});

export const get = query({
  args: { id: v.id("products") },
  handler: async (ctx, args) => {
    const product = await ctx.db.get(args.id);
    if (!product) return null;
    const brand = product.brandId ? await ctx.db.get(product.brandId) : null;
    const category = await ctx.db.get(product.categoryId);
    const variants = await ctx.db
      .query("productVariants")
      .withIndex("by_product", (q) => q.eq("productId", args.id))
      .collect();
    return {
      ...product,
      brandName: brand?.name ?? "",
      categoryName: category?.name ?? "",
      variants,
    };
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    brandId: v.optional(v.id("brands")),
    categoryId: v.id("categories"),
    description: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return ctx.db.insert("products", {
      ...args,
      isActive: true,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("products"),
    name: v.string(),
    brandId: v.optional(v.id("brands")),
    categoryId: v.id("categories"),
    description: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    isActive: v.boolean(),
  },
  handler: async (ctx, args) => {
    const { id, ...rest } = args;
    await ctx.db.patch(id, { ...rest, updatedAt: Date.now() });
  },
});

export const remove = mutation({
  args: { id: v.id("products") },
  handler: async (ctx, args) => {
    const variants = await ctx.db
      .query("productVariants")
      .withIndex("by_product", (q) => q.eq("productId", args.id))
      .collect();
    for (const variant of variants) {
      await ctx.db.delete(variant._id);
    }
    await ctx.db.delete(args.id);
  },
});

// Variant operations
export const createVariant = mutation({
  args: {
    productId: v.id("products"),
    sku: v.string(),
    barcode: v.optional(v.string()),
    packageSize: v.string(),
    costPrice: v.number(),
    sellingPrice: v.number(),
    stockQuantity: v.number(),
    lowStockThreshold: v.number(),
    expiryDate: v.optional(v.number()),
      },
  handler: async (ctx, args) => {
    return ctx.db.insert("productVariants", {
      ...args,
      isActive: true,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

export const updateVariant = mutation({
  args: {
    id: v.id("productVariants"),
    sku: v.string(),
    barcode: v.optional(v.string()),
    packageSize: v.string(),
    costPrice: v.number(),
    sellingPrice: v.number(),
    stockQuantity: v.number(),
    lowStockThreshold: v.number(),
    expiryDate: v.optional(v.number()),
        isActive: v.boolean(),
  },
  handler: async (ctx, args) => {
    const { id, ...rest } = args;
    await ctx.db.patch(id, { ...rest, updatedAt: Date.now() });
  },
});

export const deleteVariant = mutation({
  args: { id: v.id("productVariants") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { isActive: false, updatedAt: Date.now() });
  },
});

export const bulkImport = mutation({
  args: {
    rows: v.array(v.object({
      name: v.string(),
      brand: v.string(),
      category: v.string(),
      description: v.optional(v.string()),
      sku: v.optional(v.string()),
      barcode: v.optional(v.string()),
      packageSize: v.string(),
      costPrice: v.number(),
      sellingPrice: v.number(),
      stockQuantity: v.number(),
      lowStockThreshold: v.number(),
      expiryDate: v.optional(v.number()),
          })),
  },
  handler: async (ctx, args) => {
    const toSlug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const brandMap = new Map<string, string>();
    const categoryMap = new Map<string, string>();
    const productMap = new Map<string, string>();

    for (const row of args.rows) {
      // Brand
      const brandSlug = toSlug(row.brand);
      if (!brandMap.has(brandSlug)) {
        const existing = await ctx.db.query("brands").withIndex("by_slug", (q) => q.eq("slug", brandSlug)).first();
        if (existing) {
          brandMap.set(brandSlug, existing._id);
        } else {
          const id = await ctx.db.insert("brands", { name: row.brand, slug: brandSlug, isActive: true, createdAt: Date.now() });
          brandMap.set(brandSlug, id);
        }
      }
      const brandId = brandMap.get(brandSlug)!;

      // Category
      const catSlug = toSlug(row.category);
      if (!categoryMap.has(catSlug)) {
        const existing = await ctx.db.query("categories").withIndex("by_slug", (q) => q.eq("slug", catSlug)).first();
        if (existing) {
          categoryMap.set(catSlug, existing._id);
        } else {
          const id = await ctx.db.insert("categories", { name: row.category, slug: catSlug, isActive: true, createdAt: Date.now() });
          categoryMap.set(catSlug, id);
        }
      }
      const categoryId = categoryMap.get(catSlug)!;

      // Product (match by name+brand)
      const productKey = `${row.name.toLowerCase().trim()}|${brandId}`;
      if (!productMap.has(productKey)) {
        const existing = await ctx.db.query("products").withIndex("by_brand", (q) => q.eq("brandId", brandId as never)).collect();
        const found = existing.find((p) => p.name.toLowerCase() === row.name.toLowerCase().trim());
        if (found) {
          productMap.set(productKey, found._id);
        } else {
          const id = await ctx.db.insert("products", {
            name: row.name,
            brandId: brandId as never,
            categoryId: categoryId as never,
            description: row.description,
            isActive: true,
            createdAt: Date.now(),
            updatedAt: Date.now(),
          });
          productMap.set(productKey, id);
        }
      }
      const productId = productMap.get(productKey)!;

      const brandCode = row.brand.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 4);
      const nameCode = row.name.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6);
      const sku = row.sku || `${brandCode}-${nameCode}-${row.packageSize}ML`;

      await ctx.db.insert("productVariants", {
        productId: productId as never,
        sku,
        barcode: row.barcode,
        packageSize: row.packageSize,
        costPrice: row.costPrice,
        sellingPrice: row.sellingPrice,
        stockQuantity: row.stockQuantity,
        lowStockThreshold: row.lowStockThreshold,
        expiryDate: row.expiryDate,
                isActive: true,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    }

    return { imported: args.rows.length };
  },
});

export const getVariantBySku = query({
  args: { sku: v.string() },
  handler: async (ctx, args) => {
    return ctx.db
      .query("productVariants")
      .withIndex("by_sku", (q) => q.eq("sku", args.sku))
      .first();
  },
});

export const getVariantByBarcode = query({
  args: { barcode: v.string() },
  handler: async (ctx, args) => {
    return ctx.db
      .query("productVariants")
      .withIndex("by_barcode", (q) => q.eq("barcode", args.barcode))
      .first();
  },
});
