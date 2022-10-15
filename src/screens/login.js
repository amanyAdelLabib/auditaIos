import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
} from 'react-native';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
  brandNameChanged,
  branchNameChanged,
  passwordChanged,
  loginUser,
  storageStatus,
  savedSecert,
  savedUrl,
  getAllUserData,
} from '../actions';
import {Input, Button} from 'react-native-elements';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import Orientation from 'react-native-orientation';
import AsyncStorage from '@react-native-community/async-storage';
import AwesomeAlert from 'react-native-awesome-alerts';
import reactotron from 'reactotron-react-native';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initialScreen: false,
      errorFlag: false,
      loginSubmit: false,
      branchName:'',
      brandName:'',
      password:''
    };
  }

  componentDidMount() {
    console.log('in did mount');
    Orientation.lockToPortrait();
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.errMsgLogin && this.state.loginSubmit) {
      this.setState({
        errorFlag: true,
        loginSubmit:false
      });
    }   

    if (nextProps.loading && this.state.loginSubmit) {

     
      // reactotron.log('in get dtaaaa will reci', nextProps.authData);

      this.props.getAllUserData({
        url: nextProps.authData.url,
        id: nextProps.authData.id,
      });
    
   
    } 
    if (nextProps.loadingGetAllData && this.state.loginSubmit) {
      this.setState({
        loginSubmit:false
      });
    }


  }
  componentDidUpdate(prevProps) {

    reactotron.log('in get dtaaaa will reci did update', prevProps.loadingAllData);
    reactotron.log('in get dtaaaa will reci did update getAllData', prevProps.getAllData);

    if (prevProps.loadingAllData) {
      this.props.navigation.replace('Survey');
    } 
}

  onBranchnameChange(text) {
    console.log(text);
    this.setState({
      branchName:text
    });
  }

  onBrandnameChange(text) {
    console.log(text);
    this.setState({
      brandName:text
    });
  }

  onPasswordChange(text) {
    console.log(text);
    this.setState({
      password:text
    });

  }

 
  closeErrorAlert = () => {
    this.setState({
      errorFlag: false,
      loginSubmit:false
    });
  };
  getData =  () => {
    // async getData(){
    console.log('in fun get data');
    
    reactotron.log('in get dtaaaa', this.props.authData.url,this.props.authData.id);

      this.props.getAllUserData({
        url: this.props.authData.url,
        id: this.props.authData.id,
      });

      // this.props.navigation.navigate('Survey');

      //  await AsyncStorage.removeItem('USER')
    // }
  };

  onButtonPressLogin() {
    console.log('btn login');

    this.props.loginUser({
      // "brand_name":"aht",
      // "branch_name":"New Balance ( CFC )",
      // "password":"ahtcmiles"
      brand_name: this.state.brandName,
      branch_name: this.state.branchName,
      password: this.state.password,
    });
    this.setState({
      loginSubmit: true,
    });
    // this.storeData();
  }
  displayErrorMsg(text)
  {
    if(text =="UnAuthorized")
    return " This account is already logged in from another device"
    else if(text =="Wrong branch name")
    return "Wrong user name"
    else if(text =="Errors in inputs")
    return " All fields are required"
    else
    return text;
    
  }
  loginState() {
    console.log('loading');
    // if (this.props.loading && this.state.loginSubmit) {

    //   this.setState({
    //     loginSubmit:false
    //   });
    //   // reactotron.log('in get dtaaaa will reci', nextProps.authData);

    //   this.props.getAllUserData({
    //     url: this.props.authData.url,
    //     id: this.props.authData.id,
    //   });
   
    // } 
  }

  navigateToHome() {
    this.props.navigation.navigate('Home');
  }

  render() {
    {
      return (
        <KeyboardAvoidingView
          style={{
            flex: 1,
            backgroundColor: 'white',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
          // behavior="height"
          enabled>
          <ScrollView>
            <View style={styles.bodyContainer}>
              <Image
                style={styles.logoImg}
                source={require('../assets/icons/icon3.jpeg')}
              />

              <Input
                placeholder="Company Name"
                onChangeText={this.onBrandnameChange.bind(this)}
                value={this.state.brandName}
                inputContainerStyle={styles.inputContainerStyle}
                autoCapitalize="none"
                inputStyle={styles.inputStyle}
              />
              <Input
                placeholder=" User Name"
                onChangeText={this.onBranchnameChange.bind(this)}
                value={this.state.branchName}
                inputContainerStyle={styles.inputContainerStyle}
                inputStyle={styles.inputStyle}
                autoCapitalize="none"
              />
              <Input
                placeholder="Password"
                value={this.state.password}
                onChangeText={this.onPasswordChange.bind(this)}
                autoCapitalize="none"
                inputContainerStyle={styles.inputContainerStyle}
                inputStyle={styles.inputStyle}
              />
              <Button
                title="Login"
                onPress={this.onButtonPressLogin.bind(this)}
                titleStyle={styles.titleLoginBtn}
                buttonStyle={styles.loginBtn}
                loading={this.state.loginSubmit}
              />
            </View>
            {this.loginState()}
            <AwesomeAlert
              show={this.state.errorFlag}
              showProgress={false}
              title="Error Message"
              message={this.displayErrorMsg(this.props?.errMsgLogin?.msg)}
              closeOnTouchOutside={true}
              closeOnHardwareBackPress={false}
              showCancelButton={true}
              cancelText="Close"
              cancelButtonColor="#DD6B55"
              titleStyle={{color: '#DD6B55', fontWeight: 'bold'}}
              onCancelPressed={() => {
                this.closeErrorAlert();
              }}
            />
          </ScrollView>
        </KeyboardAvoidingView>
      );
    }
  }
}

const styles = StyleSheet.create({
  iconLogo: {
    textAlign: 'center',
    marginBottom: '10%',
  },
  loginBtn: {
    backgroundColor: '#0d008e',
    borderRadius: 30,
    width: responsiveWidth(40),
    marginHorizontal: responsiveWidth(1),
    marginTop: responsiveHeight(4),
  },
  titleLoginBtn: {
    fontSize: responsiveFontSize(2),
    paddingHorizontal: responsiveWidth(0.5),
    paddingVertical: responsiveHeight(0.8),
  },
  inputContainerStyle: {
    marginVertical: responsiveHeight(0.3),
    // marginHorizontal: responsiveWidth(5),
    width: responsiveWidth(80),
  },
  inputStyle: {
    fontSize: responsiveFontSize(1.5),
    color: '#4eace9',
  },
  logoImg: {
    width: responsiveWidth(40),
    height: responsiveHeight(40),
    resizeMode: 'contain',
  },
  bodyContainer: {
    marginHorizontal: responsiveWidth(10),
    marginVertical: responsiveHeight(5),
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainContainer: {
    backgroundColor: 'white',
    // height: responsiveHeight(100)
  },
});

const mapStateToProps = (state) => {
  return {
    // brandName: state.auth.brandName,
    // branchName: state.auth.branchName,
    // password: state.auth.password,
    loading: state.auth.loading,
    syncStorageStatus: state.auth.syncStorageStatus,
    authData: state.auth.userData,
    errMsgLogin: state.auth.errMsg,
    loadingAllData: state.getUserData.loadingGetAllData,
    getAllData: state.getUserData.allData,


    // language: state.translation,
    // user: state.auth.user
  };
};

const LoginRedux = connect(mapStateToProps, {
  brandNameChanged,
  branchNameChanged,
  passwordChanged,
  loginUser,
  storageStatus,
  savedSecert,
  savedUrl,
  getAllUserData,
})(Login);
export {LoginRedux as Login};
