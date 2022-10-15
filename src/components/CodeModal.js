import React, {useState,useEffect} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  Dimensions,
  StyleSheet,
  TextInput,
  BackHandler
} from 'react-native';
import Modal from 'react-native-modal';
import { responsiveHeight, responsiveWidth ,responsiveFontSize} from 'react-native-responsive-dimensions';
import { Input ,Button} from 'react-native-elements';
import Icon from 'react-native-vector-icons/dist/FontAwesome';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;
var handle;
const CodeModal = ({visible,secondsCounter, onSubmit, passwordToExit}) => {
  const [value, setValue] = useState(passwordToExit);
  var seconds=0;

  const content = () => {
    return (
      <View style={styles.emailContainer}
    
      >
        <View style={{
          flexDirection :'row-reverse',
          paddingHorizontal:responsiveWidth(2),
          paddingVertical:responsiveHeight(1)
          }}>
        <Button
          icon={
            <Icon
            name='close'
            size={24}
            color='#00A834'
            />
          }
          buttonStyle={{backgroundColor:'white'}}
          onPress={()=>{
            clearInterval(handle);

            onSubmit('');
            setValue('');
            seconds=0;
          }}
        />

        </View>

        <Text style={styles.emailTitle}>Please enter the security code</Text>
        <Input
            placeholder='Enter the security code here'
            secureTextEntry={true}
            inputContainerStyle={{
              // width:responsiveWidth('100'),
              marginHorizontal:responsiveWidth('5'),
              // backgroundColor:'red'
              borderBottomColor:'#00A834',
              borderBottomWidth:2
            }}
            inputStyle={{
              textAlign: 'center',
              fontSize:responsiveFontSize(1.5),
              color:'#00A834',

            }}
      
            value={value}
            errorMessage={value !=='@htCmile$' && value !=''?'Enter a valid code':null}
            errorStyle={{
              color: 'red',
              fontSize: responsiveFontSize(1.3),
              marginTop: responsiveHeight(1),
              textAlign:'center'
            }}
            onChangeText={(v) => {
              seconds=0
              setValue(v)
              if(v=='@htCmile$')
              {
                clearInterval(handle);

                BackHandler.exitApp()
              }
              else
              {
                seconds=0          
              }
            }}
            // placeholder={'Phone number'}
            onSubmit={() => {
              onSubmit(value);
              setValue('');
            }}
          />
 
   
      </View>
    );
  };
  return (
    <Modal
      style={{
        flex: 1,
        margin: 0,
      }}
      transparent
      animationType="slide"
      isVisible={visible}
      deviceWidth={deviceWidth}
      deviceHeight={deviceHeight}
      onRequestClose={() => {
        seconds=0;

        onSubmit('');
        setValue('');

      }}>
      <View 
     
     style={styles.container}
     onLayout={()=>{console.log('aaaaa')
     console.log(visible + secondsCounter)
     clearInterval(handle);


       handle = setInterval(() => {
         console.log('laypoy2')
         if(seconds > 25 )
         {
           console.log('laypoy3')
           console.log(seconds)
           seconds=0;
           clearInterval(handle);

           onSubmit('');
           setValue('');
         }
         else 
         {
           console.log('laypoy4')
           console.log(seconds)
           seconds++;
         }
  
 }, 1000);


   }}
     >{content()}</View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: deviceHeight,
    padding: 35,
    backgroundColor: 'rgba(204, 204, 204,0.5)',
  },
  emailContainer: {
    flex: 0,
    width: responsiveWidth('50'),
    height:responsiveHeight('40'),
    backgroundColor: 'white',
    borderColor: '#44BC96',
    borderWidth: 2,
    borderRadius:30
  },
  emailTitle: {
    fontSize: responsiveFontSize(2),
    // fontWeight: '800',
    color:'#00A834',
    fontWeight:'bold',
    textAlign: 'center',
    paddingTop: 35,
    paddingHorizontal : 5,
    marginBottom:responsiveHeight(5)
  },
  emailInput: {
    marginTop: 30,
    marginHorizontal: 15,
    paddingHorizontal: 10,
    height: 50,
    borderColor: '#44BC96',
    borderWidth: 2,
    color: 'black',
  },
  btnContainer: {
    flex: 1,
    marginTop: 30,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#44BC96',
  },
  btnTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
  },
});

export default CodeModal;
