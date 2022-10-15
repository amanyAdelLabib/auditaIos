import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  BackHandler,
  Image,
} from 'react-native';
import React, {Component} from 'react';
import {Input, Button} from 'react-native-elements';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import {connect} from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';
import {LoadingLottie} from '../components';
import {savedSecert} from '../actions';
import LottieView from 'lottie-react-native';

// import SplashScreen from 'react-native-splash-screen'

class Result extends Component {
  componentDidMount() {
    let interval = setInterval(() => {
      console.log('This will run every second!');
      this.navigateToSurvey();
      clearInterval(interval);
    }, 3000
    );
  }

  navigateToSurvey() {
    this.props.navigation.navigate('Survey');
  }

  render() {

      return (
        <>
          <View
            style={{
              position: 'absolute',
              alignSelf: 'center',
              flex: 1,
              bottom: 10,
            }}>
            <Text
              style={{
                fontSize: responsiveFontSize(1.5),
                marginTop: responsiveHeight(18),
                fontFamily: 'Roboto-Regular',
                textAlign: 'center',
                color: '#808080',
              }}>
              Powered by AHT Analytics
            </Text>
          </View>

          <View
            style={{
              width: responsiveWidth(100),
              height: responsiveHeight(100),
              // marginVertical: responsiveHeight(2),
              // marginHorizontal: responsiveWidth(28),
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image
              style={{
                width: responsiveWidth(20),
                height: responsiveHeight(20),
                borderRadius:30,
                resizeMode: 'contain',

                // marginBottom:responsiveHeight(1)
              }}
              source={require('../assets/icons/icons8-checkmark-128.png')}
            />
            <Text
              style={{
                color: '#808080',
                fontWeight: 'bold',
                fontSize: responsiveFontSize(1.8),
                marginTop: responsiveHeight(4),
                // paddingHorizontal:responsiveWidth(3)
              }}>
              Thank you, your feedback has been registered!
            </Text>

            {/* <Button
              title="Home"
              onPress={this.navigateToHome.bind(this)}
              titleStyle={styles.titleLoginBtn}
              buttonStyle={styles.successBtn}
            /> */}
          </View>
        </>
      );
  
  }
}

const styles = StyleSheet.create({
  errBtn: {
    backgroundColor: 'red',
    borderRadius: 30,
    width: responsiveWidth(20),
    marginLeft: responsiveWidth(13),
    marginTop: responsiveHeight(4),
    // paddingHorizontal: responsiveWidth(5),
  },
  successBtn: {
    backgroundColor: '#00A834',
    borderRadius: 30,
    width: responsiveWidth(20),
    // marginLeft: responsiveWidth(13),
    marginTop: responsiveHeight(4),
    // // paddingHorizontal: responsiveWidth(5),
  },
  titleLoginBtn: {
    fontSize: responsiveFontSize(2),
    paddingHorizontal: responsiveWidth(0.5),
    paddingVertical: responsiveHeight(0.8),
  },
});

const mapStateToProps = (state) => {
  return {
    failPost: state.survey.failPostSurvey,
    // failPost:true,

    successPost: state.survey.successPostSurvey,

    // language: state.translation,
    // user: state.auth.user
  };
};

const ResultRedux = connect(mapStateToProps, {
  savedSecert,
})(Result);
export {ResultRedux as Result};
