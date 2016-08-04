'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = compiler;
var stringLiteralRegExp = /(['"`])[\s\S]*?\1/img;
var privatePropRegExp = /\b\.?_([\w$]+)/img;
var label = '###' + Math.random().toString().slice(2) + '###';
var labelRegExp = new RegExp(label, 'img');

function compiler(code) {
	if (!code) return code;

	// save literals
	var literals = [];
	code = code.replace(stringLiteralRegExp, function (literal) {
		literals.push(literal);
		return label;
	});

	// transform code
	var props = [];
	code = code.replace(privatePropRegExp, function (match, prop) {
		if (props.indexOf(prop) === -1) {
			props.push(prop);
		}
		return '[$$' + prop + '$$]';
	});

	// restore literals
	code = code.replace(labelRegExp, function () {
		return literals.shift();
	});

	// add prop symbols in head
	var symbolsInit = props.map(function (prop) {
		return 'var $$' + prop + '$$ = Symbol(\'' + prop + '\');';
	}).join('\n');

	if (!symbolsInit) return code;
	return symbolsInit + '\n\n' + code;
}

//# sourceMappingURL=compiler.js.map