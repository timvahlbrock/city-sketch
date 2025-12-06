import { expect, test } from "@playwright/test";

test("create sketch", async ({ page }) => {
  await page.goto("/");

  await page.getByTestId("create-sketch-button").click();

  await expect(page).toHaveURL(/sketch\/[a-zA-Z0-9_-]+\/edit/);
  await expect(page.getByTestId("sketch-title")).toHaveText("Your new Sketch");
});

test("changing the sketch title", async ({ page }) => {
  await page.goto("/");
  await page.getByTestId("create-sketch-button").click();

  const titleElement = page.getByTestId("sketch-title");
  const editButton = titleElement.getByRole("button").first();
  await editButton.click();
  const editableTitleElement = page.getByText("Your new Sketch").first();
  await editableTitleElement.fill("My Updated Sketch Title");
  await page.getByText("My Updated Sketch Title").press("Enter");

  await page.reload();

  await expect(titleElement).toHaveText("My Updated Sketch Title");
});
