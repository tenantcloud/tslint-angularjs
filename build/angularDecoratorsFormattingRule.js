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
var is_angular_decorator_1 = require("./helpers/is-angular-decorator");
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithWalker(new AngularDecoratorFormattingWalker(sourceFile, 'angular-decorators-formatting', null));
    };
    Rule.metadata = {
        ruleName: 'angular-decorators-formatting',
        description: "Enforces @Input() instead of @Input('<') OR @Output() instead of @Input('&') etc.",
        rationale: Lint.Utils.dedent(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n            In new Angular all extra stuff in @Input / @Output decorators\n            need to be removed. So to avoid cleaning in the future, better\n            to avoid @Input('<'), @Input('&') and @Output('&'),\n            because they all can be replaced with clean @Input()/@Output()\n            and will require no changes in new Angular version\n        "], ["\n            In new Angular all extra stuff in @Input / @Output decorators\n            need to be removed. So to avoid cleaning in the future, better\n            to avoid @Input('<'), @Input('&') and @Output('&'),\n            because they all can be replaced with clean @Input()/@Output()\n            and will require no changes in new Angular version\n        "]))),
        optionsDescription: 'Not configurable.',
        options: null,
        optionExamples: [true],
        type: 'formatting',
        typescriptOnly: true,
        codeExamples: [
            {
                description: "Enforces @Input() instead of @Input('<')",
                config: Lint.Utils.dedent(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n\t\t\t\t\t\"rules\": { \"angular-decorators-formatting\": true }\n\t\t\t\t"], ["\n\t\t\t\t\t\"rules\": { \"angular-decorators-formatting\": true }\n\t\t\t\t"]))),
                pass: Lint.Utils.dedent(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n\t\t\t\t\t@Input() public max: number;\n\t\t\t\t"], ["\n\t\t\t\t\t@Input() public max: number;\n\t\t\t\t"]))),
                fail: Lint.Utils.dedent(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n\t\t\t\t\t@Input('<') public max: number;\n\t\t\t\t"], ["\n\t\t\t\t\t@Input('<') public max: number;\n\t\t\t\t"]))),
            },
            {
                description: "Enforces @Output() instead of @Output('&') and @Input('&')",
                config: Lint.Utils.dedent(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n\t\t\t\t\t\"rules\": { \"angular-decorators-formatting\": true }\n\t\t\t\t"], ["\n\t\t\t\t\t\"rules\": { \"angular-decorators-formatting\": true }\n\t\t\t\t"]))),
                pass: Lint.Utils.dedent(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n\t\t\t\t\t@Output() public success: () => void;\n\t\t\t\t\t@Output() public error: () => void;\n\t\t\t\t"], ["\n\t\t\t\t\t@Output() public success: () => void;\n\t\t\t\t\t@Output() public error: () => void;\n\t\t\t\t"]))),
                fail: Lint.Utils.dedent(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n\t\t\t\t\t@Input('&') public success: () => void;\n\t\t\t\t\t@Output('&') public error: () => void;\n\t\t\t\t"], ["\n\t\t\t\t\t@Input('&') public success: () => void;\n\t\t\t\t\t@Output('&') public error: () => void;\n\t\t\t\t"]))),
            },
        ],
    };
    Rule.INPUT_CLEAR_FAIL = "@Input('<') should be replaced with @Input()";
    Rule.OUTPUT_CLEAR_FAIL = "@Output('&') should be replaced with @Output()";
    Rule.INPUT_TO_OUTPUT_FAIL = "@Input('&') should be replaced with @Output()";
    Rule.INPUT_TO_OUTPUT_OPTIONAL_FAIL = "@Input('&?') should be replaced with @Output('&?')";
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
var AngularDecoratorFormattingWalker = (function (_super) {
    __extends(AngularDecoratorFormattingWalker, _super);
    function AngularDecoratorFormattingWalker(sourceFile, ruleName, options) {
        var _this = _super.call(this, sourceFile, ruleName, options) || this;
        _this.checkNode = _this.checkNode.bind(_this);
        return _this;
    }
    AngularDecoratorFormattingWalker.prototype.walk = function (sourceFile) {
        ts.forEachChild(sourceFile, this.checkNode);
    };
    AngularDecoratorFormattingWalker.prototype.checkNode = function (node) {
        if (is_angular_decorator_1.isAngularBindingDecorator(node)) {
            this.validateBinding(node);
        }
        ts.forEachChild(node, this.checkNode);
    };
    AngularDecoratorFormattingWalker.prototype.validateBinding = function (node) {
        if (node.getText().includes("@Input('<')")) {
            this.addFailureAtNode(node, Rule.INPUT_CLEAR_FAIL);
        }
        if (node.getText().includes("@Output('&')")) {
            this.addFailureAtNode(node, Rule.OUTPUT_CLEAR_FAIL);
        }
        if (node.getText().includes("@Input('&')")) {
            this.addFailureAtNode(node, Rule.INPUT_TO_OUTPUT_FAIL);
        }
        if (node.getText().includes("@Input('&?')")) {
            this.addFailureAtNode(node, Rule.INPUT_TO_OUTPUT_OPTIONAL_FAIL);
        }
    };
    return AngularDecoratorFormattingWalker;
}(Lint.AbstractWalker));
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7;
