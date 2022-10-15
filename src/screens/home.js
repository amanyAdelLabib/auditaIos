import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  BackHandler,
  Alert,
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

// import SplashScreen from 'react-native-splash-screen'

class Home extends Component {
  componentDidMount() {
    // SplashScreen.hide();
    this.getData();
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    console.log('info secretKey');
    console.log(this.props.secretKey);
  }
  getData = async () => {
    // async getData(){
    console.log('in fun get data');

    const value = await AsyncStorage.getItem('USER_SECRET');

    if (value !== null) {
      console.log('have data');
      console.log(JSON.parse(value));
      // await this.props.savedSecert(value);
    } else {
      console.log(' in else storage save data');
    }
  };
  onButtonPress = () => {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    // then navigate
    // navigate('NewScreen');
  };

  handleBackButton = () => {
    this.props.navigation.navigate('Home');

    return true;
  };
  render() {
    return (
      <View
        style={styles.mainContainer}
        onTouchStart={() => this.props.navigation.navigate('Survey')}>
        <TouchableWithoutFeedback
          onPress={() => {
            this.props.navigation.navigate('Survey');
          }}>
          <View style={styles.bodyContainer}>
            <Text style={styles.mainText}>Tap To Start</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainText: {
    color: 'black',
    fontSize: responsiveFontSize(2),
    textAlign: 'center',
    fontFamily: 'Roboto-Regular',
  },
  bodyContainer: {
    marginHorizontal: responsiveWidth(30),
    // backgroundColor:'red',
    width: responsiveWidth(40),
  },
  mainContainer: {
    paddingVertical: responsiveHeight(45),
    backgroundColor: 'white',
    height: responsiveHeight(100),
  },
});

const mapStateToProps = (state) => {
  return {
    secretKey: state.auth.secretKey,
    secretUrl: state.auth.secretUrl,

    // language: state.translation,
    // user: state.auth.user
  };
};

const HomeRedux = connect(mapStateToProps, {
  savedSecert,
})(Home);
export {HomeRedux as Home};
