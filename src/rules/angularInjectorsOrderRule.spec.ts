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

	describe('method', () => {
		it('should pass without methods', () => {
			const sourceFile = `
			class A {}
		`;

			const result = lintHelper({ sourceFile, ruleName });

			expect(result.errorCount).toBe(0);
		});

		it('should pass on empty method', () => {
			const sourceFile = `
			class A {
				constructor() {}

				public some(): void {}
			}
		`;

			const result = lintHelper({ sourceFile, ruleName });

			expect(result.errorCount).toBe(0);
		});

		it('should not fail with right order', () => {
			const sourceFile = `
			class A {
				@Input('=') public model: number;

				constructor() {}

				public some($async, $httpService, HttpService: HttpService, someOther): void {}
			}
		`;

			const result = lintHelper({ sourceFile, ruleName });

			expect(result.errorCount).toBe(0);
		});

		it('should fail because injector with $ gos after injectors without $', () => {
			const sourceFile = `
			class A {
				public some(HttpService: HttpService, $async, $httpService, someOther): void {}
			}
		`;

			const result = lintHelper({ sourceFile, ruleName });

			expect(result.errorCount).toBe(2);
		});
	});

	describe('function', () => {
		it('should pass without function', () => {
			const sourceFile = `
			const a = 10;
		`;

			const result = lintHelper({ sourceFile, ruleName });

			expect(result.errorCount).toBe(0);
		});

		it('should pass on empty function', () => {
			const sourceFile = `
			function some(): void {}
		`;

			const result = lintHelper({ sourceFile, ruleName });

			expect(result.errorCount).toBe(0);
		});

		it('should not fail with right order', () => {
			const sourceFile = `
			function some($async, $httpService, HttpService: HttpService, someOther): void {}
		`;

			const result = lintHelper({ sourceFile, ruleName });

			expect(result.errorCount).toBe(0);
		});

		it('should fail because injector with $ gos after injectors without $', () => {
			const sourceFile = `
			function some(HttpService: HttpService, $async, $httpService, someOther): void {}
		`;

			const result = lintHelper({ sourceFile, ruleName });

			expect(result.errorCount).toBe(2);
		});
	});

	describe('arrow function', () => {
		it('should pass without function', () => {
			const sourceFile = `
			const a = 10;
		`;

			const result = lintHelper({ sourceFile, ruleName });

			expect(result.errorCount).toBe(0);
		});

		it('should pass on empty function', () => {
			const sourceFile = `
			const some = () => void {}
		`;

			const result = lintHelper({ sourceFile, ruleName });

			expect(result.errorCount).toBe(0);
		});

		it('should not fail with right order', () => {
			const sourceFile = `
			const some = ($async, $httpService, HttpService: HttpService, someOther) => void {}
		`;

			const result = lintHelper({ sourceFile, ruleName });

			expect(result.errorCount).toBe(0);
		});

		it('should fail because injector with $ gos after injectors without $', () => {
			const sourceFile = `
			const some = (HttpService: HttpService, $async, $httpService, someOther) => void {}
		`;

			const result = lintHelper({ sourceFile, ruleName });

			expect(result.errorCount).toBe(2);
		});
	});
});
