import * as Lint from 'tslint';
import * as ts from 'typescript';
export declare class Rule extends Lint.Rules.AbstractRule {
    static metadata: Lint.IRuleMetadata;
    static OPTIONAL_BINDING_FAIL: string;
    static OPTIONAL_FIELD_FAIL: string;
    apply(sourceFile: ts.SourceFile): Lint.RuleFailure[];
}
