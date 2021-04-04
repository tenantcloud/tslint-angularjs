import { RuleName } from '../enums/rule-name.enum';

export interface LintHelperOptions {
	sourceFile: string;
	ruleName: RuleName;
}
