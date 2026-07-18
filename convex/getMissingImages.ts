import { query } from "./_generated/server";

export const getMissing = query({
  args: {},
  handler: async (ctx) => {
    const products = await ctx.db.query("products").collect();
    // Return products that have an empty imageUrl or an imageUrl that doesn't start with /images/products/
    return products
      .filter(p => !p.imageUrl || !p.imageUrl.startsWith("/images/products/"))
      .map(p => ({ id: p._id, name: p.name, imageUrl: p.imageUrl }));
  }
});
