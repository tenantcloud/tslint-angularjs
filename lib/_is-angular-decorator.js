"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tsutils_1 = require("tsutils");
var _angular_decorators_1 = require("./_angular-decorators");
function isAngularBindingDecorator(node) {
    var isAngularBindingDecorator = _angular_decorators_1.ANGULAR_BINDING_DECORATORS.some(function (decorator) {
        return node.getText().includes(decorator);
    });
    return tsutils_1.isDecorator(node) && isAngularBindingDecorator;
}
exports.isAngularBindingDecorator = isAngularBindingDecorator;
