const j = require('jscodeshift').withParser('babel'); 

const knownSyncMethods = [
  'setContext',
  'removeContext',
  'useNativeEvents',
  'objectAt'
];

module.exports = function transformer(file) {
  const ast = j(file.source);

  const r = ast.find(j.CallExpression)
    .filter(isPageObjectCall)
    .filter(isLikeImplicitActionCall)
    .forEach(p => {
      const methodDefinition = findClosest(p, p => [
        'ObjectMethod',
        'FunctionExpression',
        'ArrowFunctionExpression'
      ].includes(p.node.type));

      if (methodDefinition) {
        methodDefinition.node.async = true;

        p.replace(j.awaitExpression(p.node));
      }
    });

  return r.toSource();
}

function isPageObjectCall(p) {
  if (p.node.callee.type !== 'MemberExpression') {
    return false;
  }

  const object = rootObject(p.node.callee);
  if (isPageObject(object, p)) {
    return true;
  }

  // call inside a definition
  return hasClosest(p, p => p.node.type === 'ObjectExpression');
}

function isPageObject(object, p) {
  const binding = findBinding(p.scope, object);
  if (!binding) {
    return false;
  }

  if (isCreateAssignment(binding.parent)) {
    return true;
  }

  if (binding.parent.node.type === 'ArrayPattern'
    && binding.parent.parent.node.type === 'VariableDeclarator'
  ) {
    const context = rootObject(binding.parent.parent.node.init);
    return isPageObject(context, binding.parent.parent);
  }

  const closestVarDeclarator = findClosest(binding, p => p.node.type === 'VariableDeclarator');
  if (closestVarDeclarator) { 
    let context;
    if (closestVarDeclarator.node.init.type === 'Identifier') {
      context = closestVarDeclarator.node.init;
    } else {
      context = closestVarDeclarator.node.init.callee
        ? rootObject(closestVarDeclarator.node.init.callee)
        : rootObject(closestVarDeclarator.node.init);
    }

    return isPageObject(context, binding.parent);
  }
  
  if (binding.parent.parent.node.type === 'ImportDeclaration') {
    return binding.parent.parent.node.source.value.includes('/pages');
  }

  return false;
}

function isCreateAssignment(p) {
  if (
    p.node.type === 'VariableDeclarator'
    && p.node.init.type === 'CallExpression'
    && p.node.init.callee.name === 'create'
  ) {
    return true;
  }

  return false;
}

function findBinding(scope, context) {
  let local = scope.getBindings()[context.name];
  if (local) {
    return local[local.length - 1];
  }

  let global = scope.getGlobalScope().getBindings()[context.name]
  if (global) {
    return global[global.length - 1];
  }
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
function isLikeImplicitActionCall(p) {
  const isSuspicious =
    // if PO method is called inside another call, most likely it's an assertion.
    // skip it:
    // `assert.ok(po.contains('something'))`
    !parentIsACall(p) 
    && !hasClosest(p, parentIsACall, 'BlockStatement')
    // skip explicitly async methods
    && !hasClosest(p, p => p.node.type === 'AwaitExpression')
    // exceptional PO methods
    && !knownSyncMethods.includes(p.node.callee.property.name);

  return isSuspicious;
}

function rootObject(callee) {
  if (!callee || !callee.object) {
    throw new Error('Must be a callee or init')
  }

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
