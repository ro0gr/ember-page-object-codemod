const { getParser } = require('codemod-cli').jscodeshift;

module.exports = function transformer(file, api) {
  const j = getParser(api);

  return j(file.source)
    .find(j.CallExpression)
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
    p.node.callee.type === 'MemberExpression'
    && !parentIsACall(p)
    && !hasClosest(p, parentIsACall, 'BlockStatement')
    && !hasClosest(p, p => p.node.type === 'AwaitExpression');

  return isSuspicious;
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
