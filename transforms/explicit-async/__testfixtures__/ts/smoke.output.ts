import A from 'somewhere';
import aPage from 'my-app/tests/pages';

let items = A(['a', 'b']);

test('destruction works', async function(assert) {
  const { aComponent } = aPage;

  await aComponent.click();
})

test('complex collection with a nested scope', function(assert) {
  const aCollection = aPage.items.objectAt(0).subitems.objectAt(0).subbitems.objectAt(0);

  items.forEach(async function(i) {
      await aCollection.click(i);
  });
});
