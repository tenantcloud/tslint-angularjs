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
var tsutils_1 = require("tsutils");
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithWalker(new BanGlobalLodashWalker(sourceFile, 'ban-global-lodash', null));
    };
    Rule.metadata = {
        ruleName: 'ban-global-lodash',
        description: 'Enforces to import lodash function from lodash instead of global _.',
        rationale: Lint.Utils.dedent(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n            To avoid whole lodash lib to be bundled\n        "], ["\n            To avoid whole lodash lib to be bundled\n        "]))),
        optionsDescription: 'Not configurable.',
        options: null,
        optionExamples: [true],
        type: 'maintainability',
        typescriptOnly: false,
        codeExamples: [
            {
                description: "Enforces to import { isArray } from 'lodash'",
                config: Lint.Utils.dedent(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n\t\t\t\t\t\"rules\": { \"ban-global-lodash\": true }\n\t\t\t\t"], ["\n\t\t\t\t\t\"rules\": { \"ban-global-lodash\": true }\n\t\t\t\t"]))),
                pass: Lint.Utils.dedent(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n\t\t\t\t\timport { isArray } from 'lodash'\n\n\t\t\t\t\tfunction getData(data: number[] | number): number[] {\n\t\t\t\t\t\tif(isArray(data)) {\n\t\t\t\t\t\t\treturn data;\n\t\t\t\t\t\t}\n\n\t\t\t\t\t\treturn [data];\n\t\t\t\t\t}\n\t\t\t\t"], ["\n\t\t\t\t\timport { isArray } from 'lodash'\n\n\t\t\t\t\tfunction getData(data: number[] | number): number[] {\n\t\t\t\t\t\tif(isArray(data)) {\n\t\t\t\t\t\t\treturn data;\n\t\t\t\t\t\t}\n\n\t\t\t\t\t\treturn [data];\n\t\t\t\t\t}\n\t\t\t\t"]))),
                fail: Lint.Utils.dedent(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n\t\t\t\t\tfunction getData(data: number[] | number): number[] {\n\t\t\t\t\t\tif(_.isArray(data)) {\n\t\t\t\t\t\t\treturn data;\n\t\t\t\t\t\t}\n\n\t\t\t\t\t\treturn [data];\n\t\t\t\t\t}\n\t\t\t\t"], ["\n\t\t\t\t\tfunction getData(data: number[] | number): number[] {\n\t\t\t\t\t\tif(_.isArray(data)) {\n\t\t\t\t\t\t\treturn data;\n\t\t\t\t\t\t}\n\n\t\t\t\t\t\treturn [data];\n\t\t\t\t\t}\n\t\t\t\t"]))),
            },
        ],
    };
    Rule.FAILURE_STRING = function (lodashFunctionName) {
        return "\"" + lodashFunctionName + "\" should be imported from 'lodash'";
    };
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
var BanGlobalLodashWalker = (function (_super) {
    __extends(BanGlobalLodashWalker, _super);
    function BanGlobalLodashWalker(sourceFile, ruleName, options) {
        var _this = _super.call(this, sourceFile, ruleName, options) || this;
        _this.checkNode = _this.checkNode.bind(_this);
        return _this;
    }
    BanGlobalLodashWalker.prototype.walk = function (sourceFile) {
        ts.forEachChild(sourceFile, this.checkNode);
    };
    BanGlobalLodashWalker.prototype.checkNode = function (node) {
        if (tsutils_1.isPropertyAccessExpression(node)) {
            this.validate(node);
        }
        ts.forEachChild(node, this.checkNode);
    };
    BanGlobalLodashWalker.prototype.validate = function (node) {
        if (node.getText().includes('_.')) {
            var lodashFunctionName = node.getText().replace('_.', '');
            this.addFailureAtNode(node, Rule.FAILURE_STRING(lodashFunctionName));
        }
    };
    return BanGlobalLodashWalker;
}(Lint.AbstractWalker));
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
