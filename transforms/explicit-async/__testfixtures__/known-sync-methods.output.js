import aPage from 'my-app/tests/pages';

test('should not be affected', async function(assert) {
  aPage.render();
  aPage.setContext();
  aPage.removeContext();
  aPage.useNativeEvents();
  aPage.objectAt();
  aPage.toArray();
  aPage.map();
  aPage.mapBy();
  aPage.forEach();
  aPage.filter();
})
