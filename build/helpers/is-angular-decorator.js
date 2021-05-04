"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tsutils_1 = require("tsutils");
var angular_decorators_1 = require("../constants/angular-decorators");
function isAngularBindingDecorator(node) {
    var isAngularBindingDecorator = angular_decorators_1.ANGULAR_BINDING_DECORATORS.some(function (decorator) {
        return node.getText().includes(decorator);
    });
    return tsutils_1.isDecorator(node) && isAngularBindingDecorator;
}
exports.isAngularBindingDecorator = isAngularBindingDecorator;
