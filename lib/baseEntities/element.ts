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

import { Locator } from './locators/locator';
import { ByWebElementsLocator } from './locators/byWebElementsLocator';
import { ByWebElementLocator } from './locators/byWebElementLocator';
import { By, Key, WebElement } from 'selenium-webdriver';
import { be } from '../conditions/helpers/be';
import { With } from '../locators/with';
import { Driver } from "./driver";
import { Wait } from "./wait";
import { Condition } from "../conditions/condition";
import { ElementCondition } from "../conditions/elementCondition";
import { Collection } from "./collection";
import { Click } from "../commands/click";
import { ClickByJs } from "../commands/clickByJs";
import { SetValue } from "../commands/setValue";
import { SetValueByJs } from "../commands/setValueByJs";
import { SendKeys } from "../commands/sendKeys";
import { DoubleClick } from "../commands/doubleClick";
import { Hover } from "../commands/hover";
import { ContextClick } from "../commands/contextClick";
import { PressKey } from "../commands/pressKey";
import { ScrollIntoView } from "../commands/scrollIntoView";
import { PerformActionOnVisible } from "../commands/performActionOnVisible";
import { ElementActionHooks } from "./elementActionHooks";
import { BeforeElementActionHook } from "./beforeElementActionHook";
import { AfterElementActionHook } from "./afterElementActionHook";


export class Element {

    public static beforeActionHooks: BeforeElementActionHook[] = [];
    public static afterActionHooks: AfterElementActionHook[] = [];

    readonly driver: Driver;
    private readonly locator: Locator<Promise<WebElement>>;
    private readonly wait: Wait<Element>;

    constructor(locator: Locator<Promise<WebElement>>, driver: Driver) {
        this.locator = locator;
        this.driver = driver;
        this.wait = new Wait(this, driver.config);
    }

    @ElementActionHooks
    async click() {
        await new PerformActionOnVisible().perform(this, 'click', new Click().perform);
    }

    @ElementActionHooks
    async clickByJS() {
        await new PerformActionOnVisible().perform(this, 'clickByJs', new ClickByJs().perform);
    }

    @ElementActionHooks
    async setValue(value: string | number) {
        await new PerformActionOnVisible().perform(this, 'setValue', new SetValue().perform, value);
    }

    @ElementActionHooks
    async setValueByJS(value: string | number) {
        await new PerformActionOnVisible().perform(this, 'setValueByJS', new SetValueByJs().perform, value);
    }

    @ElementActionHooks
    async sendKeys(value: string | number) {
        await new PerformActionOnVisible().perform(this, 'sendKeys', new SendKeys().perform, value);
    }

    @ElementActionHooks
    async doubleClick() {
        await new PerformActionOnVisible().perform(this, 'doubleClick', new DoubleClick().perform);
    }

    @ElementActionHooks
    async hover() {
        await new PerformActionOnVisible().perform(this, 'hover', new Hover().perform);
    }

    @ElementActionHooks
    async contextClick() {
        await new PerformActionOnVisible().perform(this, 'contextClick', new ContextClick().perform);
    }

    @ElementActionHooks
    async pressEnter() {
        await new PerformActionOnVisible().perform(this, 'pressEnter', new PressKey().perform, Key.ENTER);
    }

    @ElementActionHooks
    async pressEscape() {
        await new PerformActionOnVisible().perform(this, 'pressEscape', new PressKey().perform, Key.ESCAPE);
    }

    @ElementActionHooks
    async pressTab() {
        await new PerformActionOnVisible().perform(this, 'pressTab', new PressKey().perform, Key.TAB);
    }

    @ElementActionHooks
    async scrollIntoView() {
        await new PerformActionOnVisible().perform(this, 'scrollIntoView', new ScrollIntoView().perform);
    }

    async should(condition: ElementCondition, timeout?: number): Promise<Element> {
        return await this.wait.shouldMatch(condition, timeout);
    }

    async shouldNot(condition: ElementCondition): Promise<Element> {
        return await this.should(Condition.not(condition));
    }

    async is(condition: ElementCondition, timeout?: number): Promise<boolean> {
        return await this.wait.isMatch(condition, timeout);
    }

    async isNot(condition: ElementCondition): Promise<boolean> {
        return await this.is(Condition.not(condition));
    }

    async isVisible(): Promise<boolean> {
        return await (await this.getWebElement()).isDisplayed();
    }

    async isPresent(): Promise<boolean> {
        try {
            return !!(await this.getWebElement());
        } catch (ignored) {
            return false;
        }
    }

    async isAbsent(): Promise<boolean> {
        return !(await this.isPresent());
    }

    async value(): Promise<string> {
        return await (await this.getWebElement()).getAttribute('value');
    }

    async text(): Promise<string> {
        await this.should(be.visible);
        return await (await this.getWebElement()).getText();
    }

    async attribute(attributeName: string): Promise<string> {
        return await (await this.getWebElement()).getAttribute(attributeName);
    }

    async innerHtml(): Promise<string> {
        return await this.attribute('innerHTML');
    }

    async outerHtml(): Promise<string> {
        return await this.attribute('outerHTML');
    }

    async getWebElement(): Promise<WebElement> {
        return await this.locator.find();
    }

    private async fireEvent(...events: string[]) {
        //usage - await this.fireEvent('focus', 'keydown', 'keypress', 'input', 'keyup', 'change', 'blur');
        const jsCodeToTriggerEvent: string =
            `(function() {
                var webElement = arguments[0];
                var eventNames = arguments[1];
                for (var i = 0; i < eventNames.length; i++) {
                    if (document.createEventObject) {
                        var evt = document.createEventObject();
                        webElement.fireEvent('on' + eventNames[i], evt);
                    } else {
                        var evt = document.createEvent('HTMLEvents');
                        evt.initEvent(eventNames[i], true, true );
                        webElement.dispatchEvent(evt);
                    }
                }
            })();`;

        try {
            await this.driver.executeScript(jsCodeToTriggerEvent, await this.getWebElement(), events);
        } catch (error) {
            console.log(`Failed to trigger events ${events}: ${error.message}`);
        }
    }

    parent(): Element {
        return this.element(With.xpath('./..'));
    }

    followingSibling(predicate: string = ''): Element {
        return this.element(With.xpath('./following-sibling::*' + predicate));
    }

    element(cssOrXpathOrBy: string | By): Element {
        const by = (typeof cssOrXpathOrBy === 'string')
            ? cssOrXpathOrBy.includes('/') ? With.xpath(cssOrXpathOrBy) : With.css(cssOrXpathOrBy)
            : cssOrXpathOrBy;
        const locator = new ByWebElementLocator(by, this);
        return new Element(locator, this.driver);
    }


    visibleElement(cssSelector: string): Element {
        return this.all(cssSelector).findBy(be.visible);
    }

    all(cssOrXpathOrBy: string | By): Collection {
        const by = (typeof cssOrXpathOrBy === 'string')
            ? cssOrXpathOrBy.includes('/') ? With.xpath(cssOrXpathOrBy) : With.css(cssOrXpathOrBy)
            : cssOrXpathOrBy;
        const locator = new ByWebElementsLocator(by, this);
        return new Collection(locator, this.driver);
    }

    toString(): string {
        return this.locator.toString();
    }
}
