'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _iridium = require('iridium');

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var db = new _iridium.Core({ database: _config2.default.database });
db.connect();

exports.default = db;

//# sourceMappingURL=db.js.map