import { lintHelper } from '../../tests/test-helper';

import { Rule } from './angularDecoratorsOptionalRule';

const ruleName = 'angular-decorators-optional';

describe('angular decorators optional rule', () => {
	it('should not fail with both optional: binding and field', () => {
		const sourceFile = `
			class A {
				@Input('=') public model: number;
				@Input('=?') public model?: number;
				@Input('<?') public max?: number;
				@Input('<?') public min = 10;
				@Input() public average: number;
				@Input('@?') public label?: string;

				@Output() public success: () => void;
				@Output('&?') public error?: () => void;
			}
		`;

		const result = lintHelper({ sourceFile, ruleName });

		expect(result.errorCount).toBe(0);
	});

	describe('optional field', () => {
		it("should fail with 1 @Input('#?')", () => {
			const sourceFile = `
			class A {
				@Input('=') public model: number;
				@Input('<?') public max: number; // fail
				@Input('@?') public label?: string;
			}
		`;

			const result = lintHelper({ sourceFile, ruleName });
			const failures = result.failures.map((failure) => failure.getFailure());

			expect(result.errorCount).toBe(1);
			expect(failures).toEqual([Rule.OPTIONAL_FIELD_FAIL]);
		});

		it("should fail with multiple @Input('#?')", () => {
			const sourceFile = `
			class A {
				@Input('=?') public model: number;
				@Input('<?') public max: number;
				@Input('<?') public min = 10; // fine
				@Input('@?') public label: string;
				@Output('&?') public callback: () => void;
			}
		`;

			const errorCount = 4;

			const result = lintHelper({ sourceFile, ruleName });
			const failures = result.failures.map((failure) => failure.getFailure());
			const failuresRules = Array.from({ length: errorCount }, () => Rule.OPTIONAL_FIELD_FAIL);

			expect(result.errorCount).toBe(errorCount);
			expect(failures).toEqual(failuresRules);
		});
	});

	describe('optional binding', () => {
		it("should fail with 1 optional field", () => {
			const sourceFile = `
			class A {
				@Input('=') public model: number;
				@Input() public max?: number; // fail
				@Input('@?') public label?: string;
			}
		`;

			const result = lintHelper({ sourceFile, ruleName });
			const failures = result.failures.map((failure) => failure.getFailure());

			expect(result.errorCount).toBe(1);
			expect(failures).toEqual([Rule.OPTIONAL_BINDING_FAIL]);
		});

		it("should fail with multiple optional fields", () => {
			const sourceFile = `
			class A {
				@Input('=') public model?: number;
				@Input() public max?: number;
				@Input('<?') public min = 10; // fine
				@Input('@') public label?: string;
				@Output() public callback?: () => void;
			}
		`;

			const errorCount = 4;

			const result = lintHelper({ sourceFile, ruleName });
			const failures = result.failures.map((failure) => failure.getFailure());
			const failuresRules = Array.from({ length: errorCount }, () => Rule.OPTIONAL_BINDING_FAIL);

			expect(result.errorCount).toBe(errorCount);
			expect(failures).toEqual(failuresRules);
		});
	});
});
