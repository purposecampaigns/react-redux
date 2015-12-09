'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createAll;

var _createProvider = require('./createProvider');

var _createProvider2 = _interopRequireDefault(_createProvider);

var _createConnect = require('./createConnect');

var _createConnect2 = _interopRequireDefault(_createConnect);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createAll(React) {
  var Provider = (0, _createProvider2.default)(React);
  var connect = (0, _createConnect2.default)(React);

  return { Provider: Provider, connect: connect };
}