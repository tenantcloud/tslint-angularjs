import { lintHelper } from '../../tests/test-helper';

const ruleName = 'angular-decorators-modifier';

describe('angular decorators modifier rule', () => {
	it('should not fail with public modifier and without readonly', () => {
		const sourceFile = `
			class A {
				@Input('=') public model: number;
				@Input() public max: number;
				@Input() public min: number;
				@Input() public average: number;
				@Input('@?') public label?: string;

				@Output() public success: () => void;
				@Output('&?') public error?: () => void;

				private readonly some: string;
			}
		`;

		const result = lintHelper({ sourceFile, ruleName });

		expect(result.errorCount).toBe(0);
	});

	it('should fail with private modifier', () => {
		const sourceFile = `
			class A {
				@Input('=') private model: number;
				@Input() public max: number;
				@Input() public min: number;
				@Input() private average: number;
				@Input('@?') public label?: string;

				@Output() public success: () => void;
				@Output('&?') public error?: () => void;

				private some: string;
			}
		`;

		const result = lintHelper({ sourceFile, ruleName });

		expect(result.errorCount).toBe(2);
	});

	it('should fail with protected modifier', () => {
		const sourceFile = `
			class A {
				@Input('=') protected model: number;
				@Input() public max: number;
				@Input() public min: number;
				@Input() protected average: number;
				@Input('@?') public label?: string;

				@Output() public success: () => void;
				@Output('&?') public error?: () => void;

				private some: string;
			}
		`;

		const result = lintHelper({ sourceFile, ruleName });

		expect(result.errorCount).toBe(2);
	});

	it('should fail with readonly', () => {
		const sourceFile = `
			class A {
				@Input('=') public model: number;
				@Input() public max: number;
				@Input() public min: number;
				@Input() public readonly average: number;
				@Input('@?') public label?: string;

				@Output() public readonly success: () => void;
				@Output('&?') public error?: () => void;

				private readonly some: string;
			}
		`;

		const result = lintHelper({ sourceFile, ruleName });

		expect(result.errorCount).toBe(2);
	});
});
