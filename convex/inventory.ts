import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getStockOverview = query({
  args: {},
  handler: async (ctx) => {
    const variants = await ctx.db.query("productVariants").collect();
    const allProducts = await ctx.db.query("products").collect();
    const allBrands = await ctx.db.query("brands").collect();

    const brandMap = new Map(allBrands.map(b => [b._id, b.name]));
    const productMap = new Map();
    for (const p of allProducts) {
      productMap.set(p._id, {
        name: p.name,
        brandName: p.brandId ? (brandMap.get(p.brandId) ?? "") : "",
      });
    }

    const enriched = variants.map((variant) => {
      const pInfo = productMap.get(variant.productId);
      return {
        ...variant,
        productName: pInfo?.name ?? "",
        brandName: pInfo?.brandName ?? "",
      };
    });
    return enriched;
  },
});

export const getLowStock = query({
  args: {},
  handler: async (ctx) => {
    const variants = await ctx.db.query("productVariants").collect();
    const low = variants.filter(
      (v) => v.isActive && v.stockQuantity <= v.lowStockThreshold
    );
    const allProducts = await ctx.db.query("products").collect();
    const allBrands = await ctx.db.query("brands").collect();

    const brandMap = new Map(allBrands.map(b => [b._id, b.name]));
    const productMap = new Map();
    for (const p of allProducts) {
      productMap.set(p._id, {
        name: p.name,
        brandName: p.brandId ? (brandMap.get(p.brandId) ?? "") : "",
      });
    }

    const enriched = low.map((variant) => {
      const pInfo = productMap.get(variant.productId);
      return {
        ...variant,
        productName: pInfo?.name ?? "",
        brandName: pInfo?.brandName ?? "",
      };
    });
    return enriched.sort((a, b) => a.stockQuantity - b.stockQuantity);
  },
});

export const getExpiryAlerts = query({
  args: { daysAhead: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const days = args.daysAhead ?? 90;
    const cutoff = Date.now() + days * 24 * 60 * 60 * 1000;
    const variants = await ctx.db.query("productVariants").collect();
    const expiring = variants.filter(
      (v) => v.isActive && v.expiryDate && v.expiryDate <= cutoff
    );
    const enriched = await Promise.all(
      expiring.map(async (variant) => {
        const product = await ctx.db.get(variant.productId);
        const brand = product?.brandId ? await ctx.db.get(product.brandId) : null;
        return {
          ...variant,
          productName: product?.name ?? "",
          brandName: brand?.name ?? "",
        };
      })
    );
    return enriched.sort((a, b) => (a.expiryDate ?? 0) - (b.expiryDate ?? 0));
  },
});

export const adjustStock = mutation({
  args: {
    variantId: v.id("productVariants"),
    newQuantity: v.number(),
    reason: v.string(),
    performedBy: v.id("users"),
  },
  handler: async (ctx, args) => {
    const variant = await ctx.db.get(args.variantId);
    if (!variant) throw new Error("Variant not found");

    const previousStock = variant.stockQuantity;
    const adjustment = args.newQuantity - previousStock;

    await ctx.db.patch(args.variantId, {
      stockQuantity: args.newQuantity,
      updatedAt: Date.now(),
    });

    await ctx.db.insert("stockMovements", {
      variantId: args.variantId,
      type: "adjustment",
      quantity: adjustment,
      previousStock,
      newStock: args.newQuantity,
      reason: args.reason,
      performedBy: args.performedBy,
      createdAt: Date.now(),
    });
  },
});

export const getStockMovements = query({
  args: { variantId: v.optional(v.id("productVariants")) },
  handler: async (ctx, args) => {
    if (args.variantId) {
      return ctx.db
        .query("stockMovements")
        .withIndex("by_variant", (q) => q.eq("variantId", args.variantId!))
        .order("desc")
        .take(50);
    }
    return ctx.db.query("stockMovements").order("desc").take(100);
  },
});
