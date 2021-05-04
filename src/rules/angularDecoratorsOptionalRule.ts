import * as Lint from 'tslint';
import * as ts from 'typescript';

import { isAngularBindingDecorator } from './helpers/is-angular-decorator';
import { isPropertyDeclaration } from 'tsutils';

export class Rule extends Lint.Rules.AbstractRule {
	public static metadata: Lint.IRuleMetadata = {
		ruleName: 'angular-decorators-optional',
		description:
			"Enforces @Output/@Input('#?') public some: string; to set optional field for 'some' property as bind is optional as well.",
		rationale: Lint.Utils.dedent`
            In new Angular all optional bindings are marked just with
            typescript '?' to set that they are optional.
            So to avoid multiple error in future, better to mark fields
            as optional with bindings.
        `,
		optionsDescription: 'Not configurable.',
		options: null,
		optionExamples: [true],
		type: 'typescript',
		typescriptOnly: true,
		codeExamples: [
			{
				description: "Enforces @Input('<?') public some?: string instead of @Input('<?') public some: string",
				config: Lint.Utils.dedent`
					"rules": { "angular-decorators-optional": true }
				`,
				pass: Lint.Utils.dedent`
					Input('<?') public some?: string;
				`,
				fail: Lint.Utils.dedent`
					Input('<?') public some: string;
				`,
			},
			{
				description: "Enforces @Input('<?') public some?: string instead of @Input() public some?: string",
				config: Lint.Utils.dedent`
					"rules": { "angular-decorators-optional": true }
				`,
				pass: Lint.Utils.dedent`
					Output('&?') public some?: () => void;
				`,
				fail: Lint.Utils.dedent`
					Output() public some?: () => void;
				`,
			},
		],
	};

	public static OPTIONAL_BINDING_FAIL = `Binding should be marked as optional with '?' due to optional field`;
	public static OPTIONAL_FIELD_FAIL = `Field should be marked as optional with '?' due to optional binding`;

	public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
		return this.applyWithWalker(
			new AngularDecoratorsOptionalWalker(sourceFile, 'angular-decorators-optional', null)
		);
	}
}

class AngularDecoratorsOptionalWalker extends Lint.AbstractWalker<null> {
	constructor(sourceFile: ts.SourceFile, ruleName: string, options: null) {
		super(sourceFile, ruleName, options);

		this.checkNode = this.checkNode.bind(this);
	}

	public walk(sourceFile: ts.SourceFile): void {
		ts.forEachChild(sourceFile, this.checkNode);
	}

	private checkNode(node: ts.Node): void {
		if (isAngularBindingDecorator(node)) {
			if (isPropertyDeclaration(node.parent)) {
				this.validatePropertyDeclaration(node.parent, node);
			}
		}

		ts.forEachChild(node, this.checkNode);
	}

	private validatePropertyDeclaration(node: ts.PropertyDeclaration, decoratorNode: ts.Decorator): void {
		const isInitialized = !!node.initializer;
		const hasOptionalField = !!node.questionToken;
		const hasOptionalBinding = this.isOptionalBinding(decoratorNode);

		// Only optional binding
		if (hasOptionalBinding && !hasOptionalField && !isInitialized) {
			this.addFailureAtNode(node, Rule.OPTIONAL_FIELD_FAIL);
		}

		// Only optional field
		if (hasOptionalField && !hasOptionalBinding) {
			this.addFailureAtNode(node, Rule.OPTIONAL_BINDING_FAIL);
		}
	}

	private isOptionalBinding(node: ts.Decorator): boolean {
		return node.getText().includes('?');
	}
}
