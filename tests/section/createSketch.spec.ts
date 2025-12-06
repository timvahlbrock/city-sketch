import { expect, test } from "@playwright/test";

test("create sketch", async ({ page }) => {
  await page.goto("/");

  await page.getByTestId("create-sketch-button").click();

  await expect(page).toHaveURL(/sketch\/[a-zA-Z0-9_-]+\/edit/);
});
