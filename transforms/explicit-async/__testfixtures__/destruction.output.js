import aPage from 'my-app/tests/pages';

test('destruction works', async function(assert) {
  const { aComponent } = aPage;

  await aComponent.click();
})
