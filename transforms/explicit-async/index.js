const { getParser } = require('codemod-cli').jscodeshift;

module.exports = function transformer(file, api) {
  const j = getParser(api);

  const ast = j(file.source);

  let importedPages = [];
  ast.find(j.ImportDeclaration, (p) => {
    // @todo: improve to check if the
    // full import path is inside the pages dir
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

    const callRootObject = calleeRootObject(p.node.callee);
    if (callRootObject && importedPages.includes(callRootObject.name)) {
      return true;
    }

    return hasClosest(p, p => p.node.type === 'ObjectExpression');
  }

  return ast.find(j.CallExpression)
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
    && !hasClosest(p, parentIsACall, 'BlockStatement')
    && !hasClosest(p, p => p.node.type === 'AwaitExpression');

  return isSuspicious;
}

function calleeRootObject(callee) {
  let object = callee.object;
  while (object && object.object) {
    object = object.object;
  }

  return object;
}

function parentIsACall(p) {
  return p.parent && p.parent.node.type === 'CallExpression';
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
