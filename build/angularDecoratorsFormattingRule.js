"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rule = void 0;
var tslib_1 = require("tslib");
var Lint = require("tslint");
var ts = require("typescript");
var is_angular_decorator_1 = require("./helpers/is-angular-decorator");
var Rule = /** @class */ (function (_super) {
    tslib_1.__extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithWalker(new AngularDecoratorFormattingWalker(sourceFile, 'angular-decorators-formatting', null));
    };
    Rule.metadata = {
        ruleName: 'angular-decorators-formatting',
        description: "Enforces @Input() instead of @Input('<') OR @Output() instead of @Input('&') etc.",
        rationale: Lint.Utils.dedent(templateObject_1 || (templateObject_1 = tslib_1.__makeTemplateObject(["\n            In new Angular all extra stuff in @Input / @Output decorators\n            need to be removed. So to avoid cleaning in the future, better\n            to avoid @Input('<'), @Input('&') and @Output('&'),\n            because they all can be replaced with clean @Input()/@Output()\n            and will require no changes in new Angular version\n        "], ["\n            In new Angular all extra stuff in @Input / @Output decorators\n            need to be removed. So to avoid cleaning in the future, better\n            to avoid @Input('<'), @Input('&') and @Output('&'),\n            because they all can be replaced with clean @Input()/@Output()\n            and will require no changes in new Angular version\n        "]))),
        optionsDescription: 'Not configurable.',
        options: null,
        optionExamples: [true],
        type: 'formatting',
        typescriptOnly: true,
        codeExamples: [
            {
                description: "Enforces @Input() instead of @Input('<')",
                config: Lint.Utils.dedent(templateObject_2 || (templateObject_2 = tslib_1.__makeTemplateObject(["\n\t\t\t\t\t\"rules\": { \"angular-decorators-formatting\": true }\n\t\t\t\t"], ["\n\t\t\t\t\t\"rules\": { \"angular-decorators-formatting\": true }\n\t\t\t\t"]))),
                pass: Lint.Utils.dedent(templateObject_3 || (templateObject_3 = tslib_1.__makeTemplateObject(["\n\t\t\t\t\t@Input() public max: number;\n\t\t\t\t"], ["\n\t\t\t\t\t@Input() public max: number;\n\t\t\t\t"]))),
                fail: Lint.Utils.dedent(templateObject_4 || (templateObject_4 = tslib_1.__makeTemplateObject(["\n\t\t\t\t\t@Input('<') public max: number;\n\t\t\t\t"], ["\n\t\t\t\t\t@Input('<') public max: number;\n\t\t\t\t"]))),
            },
            {
                description: "Enforces @Output() instead of @Output('&') and @Input('&')",
                config: Lint.Utils.dedent(templateObject_5 || (templateObject_5 = tslib_1.__makeTemplateObject(["\n\t\t\t\t\t\"rules\": { \"angular-decorators-formatting\": true }\n\t\t\t\t"], ["\n\t\t\t\t\t\"rules\": { \"angular-decorators-formatting\": true }\n\t\t\t\t"]))),
                pass: Lint.Utils.dedent(templateObject_6 || (templateObject_6 = tslib_1.__makeTemplateObject(["\n\t\t\t\t\t@Output() public success: () => void;\n\t\t\t\t\t@Output() public error: () => void;\n\t\t\t\t"], ["\n\t\t\t\t\t@Output() public success: () => void;\n\t\t\t\t\t@Output() public error: () => void;\n\t\t\t\t"]))),
                fail: Lint.Utils.dedent(templateObject_7 || (templateObject_7 = tslib_1.__makeTemplateObject(["\n\t\t\t\t\t@Input('&') public success: () => void;\n\t\t\t\t\t@Output('&') public error: () => void;\n\t\t\t\t"], ["\n\t\t\t\t\t@Input('&') public success: () => void;\n\t\t\t\t\t@Output('&') public error: () => void;\n\t\t\t\t"]))),
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
var AngularDecoratorFormattingWalker = /** @class */ (function (_super) {
    tslib_1.__extends(AngularDecoratorFormattingWalker, _super);
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
