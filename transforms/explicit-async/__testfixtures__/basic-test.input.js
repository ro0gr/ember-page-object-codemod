test('test', function(assert) {
    page.visit();

    assert.ok(page.isVisible);
});
