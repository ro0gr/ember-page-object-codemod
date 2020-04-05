import A from 'somewhere';
import aPage from 'my-app/tests/pages';

let items = A(['a', 'b']);

test('destruction works', function(assert) {
  const { aComponent } = aPage;

  aComponent.click();
})

test('complex collection with a nested scope', function(assert) {
  const aCollection = aPage.items.objectAt(0).subitems.objectAt(0).subbitems.objectAt(0);

  items.forEach(function(i) {
      aCollection.click(i);
  });
});

