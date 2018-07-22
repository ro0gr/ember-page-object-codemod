import page from '/pages/page';

test('test', function(assert) {
    page.visit({ id });

    assert.ok(page.contains('some text'));
});
