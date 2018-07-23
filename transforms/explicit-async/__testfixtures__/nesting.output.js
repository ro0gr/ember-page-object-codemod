import A from 'somewhere';
import complexPage from '../pages';

let items = A(['a', 'b']);

test('complex collection with a nested scope', function(assert) {
    const aCollection = complexPage.items.objectAt(0).subitems.objectAt(0).subbitems.objectAt(0);

    items.forEach(async function(i) {
        await aCollection.click(i);
    });
});
