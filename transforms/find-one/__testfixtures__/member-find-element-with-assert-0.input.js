import { findElementWithAssert } from 'ember-cli-page-object/extend';

function testOne(po) {
    return po.findElementWithAssert(po)[0];
}