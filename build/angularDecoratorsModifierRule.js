"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rule = void 0;
var tslib_1 = require("tslib");
var Lint = require("tslint");
var ts = require("typescript");
var tsutils_1 = require("tsutils");
var is_angular_decorator_1 = require("./helpers/is-angular-decorator");
var Rule = /** @class */ (function (_super) {
    tslib_1.__extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithWalker(new AngularDecoratorsModifierWalker(sourceFile, 'angular-decorators-modifier', null));
    };
    Rule.metadata = {
        ruleName: 'angular-decorators-modifier',
        description: 'Enforces bindings to be always public.',
        rationale: Lint.Utils.dedent(templateObject_1 || (templateObject_1 = tslib_1.__makeTemplateObject(["\n            In new Angular all binding is public.\n            In other case there are no reason for binding and it will error.\n        "], ["\n            In new Angular all binding is public.\n            In other case there are no reason for binding and it will error.\n        "]))),
        optionsDescription: 'Not configurable.',
        options: null,
        optionExamples: [true],
        type: 'typescript',
        typescriptOnly: true,
        codeExamples: [
            {
                description: 'Enforces @Input() public some: string instead of @Input() private some: string',
                config: Lint.Utils.dedent(templateObject_2 || (templateObject_2 = tslib_1.__makeTemplateObject(["\n\t\t\t\t\t\"rules\": { \"angular-decorators-modifier\": true }\n\t\t\t\t"], ["\n\t\t\t\t\t\"rules\": { \"angular-decorators-modifier\": true }\n\t\t\t\t"]))),
                pass: Lint.Utils.dedent(templateObject_3 || (templateObject_3 = tslib_1.__makeTemplateObject(["\n\t\t\t\t\tInput() public some: string;\n\t\t\t\t\tInput('<?') public other?: string;\n\t\t\t\t"], ["\n\t\t\t\t\tInput() public some: string;\n\t\t\t\t\tInput('<?') public other?: string;\n\t\t\t\t"]))),
                fail: Lint.Utils.dedent(templateObject_4 || (templateObject_4 = tslib_1.__makeTemplateObject(["\n\t\t\t\t\tInput() private some: string;\n\t\t\t\t\tInput('<?') private other?: string;\n\t\t\t\t"], ["\n\t\t\t\t\tInput() private some: string;\n\t\t\t\t\tInput('<?') private other?: string;\n\t\t\t\t"]))),
            },
        ],
    };
    Rule.FAILURE_STRING = "Declaration with angular binding decorator should be public";
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
var AngularDecoratorsModifierWalker = /** @class */ (function (_super) {
    tslib_1.__extends(AngularDecoratorsModifierWalker, _super);
    function AngularDecoratorsModifierWalker(sourceFile, ruleName, options) {
        var _this = _super.call(this, sourceFile, ruleName, options) || this;
        _this.checkNode = _this.checkNode.bind(_this);
        return _this;
    }
    AngularDecoratorsModifierWalker.prototype.walk = function (sourceFile) {
        ts.forEachChild(sourceFile, this.checkNode);
    };
    AngularDecoratorsModifierWalker.prototype.checkNode = function (node) {
        if (tsutils_1.isPropertyDeclaration(node.parent) && is_angular_decorator_1.isAngularBindingDecorator(node)) {
            this.validatePropertyDeclaration(node.parent);
        }
        ts.forEachChild(node, this.checkNode);
    };
    AngularDecoratorsModifierWalker.prototype.validatePropertyDeclaration = function (node) {
        var privateKeyword = tsutils_1.getModifier(node, ts.SyntaxKind.PrivateKeyword);
        var protectedKeyword = tsutils_1.getModifier(node, ts.SyntaxKind.ProtectedKeyword);
        if (privateKeyword || protectedKeyword) {
            this.addFailureAtNode(node, Rule.FAILURE_STRING);
        }
    };
    return AngularDecoratorsModifierWalker;
}(Lint.AbstractWalker));
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
