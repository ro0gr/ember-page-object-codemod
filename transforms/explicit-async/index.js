const j = require('jscodeshift').withParser('babel'); 

const KNOWN_SYNC_METHODS = [
  'render',
  'setContext',
  'removeContext',
  'useNativeEvents',

  // collection
  'objectAt',
  'toArray',
  'map',
  'mapBy',
  'filter',
  'forEach'
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
    let context = rootObject(closestVarDeclarator.node.init);

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
  while (scope) {
    let local = scope.getBindings()[context.name];
    if (local) {
      return local[local.length - 1];
    }

    scope = scope.parent;
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
    && !KNOWN_SYNC_METHODS.includes(p.node.callee.property.name);

  return isSuspicious;
}
              
function rootObject(callee) {
  if (callee.type === 'Identifier') {
    return callee;
  }

  if (!callee || (!callee.object && !callee.callee)) {
    throw new Error('Must be a callee or init')
  }

  let object = callee;
  while (object) {
    if (object.type === 'CallExpression') {
      if (object.callee) {
        return rootObject(object.callee);
      } 
    } else if (object.object) {
      object = object.object;
    } else {

      // type=Identifier
      return object;
    }
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
