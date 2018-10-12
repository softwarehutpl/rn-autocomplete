import React, { Component } from 'react';
import { TextInput, Text, View, Modal, TouchableOpacity, Dimensions } from 'react-native';
import Svg,{ Path, Line } from 'react-native-svg';
import { StyleSheet } from 'react-native';
import { debounce } from 'lodash';

const { width, height } = Dimensions.get('window');

interface State {
  inputValue?: string,
  selectedItem?: Object,
  items?: Array<Object>,
  modalVisible: boolean,
}

interface Props {
  dataSourceFn: Function,
  onSelect: Function,
  selectedItem?: Object,
  labelField: string,
  minChars: number,
  hintsNo: number,
}

class Autocomplete extends Component<State, Props> {
  constructor(props: Props) {
    super(props);
    this.state = {
      inputValue: '',
      selectedItem: {},
      items: [],
      modalVisible: false,
    };
    this.debouncedSetItems = debounce(this.setItems, 200);
  }

  componentDidUpdate(prevProps) {
    if (this.props.selectedItem !== prevProps.selectedItem) {
      this.setInputValueExternal(this.props.selectedItem[this.props.labelField]);
    }
  }

  setInputValue = (value) => {
    this.setState({ inputValue: value }, () => {
      this.debouncedSetItems();
    });
  };

  setInputValueExternal = (value) => {
    if (value) {
      this.setState({ inputValue: value });
    } else {
      this.setState({ inputValue: '' });
    }
  };

  clearInput = () => {
    this.setState({ inputValue: '' });
  }

  setItems = () => {
    const stateData = this.state.inputValue;
    this.props.dataSourceFn(this.state.inputValue)
      .then((itemsData) => {
        const updStateData = this.state.inputValue;
        if (stateData !== updStateData) {
          return;
        }
        const itemsArray = [...itemsData];
        const newItemsArray = itemsArray.slice(0, this.props.hintsNo);
        this.setState({ items: newItemsArray });
      });
  }

  selectItem = (item) => {
    if (item) {
      this.setState({ inputValue: item[this.props.labelField], items: [], selectedItem: item });
      this.props.onSelect(item);
    } else {
      const items = [...this.state.items];
      const selectedItem = items.find(item => item[this.props.labelField] === this.state.inputValue);
      if(selectedItem) {
        this.props.onSelect(selectedItem);
      }
    }
    this.toggleModal();
  }

  toggleHints = () => {
    this.setState({ areHintsVisible: true });
  }

  toggleModal = () => {
    this.setState({modalVisible: !this.state.modalVisible}, () => {
        if(this.componentTextInput) this.componentTextInput.blur();
    });
  }

  render() {
    let items = this.state.items;
    if(this.state.inputValue.length > this.props.minChars) {
      if (Array.isArray(items) && items.length > 0) {
        items = items.map(item => {
          return <Text
                  style={styles.select}
                  onPress={() => this.selectItem(item)}
                  key={Math.random().toString(36).substr(2, 9)}
                  >
                    {item[this.props.labelField]}
                  </Text>
        });
      }
    } else {
      items = null;
    }


    return (
      <View>
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modalVisible}
          >
          <View style={styles.backBtn}>
            <TouchableOpacity onPress={() => this.toggleModal()}>
              <Svg height="32" width="32">
                <Path scale="1.5" d="M 10 5.3417969 C 9.744125 5.3417969 9.4879688 5.4412187 9.2929688 5.6367188 L 3.6367188 11.292969 C 3.2457187 11.683969 3.2457187 12.317031 3.6367188 12.707031 L 9.2929688 18.363281 C 9.6839688 18.754281 10.317031 18.754281 10.707031 18.363281 L 10.792969 18.277344 C 11.183969 17.886344 11.183969 17.253281 10.792969 16.863281 L 6.9296875 13 L 20 13 C 20.552 13 21 12.552 21 12 C 21 11.448 20.552 11 20 11 L 6.9296875 11 L 10.792969 7.1367188 C 11.183969 6.7457187 11.183969 6.1126563 10.792969 5.7226562 L 10.707031 5.6367188 C 10.511531 5.4412187 10.255875 5.3417969 10 5.3417969 z"
                fill="#555"
                />
              </Svg>
            </TouchableOpacity>
          </View>
          <View style={styles.navbar}>
            <View style={styles.inputContainer}>
              <TextInput
                value={this.state.inputValue}
                style={styles.input}
                onChangeText={(text) => this.setInputValue(text)}
                onFocus={() => this.setItems()}
                onSubmitEditing={() => this.selectItem()}
                ref={(input) => { this.modalTextInput = input; }} withRef
                autoFocus
              />
              {items ? <View style={styles.selectsContainer}>{items}</View> : null}
            </View>

            <View style={styles.delBtn}>
              <TouchableOpacity onPress={() => this.clearInput()}>
                <Svg width="32" height="32">
                  <Line scale="1.5" fill="none" strokeWidth="2" stroke="#ff0033" x1="4" y1="4" x2="20" y2="20"/>
                  <Line scale="1.5" fill="none" strokeWidth="2" stroke="#ff0033" x1="20" y1="4" x2="4" y2="20"/>
                </Svg>
              </TouchableOpacity>
            </View>

          </View>
        </Modal>
        <TouchableOpacity onPress={() => this.toggleModal()}>
          <View pointerEvents="none">
            <TextInput
              value={this.state.inputValue}
              style={styles.input}
              placeholder="Insert value"
            />
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

export default Autocomplete;

const styles = StyleSheet.create({
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