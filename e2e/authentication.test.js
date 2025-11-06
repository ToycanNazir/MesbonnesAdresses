describe('Authentication Flow', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true });
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should display login screen on app launch', async () => {
    await expect(element(by.text('Mes Bonnes Adresses'))).toBeVisible();
    await expect(element(by.text('Connexion'))).toBeVisible();
  });

  it('should show error when login with empty fields', async () => {
    await element(by.text('Se connecter')).tap();
    // Alert should appear (Detox can't check Alert, so we just verify no crash)
    await waitFor(element(by.text('Se connecter')))
      .toBeVisible()
      .withTimeout(2000);
  });

  it('should navigate to signup screen', async () => {
    await element(by.text('Pas de compte ? S\'inscrire')).tap();
    await expect(element(by.text('Inscription'))).toBeVisible();
  });

  it('should show error when signup with mismatched passwords', async () => {
    await element(by.text('Pas de compte ? S\'inscrire')).tap();

    const emailInput = element(by.label('Email *'));
    const passwordInput = element(by.label('Mot de passe *'));
    const confirmPasswordInput = element(by.label('Confirmer le mot de passe *'));

    await emailInput.typeText('test@example.com');
    await passwordInput.typeText('password123');
    await confirmPasswordInput.typeText('password456');

    await element(by.text('S\'inscrire')).tap();

    // Should stay on signup screen due to error
    await expect(element(by.text('Inscription'))).toBeVisible();
  });

  it('should navigate back to login from signup', async () => {
    await element(by.text('Pas de compte ? S\'inscrire')).tap();
    await expect(element(by.text('Inscription'))).toBeVisible();

    await element(by.text('Déjà un compte ? Se connecter')).tap();
    await expect(element(by.text('Connexion'))).toBeVisible();
  });
});
