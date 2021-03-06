# tslint-angularjs

A set of additional TSLint rules used on tenantcloud project in order to help with angularjs => angular migration and other discussed styleguide rules.

# Install

```
yarn add -D tenantcloud/tslint-angularjs
```

Change your `tslint.json` file to extend the rules:

```
"extends": [
    ...
    "tslint-angularjs"
    ...
],
```

**All rules are turn on by default**

# Rules

## `ban-global-lodash`

Enforces to import lodash functions instead of using them through globally _.

Example:

#### `GOOD`
```ts
import { isArray } from 'lodash-es';

function getData(data: number[] | number): number[] {
	if(isArray(data)) {
		return data;
	}

	return [data];
}
```

#### `FAIL`
```ts
function getData(data: number[] | number): number[] {
	if(_.isArray(data)) {
		return data;
	}

	return [data];
}
```

Example usage:

```json
{ "ban-global-lodash": true }
```

## `angular-injectors-order`

Enforces native angularJs injectors to go first.

Example:

```ts
class A {
	// Right order
	constructor($async, private $httpService, private HttpService: HttpService, someOther) {}
};

class A {
	// Wrong order (HttpService service go before $async and $httpService)
	constructor(private HttpService: HttpService, $async, private $httpService, someOther) {}
}
```

Example usage:

```json
{ "angular-injectors-formatting": true }
```

## `angular-decorators-formatting`

Enforces binding formatting:

-   `@Input()` instead of `@Input('<')`
-   `@Output()` instead of `@Output('&')` or `@Input('&')`
-   `@Output('&?')` instead of `@Input('&?')`

Example:

```ts
class A {
	@Input() public good: string;
	@Output() public good2: () => void;

	@Input('<') public bad: string; // not allowed
	@Input('&') public bad2: () => void; // not allowed
	@Output('&') public bad3: () => void; // not allowed
}
```

Example usage:

```json
{ "angular-decorators-formatting": true }
```

## `angular-decorators-modifier`

Enforces bindings to be always public and mutable (without readonly).

Example:

```ts
class A {
	@Input() public good: string;

	@Input() private bad: string; // not allowed
	@Input() public readonly bad2: string; // not allowed
}
```

Example usage:

```json
{ "angular-decorators-modifier": true }
```

## `angular-decorators-optional`

Enforces @Output('&?')/@Input('#?') public some; to set optional field for 'some' property as bind is optional as well.

Example:

```ts
class A {
	@Input('<?') public good?: string;
	@Input() public good2: string;

	@Input('<?') public bad: string; // not allowed
	@Input() public bad2?: string; // not allowed
}
```

Example usage:

```json
{ "angular-decorators-optional": true }
```
