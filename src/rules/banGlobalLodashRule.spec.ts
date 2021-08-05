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
			import { isArray } from 'lodash-es';

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
			import { isArray, toNumber } from 'lodash-es';

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

		expect(result.failures[0].getFailure()).toBe(`"isArray" should be imported from 'lodash-es'`);
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

		expect(result.failures[0].getFailure()).toBe(`"isArray" should be imported from 'lodash-es'`);
		expect(result.failures[1].getFailure()).toBe(`"toNumber" should be imported from 'lodash-es'`);
	});

	it('should fail with global multiple chained _.', () => {
		const sourceFile = `
			function some(data: number | string): boolean {
				return _.toNumber(_.toString(data));
			}
		`;

		const result = lintHelper({ sourceFile, ruleName });

		expect(result.failures[0].getFailure()).toBe(`"toNumber" should be imported from 'lodash-es'`);
		expect(result.failures[1].getFailure()).toBe(`"toString" should be imported from 'lodash-es'`);
	});

	it('should fail with global _. and import', () => {
		const sourceFile = `
			import { isArray } from 'lodash-es';

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

		expect(result.failures[0].getFailure()).toBe(`"toNumber" should be imported from 'lodash-es'`);
	});

	it('should fail two times in one line', () => {
		const sourceFile = `
			function getData(input: object): object {
				return _.filter(input, _.isNil)
			}
		`;

		const result = lintHelper({ sourceFile, ruleName });

		expect(result.errorCount).toEqual(2);

		expect(result.failures[0].getFailure()).toBe(`"filter" should be imported from 'lodash-es'`);
		expect(result.failures[1].getFailure()).toBe(`"isNil" should be imported from 'lodash-es'`);
	});

	it('should fail once with 1 global lodash and native array method after', () => {
		const sourceFile = `
			function getData(input: object): object {
				return _.map(item => Number(item)).filter(item => !!item)
			}
		`;

		const result = lintHelper({ sourceFile, ruleName });

		expect(result.errorCount).toEqual(1);
		expect(result.failures[0].getFailure()).toBe(`"map" should be imported from 'lodash-es'`);
	});

	it('should fail once with global _. and chain', () => {
		const sourceFile = `
			import { isNil, isObject, omitBy } from 'lodash-es';

			function getData(input: object): object {
				return _.chain(input)
					.pickBy(isObject) // get only objects
					.mapValues(this.transform) // call only for values as objects
					.assign(omitBy(input, isObject)) // save back result that is not object
					.omitBy(isNil) // remove null and undefined from object
					.value()
			}
		`;

		const result = lintHelper({ sourceFile, ruleName });

		expect(result.errorCount).toEqual(1);
		expect(result.failures[0].getFailure()).toBe(`"chain" should be imported from 'lodash-es'`);
	});
});
