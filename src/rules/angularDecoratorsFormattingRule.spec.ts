import { lintHelper } from '../../tests/test-helper';

import { Rule } from './angularDecoratorsFormattingRule';

const ruleName = 'angular-decorators-formatting';

describe('angular decorators formatting rule', () => {
	it("should not fail without @Input('<'), @Input('&'), @Input('&?'), @Output('&')", () => {
		const sourceFile = `
			class A {
				@Input('=') public model: number;
				@Input() public max: number;
				@Input() public min: number;
				@Input() public average: number;
				@Input('@?') public label?: string;

				@Output() public success: () => void;
				@Output('&?') public error?: () => void;
			}
		`;

		const result = lintHelper({ sourceFile, ruleName });

		expect(result.errorCount).toBe(0);
	});

	describe('input clear', () => {
		it("should fail with 1 @Input('<')", () => {
			const sourceFile = `
			class A {
				@Input('=') public model: number;
				@Input('<') public max: number;
				@Input() public min: number;
				@Input() public average: number;
				@Input('@?') public label?: string;
			}
		`;

			const result = lintHelper({ sourceFile, ruleName });
			const failures = result.failures.map((failure) => failure.getFailure());

			expect(result.errorCount).toBe(1);
			expect(failures).toContain(Rule.INPUT_CLEAR_FAIL);
		});

		it("should fail with multiple @Input('<')", () => {
			const sourceFile = `
			class A {
				@Input('=') public model: number;
				@Input('<') public max: number;
				@Input('<') public min: number;
				@Input('<') public average: number;
				@Input('@?') public label?: string;
			}
		`;

			const result = lintHelper({ sourceFile, ruleName });
			const failures = result.failures.map((failure) => failure.getFailure());

			expect(result.errorCount).toBe(3);
			expect(failures).toContain(Rule.INPUT_CLEAR_FAIL);
		});
	});

	describe('output clear', () => {
		it("should fail with 1 @Output('&')", () => {
			const sourceFile = `
			class A {
				@Output('&') public success: () => void;
				@Output('&?') public error?: () => void;
			}
		`;

			const result = lintHelper({ sourceFile, ruleName });
			const failures = result.failures.map((failure) => failure.getFailure());

			expect(result.errorCount).toBe(1);
			expect(failures).toContain(Rule.OUTPUT_CLEAR_FAIL);
		});

		it("should fail with multiple @Output('&')", () => {
			const sourceFile = `
			class A {
				@Output('&') public success: () => void;
				@Output('&') public error: () => void;
			}
		`;

			const result = lintHelper({ sourceFile, ruleName });
			const failures = result.failures.map((failure) => failure.getFailure());

			expect(result.errorCount).toBe(2);
			expect(failures).toContain(Rule.OUTPUT_CLEAR_FAIL);
		});
	});

	describe('input to output', () => {
		it("should fail with @Input('&')", () => {
			const sourceFile = `
			class A {
				@Input('&') public success: () => void;
				@Output('&?') public error?: () => void;
			}
		`;

			const result = lintHelper({ sourceFile, ruleName });
			const failures = result.failures.map((failure) => failure.getFailure());

			expect(result.errorCount).toBe(1);
			expect(failures).toContain(Rule.INPUT_TO_OUTPUT_FAIL);
		});

		it("should fail with @Input('&?')", () => {
			const sourceFile = `
			class A {
				@Output() public success: () => void;
				@Input('&?') public error: () => void;
			}
		`;

			const result = lintHelper({ sourceFile, ruleName });
			const failures = result.failures.map((failure) => failure.getFailure());

			expect(result.errorCount).toBe(1);
			expect(failures).toContain(Rule.INPUT_TO_OUTPUT_OPTIONAL_FAIL);
		});

		it("should fail with @Input('&?')", () => {
			const sourceFile = `
			class A {
				@Input('&') public success: () => void;
				@Input('&?') public error: () => void;
			}
		`;

			const result = lintHelper({ sourceFile, ruleName });
			const failures = result.failures.map((failure) => failure.getFailure());

			expect(result.errorCount).toBe(2);
			expect(failures).toContain(Rule.INPUT_TO_OUTPUT_FAIL);
			expect(failures).toContain(Rule.INPUT_TO_OUTPUT_OPTIONAL_FAIL);
		});
	});
});
