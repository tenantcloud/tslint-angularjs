import * as Lint from 'tslint';
import * as ts from 'typescript';

export class Rule extends Lint.Rules.AbstractRule {
	public static metadata: Lint.IRuleMetadata = {
		ruleName: 'input-type',
		description: "Enforces @Input() instead of @Input('<')",
		rationale: Lint.Utils.dedent`
            In new Angular all extra stuff in @Input decorator
            need to be removed. So to avoid cleaning in the future, better
            to avoid @Input('<') as it has the same logic as @Input(),
            but will require no changes  in new Angular version
        `,
		optionsDescription: 'Not configurable.',
		options: null,
		optionExamples: [true],
		type: 'maintainability',
		typescriptOnly: true,
		codeExamples: [
			{
				description: "Enforces @Input() instead of @Input('<')",
				config: Lint.Utils.dedent`
					"rules": { "input-type": true }
				`,
				pass: Lint.Utils.dedent`
					@Input() public max: number;
				`,
				fail: Lint.Utils.dedent`
					@Input('<') public max: number;
				`,
			},
		],
	};

	public static FAILURE_STRING = `@Input('<') should be replaced with @Input()`;

	public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
		return this.applyWithWalker(new InputTypeWalker(sourceFile, 'input-type', this.getOptions()));
	}
}

class InputTypeWalker extends Lint.AbstractWalker<any> {
	public walk(sourceFile: ts.SourceFile) {
		console.log(sourceFile, '1');
		console.log(sourceFile, '1');
		// Some code that will implement your rule logic
	}
}
