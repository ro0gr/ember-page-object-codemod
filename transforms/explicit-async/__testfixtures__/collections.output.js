import { aPage } from 'my-app/tests/pages';

const [ first ] = aPage.items;
const second = aPage.objectAt(1);
const third = aPage.items[2];

test('collection works', async function(assert) {
  await aPage.more[0].click();
  await first.click();
  await second.click();
  await third.more[0].click();
})
