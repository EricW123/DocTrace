import { test, expect } from "@playwright/test";

test("compare flow works", async ({ page }) => {
    await page.goto("http://localhost:3000");

    await page.fill('input[placeholder="repo"]', "vercel/next.js");
    await page.fill('input[placeholder="base commit"]', "xxx");
    await page.fill('input[placeholder="target commit"]', "yyy");

    await page.click("text=Compare");

    await expect(page.locator("text=Summary")).toBeVisible();
});