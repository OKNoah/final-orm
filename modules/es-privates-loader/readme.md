Webpack loader for add private props to javascript
===

Add privates to javascript in file level.
Props when start with _ will be replaced to symbols.
Its just experiment =).

Actually next in next ECMA specifications, private props
will be like `this#prop = 11`.
So, this webpack loader is temporary solution.
 


Example:
---
```javascript
class EventEmitter {

  constructor() {
    this._handlers = []
    this._initHandlers()
  }

  _initHandlers() {

  }

}
```

compile to:

```javascript
var $$handlers$$ = Symbol('handlers');
var $$initHandlers$$ = Symbol('initHandlers');

class EventEmitter {

  constructor() {
    this[$$handlers$$] = []
    this[$$initHandlers$$]()
  }

  [$$initHandlers$$]() {
    
  }

}
```


TODO:
===
- Add `obj#prop` in ECMA specifications
- Add class level scope, no file scope
- Add `obj#prop` support to Babel
- Fix `var _name`, now its compile to  `var [$$name$$]`, this is syntax error.
- Fix `function _name(){}`, now its compile to  `function [$$name$$]{}`, this is syntax error.
- Fix ``` `str${this._prop}ing` ``` must be ``` `str${this[$$prop$$]}ing` ```