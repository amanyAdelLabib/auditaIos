import {
    Platform,
    StyleSheet,
  } from 'react-native';
  import {
    responsiveFontSize,
    responsiveHeight,
    responsiveWidth,
  } from 'react-native-responsive-dimensions';
const styles = StyleSheet.create({
    mainContainer: {
      paddingVertical: responsiveHeight(5),
      paddingHorizontal: responsiveWidth(2),
    },
    bodyContainerSubmit: {
    },
    questionText: {
      fontSize: responsiveFontSize(2),
      marginTop: responsiveHeight(3),
      fontFamily: 'Roboto-Regular',
      textAlign: 'center',
      fontWeight:'bold',
    },
    questionText1: {
      fontSize: responsiveFontSize(2),
      marginTop: responsiveHeight(2),
      fontFamily: 'Roboto-Regular',
      textAlign: 'center',
      fontWeight:'bold'
    },
    questionText2: {
      fontSize: responsiveFontSize(2),
      marginTop: responsiveHeight(2),
      fontFamily: 'Roboto-Regular',
      textAlign: 'center',
      fontWeight:'bold'
    },
    answersContainer: {
      flex: 1,
      justifyContent: 'center',
      marginTop: responsiveHeight(1),
      flexDirection:'row',
    },
    surveyImg: {
      width: Platform.OS == 'ios' ? responsiveWidth(20) : responsiveWidth(20),
      height: Platform.OS == 'ios' ? responsiveHeight(10) : responsiveHeight(10),
      resizeMode: 'contain',
      // borderRadius: 110,
    },
    textareaContainer: {
      height: responsiveHeight(15),
      width:responsiveWidth(72),
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
    optionalText: {
      fontSize: responsiveFontSize(2),
      marginBottom: responsiveHeight(0.8),
      fontFamily: 'Roboto-Regular',
      color: '#cccccc',
    },
    button: {
      width: responsiveWidth(20),
      height: responsiveHeight(20),
      // backgroundColor: '#44BC96',
      marginHorizontal: responsiveWidth(2.5),
      justifyContent: 'center',
      alignItems: 'center',
  
      // flex:1,
      borderRadius: 100,
      borderColor: '#44BC96',
      borderWidth: 5,
  
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 5,
      },
      shadowOpacity: 0.58,
      shadowRadius: 8.0,
  
      elevation: 10,
    },
    buttonRate: {
      // width: responsiveWidth(100),
      // height: responsiveHeight(5),
      // backgroundColor: '
      justifyContent: 'center',
      alignItems: 'center',
      marginVertical: responsiveHeight(0.5),
    },
    btnTitle: {
      fontSize: responsiveFontSize(3),
      fontWeight: 'bold',
      textAlign: 'center',
      color: '#44BC96',
    },
    btnTitleRate: {
      fontSize: responsiveFontSize(1.5),
      fontWeight: '200',
      textAlign: 'center',
      color: 'black',
    },
    nextBtn: {
      backgroundColor: '#2e6da4',
      width: responsiveWidth(15),
      height: responsiveHeight(8),
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      borderRadius: 10,
      shadowOffset: {
        width: 0,
        height: 30,
      },
      shadowOpacity: 0.58,
      shadowRadius: 16.0,
  
      elevation: 24,
    },
    poweredByView: {
      position: 'absolute',
      alignSelf: 'center',
      backgroundColor: '#F2F2F2',
      // backgroundColor:'red',
  
      flex: 1,
      bottom: 0,
      width: responsiveWidth(100),
      // height:responsiveHeight(10)
    },
    poweredByText: {
      fontSize: responsiveFontSize(1.5),
      // marginTop: responsiveHeight(18),
      paddingVertical: responsiveHeight(1),
      fontFamily: 'Roboto-Regular',
      textAlign: 'center',
      color: '#808080',
    },
    nextText: {
      // color: '#44BC96',
      color: 'white',
      fontSize: responsiveFontSize(2),
      fontWeight: 'bold',
    },
    inputLabel: {
      fontSize: responsiveFontSize(1.5),
      marginBottom: responsiveHeight(2),
      fontFamily: 'Roboto-Regular',
      color: 'black',
    },
    containerStyleFullName: {
      width: responsiveWidth(40),
      // marginLeft: responsiveWidth(4),
    },
    inputContainerStyleFullName: {
      width: responsiveWidth(40),
      height: responsiveHeight(8),
      borderBottomWidth: 0,
    },
    inputStyleForm: {
      fontSize: responsiveFontSize(1.5),
      color: 'black',
      borderColor: '#00A834',
      borderWidth: 3,
      borderRadius: 20,
      paddingVertical: responsiveHeight(2),
      paddingHorizontal: responsiveWidth(2),
      height: responsiveHeight(10),
      backgroundColor: '#F5FCFF',
    },
    containerStyleMobile: {
      width: responsiveWidth(32),
      marginLeft: responsiveWidth(5),
    },
    inputContainerStyleMobile: {
      width: responsiveWidth(35),
      height: responsiveHeight(8),
      borderBottomWidth: 0,
    },
    buttonStyle: {
      backgroundColor: '#4eace9',
      borderRadius: 30,
      width: responsiveWidth(40),

    },
    buttonImagesStyle: {
      backgroundColor: 'white',
      borderColor:'#4eace9',
      borderWidth:1,
      borderRadius: 30,
      width: responsiveWidth(27),
      
  
    },
    titleSubmitBtn: {
      fontSize: responsiveFontSize(2),
      paddingHorizontal: responsiveWidth(0.5),
      paddingVertical: responsiveHeight(0.8),
    },
    titleUploadBtn: {
      fontSize: responsiveFontSize(1.3),
      paddingHorizontal: responsiveWidth(0.5),
      paddingVertical: responsiveHeight(0.8),
      color:'#4eace9'
    },
    btnView: {justifyContent: 'center', alignItems: 'center'},
    uploadImageView:{
      // borderWidth: 1,
      height: responsiveHeight(19),
      width: responsiveWidth(50),
      justifyContent: 'center',
      alignSelf: 'center',
      marginTop: responsiveHeight(2),
      flex:1
 
    },
    buttonsViewStyle:{   flex: 1,
      width:responsiveWidth(72),
      flexDirection: 'row',
      justifyContent: 'space-around',
      // alignItems:'center',
      marginTop:responsiveHeight(1.5)
    },
    backIconCamera:{
      alignItems: 'flex-start',
      marginTop: responsiveHeight(7),
    },
    titleSubmitBtn: {
      fontSize: responsiveFontSize(2),
      paddingHorizontal: responsiveWidth(0.5),
      paddingVertical: responsiveHeight(1),
    },
    submitBtn: {
      backgroundColor: '#4eace9',
      borderRadius: 30,
      width: responsiveWidth(23),
      marginHorizontal: responsiveWidth(30),
      marginTop: responsiveHeight(5),
    },
    mainContainerCategoryStyle:{
      borderWidth: 1,
      borderColor: '#4eace9',
      borderRadius: 5,
      marginVertical: responsiveHeight(2),
      // paddingTop:responsiveHeight(3)
      
      // paddingHorizontal:responsiveHeight(1)
      // paddingHorizontal: responsiveWidth(3),
    },
    categoryTextStyle:{
      color: 'white',
      fontSize: responsiveFontSize(2.5),
      // marginVertical: responsiveHeight(1.5),
      fontFamily: 'Roboto-Regular',
      textAlign: 'center',
      fontWeight: '300',
      backgroundColor:'#4eace9',
      height:responsiveHeight(6),
      paddingTop:responsiveHeight(1)
      // justifyContent:'space-around'
    },
    modalStyle:{
      height: responsiveHeight(50),
    },
    mainContainerModal:{
      backgroundColor: 'white',
      borderRadius: 30,
      paddingVertical: responsiveHeight(3),
      borderWidth: 1,
    },
  });

export default styles;