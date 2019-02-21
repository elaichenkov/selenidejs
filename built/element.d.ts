import { By, WebElement } from 'selenium-webdriver';
import { Collection } from './collection';
import { Configuration } from './configuration';
import { Locator } from './locators/locator';
import { SearchContext } from './searchContext';
import { Assertable, Entity, Matchable } from './entity';
export declare class Element extends Entity implements SearchContext, Assertable, Matchable {
    private readonly locator;
    protected readonly configuration: Configuration;
    constructor(locator: Locator<Promise<WebElement>>, configuration: Configuration);
    toString(): string;
    getWebElement(): Promise<WebElement>;
    findWebElement(by: By): Promise<WebElement>;
    findWebElements(by: By): Promise<WebElement[]>;
    configuredWith(custom: Partial<Configuration>): Element;
    element(cssOrXpathOrBy: string | By): Element;
    readonly parent: Element;
    followingSibling(predicate?: string): Element;
    visibleElement(cssOrXpathOrBy: string | By): Element;
    all(cssOrXpathOrBy: string | By): Collection;
    executeScript(scriptOnThisWebElement: string, ...additionalArgs: any[]): Promise<{}>;
    click(): Promise<this>;
    setValue(value: string | number): Promise<this>;
    type(keys: string | number): Promise<this>;
    doubleClick(): Promise<this>;
    hover(): Promise<this>;
    contextClick(): Promise<this>;
    pressEnter(): Promise<this>;
    pressEscape(): Promise<this>;
    pressTab(): Promise<this>;
    scrollIntoView(): Promise<this>;
}
