"use node";
import { action } from "./_generated/server";
import { v } from "convex/values";
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
