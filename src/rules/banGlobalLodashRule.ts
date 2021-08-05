import * as Lint from 'tslint';
import * as ts from 'typescript';

import { isPropertyAccessExpression } from 'tsutils';

export class Rule extends Lint.Rules.AbstractRule {
	public static metadata: Lint.IRuleMetadata = {
		ruleName: 'ban-global-lodash',
		description: 'Enforces to import lodash function from lodash instead of global _.',
		rationale: Lint.Utils.dedent`
            To avoid whole lodash lib to be bundled
        `,
		optionsDescription: 'Not configurable.',
		options: null,
		optionExamples: [true],
		type: 'maintainability',
		typescriptOnly: false,
		codeExamples: [
			{
				description: `Enforces to import { isArray } from 'lodash-es'`,
				config: Lint.Utils.dedent`
					"rules": { "ban-global-lodash": true }
				`,
				pass: Lint.Utils.dedent`
					import { isArray } from 'lodash-es';

					function getData(data: number[] | number): number[] {
						if(isArray(data)) {
							return data;
						}

						return [data];
					}
				`,
				fail: Lint.Utils.dedent`
					function getData(data: number[] | number): number[] {
						if(_.isArray(data)) {
							return data;
						}

						return [data];
					}
				`,
			},
		],
	};

	public static FAILURE_STRING = (lodashFunctionName: string): string =>
		`"${lodashFunctionName}" should be imported from 'lodash-es'`;

	public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
		return this.applyWithWalker(new BanGlobalLodashWalker(sourceFile, 'ban-global-lodash', null));
	}
}

class BanGlobalLodashWalker extends Lint.AbstractWalker<null> {
	constructor(sourceFile: ts.SourceFile, ruleName: string, options: null) {
		super(sourceFile, ruleName, options);

		this.checkNode = this.checkNode.bind(this);
	}

	public walk(sourceFile: ts.SourceFile): void {
		ts.forEachChild(sourceFile, this.checkNode);
	}

	private checkNode(node: ts.Node): void {
		if (isPropertyAccessExpression(node)) {
			this.validate(node);
		}

		ts.forEachChild(node, this.checkNode);
	}

	private validate(node: ts.PropertyAccessExpression): void {
		const lodashFunctionNameMatches = node.getText().match(/_\.(\w)*$/g);

		if (lodashFunctionNameMatches) {
			const lodashFunctionNames = lodashFunctionNameMatches.map(name => name.replace('_.', ''));

			lodashFunctionNames.forEach(lodashFunctionName => {
				this.addFailureAtNode(node, Rule.FAILURE_STRING(lodashFunctionName));
			});
		}
	}
}
