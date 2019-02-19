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

import { WebElement } from 'selenium-webdriver';
import { CollectionCondition, ElementCondition } from './conditions';
import { Configuration } from './configuration';
import { Element } from './element';
import { ByIndexWebElementLocator } from './locators/byIndexWebElementLocator';
import { CashedWebElementLocator } from './locators/cashedWebElementLocator';
import { FilteredByConditionWebElementsLocator } from './locators/filteredByConditionWebElementsLocator';
import { Locator } from './locators/locator';
import { Condition, Query, Wait } from './wait';
import { Assertable, Entity, Matchable } from './entity';

export class Collection extends Entity implements Assertable, Matchable {

    // private readonly wait: Wait<Collection>;

    constructor(private readonly locator: Locator<Promise<WebElement[]>>,
                private readonly configuration: Configuration) {
        super(configuration.timeout, configuration.onFailureHooks);
        this.locator = locator;
        this.configuration = configuration;
        // this.wait = new Wait(this, this.configuration.timeout, this.configuration.onFailureHooks);
    }

    configuredWith(custom: Partial<Configuration>): Collection {
        return new Collection(this.locator, new Configuration({ ...this.configuration, ...custom }));
    }

    // todo: should not we move it to queries?, or rename to asCashedArray() ?
    async getAsCashedArray(): Promise<Element[]> {
        return (await this.getWebElements())
            .map((it, index) => new Element(
                new CashedWebElementLocator(it, `${this}[${index}]`), this.configuration)
            );
    }

    elementAt(index: number): Element {
        return new Element(new ByIndexWebElementLocator(index, this), this.configuration);
    }

    /*
     * todo: should we implement collection.first() as getter? i.e. collection.first ?
     * here we should think, because in future we might want to implement method to return
     * a collection subset, i.e. "first n elements"...
     * then we might need first(count: number?)...
     * yet we can name it as take(count: number)
     * then no problem with first as getter... need to think... but probably define it before
     * release 1.0
     */
    first(): Element {
        return this.elementAt(0);
    }

    filteredBy(...conditions: ElementCondition[]): Collection { // todo: think on renaming to filteredBy
        if (conditions.length === 0) {
            return this; // todo: consider throwing error
        }
        const condition = conditions.length > 1 ?
            Condition.and(...conditions) :
            conditions[0];
        return new Collection(new FilteredByConditionWebElementsLocator(condition, this), this.configuration);
    }

    elementBy(...conditions: ElementCondition[]): Element {
        if (conditions.length === 0) {
            return this.first(); // todo: consider throwing error
        }
        const condition = conditions.length > 1 ?
            Condition.and(...conditions) :
            conditions[0];
        return new Collection(new FilteredByConditionWebElementsLocator(condition, this), this.configuration)
            .elementAt(0);  // todo: implement through separate ByFind...Locator
    }

    async getWebElements(): Promise<WebElement[]> {
        return this.locator.find();
    }

    toString() {
        return this.locator.toString();
    }
}
