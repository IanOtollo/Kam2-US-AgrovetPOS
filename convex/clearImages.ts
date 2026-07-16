import { mutation } from "./_generated/server";

export const run = mutation({
  args: {},
  handler: async (ctx) => {
    const products = await ctx.db.query("products").collect();
    let updatedCount = 0;
    
    for (const p of products) {
      if (p.imageUrl) {
        await ctx.db.patch(p._id, { imageUrl: "" });
        updatedCount++;
      }
    }
    
    return updatedCount;
  }
});
