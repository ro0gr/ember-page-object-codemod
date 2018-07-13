test('test', async function(assert) {
    await page.visit();

    assert.ok(page.isVisible);
});