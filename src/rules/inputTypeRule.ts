import * as Lint from 'tslint';
import * as ts from 'typescript';

export class Rule extends Lint.Rules.AbstractRule {
	public static FAILURE_STRING = `@Input('<') should be replaced with @Input()`;

	public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
		return this.applyWithWalker(new InputTypeWalker(sourceFile, 'input-type', this.getOptions()));
	}
}

class InputTypeWalker extends Lint.AbstractWalker<any> {
	public walk() {
		// console.log(sourceFile)
		// Some code that will implement your rule logic
	}
}
