# find-one

Migrates from using `findElementWithAssert(` to `findOne(`.

Note: only `findElementWithAssert(...).get(0)` and `findElementWithAssert(...)[0]` forms are able to be migrated at the moment.

## Usage

```
npx ember-page-object-codemod find-one path/of/files/ or/some**/*glob.js

# or

yarn global add ember-page-object-codemod
ember-page-object-codemod find-one path/of/files/ or/some**/*glob.js
```

## Input / Output

<!--FIXTURES_TOC_START-->
* [default-import](#default-import)
* [find-element-with-assert-0](#find-element-with-assert-0)
* [find-element-with-assert-get-0](#find-element-with-assert-get-0)
* [find-element-with-assert](#find-element-with-assert)
* [member-find-element-with-assert-0](#member-find-element-with-assert-0)
<!--FIXTURES_TOC_END-->

<!--FIXTURES_CONTENT_START-->
---
<a id="default-import">**default-import**</a>

**Input** (<small>[default-import.input.js](transforms/find-one/__testfixtures__/default-import.input.js)</small>):
```js
import po, { findElementWithAssert } from 'ember-cli-page-object';

function test() {
    return po.create();
}
```

**Output** (<small>[default-import.output.js](transforms/find-one/__testfixtures__/default-import.output.js)</small>):
```js
import po from 'ember-cli-page-object';

function test() {
    return po.create();
}
```
---
<a id="find-element-with-assert-0">**find-element-with-assert-0**</a>

**Input** (<small>[find-element-with-assert-0.input.js](transforms/find-one/__testfixtures__/find-element-with-assert-0.input.js)</small>):
```js
import { findElementWithAssert } from 'ember-cli-page-object';

function testOne(po) {
    return findElementWithAssert(po)[0];
}
```

**Output** (<small>[find-element-with-assert-0.output.js](transforms/find-one/__testfixtures__/find-element-with-assert-0.output.js)</small>):
```js
import { findOne } from "ember-cli-page-object/extend";

function testOne(po) {
    return findOne(po);
}
```
---
<a id="find-element-with-assert-get-0">**find-element-with-assert-get-0**</a>

**Input** (<small>[find-element-with-assert-get-0.input.js](transforms/find-one/__testfixtures__/find-element-with-assert-get-0.input.js)</small>):
```js
import { findElementWithAssert } from 'ember-cli-page-object/extend';

function testOne(po) {
    return findElementWithAssert(po).get(0);
}
```

**Output** (<small>[find-element-with-assert-get-0.output.js](transforms/find-one/__testfixtures__/find-element-with-assert-get-0.output.js)</small>):
```js
import { findOne } from 'ember-cli-page-object/extend';

function testOne(po) {
    return findOne(po);
}
```
---
<a id="find-element-with-assert">**find-element-with-assert**</a>

**Input** (<small>[find-element-with-assert.input.js](transforms/find-one/__testfixtures__/find-element-with-assert.input.js)</small>):
```js
import { findElementWithAssert } from 'ember-cli-page-object';

function testOne(po) {
    return findElementWithAssert(po);
}
```

**Output** (<small>[find-element-with-assert.output.js](transforms/find-one/__testfixtures__/find-element-with-assert.output.js)</small>):
```js
import { findElementWithAssert } from 'ember-cli-page-object';

function testOne(po) {
    return findElementWithAssert(po);
}
```
---
<a id="member-find-element-with-assert-0">**member-find-element-with-assert-0**</a>

**Input** (<small>[member-find-element-with-assert-0.input.js](transforms/find-one/__testfixtures__/member-find-element-with-assert-0.input.js)</small>):
```js
import { findElementWithAssert } from 'ember-cli-page-object/extend';

function testOne(po) {
    return po.findElementWithAssert(po)[0];
}
```

**Output** (<small>[member-find-element-with-assert-0.output.js](transforms/find-one/__testfixtures__/member-find-element-with-assert-0.output.js)</small>):
```js
function testOne(po) {
    return po.findElementWithAssert(po)[0];
}
```
<!--FIXTURES_CONTENT_END-->