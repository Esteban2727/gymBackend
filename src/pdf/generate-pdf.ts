import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const htmlPath = path.resolve(__dirname, 'grafico.html');
  const htmlContent = fs.readFileSync(htmlPath, 'utf8');
  await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

  // Espera hasta que el gráfico se haya renderizado completamente
  await page.waitForFunction('window.chartRendered === true', {
    timeout: 10000,
  });

  // Genera el PDF
  await page.pdf({ path: 'grafico.pdf', format: 'A4' });

  await browser.close();
})();
