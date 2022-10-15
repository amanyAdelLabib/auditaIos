import React from 'react';
import {View, Text} from 'react-native';

const Label = (props) => {
  return (
    <Text allowFontScaling={false} style={props.style}>
      {' '}
      {props.children}
    </Text>
  );
};

export {Label};
