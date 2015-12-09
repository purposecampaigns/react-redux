'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.connect = exports.Provider = undefined;

var _reactNative = require('react-native');

var _reactNative2 = _interopRequireDefault(_reactNative);

var _createAll2 = require('./components/createAll');

var _createAll3 = _interopRequireDefault(_createAll2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _createAll = (0, _createAll3.default)(_reactNative2.default);

var Provider = _createAll.Provider;
var connect = _createAll.connect;
exports.Provider = Provider;
exports.connect = connect;