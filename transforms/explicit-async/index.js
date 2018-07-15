const { getParser } = require('codemod-cli').jscodeshift;

module.exports = function transformer(file, api) {
  const j = getParser(api);

  file.source = `import { create } from 'ember-cli-page-object';

  export default create({
    a() {
      this.a();
    }
  });
`;

  const root = j(file.source);

  let importedPages = [];
  root.find(j.ImportDeclaration, (p) => {
    return p.source.value.includes('/pages');
  }).forEach(i => {
    importedPages = importedPages.concat(
      i.node.specifiers.map(spec => spec.local.name)
    );
  });

  function isPageObjectCall(p) {
    if (p.node.callee.type !== 'MemberExpression') {
      return false;
    }

    return p.node.callee.object && importedPages.includes(
      calleeRootObject(p.node.callee).name
    );
  }

  return root.find(j.CallExpression)
    .filter(isPageObjectCall)
    .filter(isSuspiciousCall)
    .forEach(p => {
      const methodDefinition = findClosest(p, p => [
        'ObjectMethod',
        'FunctionExpression'
      ].includes(p.node.type));

      if (methodDefinition) {
        methodDefinition.node.async = true;

        p.replace(j.awaitExpression(p.node));
      }
    })
    .toSource();
}

/*
```
// ignore:
{
  async a() { await a.b() },

  a() { eq(a.b()); } }
}

// transform:
{
  a() { a.b() }
}
```
*/
function isSuspiciousCall(p) {
  const isSuspicious =
    !parentIsACall(p)
    && !hasClosest(p, parentIsACall)
    && !hasClosest(p, p => p.node.type === 'AwaitExpression');

  return isSuspicious;
}

function calleeRootObject(callee) {
  let object = callee.object;
  while (object.object) {
    object = object.object;
  }

  return object;
}

function parentIsACall(p) {
  return p.parent.node.type === 'CallExpression';
}

function hasClosest() {
  return !!findClosest(...arguments);
}

function findClosest(path, predicate, untilType) {
  let parent = path.parent;

  while (parent) {
    if (untilType && parent.node.type === untilType) {
      return null;
    }

    if (predicate(parent) === true) {
      return parent;
    }

    parent = parent.parent;
  }
}
