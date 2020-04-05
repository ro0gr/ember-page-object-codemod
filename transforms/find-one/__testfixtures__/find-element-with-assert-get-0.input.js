import { findElementWithAssert } from 'ember-cli-page-object/extend';

function testOne(po) {
    return findElementWithAssert(po).get(0);
}