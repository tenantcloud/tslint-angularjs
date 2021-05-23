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
        return this.applyWithWalker(new AngularInjectorsOrderWalker(sourceFile, 'angular-injectors-order', null));
    };
    Rule.metadata = {
        ruleName: 'angular-injectors-order',
        description: 'Enforces native angularJs injectors to go first',
        rationale: Lint.Utils.dedent(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n            TenantCloud injectors order convention\n        "], ["\n            TenantCloud injectors order convention\n        "]))),
        optionsDescription: 'Not configurable.',
        options: null,
        optionExamples: [true],
        type: 'formatting',
        typescriptOnly: true,
        codeExamples: [
            {
                description: 'Enforces $httpService go first over custom HttpService',
                config: Lint.Utils.dedent(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n\t\t\t\t\t\"rules\": { \"angular-injectors-order\": true }\n\t\t\t\t"], ["\n\t\t\t\t\t\"rules\": { \"angular-injectors-order\": true }\n\t\t\t\t"]))),
                pass: Lint.Utils.dedent(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n\t\t\t\t\tconstructor(private $httpService, private HttpService) {}\n\t\t\t\t"], ["\n\t\t\t\t\tconstructor(private $httpService, private HttpService) {}\n\t\t\t\t"]))),
                fail: Lint.Utils.dedent(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n\t\t\t\t\tconstructor(private HttpService, private $httpService) {}\n\t\t\t\t"], ["\n\t\t\t\t\tconstructor(private HttpService, private $httpService) {}\n\t\t\t\t"]))),
            },
        ],
    };
    Rule.FAILURE_STRING = "Injectors with '$' should go first";
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
var AngularInjectorsOrderWalker = (function (_super) {
    __extends(AngularInjectorsOrderWalker, _super);
    function AngularInjectorsOrderWalker(sourceFile, ruleName, options) {
        var _this = _super.call(this, sourceFile, ruleName, options) || this;
        _this.checkNode = _this.checkNode.bind(_this);
        return _this;
    }
    AngularInjectorsOrderWalker.prototype.walk = function (sourceFile) {
        ts.forEachChild(sourceFile, this.checkNode);
    };
    AngularInjectorsOrderWalker.prototype.checkNode = function (node) {
        if (tsutils_1.isConstructorDeclaration(node) && this.isConstructorContains$Injectors(node.parameters)) {
            this.validateConstructorParameters(node.parameters);
        }
        ts.forEachChild(node, this.checkNode);
    };
    AngularInjectorsOrderWalker.prototype.validateConstructorParameters = function (parameters) {
        var _this = this;
        var schema = parameters.map(function (parameter) {
            return _this.is$Injector(parameter)
                ? AngularInjectorsOrderWalker.$INJECTOR
                : AngularInjectorsOrderWalker.CUSTOM_INJECTOR;
        });
        var validSchema = schema.slice().sort();
        if (JSON.stringify(schema) === JSON.stringify(validSchema)) {
            return;
        }
        var firstCustomInjectorIndex = schema.findIndex(function (item) { return item === AngularInjectorsOrderWalker.CUSTOM_INJECTOR; });
        schema.forEach(function (item, index) {
            if (firstCustomInjectorIndex >= index) {
                return;
            }
            if (item === AngularInjectorsOrderWalker.$INJECTOR) {
                _this.addFailureAtNode(parameters[index], Rule.FAILURE_STRING);
            }
        });
    };
    AngularInjectorsOrderWalker.prototype.isConstructorContains$Injectors = function (parameters) {
        return parameters.some(this.is$Injector);
    };
    AngularInjectorsOrderWalker.prototype.is$Injector = function (parameter) {
        return parameter.getText().includes('$');
    };
    AngularInjectorsOrderWalker.$INJECTOR = 1;
    AngularInjectorsOrderWalker.CUSTOM_INJECTOR = 0;
    return AngularInjectorsOrderWalker;
}(Lint.AbstractWalker));
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
