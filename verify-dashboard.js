const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 420, height: 900 } });
  page.on('console', msg => {
    if (msg.type() === 'error') console.log('CONSOLE ERROR:', msg.text());
  });

  await page.goto('http://localhost:8081', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(4000);

  // Role selection modal: pick Landlord, then Get Started
  const landlordOption = page.locator('text=Landlord').first();
  if (await landlordOption.count() > 0) {
    await landlordOption.click().catch(() => {});
    await page.waitForTimeout(300);
    const getStarted = page.locator('text=/get started/i').first();
    if (await getStarted.count() > 0) {
      await getStarted.click().catch(() => {});
      await page.waitForTimeout(800);
    }
  }
  await page.screenshot({ path: 'verify-1-home.png' });

  // Go to Profile tab (bottom nav) via in-app click, not page.goto, to preserve state
  await page.locator('text=Profile').last().click();
  await page.waitForTimeout(800);
  await page.screenshot({ path: 'verify-2-profile-locked.png' });

  // Sign in
  const signInBtn = page.locator('text=Sign In').first();
  console.log('signInBtn count', await signInBtn.count());
  await signInBtn.click({ force: true });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: 'verify-3-login-modal.png' });
  console.log('body text snippet:', (await page.locator('body').innerText()).slice(0, 500));

  // Use Google mock login (instant, no OTP)
  const googleBtn = page.locator('text=/continue with google/i').first();
  await googleBtn.waitFor({ timeout: 10000 });
  await googleBtn.click();
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'verify-4-profile-loggedin.png' });

  // Click Rental Manager card to open dashboard (client-side nav)
  const rentalManagerCard = page.locator('text=Rental Manager').first();
  await rentalManagerCard.waitFor({ timeout: 10000 });
  await rentalManagerCard.click();
  await page.waitForTimeout(1500);
  await page.screenshot({ path: 'verify-5-dashboard.png', fullPage: true });

  console.log('DONE');
  await browser.close();
})();
