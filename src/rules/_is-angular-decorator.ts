import * as ts from 'typescript';
import { isDecorator } from 'tsutils';

import { ANGULAR_BINDING_DECORATORS } from './_angular-decorators';

export function isAngularBindingDecorator(node: ts.Node): node is ts.Decorator {
	const isAngularBindingDecorator = ANGULAR_BINDING_DECORATORS.some((decorator) =>
		node.getText().includes(decorator)
	);

	return isDecorator(node) && isAngularBindingDecorator;
}
