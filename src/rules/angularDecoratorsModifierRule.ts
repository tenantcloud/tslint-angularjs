import * as Lint from 'tslint';
import * as ts from 'typescript';
import { getModifier, isPropertyDeclaration } from 'tsutils';

import { isAngularBindingDecorator } from './helpers/is-angular-decorator';

export class Rule extends Lint.Rules.AbstractRule {
	public static metadata: Lint.IRuleMetadata = {
		ruleName: 'angular-decorators-modifier',
		description: 'Enforces bindings to be always public.',
		rationale: Lint.Utils.dedent`
            In new Angular all binding is public.
            In other case there are no reason for binding and it will error.
        `,
		optionsDescription: 'Not configurable.',
		options: null,
		optionExamples: [true],
		type: 'typescript',
		typescriptOnly: true,
		codeExamples: [
			{
				description: 'Enforces @Input() public some: string instead of @Input() private some: string',
				config: Lint.Utils.dedent`
					"rules": { "angular-decorators-modifier": true }
				`,
				pass: Lint.Utils.dedent`
					Input() public some: string;
					Input('<?') public other?: string;
				`,
				fail: Lint.Utils.dedent`
					Input() private some: string;
					Input('<?') private other?: string;
				`,
			},
		],
	};

	public static FAILURE_STRING = `Declaration with angular binding decorator should be public`;

	public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
		return this.applyWithWalker(
			new AngularDecoratorsModifierWalker(sourceFile, 'angular-decorators-modifier', null)
		);
	}
}

class AngularDecoratorsModifierWalker extends Lint.AbstractWalker<null> {
	constructor(sourceFile: ts.SourceFile, ruleName: string, options: null) {
		super(sourceFile, ruleName, options);

		this.checkNode = this.checkNode.bind(this);
	}

	public walk(sourceFile: ts.SourceFile): void {
		ts.forEachChild(sourceFile, this.checkNode);
	}

	private checkNode(node: ts.Node): void {
		if (isPropertyDeclaration(node.parent) && isAngularBindingDecorator(node)) {
			this.validatePropertyDeclaration(node.parent);
		}

		ts.forEachChild(node, this.checkNode);
	}

	private validatePropertyDeclaration(node: ts.PropertyDeclaration): void {
		const privateKeyword = getModifier(node, ts.SyntaxKind.PrivateKeyword);
		const protectedKeyword = getModifier(node, ts.SyntaxKind.ProtectedKeyword);

		if (privateKeyword || protectedKeyword) {
			this.addFailureAtNode(node, Rule.FAILURE_STRING);
		}
	}
}
