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
    // justifyContent: 'flex-end',
    marginTop: responsiveHeight(1),
    width:responsiveWidth(23),
    // backgroundColor:'red'
  },
  modalStyle: {
    height: responsiveHeight(100),
  },
  textareaContainer: {
    height: responsiveHeight(15),
    padding: '3%',
    backgroundColor: '#F5FCFF',
    borderColor: '#4eace9',
    borderWidth: 1.5,
    borderRadius: 15,
    backgroundColor:'white'
  },
  textarea: {
    textAlignVertical: 'top', // hack android
    height: responsiveHeight(20),
    fontSize: responsiveFontSize(1.5),
    color: '#333',
  },
  modalContainerStyle:{
    // flex: 1,
    backgroundColor: 'white',
    height: responsiveHeight(35),
    borderRadius: 30,
    paddingVertical: responsiveHeight(3),
    borderWidth: 1,
  },
  innerContainerModalStyle:{
    marginHorizontal: responsiveWidth(2),
    // width:responsiveWidth(80)
    // marginVertical: responsiveHeight(20),
  },
  titleSubmitBtn: {
    fontSize: responsiveFontSize(2),
    paddingHorizontal: responsiveWidth(0.5),
    paddingVertical: responsiveHeight(0.8),
  },
  submitBtn: {
    backgroundColor: '#4eace9',
    borderRadius: 30,
    width: responsiveWidth(23),
    marginHorizontal: responsiveWidth(2),
    marginTop: responsiveHeight(1),
    // justifyContent: 'center', alignItems: 'center'
  },
  btnView: {justifyContent: 'center', alignItems: 'center'},
  buttonsViewStyle:{   flex: 1,
    // width:responsiveWidth(72),
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems:'flex-end',
    // marginTop:responsiveHeight(1.5)
  },
  buttonImagesStyle: {
    backgroundColor: 'white',
    borderColor:'#4eace9',
    borderWidth:1,
    borderRadius: 30,
    width: responsiveWidth(27),
    

  },
  titleUploadBtn: {
    fontSize: responsiveFontSize(1.3),
    paddingHorizontal: responsiveWidth(0.5),
    paddingVertical: responsiveHeight(0.8),
    color:'#4eace9'
  },
  commentLabel:{
    textAlign:'center',
    margin:1,
    color: '#333',
    fontWeight:"200",
    fontSize:responsiveFontSize(2)
  }
 

});
export default styles;
