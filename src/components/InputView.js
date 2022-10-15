import React from 'react';
import {View} from 'react-native';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
const InputView = (props) => {
  return (
    <View style={[styles.containerStyle, props.style]}>{props.children}</View>
  );
};

const styles = {
  containerStyle: {
    marginHorizontal: responsiveWidth(15),
    marginTop: responsiveHeight(2),
  },
};

export {InputView};
