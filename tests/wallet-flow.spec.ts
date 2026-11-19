import { test, expect } from '@playwright/test';

test('full wallet flow: login → home → nueva transacción → comprobante', async ({ page }) => {
  await test.step('Login', async () => {
    await page.goto('/');
    await page.getByTestId('go-login-button').click();
    await page.getByTestId('login-user-input').fill('oscar@gmail.com');
    await page.getByTestId('login-password-input').fill('12345678');
    await page.getByTestId('login-submit-button').click();
    await page.waitForURL('**/home', { timeout: 15_000 });
  });

  await test.step('Home', async () => {
    await expect(page.getByTestId('user-name')).toBeVisible();
    await expect(page.getByTestId('user-balance')).toBeVisible();
    await page.getByTestId('new-transaction-button').click();
    await page.waitForURL('**/transactions');
  });

  await test.step('Nueva transacción', async () => {
    await page.getByTestId('transaction-amount-input').fill('25');
    await page.getByTestId('transaction-reason-input').fill('Pago GTA6');
    await expect(
      page.getByRole('option', { name: 'hector' }),
    ).toBeAttached();
    await page.getByTestId('contact-select').selectOption('1');
    await page.getByTestId('transaction-submit-button').click();
  });

  await test.step('Confirmación', async () => {
    const modal = page.getByTestId('confirm-transaction-modal');
    await expect(modal).toContainText('Cantidad');
    await expect(modal).toContainText('$25');
    await expect(modal).toContainText('Contacto');
    await expect(modal).toContainText('hector');
    await page.getByTestId('confirm-transaction-button').click();
    await page.waitForURL('**/transactions/confirmation/201/**', {
      timeout: 15_000,
    });
  });

  await test.step('Comprobante', async () => {
    await expect(page.getByTestId('confirmation-title')).toContainText(
      'exitosa',
    );
    await expect(page.getByTestId('detail-table')).toContainText('$25');
    await expect(page.getByTestId('detail-table')).toContainText('Pago GTA6');
    await expect(page.getByTestId('detail-table')).toContainText('hector');
  });
  await test.step('Home', async () => {
    await expect(page.getByTestId('back-to-transactions-button')).toBeVisible();
    await page.getByTestId('back-to-transactions-button').click();
    await page.waitForURL('**/transactions');
    await expect(page.getByTestId('spin-logo')).toBeVisible();
    await page.getByTestId('spin-logo').click();
    await expect(page.getByTestId('user-name')).toBeVisible();
    await expect(page.getByTestId('user-balance')).toBeVisible();
  });
});
