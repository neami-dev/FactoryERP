import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ shippingId: number }> }
) {
  const { shippingId } = await params;

  const cookieStore = await cookies();
  const token =
    cookieStore.get("next-auth.session-token")?.value ||
    cookieStore.get("__Secure-next-auth.session-token")?.value;

  if (!token) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const isProduction = process.env.NODE_ENV === "production";

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();

  await page.setCookie({
    name: "next-auth.session-token",
    value: token,
    domain: isProduction
      ? new URL(process.env.NEXT_PUBLIC_BASE_URL!).hostname
      : "localhost",
    path: "/",
    httpOnly: true,
    secure: isProduction,
  });

  const pdfUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/invoice/shipping-weights?shippingId=${shippingId}&download=true`;

  await page.goto(pdfUrl, {
    waitUntil: "networkidle0",
    timeout: 60 * 1000,
  });

  const pdfBuffer =Buffer.from( await page.pdf({
    format: "A4",
    printBackground: true,
    displayHeaderFooter: true,
    footerTemplate: `
      <div style="font-size:10px;width:100%;text-align:center;margin-top:5px;">
        Page <span class="pageNumber"></span> de <span class="totalPages"></span>
      </div>
    `,
    headerTemplate: `<div></div>`,
    margin: {
      top: "40px",
      bottom: "60px",
      left: "20px",
      right: "20px",
    },
  }));

  await browser.close();

  return new NextResponse(pdfBuffer, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=shipping-${shippingId}.pdf`,
    },
  });
}
