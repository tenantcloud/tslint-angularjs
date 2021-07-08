import { lintHelper } from '../../tests/test-helper';

const ruleName = 'angular-injectors-order';

describe('angular injectors order rule', () => {
	describe('constructor', () => {
		it('should pass without constructor', () => {
			const sourceFile = `
			class A {}
		`;

			const result = lintHelper({ sourceFile, ruleName });

			expect(result.errorCount).toBe(0);
		});

		it('should pass on empty constructor', () => {
			const sourceFile = `
			class A {
				constructor() {}
			}
		`;

			const result = lintHelper({ sourceFile, ruleName });

			expect(result.errorCount).toBe(0);
		});

		it('should not fail with right order', () => {
			const sourceFile = `
			class A {
				@Input('=') public model: number;

				constructor($async, private $httpService, private HttpService: HttpService, someOther) {}
			}
		`;

			const result = lintHelper({ sourceFile, ruleName });

			expect(result.errorCount).toBe(0);
		});

		it('should fail because injector with $ gos after injectors without $', () => {
			const sourceFile = `
			class A {
				constructor(private HttpService: HttpService, $async, private $httpService, someOther) {}
			}
		`;

			const result = lintHelper({ sourceFile, ruleName });

			expect(result.errorCount).toBe(2);
		});
	});
});
