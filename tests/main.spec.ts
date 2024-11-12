import { expect, test } from '@playwright/test';

test('loads', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle(/Point Collab/);
});

test('goes to welcome page on initial load', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { name: 'Welcome!' })).toBeVisible();
});

test('onboards as admin correctly', async ({ page }) => {
  await page.goto('/');

  await page.getByLabel('What is your name?').fill('Playwright');
  await expect(
    page.getByRole('button', { name: 'Join an existing team' }),
  ).toBeVisible();

  await page.getByRole('button', { name: 'Start a new team' }).click();
  await page.getByLabel('Enter your team name').fill('Playwright Test');

  await page.getByRole('button', { name: 'Start Team!' }).click();

  await expect(page).toHaveURL(/team\/.*/);
  await expect(page.getByRole('heading', { name: 'Status' })).toBeVisible();
  await expect(page.getByText('Waiting for users...')).toBeVisible();
});

test('onboards as participant correctly', async ({ page }) => {
  const testTeamID = process.env.PLAYWRIGHT_TEST_TEAM_ID || '';
  await page.goto('/');

  await page.getByLabel('What is your name?').fill('Playwright Main');
  await expect(
    page.getByRole('button', { name: 'Join an existing team' }),
  ).toBeVisible();

  await page.getByRole('button', { name: 'Join an existing team' }).click();
  await page.getByLabel('Enter your Team ID').fill(testTeamID);

  await page.getByRole('button', { name: 'Join Team!' }).click();

  await expect(page.getByText('Currently pointing')).toBeVisible();
  await expect(page.getByText(`Team ID: ${testTeamID}`)).toBeVisible();
  await expect
    .poll(() => page.getByText('Playwright Multiplayer 1').count())
    .toBeGreaterThan(0);
});
