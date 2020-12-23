# multiple

Migrates from using `multiple: true`.

Note: `multiple: true` can be migrated only at some conditions.
See examples below for details.

## Usage

```
npx ember-page-object-codemod multiple path/of/files/ or/some**/*glob.js

# or

yarn global add ember-page-object-codemod
ember-page-object-codemod multiple path/of/files/ or/some**/*glob.js
```

## Input / Outpuut

<!--FIXTURES_TOC_START-->
* [multiple-attribute](#multiple-attribute)
* [multiple-boolean](#multiple-boolean)
* [multiple-clickable](#multiple-clickable)
* [multiple-default](#multiple-default)
* [multiple-has-class](#multiple-has-class)
* [multiple-imports](#multiple-imports)
* [multiple-nested](#multiple-nested)
* [multiple-not-has-class](#multiple-not-has-class)
* [multiple-property](#multiple-property)
* [multiple-text](#multiple-text)
* [multiple-value](#multiple-value)
* [multiple-with-collection-imported](#multiple-with-collection-imported)
* [multiple-with-text-imported](#multiple-with-text-imported)
* [no-multiple](#no-multiple)
* [no-page-object](#no-page-object)
<!--FIXTURES_TOC_END-->

<!--FIXTURES_CONTENT_START-->
---
<a id="multiple-attribute">**multiple-attribute**</a>

**Input** (<small>[multiple-attribute.input.js](transforms/multiple/__testfixtures__/multiple-attribute.input.js)</small>):
```js
import { create, attribute } from 'ember-cli-page-object';

const page = create({
  scope: 'div',
  checked: attribute('checked', '.tags', { multiple: true })
});

```

**Output** (<small>[multiple-attribute.output.js](transforms/multiple/__testfixtures__/multiple-attribute.output.js)</small>):
```js
import { create, attribute, collection } from 'ember-cli-page-object';

const page = create({
  scope: 'div',

  _checked: collection('.tags', {
    checked: attribute('checked')
  }),

  checked: {
    isDescriptor: true,

    get: function() {
      return this._checked.map((el) => el.checked);
    }
  }
});

```
---
<a id="multiple-boolean">**multiple-boolean**</a>

**Input** (<small>[multiple-boolean.input.js](transforms/multiple/__testfixtures__/multiple-boolean.input.js)</small>):
```js
import { create, isVisible, isHidden, isPresent } from 'ember-cli-page-object';

const page = create({
  spansArePresent: isPresent('span', { multiple: true }),
  spansAreVisible: isVisible('span', { multiple: true }),
  spansAreHidden: isHidden('span', { multiple: true })
});

```

**Output** (<small>[multiple-boolean.output.js](transforms/multiple/__testfixtures__/multiple-boolean.output.js)</small>):
```js
import { create, isVisible, isHidden, isPresent } from 'ember-cli-page-object';

const page = create({
  spansArePresent: isPresent('span'),
  spansAreVisible: isVisible('span'),
  spansAreHidden: isHidden('span')
});

```
---
<a id="multiple-clickable">**multiple-clickable**</a>

**Input** (<small>[multiple-clickable.input.js](transforms/multiple/__testfixtures__/multiple-clickable.input.js)</small>):
```js
import { create, clickable } from 'ember-cli-page-object';

const page = create({
  scope: 'div',
  clickTag: clickable('.tag', { multiple: true })
});

```

**Output** (<small>[multiple-clickable.output.js](transforms/multiple/__testfixtures__/multiple-clickable.output.js)</small>):
```js
import { create, clickable } from 'ember-cli-page-object';

const page = create({
  scope: 'div',
  clickTag: clickable('.tag', { multiple: true })
});

```
---
<a id="multiple-default">**multiple-default**</a>

**Input** (<small>[multiple-default.input.js](transforms/multiple/__testfixtures__/multiple-default.input.js)</small>):
```js
import { property } from 'ember-cli-page-object';

export default {
  scope: 'div',
  disabled: property('disabled', '.tags', { multiple: true })
};

```

**Output** (<small>[multiple-default.output.js](transforms/multiple/__testfixtures__/multiple-default.output.js)</small>):
```js
import { property, collection } from 'ember-cli-page-object';

export default {
  scope: 'div',

  _disabled: collection('.tags', {
    disabled: property('disabled')
  }),

  disabled: {
    isDescriptor: true,

    get: function() {
      return this._disabled.map((el) => el.disabled);
    }
  }
};

```
---
<a id="multiple-has-class">**multiple-has-class**</a>

**Input** (<small>[multiple-has-class.input.js](transforms/multiple/__testfixtures__/multiple-has-class.input.js)</small>):
```js
import { create, hasClass } from 'ember-cli-page-object';

const page = create({
  scope: 'div',
  messagesAreSuccessful: hasClass('success', 'span', { multiple: true })
});

```

**Output** (<small>[multiple-has-class.output.js](transforms/multiple/__testfixtures__/multiple-has-class.output.js)</small>):
```js
import { create, hasClass, collection } from 'ember-cli-page-object';

const page = create({
  scope: 'div',

  _messagesAreSuccessful: collection('span', {
    messagesAreSuccessful: hasClass('success')
  }),

  messagesAreSuccessful: {
    isDescriptor: true,

    get: function() {
      return this._messagesAreSuccessful.map((el) => el.messagesAreSuccessful);
    }
  }
});

```
---
<a id="multiple-imports">**multiple-imports**</a>

**Input** (<small>[multiple-imports.input.js](transforms/multiple/__testfixtures__/multiple-imports.input.js)</small>):
```js
import { create, isPresent } from 'ember-cli-page-object';
import { text } from 'ember-cli-page-object';

const page = create({
  scope: 'div',
  tags: text('.tags', { multiple: true }),
  titlePresent: isPresent('.title')
});

```

**Output** (<small>[multiple-imports.output.js](transforms/multiple/__testfixtures__/multiple-imports.output.js)</small>):
```js
import { create, isPresent, collection } from 'ember-cli-page-object';

const page = create({
  scope: 'div',
  _tags: collection('.tags'),
  titlePresent: isPresent('.title'),

  tags: {
    isDescriptor: true,

    get: function() {
      return this._tags.map((el) => el.text);
    }
  }
});

```
---
<a id="multiple-nested">**multiple-nested**</a>

**Input** (<small>[multiple-nested.input.js](transforms/multiple/__testfixtures__/multiple-nested.input.js)</small>):
```js
import { attribute } from 'ember-cli-page-object';

const NestedPage = {
  test: attribute('src', '.tags', { multiple: true })
};

export default {
  nested: {
    test: attribute('src', '.tags', { multiple: true })
  },
  nested2: NestedPage
};

```

**Output** (<small>[multiple-nested.output.js](transforms/multiple/__testfixtures__/multiple-nested.output.js)</small>):
```js
import { attribute, collection } from 'ember-cli-page-object';

const NestedPage = {
  _test: collection('.tags', {
    test: attribute('src')
  }),

  test: {
    isDescriptor: true,

    get: function() {
      return this._test.map((el) => el.test);
    }
  }
};

export default {
  nested: {
    _test: collection('.tags', {
      test: attribute('src')
    }),

    test: {
      isDescriptor: true,

      get: function() {
        return this._test.map((el) => el.test);
      }
    }
  },
  nested2: NestedPage
};

```
---
<a id="multiple-not-has-class">**multiple-not-has-class**</a>

**Input** (<small>[multiple-not-has-class.input.js](transforms/multiple/__testfixtures__/multiple-not-has-class.input.js)</small>):
```js
import { create, notHasClass } from 'ember-cli-page-object';

const page = create({
  scope: 'div',
  messagesAreUnsuccessful: notHasClass('success', 'span', { multiple: true })
});

```

**Output** (<small>[multiple-not-has-class.output.js](transforms/multiple/__testfixtures__/multiple-not-has-class.output.js)</small>):
```js
import { create, notHasClass, collection } from 'ember-cli-page-object';

const page = create({
  scope: 'div',

  _messagesAreUnsuccessful: collection('span', {
    messagesAreUnsuccessful: notHasClass('success')
  }),

  messagesAreUnsuccessful: {
    isDescriptor: true,

    get: function() {
      return this._messagesAreUnsuccessful.map((el) => el.messagesAreUnsuccessful);
    }
  }
});

```
---
<a id="multiple-property">**multiple-property**</a>

**Input** (<small>[multiple-property.input.js](transforms/multiple/__testfixtures__/multiple-property.input.js)</small>):
```js
import { create, property } from 'ember-cli-page-object';

const page = create({
  scope: 'div',
  disabled: property('disabled', '.tags', { multiple: true })
});

```

**Output** (<small>[multiple-property.output.js](transforms/multiple/__testfixtures__/multiple-property.output.js)</small>):
```js
import { create, property, collection } from 'ember-cli-page-object';

const page = create({
  scope: 'div',

  _disabled: collection('.tags', {
    disabled: property('disabled')
  }),

  disabled: {
    isDescriptor: true,

    get: function() {
      return this._disabled.map((el) => el.disabled);
    }
  }
});

```
---
<a id="multiple-text">**multiple-text**</a>

**Input** (<small>[multiple-text.input.js](transforms/multiple/__testfixtures__/multiple-text.input.js)</small>):
```js
import { create, text } from 'ember-cli-page-object';

const page = create({
  scope: 'div',
  tags: text('.tag', { multiple: true })
});

```

**Output** (<small>[multiple-text.output.js](transforms/multiple/__testfixtures__/multiple-text.output.js)</small>):
```js
import { create, collection } from 'ember-cli-page-object';

const page = create({
  scope: 'div',
  _tags: collection('.tag'),

  tags: {
    isDescriptor: true,

    get: function() {
      return this._tags.map((el) => el.text);
    }
  }
});

```
---
<a id="multiple-value">**multiple-value**</a>

**Input** (<small>[multiple-value.input.js](transforms/multiple/__testfixtures__/multiple-value.input.js)</small>):
```js
import { create, value } from 'ember-cli-page-object';

const page = create({
  scope: 'div',
  values: value('input', { multiple: true })
});

```

**Output** (<small>[multiple-value.output.js](transforms/multiple/__testfixtures__/multiple-value.output.js)</small>):
```js
import { create, collection } from 'ember-cli-page-object';

const page = create({
  scope: 'div',
  _values: collection('input'),

  values: {
    isDescriptor: true,

    get: function() {
      return this._values.map((el) => el.value);
    }
  }
});

```
---
<a id="multiple-with-collection-imported">**multiple-with-collection-imported**</a>

**Input** (<small>[multiple-with-collection-imported.input.js](transforms/multiple/__testfixtures__/multiple-with-collection-imported.input.js)</small>):
```js
import { create, text, collection } from 'ember-cli-page-object';

const page = create({
  scope: 'div',
  names: collection('.name'),
  tags: text('.tag', { multiple: true })
});

```

**Output** (<small>[multiple-with-collection-imported.output.js](transforms/multiple/__testfixtures__/multiple-with-collection-imported.output.js)</small>):
```js
import { create, collection } from 'ember-cli-page-object';

const page = create({
  scope: 'div',
  names: collection('.name'),
  _tags: collection('.tag'),

  tags: {
    isDescriptor: true,

    get: function() {
      return this._tags.map((el) => el.text);
    }
  }
});

```
---
<a id="multiple-with-text-imported">**multiple-with-text-imported**</a>

**Input** (<small>[multiple-with-text-imported.input.js](transforms/multiple/__testfixtures__/multiple-with-text-imported.input.js)</small>):
```js
import { create, text } from 'ember-cli-page-object';

const page = create({
  scope: 'div',
  name: text('.name'),
  tags: text('.tag', { multiple: true })
});

```

**Output** (<small>[multiple-with-text-imported.output.js](transforms/multiple/__testfixtures__/multiple-with-text-imported.output.js)</small>):
```js
import { create, text, collection } from 'ember-cli-page-object';

const page = create({
  scope: 'div',
  name: text('.name'),
  _tags: collection('.tag'),

  tags: {
    isDescriptor: true,

    get: function() {
      return this._tags.map((el) => el.text);
    }
  }
});

```
---
<a id="no-multiple">**no-multiple**</a>

**Input** (<small>[no-multiple.input.js](transforms/multiple/__testfixtures__/no-multiple.input.js)</small>):
```js
import { create, text } from 'ember-cli-page-object';

const page = create({
  scope: 'div',
  name: text('.name')
});

```

**Output** (<small>[no-multiple.output.js](transforms/multiple/__testfixtures__/no-multiple.output.js)</small>):
```js
import { create, text } from 'ember-cli-page-object';

const page = create({
  scope: 'div',
  name: text('.name')
});

```
---
<a id="no-page-object">**no-page-object**</a>

**Input** (<small>[no-page-object.input.js](transforms/multiple/__testfixtures__/no-page-object.input.js)</small>):
```js
import { attribute } from 'attribute';

export default {
  nested: {
    test: attribute('src', '.tags', { multiple: true })
  }
};

```

**Output** (<small>[no-page-object.output.js](transforms/multiple/__testfixtures__/no-page-object.output.js)</small>):
```js
import { attribute } from 'attribute';

export default {
  nested: {
    test: attribute('src', '.tags', { multiple: true })
  }
};

```
<!--FIXTURES_CONTENT_END-->
