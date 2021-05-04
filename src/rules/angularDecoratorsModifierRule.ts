import * as Lint from 'tslint';
import * as ts from 'typescript';
import { getModifier, isPropertyDeclaration } from 'tsutils';

import { isAngularBindingDecorator } from './helpers/is-angular-decorator';

export class Rule extends Lint.Rules.AbstractRule {
	public static metadata: Lint.IRuleMetadata = {
		ruleName: 'angular-decorators-modifier',
		description: 'Enforces bindings to be always public and mutable (without readonly).',
		rationale: Lint.Utils.dedent`
            In new Angular all binding is public and mutable.
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
				`,
				fail: Lint.Utils.dedent`
					Input() private some: string;
				`,
			},
			{
				description: 'Enforces @Input() public some: string instead of @Input() public readonly some: string',
				config: Lint.Utils.dedent`
					"rules": { "angular-decorators-modifier": true }
				`,
				pass: Lint.Utils.dedent`
					Input() public some: string;
				`,
				fail: Lint.Utils.dedent`
					Input() public readonly some: string;
				`,
			},
		],
	};

	public static ACCESS_MODIFIER_FAIL = `Declaration with angular binding decorator should be public`;
	public static READONLY_FAIL = `Readonly declarations with angular binding decorator are not allowed`;

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
		if (isAngularBindingDecorator(node)) {
			if (isPropertyDeclaration(node.parent)) {
				this.validatePropertyDeclaration(node.parent);
			}
		}

		ts.forEachChild(node, this.checkNode);
	}

	private validatePropertyDeclaration(node: ts.PropertyDeclaration): void {
		const privateKeyword = getModifier(node, ts.SyntaxKind.PrivateKeyword);
		const protectedKeyword = getModifier(node, ts.SyntaxKind.ProtectedKeyword);
		const readonlyKeyword = getModifier(node, ts.SyntaxKind.ReadonlyKeyword);

		if (privateKeyword) {
			const start = privateKeyword.end - 'private'.length;

			this.addFailure(start, privateKeyword.end, Rule.ACCESS_MODIFIER_FAIL);
		}

		if (protectedKeyword) {
			const start = protectedKeyword.end - 'protected'.length;

			this.addFailure(start, protectedKeyword.end, Rule.ACCESS_MODIFIER_FAIL);
		}

		if (readonlyKeyword) {
			const start = readonlyKeyword.end - 'readonly'.length;

			this.addFailure(start, readonlyKeyword.end, Rule.READONLY_FAIL);
		}
	}
}
