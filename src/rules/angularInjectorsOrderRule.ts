import * as Lint from 'tslint';
import * as ts from 'typescript';

import { isConstructorDeclaration } from 'tsutils';

export class Rule extends Lint.Rules.AbstractRule {
	public static metadata: Lint.IRuleMetadata = {
		ruleName: 'angular-injectors-order',
		description: 'Enforces native angularJs injectors to go first',
		rationale: Lint.Utils.dedent`
            TenantCloud injectors order convention
        `,
		optionsDescription: 'Not configurable.',
		options: null,
		optionExamples: [true],
		type: 'formatting',
		typescriptOnly: true,
		codeExamples: [
			{
				description: 'Enforces $httpService go first over custom HttpService',
				config: Lint.Utils.dedent`
					"rules": { "angular-injectors-order": true }
				`,
				pass: Lint.Utils.dedent`
					constructor(private $httpService, private HttpService) {}
				`,
				fail: Lint.Utils.dedent`
					constructor(private HttpService, private $httpService) {}
				`,
			},
		],
	};

	public static FAILURE_STRING = `Injectors with '$' should go first`;

	public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
		return this.applyWithWalker(new AngularInjectorsOrderWalker(sourceFile, 'angular-injectors-order', null));
	}
}

class AngularInjectorsOrderWalker extends Lint.AbstractWalker<null> {
	public static readonly $INJECTOR = 1;
	public static readonly CUSTOM_INJECTOR = 0;

	constructor(sourceFile: ts.SourceFile, ruleName: string, options: null) {
		super(sourceFile, ruleName, options);

		this.checkNode = this.checkNode.bind(this);
	}

	public walk(sourceFile: ts.SourceFile): void {
		ts.forEachChild(sourceFile, this.checkNode);
	}

	private checkNode(node: ts.Node): void {
		if (isConstructorDeclaration(node) && this.isConstructorContains$Injectors(node.parameters)) {
			this.validateConstructorParameters(node.parameters);
		}

		ts.forEachChild(node, this.checkNode);
	}

	private validateConstructorParameters(parameters: ts.NodeArray<ts.ParameterDeclaration>): void {
		const schema: number[] = parameters.map((parameter: ts.ParameterDeclaration) =>
			this.is$Injector(parameter)
				? AngularInjectorsOrderWalker.$INJECTOR
				: AngularInjectorsOrderWalker.CUSTOM_INJECTOR
		);

		// Avoid mutating original array for proper order check
		const validSchema = [...schema].sort();

		// Injectors ordered in right way
		if (JSON.stringify(schema) === JSON.stringify(validSchema)) {
			return;
		}

		const firstCustomInjectorIndex = schema.findIndex(item => item === AngularInjectorsOrderWalker.CUSTOM_INJECTOR);

		schema.forEach((item: number, index: number) => {
			if (firstCustomInjectorIndex >= index) {
				return;
			}

			if (item === AngularInjectorsOrderWalker.$INJECTOR) {
				this.addFailureAtNode(parameters[index], Rule.FAILURE_STRING);
			}
		});
	}

	private isConstructorContains$Injectors(parameters: ts.NodeArray<ts.ParameterDeclaration>): boolean {
		return parameters.some(this.is$Injector);
	}

	private is$Injector(parameter: ts.ParameterDeclaration): boolean {
		return parameter.getText().includes('$');
	}
}
