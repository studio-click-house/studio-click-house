const { chromium } = require(process.argv[2]);

(async () => {
  const browser = await chromium.launch({ headless: true });
  const profiles = [
    { name: "desktop", viewport: { width: 1365, height: 768 } },
    { name: "mobile", viewport: { width: 412, height: 823 }, isMobile: true },
  ];
  const results = [];

  for (const profile of profiles) {
    const page = await browser.newPage(profile);
    const heroVideoRequests = [];
    page.on("request", (request) => {
      if (/hero%20section\.webm/.test(request.url())) {
        heroVideoRequests.push(request.url());
      }
    });
    await page.route("**/videos/hero%20section.webm", (route) => route.abort());
    await page.addInitScript(() => {
      window.__smoke = { cls: 0, shifts: [], fcp: 0, lcp: 0, preloaderComplete: 0 };
      addEventListener("site-preloader-complete", () => {
        window.__smoke.preloaderComplete = performance.now();
      });
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === "first-contentful-paint") window.__smoke.fcp = entry.startTime;
        }
      }).observe({ type: "paint", buffered: true });
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) window.__smoke.lcp = entry.startTime;
      }).observe({ type: "largest-contentful-paint", buffered: true });
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) {
            window.__smoke.cls += entry.value;
            window.__smoke.shifts.push({
              value: entry.value,
              sources: entry.sources.map((source) => {
                const node = source.node;
                return node
                  ? `${node.tagName?.toLowerCase() || "node"}.${String(node.className || "").slice(0, 120)}`
                  : "unknown";
              }),
            });
          }
        }
      }).observe({ type: "layout-shift", buffered: true });
    });

    await page.goto("http://127.0.0.1:4173/", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(5000);
    const passive = await page.evaluate(() => {
      const detail = document.querySelector(".hero-detail");
      const line = document.querySelector(".hero-line");
      return {
        ...window.__smoke,
        preloaderPresent: Boolean(document.querySelector(".site-preloader")),
        detailOpacity: detail ? getComputedStyle(detail).opacity : null,
        detailVisibility: detail ? getComputedStyle(detail).visibility : null,
        lineVisibility: line ? getComputedStyle(line).visibility : null,
      };
    });
    const passiveVideoRequests = heroVideoRequests.length;

    await page.mouse.wheel(0, 120);
    await page.waitForTimeout(500);
    results.push({
      name: profile.name,
      passive,
      passiveVideoRequests,
      videoRequestsAfterInteraction: heroVideoRequests.length,
    });
    await page.close();
  }

  console.log(JSON.stringify(results, null, 2));
  await browser.close();
})();
