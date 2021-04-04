import * as TSLintConfig from '../tslint.json';
import { Linter, Configuration } from 'tslint';
import { LintHelperOptions } from '../src/types/lint-helper-options.type';

// This utility helps to test ts-lint custom rules
export const lintHelper = ({ sourceFile, ruleName }: LintHelperOptions) => {
	const lint = new Linter({ fix: false });

	const getRuleOptions = TSLintConfig.rules[ruleName];

	lint.lint(
		'',
		sourceFile,
		Configuration.parseConfigFile({
			rules: { [ruleName]: getRuleOptions },
			rulesDirectory: TSLintConfig.rulesDirectory,
		})
	);

	return lint.getResult();
};
