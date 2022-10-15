import {StyleSheet} from 'react-native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import { Colors } from '../../Utils/Colors';
const styles = StyleSheet.create({
  containerStyle: {
    flexDirection:'row',
    justifyContent: 'center',
    marginTop: responsiveHeight(1),
    width:responsiveWidth(68)
  },
  containerInputStyle: {
    width:'40%',
    height:'20%',
    // borderBottomColor:'#4eace9'
  },
  inputContainer:{
    borderBottomColor:'#4eace9',borderBottomWidth:1
  },
  inputStyle:{
    textAlign: 'center',
    
  }

});
export default styles;
