import {Image, StyleSheet, View,PermissionsAndroid, Platform} from 'react-native';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
  savedSecert,
  savedUrl,
  userApiObj,
  getAllUserData,
  getCoordsInfo,
} from '../actions';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import AsyncStorage from '@react-native-community/async-storage';
import NetInfo from '@react-native-community/netinfo';
import Reactotron from 'reactotron-react-native';
import isEmpty from 'lodash/isEmpty';
import Geolocation from 'react-native-geolocation-service';
import reactotron from 'reactotron-react-native';
import { PERMISSIONS, check, request } from 'react-native-permissions'


class Intial extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initialScreen: '',
      lastState: null,
      currentLongitude:'',
      currentLatitude:''

    };
  }

  componentDidMount() {
    console.log('heloooooooooooooooooo')
    this.requestPermissions();


    let interval = setInterval(() => {
      console.log('This will run every second!');
      this.getData();
      if(!isEmpty(this.props.authData ))
      {
        this.props.getAllUserData({
          url: this.props.authData.url,
          id: this.props.authData.id,
        });
      }
      clearInterval(interval);
    }, 3000);
    this.unsubscribe = NetInfo.addEventListener((state) => {
      if (this.timeout) {
        clearTimeout(this.timeout);
      }
      this.timeout = setTimeout(async () => {
        if (this.state.lastState !== state.isConnected) {
          console.log('***********************************');
          console.log('Connection type', state.type);
          console.log('Is connected?', state.isConnected);
          console.log('***********************************');
          this.state.lastState = state.isConnected;

          const getHistory = await AsyncStorage.getItem('@API_QUEUE');
          // if ( state.isConnected)  {
          //   if(!isEmpty(this.props.authData ))
          //   {
          //     this.props.getAllUserData({
          //       url: this.props.authData.url,
          //       id: this.props.authData.id,
          //     });
          //   }
        
          // }
          if (getHistory && state.isConnected) {
            console.log('************* Send History ********************');
            const historyObj = JSON.parse(getHistory);
            Reactotron.display({
              name: 'historyObj',
              value: historyObj,
            });
            historyObj.map((data, index) => {
              console.log('****************data', data);
              userApiObj
                .PostSurvey(data)
                .then((res) => {
                  console.log('****************res', res);
                  if (res.success) {
                    console.log(index, ' completed', res.success);
                  } else {
                    console.log(index, ' failed');
                  }
                })
                .catch((err) => {
                  console.log('err', err);
                });
            });
            await AsyncStorage.setItem('@API_QUEUE', JSON.stringify([]));
          }
        }
      }, 1000);
    });
  }

  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
    }
  }
  requestPermissions = async ()=> {
    // const granted= await request (
    //   Platform.select({
    //     android:PERMISSIONS.ANDROID.ACCESS_MEDIA_LOCATION,
    //     ios:PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
    //   }),{
    //     title:'DemoApp',
    //     message:' DemoApp would like to access your location'
    //   }
    // )

    // console.log('locationnnn')
    // console.log(granted)

    if (Platform.OS === 'android') {
    
    await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
    // const grantedIos = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);|| grantedIos === RESULTS.GRANTED
    if (granted === PermissionsAndroid.RESULTS.GRANTED   ) {
      console.log('You can use the location');
     Geolocation.getCurrentPosition(
        (position) => {
          console.log(position);
          this.props.getCoordsInfo(position.coords)
        },
        error => {
          // See error code charts below.
          console.log(error.code, error.message);
        },
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
      );
    } else {
      reactotron.log('location permission denied');
    }
  }
  else
  {
    const granted = await Geolocation.requestAuthorization("whenInUse");
    // if(auth === "granted") {
    if(granted==="granted")
    {
      console.log('You can use the location ios true');

    await  Geolocation.getCurrentPosition(
        (position) => {
          console.log('You can use the location ios true position' );

          console.log(position);
          this.props.getCoordsInfo(position.coords)
        },
        error => {
          console.log('You can use the location ios true position error' );

          // See error code charts below.
          console.log(error.code, error.message);
        },
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
      );
    }
    else{
      console.log('You can use the location ios false');

    }
    }

  }
  
  getData = async () => {
    // async getData(){
    console.log('in fun get data');

    const value = await AsyncStorage.getItem('USER_SECRET');
    const valueUrl = await AsyncStorage.getItem('USER_URL');

    if (!isEmpty(this.props.authData) ) {
      // console.log('have data in intial');
      // console.log(value);
      // await this.props.savedSecert(value);
      // await this.props.savedUrl(valueUrl);
      this.props.navigation.navigate('Survey');
    } else {
      console.log(' in else storage save data');
      this.props.navigation.navigate('Login');
    }
  };

  render() {
    return (
      <View style={styles.mainContainer}>
        <View style={styles.bodyContainer}>
          <Image
            style={styles.loadingImg}
            
            source={require('../assets/icons/icon1.jpeg')}
            
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: 'white',
    height: responsiveHeight(100),
  },
  bodyContainer: {
    marginHorizontal: responsiveWidth(10),
    marginVertical: responsiveHeight(25),
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingImg: {
    width: responsiveWidth(50),
    height: responsiveHeight(50),
    resizeMode: 'contain',
  },
});

const mapStateToProps = (state) => {
  return {
    syncStorageStatus: state.auth.syncStorageStatus,
    authData: state.auth.userData,

  };
};

const IntialRedux = connect(mapStateToProps, {
  savedSecert,
  savedUrl,
  getAllUserData,
  getCoordsInfo
})(Intial);
export {IntialRedux as Intial};
