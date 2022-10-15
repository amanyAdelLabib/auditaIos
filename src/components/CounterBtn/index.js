import React, {useState,useEffect} from 'react';
import { View} from 'react-native';
import {Input, Button} from 'react-native-elements';
import reactotron from 'reactotron-react-native';

import styles from './style';

export function CounterBtn({
  onChangeCounter,containerStyle
}) {
  const [inputValue, setInputValue] = useState(0);

  useEffect(() => {
    // if(inputValue !==0)
    onChangeCounter(inputValue)
  },[inputValue]);
  /* ******************************** Functions *********************************  */
  const incrementCounter = () => {
    setInputValue(parseInt(inputValue) + 1);
  };

  const decrementCounter = () => {
    setInputValue(parseInt(inputValue) - 1);
  };

  const onChangeInput = (val) => {
    // if(!isNaN(val))
    // setInputValue(val)

    setInputValue(val.replace(/[^0-9]/g, '-'));
  };
  return (
    <View style={[styles.containerStyle,containerStyle]}>
      <Button
        title="-"
        type="outline"
        // disabled={inputValue == 0 || inputValue == ''}
        onPress={decrementCounter}
      />
      <Input
        keyboardType="numeric"
        value={inputValue.toString()}
        onChangeText={onChangeInput}
        placeholder="0"
        containerStyle={styles.containerInputStyle}
        inputContainerStyle ={styles.inputContainer}
        inputStyle={styles.inputStyle}
      />
      <Button
        // disabled={inputValue == ''}
        title="+"
        type="outline"
        onPress={incrementCounter}
      />
    </View>
  );
}
