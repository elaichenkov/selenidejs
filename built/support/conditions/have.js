"use strict";
// Copyright 2018 Knowledge Expert SA
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
Object.defineProperty(exports, "__esModule", { value: true });
const conditions_1 = require("../../conditions");
var have;
(function (have) {
    // todo: refactor to arrow const versions
    have.visibleElement = (locator) => conditions_1.condition.element.hasVisibleElement(locator);
    have.exactText = (value /* | number*/) => conditions_1.condition.element.hasExactText(value);
    have.text = (value /* | number*/) => conditions_1.condition.element.hasText(value);
    // todo: do we really need this "optionality" of attributeValue, i.e. one super condition instead of two?
    /* ... - no, we do not
     * here is why... look at this example:
     * element.should(have.attribute('class', 'green'));
     * if you read it, like in real English, you will never guess, that it will be compared by "contains"
     * because naturally a native speaker will understand it as "exact comparison".
     * Ok, we can rename:
     * element.should(have.attributeContaining('class', 'green'));
     * but how then understand this:
     * element.should(have.attributeContaining('class'));
     * o_O?
     * in english it will sound like "there should be an element with some of attributes
     * that contains "class" text in the value
     * ;)
     * This why, if we want to keep things "naturally readable and understandable", we have to separate...
     * and keep things simple...
     **/
    have.attribute = (name) => conditions_1.condition.element.hasAttribute(name);
    have.attributeWithValue = (attributeName, attributeValue /* | number*/) => conditions_1.condition.element.hasAttributeWithValue(attributeName, attributeValue);
    have.attributeWithValueContaining = (attributeName, attributeValue /* | number*/) => conditions_1.condition.element.hasAttributeWithValueContaining(attributeName, attributeValue);
    have.value = (value /* | number*/) => conditions_1.condition.element.hasValue(value);
    have.valueContaining = (expected /* | number*/) => conditions_1.condition.element.hasValueContaining(expected);
    have.cssClass = (cssClass) => conditions_1.condition.element.hasCssClass(cssClass);
    have.size = (size) => conditions_1.condition.collection.hasSize(size);
    have.texts = (...texts) => conditions_1.condition.collection.hasTexts(texts);
    have.exactTexts = (...texts) => conditions_1.condition.collection.hasExactTexts(texts);
    have.url = (url) => conditions_1.condition.browser.hasUrl(url);
    // todo: what about inUrl?
    /*
     * compare:
     * browser.should(have.inUrl('main-page'));
     * VS
     * browser.should(have.urlContaining('main-page'));
     * or...
     * browser.should(have.textInUrl('main-page'));
     */
    have.urlContaining = (urlPart) => conditions_1.condition.browser.hasUrlContaining(urlPart);
    have.title = (expected) => conditions_1.condition.browser.hasTitle(expected);
    have.titleContaining = (titlePart) => conditions_1.condition.browser.hasTitleContaining(titlePart);
    have.tabsNumber = (num) => conditions_1.condition.browser.hasTabsNumber(num);
    have.tabsNumberLessThan = (num) => conditions_1.condition.browser.hasTabsNumberLessThan(num);
    have.tabsNumberMoreThan = (num) => conditions_1.condition.browser.hasTabsNumberMoreThan(num);
    have.jsReturnedTrue = (script) => conditions_1.condition.browser.hasJsReturnedTrue(script);
})(have = exports.have || (exports.have = {}));
//# sourceMappingURL=have.js.map