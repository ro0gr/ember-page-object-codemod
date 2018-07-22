import page from '/pages/page';

test('test', async function(assert) {
    await page.visit({ id });

    assert.ok(page.contains('some text'));
});