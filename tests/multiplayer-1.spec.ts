import { expect, test } from '@playwright/test';

test('joins team and sees other participants', async ({ page }, testInfo) => {
  const testTeamID = process.env.PLAYWRIGHT_TEST_TEAM_ID || '';
  await page.goto('/');

  await page.getByLabel('What is your name?').fill('Playwright Multiplayer 1');
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

  const screenshot = await page.screenshot();
  await testInfo.attach('screenshot-multiplayer', {
    body: screenshot,
    contentType: 'image/png',
  });
});
