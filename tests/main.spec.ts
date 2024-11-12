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
    .poll(() => page.getByText('Playwright Main').count())
    .toBeGreaterThan(0);
});

test('returning to a team as an admin', async ({ page }) => {
  const testTeamID = process.env.PLAYWRIGHT_TEST_TEAM_ID || '';
  await page.goto(`/`);

  await page.evaluate(() => {
    localStorage.setItem('clientID', 'playwright-test');
    localStorage.setItem('name', 'Playwright Main');
  });

  await page.goto(`/team/${testTeamID}`);

  await expect(page.getByText('What are you pointing?')).toBeVisible();
});

test('admin and participant stay in sync through cycles of usage', async ({
  page,
  browser,
}) => {
  await page.goto(`/`);

  await page.getByLabel('What is your name?').fill('Playwright 1');
  await page.getByRole('button', { name: 'Start a new team' }).click();
  await page.getByLabel('Enter your team name').fill('Playwright Test');
  await page.getByRole('button', { name: 'Start Team!' }).click();

  const testTeamID = await page.getByTestId('teamID').textContent();

  const secondContext = await browser.newContext();
  const secondPage = await secondContext.newPage();

  await secondPage.goto('/');

  await secondPage.evaluate(() => {
    localStorage.setItem('clientID', 'playwright-test-2');
    localStorage.setItem('name', 'Playwright 2');
  });

  await secondPage.goto(`/team/${testTeamID}`);

  await secondPage.getByRole('button', { name: '3 3' }).click();

  await expect(secondPage.getByText('check_circle')).toBeVisible();
  await expect(page.getByText('check_circle')).toBeVisible();

  await page.getByLabel('What are you pointing?').fill('Test StoryID');
  await page.getByRole('button', { name: 'Save' }).click();
  await expect(secondPage.getByText('Test StoryID')).toBeVisible();

  await page.getByRole('button', { name: 'Show Points' }).click();
  await expect(
    page.getByRole('button', { name: 'Point Next Story' }),
  ).toBeVisible();
  await expect(secondPage.getByText('3Playwright 2')).toBeVisible();

  await page.getByRole('button', { name: 'Point Next Story' }).click();
  await expect(page.locator('svg')).toBeVisible();
  await expect(secondPage.locator('svg')).toBeVisible();

  await secondContext.close();
});
