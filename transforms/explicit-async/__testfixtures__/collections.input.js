import { aPage } from 'my-app/tests/pages';

const [ first ] = aPage.items;
const second = aPage.objectAt(1);
const third = aPage.items[2];

test('collection works', function(assert) {
  aPage.more[0].click();
  first.click();
  second.click();
  third.more[0].click();
})
