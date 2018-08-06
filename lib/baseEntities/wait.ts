//Copyright 2018 Knowledge Expert SA
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

import {Configuration} from "./config/configuration";
import {Condition} from "../conditions/condition";
import {Driver} from "./driver";
import {Element} from "./element";
import {Collection} from "./collection";


export class Wait<T extends Driver | Element | Collection> {

    readonly configuration: Configuration;
    readonly entity: T;
    readonly selenideDriver: Driver;

    constructor(entity: T, config: Configuration) {
        this.configuration = config;
        this.entity = entity;
        this.selenideDriver = entity['driver'] ? entity['driver'] : entity as Driver;
    }

    async shouldMatch(condition: Condition<T>, timeout = this.configuration.timeout): Promise<T> {
        return await this.until(condition, timeout, true);
    }

    async isMatch(condition: Condition<T>, timeout = this.configuration.timeout): Promise<boolean> {
        return !!await this.until(condition, timeout, false);
    }

    private async until(condition: Condition<T>, timeout: number, throwError: boolean): Promise<T> {

        const finishTime = new Date().getTime() + timeout;
        let lastError: Error;

        do {
            try {
                return await condition.matches(this.entity);
            } catch (error) {
                lastError = error;
            }
        } while (new Date().getTime() < finishTime);

        if (throwError) {
            lastError.message = `${this.entity.toString()}\n\tshould ${lastError.message}\n\tWait timed out after ${timeout}ms`;

            for (let func of this.configuration.onFailureHooks) {
                try {
                    await func(lastError, this.entity, condition);
                } catch (error) {
                    console.error(`Cannot perform hook '${func.toString()}' function cause of:\n\tError message: ${error.message}\n\tError stacktrace: ${error.stackTrace}`);
                }
            }
            throw lastError;
        }
        return this.entity;

    }
}