const { getParser } = require('codemod-cli').jscodeshift;
const ROOT_SOURCE_PATH = 'ember-cli-page-object';
const EXTEND_SOURCE_PATH = 'ember-cli-page-object/extend';

const SUPPORTED_CALLEE_NAMES = ['create', 'collection'];

module.exports = function transformer(file, api) {
  const j = getParser(api);

  if (!findPageObjectDeclaration(j, file.source).length) {
    return file.source;
  }

  return findNodes(j, file.source)
    .replaceWith(nodePath => {
      const { node, parent } = nodePath;

      addGetterProperty(j, node, parent);
      transformProperty(j, node);

      return node;
    })
    .toSource();
}

function transformProperty(j, node) {
  let callExpression = node.value;
  let propName = node.key.name;

  let newArgs = callExpression.arguments.filter((argument) => (
    !expressionWithMultipleKeyword(j, argument)
  ));

  node.key.name = `_${propName}`;
  callExpression.callee.name = 'collection';
  callExpression.arguments = newArgs;
}

function addGetterProperty(j, node, parent) {
  let callExpression = node.value;
  let propName = node.key.name;

  let descriptorProperty = j.property(
    'init',
    j.identifier('isDescriptor'),
    j.literal(true)
  );

  let newCallExpression = j.callExpression(
    j.memberExpression(
      j.memberExpression(j.thisExpression(), j.identifier(`_${propName}`)),
      j.identifier('map')
    ),
    [
      j.arrowFunctionExpression(
        [ j.identifier('el') ],
        j.memberExpression(
          j.identifier('el'),
          j.identifier(callExpression.callee.name)
        )
      )
    ]
  );
  let getterProperty = j.property(
    'init',
    j.identifier('get'),
    j.functionExpression(
      null,
      [],
      j.blockStatement(
        [
          j.returnStatement(newCallExpression)
        ]
      ),
      false,
      false
    )
  );

  let objectExpression = j.objectExpression(
    [
      descriptorProperty,
      getterProperty
    ]
  );

  let newProperty = j.property(
    'init',
    j.identifier(propName),
    objectExpression
  );

  parent.node.properties.push(newProperty);
}

/*
 * Find page object properties with multiple keyword.
 * For example:
 *
 * ```
 * const page = create({
 *   scope: 'div',
 *   tags: text('.tag', { multiple: true })
 * });
 * ```
 *
 * Returns node: `tags: text('.tag', { multiple: true })`
 */
function findNodes(j, root) {
  // TODO: filter out nodes if they already have a corresponding underscored getter
  return j(root)
    .find(j.ObjectProperty)
    .filter(el => pageObjectPropertyWithMultipleKeyword(j, el));
}

function pageObjectPropertyWithMultipleKeyword(j, node) {
  let objectExpression = node.parent;
  let parentCallExpression = objectExpression.parent;

  // If parent expression is not call expression or is not supported call expression
  if (parentCallExpression.value.type !== j.CallExpression.name
      || !SUPPORTED_CALLEE_NAMES.includes(parentCallExpression.value.callee.name)) {
    return false;
  }

  let childCallExpression = node.value.value;
  // If property value is not call expression
  if (childCallExpression.type !== j.CallExpression.name) {
    return false;
  }

  // If there is an argument object expression with multiple keyword property
  return childCallExpression.arguments.some(el => expressionWithMultipleKeyword(j, el));
}

/*
 * Find object properties with multiple keyword only.
 */
function expressionWithMultipleKeyword(j, node) {
  if (node.type !== j.ObjectExpression.name) {
    return false;
  }

  if (node.properties.length != 1) {
    return false;
  }

  let objectProperty = node.properties[0];

  return objectProperty.key.type === j.Identifier.name
    && objectProperty.key.name === 'multiple';
}

function findPageObjectDeclaration(j, source) {
  return j(source)
    .find(j.ImportDeclaration)
    .filter(p => {
      return [EXTEND_SOURCE_PATH, ROOT_SOURCE_PATH].includes(p.value.source.value);
    });
}
