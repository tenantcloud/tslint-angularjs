import { lintHelper } from '../tests/test-helper';

const ruleName = 'input-type';

describe('input type rule', () => {
	it("should not fail without @Input('<')", () => {
		const sourceFile = `
			@Input('=') public model: number;
			@Input() public max: number;
			@Input() public min: number;
			@Input() public average: number;
			@Input('@?') public label?: string;
		`;

		const result = lintHelper({ sourceFile, ruleName });
		expect(result.errorCount).toBe(0);
	});

	it("should fail with 1 @Input('<')", () => {
		const sourceFile = `
			@Input('=') public model: number;
			@Input('<') public max: number;
			@Input() public min: number;
			@Input() public average: number;
			@Input('@?') public label?: string;
		`;

		const result = lintHelper({ sourceFile, ruleName });
		expect(result.errorCount).toBe(1);
	});

	it("should fail with multiple @Input('<')", () => {
		const sourceFile = `
			@Input('=') public model: number;
			@Input('<') public max: number;
			@Input('<') public min: number;
			@Input('<') public average: number;
			@Input('@?') public label?: string;
		`;

		const result = lintHelper({ sourceFile, ruleName });
		expect(result.errorCount).toBe(3);
	});
});
