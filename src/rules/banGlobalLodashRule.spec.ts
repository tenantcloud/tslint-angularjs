import { lintHelper } from '../../tests/test-helper';

const ruleName = 'ban-global-lodash';

describe('ban global lodash rule', () => {
	it('should pass without lodash functions', () => {
		const sourceFile = `
			function getData(data: number): number[] {
				return [data];
			}
		`;

		const result = lintHelper({ sourceFile, ruleName });

		expect(result.errorCount).toBe(0);
	});

	it('should pass with right import of lodash function', () => {
		const sourceFile = `
			import { isArray } from 'lodash'

			function getData(data: number[] | number): number[] {
				if(isArray(data)) {
					return data;
				}

				return [data];
			}
		`;

		const result = lintHelper({ sourceFile, ruleName });

		expect(result.errorCount).toBe(0);
	});

	it('should pass with right import of multiple lodash functions', () => {
		const sourceFile = `
			import { isArray, toNumber } from 'lodash'

			function getData(data: number[] | number | string): number[] {
				if(isArray(data)) {
					return data;
				}

				if (typeof data === 'string') {
					return [toNumber(data)]
				}

				return [data];
			}
		`;

		const result = lintHelper({ sourceFile, ruleName });

		expect(result.errorCount).toBe(0);
	});

	it('should fail with global _.', () => {
		const sourceFile = `
			function getData(data: number[] | number): number[] {
				if(_.isArray(data)) {
					return data;
				}

				return [data];
			}
		`;

		const result = lintHelper({ sourceFile, ruleName });

		expect(result.failures[0].getFailure()).toBe(`"isArray" should be imported from 'lodash'`);
	});

	it('should fail with global multiple _.', () => {
		const sourceFile = `
			function getData(data: number[] | number | string): number[] {
				if (_.isArray(data)) {
					return data;
				}

				if (typeof data === 'string') {
					return [_.toNumber(data)]
				}

				return [data];
			}
		`;

		const result = lintHelper({ sourceFile, ruleName });

		expect(result.failures[0].getFailure()).toBe(`"isArray" should be imported from 'lodash'`);
		expect(result.failures[1].getFailure()).toBe(`"toNumber" should be imported from 'lodash'`);
	});

	it('should fail with global multiple chained _.', () => {
		const sourceFile = `
			function some(data: number | string): boolean {
				return _.toNumber(_.toString(data));
			}
		`;

		const result = lintHelper({ sourceFile, ruleName });

		expect(result.failures[0].getFailure()).toBe(`"toNumber" should be imported from 'lodash'`);
		expect(result.failures[1].getFailure()).toBe(`"toString" should be imported from 'lodash'`);
	});

	it('should fail with global _. and import', () => {
		const sourceFile = `
			import { isArray } from 'lodash'

			function getData(data: number[] | number | string): number[] {
				if (isArray(data)) {
					return data;
				}

				if (typeof data === 'string') {
					return [_.toNumber(data)]
				}

				return [data];
			}
		`;

		const result = lintHelper({ sourceFile, ruleName });

		expect(result.failures[0].getFailure()).toBe(`"toNumber" should be imported from 'lodash'`);
	});
});
