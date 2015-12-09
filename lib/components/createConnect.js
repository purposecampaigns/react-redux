'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createConnect;

var _createStoreShape = require('../utils/createStoreShape');

var _createStoreShape2 = _interopRequireDefault(_createStoreShape);

var _shallowEqual = require('../utils/shallowEqual');

var _shallowEqual2 = _interopRequireDefault(_shallowEqual);

var _isPlainObject = require('../utils/isPlainObject');

var _isPlainObject2 = _interopRequireDefault(_isPlainObject);

var _wrapActionCreators = require('../utils/wrapActionCreators');

var _wrapActionCreators2 = _interopRequireDefault(_wrapActionCreators);

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var defaultMapStateToProps = function defaultMapStateToProps() {
  return {};
};
var defaultMapDispatchToProps = function defaultMapDispatchToProps(dispatch) {
  return { dispatch: dispatch };
};
var defaultMergeProps = function defaultMergeProps(stateProps, dispatchProps, parentProps) {
  return _extends({}, parentProps, stateProps, dispatchProps);
};

function getDisplayName(Component) {
  return Component.displayName || Component.name || 'Component';
}

// Helps track hot reloading.
var nextVersion = 0;

function createConnect(React) {
  var Component = React.Component;
  var PropTypes = React.PropTypes;

  var storeShape = (0, _createStoreShape2.default)(PropTypes);

  return function connect(mapStateToProps, mapDispatchToProps, mergeProps) {
    var options = arguments.length <= 3 || arguments[3] === undefined ? {} : arguments[3];

    var shouldSubscribe = Boolean(mapStateToProps);
    var finalMapStateToProps = mapStateToProps || defaultMapStateToProps;
    var finalMapDispatchToProps = (0, _isPlainObject2.default)(mapDispatchToProps) ? (0, _wrapActionCreators2.default)(mapDispatchToProps) : mapDispatchToProps || defaultMapDispatchToProps;
    var finalMergeProps = mergeProps || defaultMergeProps;
    var shouldUpdateStateProps = finalMapStateToProps.length > 1;
    var shouldUpdateDispatchProps = finalMapDispatchToProps.length > 1;
    var _options$pure = options.pure;
    var pure = _options$pure === undefined ? true : _options$pure;

    // Helps track hot reloading.

    var version = nextVersion++;

    function computeStateProps(store, props) {
      var state = store.getState();
      var stateProps = shouldUpdateStateProps ? finalMapStateToProps(state, props) : finalMapStateToProps(state);

      (0, _invariant2.default)((0, _isPlainObject2.default)(stateProps), '`mapStateToProps` must return an object. Instead received %s.', stateProps);
      return stateProps;
    }

    function computeDispatchProps(store, props) {
      var dispatch = store.dispatch;

      var dispatchProps = shouldUpdateDispatchProps ? finalMapDispatchToProps(dispatch, props) : finalMapDispatchToProps(dispatch);

      (0, _invariant2.default)((0, _isPlainObject2.default)(dispatchProps), '`mapDispatchToProps` must return an object. Instead received %s.', dispatchProps);
      return dispatchProps;
    }

    function _computeNextState(stateProps, dispatchProps, parentProps) {
      var mergedProps = finalMergeProps(stateProps, dispatchProps, parentProps);
      (0, _invariant2.default)((0, _isPlainObject2.default)(mergedProps), '`mergeProps` must return an object. Instead received %s.', mergedProps);
      return mergedProps;
    }

    return function wrapWithConnect(WrappedComponent) {
      var _class, _temp;

      var Connect = (_temp = _class = (function (_Component) {
        _inherits(Connect, _Component);

        _createClass(Connect, [{
          key: 'shouldComponentUpdate',
          value: function shouldComponentUpdate(nextProps, nextState) {
            return !pure || !(0, _shallowEqual2.default)(this.state.props, nextState.props);
          }
        }]);

        function Connect(props, context) {
          _classCallCheck(this, Connect);

          var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Connect).call(this, props, context));

          _this.version = version;
          _this.store = props.store || context.store;

          (0, _invariant2.default)(_this.store, 'Could not find "store" in either the context or ' + ('props of "' + _this.constructor.displayName + '". ') + 'Either wrap the root component in a <Provider>, ' + ('or explicitly pass "store" as a prop to "' + _this.constructor.displayName + '".'));

          _this.stateProps = computeStateProps(_this.store, props);
          _this.dispatchProps = computeDispatchProps(_this.store, props);
          _this.state = {
            props: _this.computeNextState()
          };
          return _this;
        }

        _createClass(Connect, [{
          key: 'computeNextState',
          value: function computeNextState() {
            var props = arguments.length <= 0 || arguments[0] === undefined ? this.props : arguments[0];

            return _computeNextState(this.stateProps, this.dispatchProps, props);
          }
        }, {
          key: 'updateStateProps',
          value: function updateStateProps() {
            var props = arguments.length <= 0 || arguments[0] === undefined ? this.props : arguments[0];

            var nextStateProps = computeStateProps(this.store, props);
            if ((0, _shallowEqual2.default)(nextStateProps, this.stateProps)) {
              return false;
            }

            this.stateProps = nextStateProps;
            return true;
          }
        }, {
          key: 'updateDispatchProps',
          value: function updateDispatchProps() {
            var props = arguments.length <= 0 || arguments[0] === undefined ? this.props : arguments[0];

            var nextDispatchProps = computeDispatchProps(this.store, props);
            if ((0, _shallowEqual2.default)(nextDispatchProps, this.dispatchProps)) {
              return false;
            }

            this.dispatchProps = nextDispatchProps;
            return true;
          }
        }, {
          key: 'updateState',
          value: function updateState() {
            var props = arguments.length <= 0 || arguments[0] === undefined ? this.props : arguments[0];

            var nextState = this.computeNextState(props);
            if (!(0, _shallowEqual2.default)(nextState, this.state.props)) {
              this.setState({
                props: nextState
              });
            }
          }
        }, {
          key: 'isSubscribed',
          value: function isSubscribed() {
            return typeof this.unsubscribe === 'function';
          }
        }, {
          key: 'trySubscribe',
          value: function trySubscribe() {
            if (shouldSubscribe && !this.unsubscribe) {
              this.unsubscribe = this.store.subscribe(this.handleChange.bind(this));
              this.handleChange();
            }
          }
        }, {
          key: 'tryUnsubscribe',
          value: function tryUnsubscribe() {
            if (this.unsubscribe) {
              this.unsubscribe();
              this.unsubscribe = null;
            }
          }
        }, {
          key: 'componentDidMount',
          value: function componentDidMount() {
            this.trySubscribe();
          }
        }, {
          key: 'componentWillReceiveProps',
          value: function componentWillReceiveProps(nextProps) {
            if (!(0, _shallowEqual2.default)(nextProps, this.props)) {
              if (shouldUpdateStateProps) {
                this.updateStateProps(nextProps);
              }

              if (shouldUpdateDispatchProps) {
                this.updateDispatchProps(nextProps);
              }

              this.updateState(nextProps);
            }
          }
        }, {
          key: 'componentWillUnmount',
          value: function componentWillUnmount() {
            this.tryUnsubscribe();
          }
        }, {
          key: 'handleChange',
          value: function handleChange() {
            if (!this.unsubscribe) {
              return;
            }

            if (this.updateStateProps()) {
              this.updateState();
            }
          }
        }, {
          key: 'getWrappedInstance',
          value: function getWrappedInstance() {
            return this.refs.wrappedInstance;
          }
        }, {
          key: 'render',
          value: function render() {
            return React.createElement(WrappedComponent, _extends({ ref: 'wrappedInstance'
            }, this.state.props));
          }
        }]);

        return Connect;
      })(Component), _class.displayName = 'Connect(' + getDisplayName(WrappedComponent) + ')', _class.WrappedComponent = WrappedComponent, _class.contextTypes = {
        store: storeShape
      }, _class.propTypes = {
        store: storeShape
      }, _temp);

      if (process.env.NODE_ENV !== 'production') {
        Connect.prototype.componentWillUpdate = function componentWillUpdate() {
          if (this.version === version) {
            return;
          }

          // We are hot reloading!
          this.version = version;

          // Update the state and bindings.
          this.trySubscribe();
          this.updateStateProps();
          this.updateDispatchProps();
          this.updateState();
        };
      }

      return Connect;
    };
  };
}