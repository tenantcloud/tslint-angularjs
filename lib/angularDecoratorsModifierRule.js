"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
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
exports.Rule = void 0;
var Lint = require("tslint");
var ts = require("typescript");
var tsutils_1 = require("tsutils");
var _is_angular_decorator_1 = require("./_is-angular-decorator");
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithWalker(new AngularDecoratorsModifierWalker(sourceFile, 'angular-decorators-modifier', null));
    };
    Rule.metadata = {
        ruleName: 'angular-decorators-modifier',
        description: 'Enforces bindings to be always public and mutable (without readonly).',
        rationale: Lint.Utils.dedent(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n            In new Angular all binding is public and mutable.\n            In other case there are no reason for binding and it will error.\n        "], ["\n            In new Angular all binding is public and mutable.\n            In other case there are no reason for binding and it will error.\n        "]))),
        optionsDescription: 'Not configurable.',
        options: null,
        optionExamples: [true],
        type: 'typescript',
        typescriptOnly: true,
        codeExamples: [
            {
                description: 'Enforces @Input() public some: string instead of @Input() private some: string',
                config: Lint.Utils.dedent(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n\t\t\t\t\t\"rules\": { \"angular-decorators-modifier\": true }\n\t\t\t\t"], ["\n\t\t\t\t\t\"rules\": { \"angular-decorators-modifier\": true }\n\t\t\t\t"]))),
                pass: Lint.Utils.dedent(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n\t\t\t\t\tInput() public some: string;\n\t\t\t\t"], ["\n\t\t\t\t\tInput() public some: string;\n\t\t\t\t"]))),
                fail: Lint.Utils.dedent(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n\t\t\t\t\tInput() private some: string;\n\t\t\t\t"], ["\n\t\t\t\t\tInput() private some: string;\n\t\t\t\t"]))),
            },
            {
                description: 'Enforces @Input() public some: string instead of @Input() public readonly some: string',
                config: Lint.Utils.dedent(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n\t\t\t\t\t\"rules\": { \"angular-decorators-modifier\": true }\n\t\t\t\t"], ["\n\t\t\t\t\t\"rules\": { \"angular-decorators-modifier\": true }\n\t\t\t\t"]))),
                pass: Lint.Utils.dedent(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n\t\t\t\t\tInput() public some: string;\n\t\t\t\t"], ["\n\t\t\t\t\tInput() public some: string;\n\t\t\t\t"]))),
                fail: Lint.Utils.dedent(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n\t\t\t\t\tInput() public readonly some: string;\n\t\t\t\t"], ["\n\t\t\t\t\tInput() public readonly some: string;\n\t\t\t\t"]))),
            },
        ],
    };
    Rule.ACCESS_MODIFIER_FAIL = "Declaration with angular binding decorator should be public";
    Rule.READONLY_FAIL = "Readonly declarations with angular binding decorator are not allowed";
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
var AngularDecoratorsModifierWalker = (function (_super) {
    __extends(AngularDecoratorsModifierWalker, _super);
    function AngularDecoratorsModifierWalker(sourceFile, ruleName, options) {
        var _this = _super.call(this, sourceFile, ruleName, options) || this;
        _this.checkNode = _this.checkNode.bind(_this);
        return _this;
    }
    AngularDecoratorsModifierWalker.prototype.walk = function (sourceFile) {
        ts.forEachChild(sourceFile, this.checkNode);
    };
    AngularDecoratorsModifierWalker.prototype.checkNode = function (node) {
        if ((0, _is_angular_decorator_1.isAngularBindingDecorator)(node)) {
            if ((0, tsutils_1.isPropertyDeclaration)(node.parent)) {
                this.validatePropertyDeclaration(node.parent);
            }
        }
        ts.forEachChild(node, this.checkNode);
    };
    AngularDecoratorsModifierWalker.prototype.validatePropertyDeclaration = function (node) {
        var privateKeyword = (0, tsutils_1.getModifier)(node, ts.SyntaxKind.PrivateKeyword);
        var protectedKeyword = (0, tsutils_1.getModifier)(node, ts.SyntaxKind.ProtectedKeyword);
        var readonlyKeyword = (0, tsutils_1.getModifier)(node, ts.SyntaxKind.ReadonlyKeyword);
        if (privateKeyword) {
            var start = privateKeyword.end - 'private'.length;
            this.addFailure(start, privateKeyword.end, Rule.ACCESS_MODIFIER_FAIL);
        }
        if (protectedKeyword) {
            var start = protectedKeyword.end - 'protected'.length;
            this.addFailure(start, protectedKeyword.end, Rule.ACCESS_MODIFIER_FAIL);
        }
        if (readonlyKeyword) {
            var start = readonlyKeyword.end - 'readonly'.length;
            this.addFailure(start, readonlyKeyword.end, Rule.READONLY_FAIL);
        }
    };
    return AngularDecoratorsModifierWalker;
}(Lint.AbstractWalker));
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7;
