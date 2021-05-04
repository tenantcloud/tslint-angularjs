# @tenantcloud/tslint-angularjs

A set of additional TSLint rules used on tenantcloud project in order to help with angularjs => angular migration and other discussed styleguide rules.

# Install

```
yarn add -D @tenantcloud/tslint-angularjs
```

Change your `tslint.json` file to extend the rules:

```
"extends": [
    ...
    "@tenantcloud/tslint-angularjs"
    ...
],
```

and explicity turn on desired rules (all are off by default)
