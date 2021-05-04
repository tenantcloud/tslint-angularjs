import * as Lint from 'tslint';
import * as ts from 'typescript';
export declare class Rule extends Lint.Rules.AbstractRule {
    static metadata: Lint.IRuleMetadata;
    static INPUT_CLEAR_FAIL: string;
    static OUTPUT_CLEAR_FAIL: string;
    static INPUT_TO_OUTPUT_FAIL: string;
    static INPUT_TO_OUTPUT_OPTIONAL_FAIL: string;
    apply(sourceFile: ts.SourceFile): Lint.RuleFailure[];
}
