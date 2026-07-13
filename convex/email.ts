"use node";
import { action } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendLowStockAlert = action({
  args: {
    productName: v.string(),
    sku: v.string(),
    remainingStock: v.number(),
    threshold: v.number(),
  },
  handler: async (_ctx, args) => {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn("Email credentials not configured");
      return { success: false };
    }

    const html = `
      <h2>Low Stock Alert</h2>
      <p>The following product has dropped below its minimum stock threshold:</p>
      <ul>
        <li><strong>Product:</strong> ${args.productName}</li>
        <li><strong>SKU:</strong> ${args.sku}</li>
        <li><strong>Current Stock:</strong> <span style="color: red; font-weight: bold;">${args.remainingStock}</span></li>
        <li><strong>Threshold:</strong> ${args.threshold}</li>
      </ul>
      <p>Please restock soon to avoid running out.</p>
    `;

    try {
      await transporter.sendMail({
        from: `"Kam2-US Agrovet" <${process.env.EMAIL_USER}>`,
        to: "vincent.ngala@gmail.com",
        subject: `⚠️ Low Stock Alert: ${args.productName}`,
        html,
      });
      return { success: true };
    } catch (error) {
      console.error("Failed to send low stock alert email", error);
      return { success: false, error: String(error) };
    }
  },
});

export const sendSaleNotification = action({
  args: {
    saleNumber: v.string(),
    totalAmount: v.number(),
    cashierName: v.string(),
    time: v.string(),
    itemsCount: v.number(),
  },
  handler: async (_ctx, args) => {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn("Email credentials not configured");
      return { success: false };
    }

    const html = `
      <h2>New Sale Completed</h2>
      <p>A new sale was just recorded at Kam2-US Agrovet Bungengi:</p>
      <ul>
        <li><strong>Sale Number:</strong> ${args.saleNumber}</li>
        <li><strong>Total Amount:</strong> KES ${args.totalAmount.toLocaleString()}</li>
        <li><strong>Attendant:</strong> ${args.cashierName}</li>
        <li><strong>Items Sold:</strong> ${args.itemsCount}</li>
        <li><strong>Time:</strong> ${args.time}</li>
      </ul>
    `;

    try {
      await transporter.sendMail({
        from: `"Kam2-US Agrovet" <${process.env.EMAIL_USER}>`,
        to: "vincent.ngala@gmail.com",
        subject: `💰 New Sale: KES ${args.totalAmount.toLocaleString()} - ${args.saleNumber}`,
        html,
      });
      return { success: true };
    } catch (error) {
      console.error("Failed to send sale notification email", error);
      return { success: false, error: String(error) };
    }
  },
});

export const sendFullStockReport = action({
  args: {},
  handler: async (ctx, _args) => {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn("Email credentials not configured");
      return { success: false, error: "Credentials missing" };
    }

    const lowStockItems = await ctx.runQuery(api.inventory.getLowStock);
    if (!lowStockItems || lowStockItems.length === 0) {
      return { success: true, message: "No low stock items" };
    }

    const outOfStock = lowStockItems.filter(i => i.stockQuantity === 0);
    const lowStock = lowStockItems.filter(i => i.stockQuantity > 0);

    let html = `<h2>📦 Comprehensive Stock Alert Report</h2>`;
    html += `<p>This is an automated alert. The following items require your attention.</p>`;

    if (outOfStock.length > 0) {
      html += `<h3 style="color: #d32f2f;">🚨 Out of Stock (${outOfStock.length} items)</h3>`;
      html += `<table border="1" cellpadding="5" style="border-collapse: collapse; width: 100%; text-align: left;">`;
      html += `<tr style="background-color: #fce4e4;"><th>Product</th><th>Brand</th><th>SKU</th><th>Stock</th></tr>`;
      for (const item of outOfStock) {
        html += `<tr><td>${item.productName}</td><td>${item.brandName}</td><td>${item.sku}</td><td style="color: red; font-weight: bold;">❌ 0</td></tr>`;
      }
      html += `</table><br/>`;
    }

    if (lowStock.length > 0) {
      html += `<h3 style="color: #ed6c02;">⚠️ Low Stock (${lowStock.length} items)</h3>`;
      html += `<table border="1" cellpadding="5" style="border-collapse: collapse; width: 100%; text-align: left;">`;
      html += `<tr style="background-color: #fff4e5;"><th>Product</th><th>Brand</th><th>SKU</th><th>Stock</th><th>Threshold</th></tr>`;
      for (const item of lowStock) {
        html += `<tr><td>${item.productName}</td><td>${item.brandName}</td><td>${item.sku}</td><td style="color: orange; font-weight: bold;">${item.stockQuantity}</td><td>${item.lowStockThreshold}</td></tr>`;
      }
      html += `</table>`;
    }

    // Generate CSV
    let csvContent = "Status,Product,Brand,SKU,Current Stock,Threshold\n";
    for (const item of outOfStock) {
      csvContent += `"Out of Stock","${item.productName}","${item.brandName}","${item.sku}",0,${item.lowStockThreshold}\n`;
    }
    for (const item of lowStock) {
      csvContent += `"Low Stock","${item.productName}","${item.brandName}","${item.sku}",${item.stockQuantity},${item.lowStockThreshold}\n`;
    }

    try {
      await transporter.sendMail({
        from: `"Kam2-US Agrovet" <${process.env.EMAIL_USER}>`,
        to: "vincent.ngala@gmail.com",
        subject: `🚨 Critical Stock Alert: ${outOfStock.length} Out of Stock, ${lowStock.length} Low Stock`,
        html,
        attachments: [
          {
            filename: 'Stock_Alert_Report.csv',
            content: csvContent
          }
        ]
      });
      return { success: true };
    } catch (error) {
      console.error("Failed to send full stock report email", error);
      return { success: false, error: String(error) };
    }
  },
});

