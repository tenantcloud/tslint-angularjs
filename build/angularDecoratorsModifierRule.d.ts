import * as Lint from 'tslint';
import * as ts from 'typescript';
export declare class Rule extends Lint.Rules.AbstractRule {
    static metadata: Lint.IRuleMetadata;
    static ACCESS_MODIFIER_FAIL: string;
    static READONLY_FAIL: string;
    apply(sourceFile: ts.SourceFile): Lint.RuleFailure[];
}
