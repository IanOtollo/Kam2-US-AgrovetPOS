import { query } from "./_generated/server";

export const inspect = query({
  args: {},
  handler: async (ctx) => {
    const products = await ctx.db.query("products").collect();
    return products.slice(0, 20).map(p => ({ name: p.name, imageUrl: p.imageUrl }));
  }
});
