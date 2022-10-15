import React from 'react';
import {View} from 'react-native';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
  responsiveScreenHeight,
} from 'react-native-responsive-dimensions';
import LottieView from 'lottie-react-native';

const LoadingLottie = () => {
  return (
    <View>
      <View
        style={{
          width: '100%',
          height: '85%',
          marginVertical: responsiveHeight(5),
          paddingHorizontal: responsiveHeight(0.5),
        }}>
        <LottieView
          source={require('../assets/lottie/27527-loading-and-smiling.json')}
          autoPlay
          loop
          style={{
            position: 'absolute',
            top: 0,
            width: '100%',
            height: '85%',
            // backgroundColor: 'yellow',
          }}
        />
      </View>
    </View>
  );
};

const styles = {
  containerStyle: {
    flexDirection: 'column',
    alignItems: 'center',
    // justifyContent: 'space-between',
    width: responsiveWidth('25'),
    height: responsiveHeight('11'),
    backgroundColor: 'white',
    borderRadius: 8,
    paddingVertical: responsiveHeight('.8'),
    marginTop: '5%',
  },
};

export {LoadingLottie};
