import { chromium } from "playwright";

const sizes = [
  [360, 800, "phone-360"],
  [390, 844, "phone-390"],
  [430, 932, "phone-430"],
  [768, 1024, "tablet-768"],
  [1024, 768, "laptop-1024"],
  [1280, 900, "desktop-1280"],
  [1440, 1000, "desktop-1440"],
];

const browser = await chromium.launch();
const report = [];

for (const [w, h, name] of sizes) {
  const ctx = await browser.newContext({
    viewport: { width: w, height: h },
    deviceScaleFactor: w < 500 ? 2 : 1,
  });
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  await page.goto("http://127.0.0.1:8080/index.html", { waitUntil: "networkidle" });
  await page.waitForTimeout(900);

  await page.screenshot({ path: `shots/${name}-viewport.png` });
  if (w === 390 || w === 1440) {
    await page.screenshot({ path: `shots/${name}-full.png`, fullPage: true });
  }

  const metrics = await page.evaluate(() => {
    const de = document.documentElement;
    const overflow = [...document.querySelectorAll("body *")]
      .filter((el) => {
        const r = el.getBoundingClientRect();
        return r.width > 0 && (r.right > de.clientWidth + 1 || r.left < -1);
      })
      .slice(0, 8)
      .map((el) => `${el.tagName.toLowerCase()}.${(el.className || "").toString().split(" ")[0]} right=${Math.round(el.getBoundingClientRect().right)}`);
    return {
      scrollWidth: de.scrollWidth,
      clientWidth: de.clientWidth,
      bodyHeight: Math.round(document.body.scrollHeight),
      header: Math.round(document.querySelector(".site-header").getBoundingClientRect().height),
      overflow,
    };
  });

  if (w < 1000) {
    await page.click(".nav-toggle");
    await page.waitForTimeout(450);
    await page.screenshot({ path: `shots/${name}-menu.png` });
    await page.keyboard.press("Escape");
    await page.waitForTimeout(250);
  }

  await page.evaluate(() => window.scrollTo(0, 900));
  await page.waitForTimeout(500);
  await page.screenshot({ path: `shots/${name}-scrolled.png` });

  report.push({ name, ...metrics, errors });
  await ctx.close();
}

await browser.close();
console.log(JSON.stringify(report, null, 2));
