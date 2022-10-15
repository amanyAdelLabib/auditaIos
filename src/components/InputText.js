import React from 'react';
import {View, TextInput} from 'react-native';

const InputText = (props) => {
  return (
    <TextInput
      allowFontScaling={false}
      style={props.style}
      autoCapitalize="none"
      placeholder={props.placeholder}
      secureTextEntry={props.secure}
      onChangeText={props.onChangeText}
      value={props.value}
    />
  );
};

export {InputText};
