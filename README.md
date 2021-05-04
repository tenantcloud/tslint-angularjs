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

and explicity turn on desired rules (all are off by default)

# Rules

## `angular-decorators-formatting`

Enforces binding formatting:
* `@Input()` instead of `@Input('<')`
* `@Output()` instead of `@Output('&')` or `@Input('&')`
* `@Output('&?')` instead of `@Input('&?')`

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
