import { mutation } from "./_generated/server";
import agrovetData from "./seedData/agrovetStock.json";

export const createAdmin = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("users").withIndex("by_email", q => q.eq("email", "admin@kam2us.com")).first();
    if (!existing) {
      await ctx.db.insert("users", {
        name: "Admin",
        email: "admin@kam2us.com",
        role: "admin",
        pin: "1234",
        isActive: true,
        createdAt: Date.now(),
        updatedAt: Date.now()
      });
    }

    const existingCashier = await ctx.db.query("users").withIndex("by_email", q => q.eq("email", "cashier@kam2us.com")).first();
    if (!existingCashier) {
      await ctx.db.insert("users", {
        name: "Cashier",
        email: "cashier@kam2us.com",
        role: "cashier",
        pin: "0000",
        isActive: true,
        createdAt: Date.now(),
        updatedAt: Date.now()
      });
    }
    
    return { success: true, msg: "Default users created" };
  }
});

export const importStock = mutation({
  args: {},
  handler: async (ctx) => {
    const toSlug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    let productsCreated = 0;
    let variantsCreated = 0;
    
    for (const cat of agrovetData) {
      const catSlug = toSlug(cat.category);
      let existingCat = await ctx.db.query("categories").withIndex("by_slug", q => q.eq("slug", catSlug)).first();
      let categoryId = existingCat?._id;
      if (!categoryId) {
        categoryId = await ctx.db.insert("categories", { name: cat.category, slug: catSlug, isActive: true, createdAt: Date.now() });
      }

      for (const prod of cat.products) {
        // Try to find if product already exists
        let existingProdArray = await ctx.db.query("products").withIndex("by_category", q => q.eq("categoryId", categoryId!)).collect();
        let existingProd = existingProdArray.find(p => p.name.toLowerCase() === prod.name.toLowerCase());
        let productId = existingProd?._id;

        if (!productId) {
          productId = await ctx.db.insert("products", {
            name: prod.name,
            categoryId: categoryId,
            isActive: true,
            createdAt: Date.now(),
            updatedAt: Date.now()
          });
          productsCreated++;
        }

        // Add variants
        for (const v of prod.variants) {
          const pkgSlug = toSlug(v.package);
          const nameCode = prod.name.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 4);
          const sku = `AGV-${nameCode}-${pkgSlug}`.toUpperCase();

          let existingVar = await ctx.db.query("productVariants").withIndex("by_sku", q => q.eq("sku", sku)).first();
          if (!existingVar) {
            await ctx.db.insert("productVariants", {
              productId: productId,
              sku: sku,
              packageSize: v.package,
              costPrice: 0,
              sellingPrice: v.sellingPrice,
              stockQuantity: v.stockQty,
              lowStockThreshold: 2,
              isActive: true,
              createdAt: Date.now(),
              updatedAt: Date.now()
            });
            variantsCreated++;
          }
        }
      }
    }
    return { productsCreated, variantsCreated };
  }
});
