"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var Lint = require("tslint");
var ts = require("typescript");
var _is_angular_decorator_1 = require("./_is-angular-decorator");
var tsutils_1 = require("tsutils");
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithWalker(new AngularDecoratorsOptionalWalker(sourceFile, 'angular-decorators-optional', null));
    };
    Rule.metadata = {
        ruleName: 'angular-decorators-optional',
        description: "Enforces @Output/@Input('#?') public some: string; to set optional field for 'some' property as bind is optional as well.",
        rationale: Lint.Utils.dedent(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n            In new Angular all optional bindings are marked just with\n            typescript '?' to set that they are optional.\n            So to avoid multiple error in future, better to mark fields\n            as optional with bindings.\n        "], ["\n            In new Angular all optional bindings are marked just with\n            typescript '?' to set that they are optional.\n            So to avoid multiple error in future, better to mark fields\n            as optional with bindings.\n        "]))),
        optionsDescription: 'Not configurable.',
        options: null,
        optionExamples: [true],
        type: 'typescript',
        typescriptOnly: true,
        codeExamples: [
            {
                description: "Enforces @Input('<?') public some?: string instead of @Input('<?') public some: string",
                config: Lint.Utils.dedent(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n\t\t\t\t\t\"rules\": { \"angular-decorators-optional\": true }\n\t\t\t\t"], ["\n\t\t\t\t\t\"rules\": { \"angular-decorators-optional\": true }\n\t\t\t\t"]))),
                pass: Lint.Utils.dedent(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n\t\t\t\t\tInput('<?') public some?: string;\n\t\t\t\t"], ["\n\t\t\t\t\tInput('<?') public some?: string;\n\t\t\t\t"]))),
                fail: Lint.Utils.dedent(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n\t\t\t\t\tInput('<?') public some: string;\n\t\t\t\t"], ["\n\t\t\t\t\tInput('<?') public some: string;\n\t\t\t\t"]))),
            },
            {
                description: "Enforces @Input('<?') public some?: string instead of @Input() public some?: string",
                config: Lint.Utils.dedent(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n\t\t\t\t\t\"rules\": { \"angular-decorators-optional\": true }\n\t\t\t\t"], ["\n\t\t\t\t\t\"rules\": { \"angular-decorators-optional\": true }\n\t\t\t\t"]))),
                pass: Lint.Utils.dedent(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n\t\t\t\t\tOutput('&?') public some?: () => void;\n\t\t\t\t"], ["\n\t\t\t\t\tOutput('&?') public some?: () => void;\n\t\t\t\t"]))),
                fail: Lint.Utils.dedent(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n\t\t\t\t\tOutput() public some?: () => void;\n\t\t\t\t"], ["\n\t\t\t\t\tOutput() public some?: () => void;\n\t\t\t\t"]))),
            },
        ],
    };
    Rule.OPTIONAL_BINDING_FAIL = "Binding should be marked as optional with '?' due to optional field";
    Rule.OPTIONAL_FIELD_FAIL = "Field should be marked as optional with '?' due to optional binding";
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
var AngularDecoratorsOptionalWalker = (function (_super) {
    __extends(AngularDecoratorsOptionalWalker, _super);
    function AngularDecoratorsOptionalWalker(sourceFile, ruleName, options) {
        var _this = _super.call(this, sourceFile, ruleName, options) || this;
        _this.checkNode = _this.checkNode.bind(_this);
        return _this;
    }
    AngularDecoratorsOptionalWalker.prototype.walk = function (sourceFile) {
        ts.forEachChild(sourceFile, this.checkNode);
    };
    AngularDecoratorsOptionalWalker.prototype.checkNode = function (node) {
        if (_is_angular_decorator_1.isAngularBindingDecorator(node)) {
            if (tsutils_1.isPropertyDeclaration(node.parent)) {
                this.validatePropertyDeclaration(node.parent, node);
            }
        }
        ts.forEachChild(node, this.checkNode);
    };
    AngularDecoratorsOptionalWalker.prototype.validatePropertyDeclaration = function (node, decoratorNode) {
        var isInitialized = !!node.initializer;
        var hasOptionalField = !!node.questionToken;
        var hasOptionalBinding = this.isOptionalBinding(decoratorNode);
        if (hasOptionalBinding && !hasOptionalField && !isInitialized) {
            this.addFailureAtNode(node, Rule.OPTIONAL_FIELD_FAIL);
        }
        if (hasOptionalField && !hasOptionalBinding) {
            this.addFailureAtNode(node, Rule.OPTIONAL_BINDING_FAIL);
        }
    };
    AngularDecoratorsOptionalWalker.prototype.isOptionalBinding = function (node) {
        return node.getText().includes('?');
    };
    return AngularDecoratorsOptionalWalker;
}(Lint.AbstractWalker));
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7;
