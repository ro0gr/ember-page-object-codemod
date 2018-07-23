# explicit-async

Converts all page object implicit async actions(old testing style) to the explicit async actions(ember@3 testing style).

## Usage

```
npx ember-page-object-codemod explicit-async ./tests/**/*-test.js ./tests/pages

# or

yarn global add ember-page-object-codemod
ember-page-object-codemod explicit-async ./tests/**/*-test.js ./tests/pages
```

## Input / Output

<!--FIXTURES_TOC_START-->
* [arrow-test](#arrow-test)
* [class](#class)
* [collections](#collections)
* [definition](#definition)
* [destruction](#destruction)
* [nesting](#nesting)
* [test](#test)
* [with-chaining](#with-chaining)
<!--FIXTURES_TOC_END-->

<!--FIXTURES_CONTENT_START-->
---
<a id="arrow-test">**arrow-test**</a>

**Input** (<small>[arrow-test.input.js](transforms/explicit-async/__testfixtures__/arrow-test.input.js)</small>):
```js
import page from '/pages/page';

test('test', (assert) => {
    page.visit({ id });
});

```

**Output** (<small>[arrow-test.input.js](transforms/explicit-async/__testfixtures__/arrow-test.output.js)</small>):
```js
import page from '/pages/page';

test('test', async assert => {
    await page.visit({ id });
});

```
---
<a id="class">**class**</a>

**Input** (<small>[class.input.js](transforms/explicit-async/__testfixtures__/class.input.js)</small>):
```js
export default {
    member() {
        p.aCall();
        p.a.aCall();
    },

    thisMember() {
        this.aCall();
        this.a.aCall();
    },

    inCallExpression() {
        eq(A.as());
    }
}
  
```

**Output** (<small>[class.input.js](transforms/explicit-async/__testfixtures__/class.output.js)</small>):
```js
export default {
    async member() {
        await p.aCall();
        await p.a.aCall();
    },

    async thisMember() {
        await this.aCall();
        await this.a.aCall();
    },

    inCallExpression() {
        eq(A.as());
    }
}
  
```
---
<a id="collections">**collections**</a>

**Input** (<small>[collections.input.js](transforms/explicit-async/__testfixtures__/collections.input.js)</small>):
```js
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

```

**Output** (<small>[collections.input.js](transforms/explicit-async/__testfixtures__/collections.output.js)</small>):
```js
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

```
---
<a id="definition">**definition**</a>

**Input** (<small>[definition.input.js](transforms/explicit-async/__testfixtures__/definition.input.js)</small>):
```js
export default {
    scope: '.selector',

    act() {
        this.click();
    },

    subComponent: {
        scope: '.sub-selector',

        act(value) {
            this.focus();
            this.fillIn(value);
        }
    }
};
```

**Output** (<small>[definition.input.js](transforms/explicit-async/__testfixtures__/definition.output.js)</small>):
```js
export default {
    scope: '.selector',

    async act() {
        await this.click();
    },

    subComponent: {
        scope: '.sub-selector',

        async act(value) {
            await this.focus();
            await this.fillIn(value);
        }
    }
};
```
---
<a id="destruction">**destruction**</a>

**Input** (<small>[destruction.input.js](transforms/explicit-async/__testfixtures__/destruction.input.js)</small>):
```js
import aPage from 'my-app/tests/pages';

test('destruction works', function(assert) {
  const { aComponent } = aPage;

  aComponent.click();
})

```

**Output** (<small>[destruction.input.js](transforms/explicit-async/__testfixtures__/destruction.output.js)</small>):
```js
import aPage from 'my-app/tests/pages';

test('destruction works', async function(assert) {
  const { aComponent } = aPage;

  await aComponent.click();
})

```
---
<a id="nesting">**nesting**</a>

**Input** (<small>[nesting.input.js](transforms/explicit-async/__testfixtures__/nesting.input.js)</small>):
```js
import A from 'somewhere';
import complexPage from '../pages';

let items = A(['a', 'b']);

test('complex collection with a nested scope', function(assert) {
    const aCollection = complexPage.items.objectAt(0).subitems.objectAt(0).subbitems.objectAt(0);

    items.forEach(function(i) {
        aCollection.click(i);
    });
});


```

**Output** (<small>[nesting.input.js](transforms/explicit-async/__testfixtures__/nesting.output.js)</small>):
```js
import A from 'somewhere';
import complexPage from '../pages';

let items = A(['a', 'b']);

test('complex collection with a nested scope', function(assert) {
    const aCollection = complexPage.items.objectAt(0).subitems.objectAt(0).subbitems.objectAt(0);

    items.forEach(async function(i) {
        await aCollection.click(i);
    });
});

```
---
<a id="test">**test**</a>

**Input** (<small>[test.input.js](transforms/explicit-async/__testfixtures__/test.input.js)</small>):
```js
import page from '/pages/page';

test('test', function(assert) {
    page.visit({ id });

    assert.ok(page.contains('some text'));
});

```

**Output** (<small>[test.input.js](transforms/explicit-async/__testfixtures__/test.output.js)</small>):
```js
import page from '/pages/page';

test('test', async function(assert) {
    await page.visit({ id });

    assert.ok(page.contains('some text'));
});
```
---
<a id="with-chaining">**with-chaining**</a>

**Input** (<small>[with-chaining.input.js](transforms/explicit-async/__testfixtures__/with-chaining.input.js)</small>):
```js
export default {
    scope: '.selector',

    act() {
        this.focus().blur();
    }
}
```

**Output** (<small>[with-chaining.input.js](transforms/explicit-async/__testfixtures__/with-chaining.output.js)</small>):
```js
export default {
    scope: '.selector',

    async act() {
        await this.focus().blur();
    }
}
```
<!--FIXTURE_CONTENT_END-->