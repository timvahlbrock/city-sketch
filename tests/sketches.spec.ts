import { ElementHandle, expect, Locator, Page, test } from "@playwright/test";

test("create sketch", async ({ page }) => {
  await page.goto("/");

  await page.getByTestId("create-sketch-button").click();

  await expect(page).toHaveURL(/sketch\/[a-zA-Z0-9_-]+\/edit/);
  await expect(page.getByTestId("sketch-title")).toHaveText("Your new Sketch");
});

test("changing the sketch title", async ({ page }) => {
  await page.goto("/");
  await page.getByTestId("create-sketch-button").click();
  const newTitle = "My Updated Sketch Title";

  const titleElement = page.getByTestId("sketch-title");
  const editableTitleElement = await edit(page, titleElement);
  await editableTitleElement.fill(newTitle);
  await editableTitleElement.press("Enter");

  await expect(titleElement).toHaveText(newTitle);
  await page.reload();
  await expect(titleElement).toHaveText("My Updated Sketch Title");
});

test("changing the sketch description", async ({ page }) => {
  await page.goto("/");
  await page.getByTestId("create-sketch-button").click();
  const newDescription = "An updated description for my sketch.";

  const descriptionElement = page.getByTestId("sketch-description");
  const editableDescriptionElement = await edit(page, descriptionElement);
  await editableDescriptionElement.fill(newDescription);
  await editableDescriptionElement.press("Enter");

  await expect(descriptionElement).toHaveText(newDescription);
  await page.reload();
  await expect(descriptionElement).toHaveText(newDescription);
});

async function edit(
  page: Page,
  editableElement: Locator,
): Promise<ElementHandle> {
  const editableText = await editableElement.textContent();
  const editButton = editableElement.getByRole("button").first();
  await editButton.click();
  return (await page.getByText(editableText ?? "").elementHandle())!;
}
