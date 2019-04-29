import React from 'react';
import { StyleSheet, TextInput } from 'react-native';
import { inputPlaceholder } from '../utils/Colors';


// props are built-in, check docs.
const Input = ({ inputValue, onChangeText, onDoneAddItem }) => (
  <TextInput
    style={styles.input}
    value={inputValue}
    onChangeText={onChangeText}
    onSubmitEditing={onDoneAddItem}
    placeholder="Add a task"
    placeholderTextColor={inputPlaceholder}
    multiline={true}
    autoCapitalize="sentences"
    underlineColorAndroid="transparent"
    selectionColor={'white'}
    maxLength={30}
    returnKeyType="done"
    autoCorrect={false}
    blurOnSubmit={true}
  />
);



  const styles = StyleSheet.create({
    input: {
      paddingTop: 10,
      paddingRight: 15,
      fontSize: 30,
      color: 'white',
      fontWeight: '500'
    }
  });
  export default Input;
