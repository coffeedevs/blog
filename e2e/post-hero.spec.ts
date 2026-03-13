import { test, expect } from '@playwright/test';

const POST_URL = '/laravel-12-cambios-en-espanol';

test.describe('Post hero layout', () => {
  test('title appears below the banner image', async ({ page }) => {
    await page.goto(POST_URL);

    const picture = page.locator('.post-hero__picture');
    const title = page.locator('.post-hero__title');

    await expect(picture).toBeVisible();
    await expect(title).toBeVisible();

    const pictureBox = await picture.boundingBox();
    const titleBox = await title.boundingBox();

    expect(pictureBox).not.toBeNull();
    expect(titleBox).not.toBeNull();

    // Title must start at or below the bottom of the image
    expect(titleBox!.y).toBeGreaterThanOrEqual(pictureBox!.y + pictureBox!.height - 1);
  });

  test('banner image has no dark overlay', async ({ page }) => {
    await page.goto(POST_URL);

    const hero = page.locator('.post-hero');
    const picture = page.locator('.post-hero__picture');
    const img = page.locator('.post-hero__picture img');

    // No background-color black on the hero section
    const heroBg = await hero.evaluate((el) => getComputedStyle(el).backgroundColor);
    expect(heroBg).not.toBe('rgb(0, 0, 0)');

    // Image should be at full opacity
    const imgOpacity = await img.evaluate((el) => getComputedStyle(el).opacity);
    expect(imgOpacity).toBe('1');

    const pictureOpacity = await picture.evaluate((el) => getComputedStyle(el).opacity);
    expect(pictureOpacity).toBe('1');
  });

  test('title padding aligns with post body content', async ({ page }) => {
    await page.goto(POST_URL);

    const title = page.locator('.post-hero__title');
    const content = page.locator('.post-content');

    await expect(title).toBeVisible();
    await expect(content).toBeVisible();

    const titleBox = await title.boundingBox();
    const contentBox = await content.boundingBox();

    expect(titleBox).not.toBeNull();
    expect(contentBox).not.toBeNull();

    // Title and content must share the same left edge and width
    expect(titleBox!.x).toBeCloseTo(contentBox!.x, 0);
    expect(titleBox!.width).toBeCloseTo(contentBox!.width, 0);
  });

  test('post hero visual regression', async ({ page }) => {
    await page.goto(POST_URL);
    await page.locator('.post-hero').waitFor({ state: 'visible' });

    // Wait for the image to load
    await page.locator('.post-hero__picture img').evaluate(
      (img: HTMLImageElement) => img.complete || new Promise((r) => (img.onload = r))
    );

    await expect(page.locator('.post-hero')).toHaveScreenshot('post-hero.png', {
      maxDiffPixelRatio: 0.01,
    });
  });
});
