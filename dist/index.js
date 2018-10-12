var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("index", ["require", "exports", "react", "react-native", "react-native-svg", "react-native", "lodash"], function (require, exports, react_1, react_native_1, react_native_svg_1, react_native_2, lodash_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var _a = react_native_1.Dimensions.get('window'), width = _a.width, height = _a.height;
    var Autocomplete = /** @class */ (function (_super) {
        __extends(Autocomplete, _super);
        function Autocomplete(props) {
            var _this = _super.call(this, props) || this;
            _this.setInputValue = function (value) {
                _this.setState({ inputValue: value }, function () {
                    _this.debouncedSetItems();
                });
            };
            _this.setInputValueExternal = function (value) {
                if (value) {
                    _this.setState({ inputValue: value });
                }
                else {
                    _this.setState({ inputValue: '' });
                }
            };
            _this.clearInput = function () {
                _this.setState({ inputValue: '' });
            };
            _this.setItems = function () {
                var stateData = _this.state.inputValue;
                _this.props.dataSourceFn(_this.state.inputValue)
                    .then(function (itemsData) {
                    var updStateData = _this.state.inputValue;
                    if (stateData !== updStateData) {
                        return;
                    }
                    var itemsArray = itemsData.slice();
                    var newItemsArray = itemsArray.slice(0, _this.props.hintsNo);
                    _this.setState({ items: newItemsArray });
                });
            };
            _this.selectItem = function (item) {
                if (item) {
                    _this.setState({ inputValue: item[_this.props.labelField], items: [], selectedItem: item });
                    _this.props.onSelect(item);
                }
                else {
                    var items = _this.state.items.slice();
                    var selectedItem = items.find(function (item) { return item[_this.props.labelField] === _this.state.inputValue; });
                    if (selectedItem) {
                        _this.props.onSelect(selectedItem);
                    }
                }
                _this.toggleModal();
            };
            _this.toggleHints = function () {
                _this.setState({ areHintsVisible: true });
            };
            _this.toggleModal = function () {
                _this.setState({ modalVisible: !_this.state.modalVisible }, function () {
                    if (_this.componentTextInput)
                        _this.componentTextInput.blur();
                });
            };
            _this.state = {
                inputValue: '',
                selectedItem: {},
                items: [],
                modalVisible: false,
            };
            _this.debouncedSetItems = lodash_1.debounce(_this.setItems, 200);
            return _this;
        }
        Autocomplete.prototype.componentDidUpdate = function (prevProps) {
            if (this.props.selectedItem !== prevProps.selectedItem) {
                this.setInputValueExternal(this.props.selectedItem[this.props.labelField]);
            }
        };
        Autocomplete.prototype.render = function () {
            var _this = this;
            var items = this.state.items;
            if (this.state.inputValue.length > this.props.minChars) {
                if (Array.isArray(items) && items.length > 0) {
                    items = items.map(function (item) {
                        return <react_native_1.Text style={styles.select} onPress={function () { return _this.selectItem(item); }} key={Math.random().toString(36).substr(2, 9)}>
                    {item[_this.props.labelField]}
                  </react_native_1.Text>;
                    });
                }
            }
            else {
                items = null;
            }
            return (<react_native_1.View>
        <react_native_1.Modal animationType="slide" transparent={false} visible={this.state.modalVisible}>
          <react_native_1.View style={styles.backBtn}>
            <react_native_1.TouchableOpacity onPress={function () { return _this.toggleModal(); }}>
              <react_native_svg_1.default height="32" width="32">
                <react_native_svg_1.Path scale="1.5" d="M 10 5.3417969 C 9.744125 5.3417969 9.4879688 5.4412187 9.2929688 5.6367188 L 3.6367188 11.292969 C 3.2457187 11.683969 3.2457187 12.317031 3.6367188 12.707031 L 9.2929688 18.363281 C 9.6839688 18.754281 10.317031 18.754281 10.707031 18.363281 L 10.792969 18.277344 C 11.183969 17.886344 11.183969 17.253281 10.792969 16.863281 L 6.9296875 13 L 20 13 C 20.552 13 21 12.552 21 12 C 21 11.448 20.552 11 20 11 L 6.9296875 11 L 10.792969 7.1367188 C 11.183969 6.7457187 11.183969 6.1126563 10.792969 5.7226562 L 10.707031 5.6367188 C 10.511531 5.4412187 10.255875 5.3417969 10 5.3417969 z" fill="#555"/>
              </react_native_svg_1.default>
            </react_native_1.TouchableOpacity>
          </react_native_1.View>
          <react_native_1.View style={styles.navbar}>
            <react_native_1.View style={styles.inputContainer}>
              <react_native_1.TextInput value={this.state.inputValue} style={styles.input} onChangeText={function (text) { return _this.setInputValue(text); }} onFocus={function () { return _this.setItems(); }} onSubmitEditing={function () { return _this.selectItem(); }} ref={function (input) { _this.modalTextInput = input; }} withRef autoFocus/>
              {items ? <react_native_1.View style={styles.selectsContainer}>{items}</react_native_1.View> : null}
            </react_native_1.View>

            <react_native_1.View style={styles.delBtn}>
              <react_native_1.TouchableOpacity onPress={function () { return _this.clearInput(); }}>
                <react_native_svg_1.default width="32" height="32">
                  <react_native_svg_1.Line scale="1.5" fill="none" strokeWidth="2" stroke="#ff0033" x1="4" y1="4" x2="20" y2="20"/>
                  <react_native_svg_1.Line scale="1.5" fill="none" strokeWidth="2" stroke="#ff0033" x1="20" y1="4" x2="4" y2="20"/>
                </react_native_svg_1.default>
              </react_native_1.TouchableOpacity>
            </react_native_1.View>

          </react_native_1.View>
        </react_native_1.Modal>
        <react_native_1.TouchableOpacity onPress={function () { return _this.toggleModal(); }}>
          <react_native_1.View pointerEvents="none">
            <react_native_1.TextInput value={this.state.inputValue} style={styles.input} placeholder="Insert value"/>
          </react_native_1.View>
        </react_native_1.TouchableOpacity>
      </react_native_1.View>);
        };
        return Autocomplete;
    }(react_1.Component));
    exports.default = Autocomplete;
    var styles = react_native_2.StyleSheet.create({
        backBtn: {
            paddingTop: 5,
            paddingLeft: 5,
            backgroundColor: '#6c90bf',
        },
        navbar: {
            paddingTop: 12,
            paddingBottom: 24,
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center',
            backgroundColor: '#6c90bf',
        },
        inputContainer: {
            flexDirection: 'column',
            flex: 1,
            paddingLeft: 10,
            paddingRight: 10,
            position: 'relative',
        },
        input: {
            borderWidth: 2,
            borderColor: "#555",
            backgroundColor: '#eee',
            minHeight: 52.6,
        },
        delBtn: {
            paddingLeft: 5,
            paddingRight: 5,
            position: 'absolute',
            right: 15,
            top: 21,
        },
        selectsContainer: {
            flexDirection: 'column',
        },
        select: {
            padding: 5,
            borderColor: '#eee',
            backgroundColor: '#eee',
        },
    });
});
