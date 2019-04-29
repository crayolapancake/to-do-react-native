import React from 'react';
import { StyleSheet, View, StatusBar, ActivityIndicator,
	ScrollView, AsyncStorage} from 'react-native';
import { LinearGradient } from 'expo';
import uuid from 'uuid/v1';
import { primaryGradientArray } from './utils/Colors';
import Header from './components/Header';
import SubTitle from './components/SubTitle';
import Input from './components/Input';
import List from './components/List';
import Button from './components/Button';

const headerTitle = 'To Do';

export default class Main extends React.Component {

  state = {
    inputValue: '',
    loadingItems: false,
    allItems: {},
    isCompleted: false
  };

  componentDidMount = () => {
    this.loadingItems();
  };

  newInputValue = value => {
    this.setState({ inputValue: value });
  };

  // CRUD operations will be used in the app using AsyncStorage, so that our application is able to perform operations with realtime data on the device.
  // associate multiple operations for each to do item in the list for each CRUD action.
  // using Objects instead of an array to store these items: Operating CRUD operations on an Object will be easier in this case.
  // identify each object thru a unique ID. Generate IDs with uuid.


  // asynchStorage is now DEPRECATED.
  // Each method in the API returns a Promise object.
  // loadingItems is FETCHING data:
  loadingItems = async () => {
    try {
      const allItems = await AsyncStorage.getItem('ToDos');

      this.setState({
        loadingItems: true,
        // JSON.parse transforms data from string to a JS object.
        allItems: JSON.parse(allItems) || {}
      });
    } catch (err) {
      console.log(err);
    }
  };


  //
  onDoneAddItem = () => {
    const { inputValue } = this.state;

    if (inputValue !== '') {
      this.setState(prevState => {
        // generates a unique ID
        const id = uuid();

        // newItemObject uses the generated ID as a variable name.
        const newItemObject = {
          [id]: {
            id,
            isCompleted: false,
            text: inputValue,
            createdAt: Date.now()
          }
        };
        /* structure of to-do item is like this:
        232390: {
        id: 232390,           // same id as the object
        text: 'New item',     // name of the To Do item
        isCompleted: false,   // by default
        createdAt: Date.now()
      }
      */

        // newState uses the prevState object, clears the TextInput for newInputValue and adds our newItemObject at the end of the other to-do items list
        const newState = {
          ...prevState,
          inputValue: '',
          allItems: {
            ...prevState.allItems,
            ...newItemObject
          }
        };
        this.saveItems(newState.allItems);
        return { ...newState };
      });
    }
  };

  // To delete an item from the to-do list object, we have to get the id of the item from the state.
  // This is further passed as a prop to our List component as deleteItem={this.deleteItem}.
  deleteItem = id => {
    this.setState(prevState => {
      const allItems = prevState.allItems;
      delete allItems[id];
      const newState = {
        ...prevState,
        ...allItems
      };
      this.saveItems(newState.allItems);
      return { ...newState };
    });
  };


  // The completeItem and incompleteItem track which items in the to do list have been marked completed by the user or have been unmarked.
  // In AsyncStorage items are saved in strings. It cannot store objects.Need to use JSON.stringify()
  // Similarly, when fetching the item from the storage, we have to parse it using JSON.parse() like we do above in loadingItems() method.
  completeItem = id => {
    this.setState(prevState => {
      const newState = {
        ...prevState,
        allItems: {
          ...prevState.allItems,
          [id]: {
            ...prevState.allItems[id],
            isCompleted: true
          }
        }
      };
      this.saveItems(newState.allItems);
      return { ...newState };
    });
  };

  incompleteItem = id => {
    this.setState(prevState => {
      const newState = {
        ...prevState,
        allItems: {
          ...prevState.allItems,
          [id]: {
            ...prevState.allItems[id],
            isCompleted: false
          }
        }
      };
      this.saveItems(newState.allItems);
      return { ...newState };
    });
  };

  saveItems = newItem => {
    const saveItem = AsyncStorage.setItem('To Dos', JSON.stringify(newItem));
  };


  //
  deleteAllItems = async () => {
     try {
       await AsyncStorage.removeItem('ToDos');
       this.setState({ allItems: {} });
     } catch (err) {
       console.log(err);
     }
   };


  render() {
    const { inputValue, loadingItems, allItems } = this.state;

    return (
      <LinearGradient
        className="container"
        colors={primaryGradientArray}
        style={styles.container}
      >
        <StatusBar barStyle="light-content"/>

        <View style={styles.centered} className="Header">
          <Header title={headerTitle}/>
        </View>

        <View style={styles.inputContainer} className="inputContainer">
          <SubTitle subtitle={"What's Next?"} />
          <Input
            inputValue={inputValue}
            onChangeText={this.newInputValue}
            onDoneAddItem={this.onDoneAddItem}
          />
        </View>

        <View style={styles.list}>
          <View style={styles.column}>
           <SubTitle subtitle={'Recent Tasks'} />
           <View style={styles.deleteAllButton}>
             <Button deleteAllItems={this.deleteAllItems} />
           </View>
         </View>

         { loadingItems ? (
          <ScrollView contentContainerStyle={styles.scrollableList} className="scrollView">
            {Object.values(allItems)
              .reverse()
              .map(item => (
                <List
                  key={item.id}
                  {...item}
                  deleteItem={this.deleteItem}
                  completeItem={this.completeItem}
                  incompleteItem={this.incompleteItem}
                />
              ))}
          </ScrollView>
        ) : (
          <ActivityIndicator size="large" color="white" />
        )}
        </View>

      </LinearGradient>
    );
  }
}

// ScrollView is wrapper that provides interface for scrollable lists.
// Vertical or horizontal.

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  centered: {
    alignItems: 'center'
  },
  inputContainer: {
    marginTop: 40,
    paddingLeft: 15
  },
  list: {
    flex: 1,
    marginTop: 70,
    paddingLeft: 15,
    marginBottom: 10
  },
  scrollableList: {
    marginTop: 15
  },
  column: {
   flexDirection: 'row',
   alignItems: 'center',
   justifyContent: 'space-between'
 },
 deleteAllButton: {
   marginRight: 40
 }
});
