import { Response } from "express";
import * as PDFDocument from "pdfkit"; 

export class GeneratePdfServices {
  async createPdf(title: string, res: Response) {
    try {
      const formattedTitle = title.split("-").join(" ");

      const doc = new PDFDocument(); // Ahora debería funcionar bien
      const filename = `documento-${Date.now()}.pdf`;

      res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
      res.setHeader("Content-Type", "application/pdf");

      doc.pipe(res);

      doc.fontSize(20).text(`${formattedTitle}`, { align: "center" });
      doc.moveDown();
      doc.fontSize(14).text("Este es un documento PDF generado con Node.js y PDFKit.");
      doc.moveDown();
      doc.text(`Fecha de generación: ${new Date().toLocaleString()}`);

      doc.end();
    } catch (error) {
      console.error("Error en generatePdfService:", error);
      throw new Error("Error al generar el PDF");
    }
  }
}
