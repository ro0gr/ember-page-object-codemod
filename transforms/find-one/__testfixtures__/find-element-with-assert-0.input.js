import { findElementWithAssert } from 'ember-cli-page-object';

function testOne(po) {
    return findElementWithAssert(po)[0];
}