import * as Lint from 'tslint';
import * as ts from 'typescript';

import { isAngularBindingDecorator } from './_is-angular-decorator';

export class Rule extends Lint.Rules.AbstractRule {
	public static metadata: Lint.IRuleMetadata = {
		ruleName: 'angular-decorators-formatting',
		description: "Enforces @Input() instead of @Input('<') OR @Output() instead of @Input('&') etc.",
		rationale: Lint.Utils.dedent`
            In new Angular all extra stuff in @Input / @Output decorators
            need to be removed. So to avoid cleaning in the future, better
            to avoid @Input('<'), @Input('&') and @Output('&'),
            because they all can be replaced with clean @Input()/@Output()
            and will require no changes in new Angular version
        `,
		optionsDescription: 'Not configurable.',
		options: null,
		optionExamples: [true],
		type: 'formatting',
		typescriptOnly: true,
		codeExamples: [
			{
				description: "Enforces @Input() instead of @Input('<')",
				config: Lint.Utils.dedent`
					"rules": { "angular-decorators-formatting": true }
				`,
				pass: Lint.Utils.dedent`
					@Input() public max: number;
				`,
				fail: Lint.Utils.dedent`
					@Input('<') public max: number;
				`,
			},
			{
				description: "Enforces @Output() instead of @Output('&') and @Input('&')",
				config: Lint.Utils.dedent`
					"rules": { "angular-decorators-formatting": true }
				`,
				pass: Lint.Utils.dedent`
					@Output() public success: () => void;
					@Output() public error: () => void;
				`,
				fail: Lint.Utils.dedent`
					@Input('&') public success: () => void;
					@Output('&') public error: () => void;
				`,
			},
		],
	};

	public static INPUT_CLEAR_FAIL = `@Input('<') should be replaced with @Input()`;
	public static OUTPUT_CLEAR_FAIL = `@Output('&') should be replaced with @Output()`;
	public static INPUT_TO_OUTPUT_FAIL = `@Input('&') should be replaced with @Output()`;
	public static INPUT_TO_OUTPUT_OPTIONAL_FAIL = `@Input('&?') should be replaced with @Output('&?')`;

	public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
		return this.applyWithWalker(
			new AngularDecoratorFormattingWalker(sourceFile, 'angular-decorators-formatting', null)
		);
	}
}

class AngularDecoratorFormattingWalker extends Lint.AbstractWalker<null> {
	constructor(sourceFile: ts.SourceFile, ruleName: string, options: null) {
		super(sourceFile, ruleName, options);

		this.checkNode = this.checkNode.bind(this);
	}

	public walk(sourceFile: ts.SourceFile): void {
		ts.forEachChild(sourceFile, this.checkNode);
	}

	private checkNode(node: ts.Node): void {
		if (isAngularBindingDecorator(node)) {
			this.validateBinding(node);
		}

		ts.forEachChild(node, this.checkNode);
	}

	private validateBinding(node: ts.Decorator): void {
		if (node.getText().includes("@Input('<')")) {
			return this.addFailureAtNode(node, Rule.INPUT_CLEAR_FAIL);
		}

		if (node.getText().includes("@Output('&')")) {
			return this.addFailureAtNode(node, Rule.OUTPUT_CLEAR_FAIL);
		}

		if (node.getText().includes("@Input('&')")) {
			return this.addFailureAtNode(node, Rule.INPUT_TO_OUTPUT_FAIL);
		}

		if (node.getText().includes("@Input('&?')")) {
			return this.addFailureAtNode(node, Rule.INPUT_TO_OUTPUT_OPTIONAL_FAIL);
		}
	}
}
