import React from 'react';
import {Text, View, StyleSheet, TouchableOpacity, FlatList} from 'react-native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';

const arrTest=[
  'محمد كمال'
  ,'احمد الشناوي'
  ,'احمد عوني',
  'محمد عادل عبد الوهاب عبد السميع'
  ,'هاني عبد المجيد'
  ,'احمد صقر'
  ,
  'Jan',
  'Lily Tracey',
  'Michelle',
  'Sarah Tracey',
  'Rose Tracey',
  'Tracey',
  'Yvonne Tracey',
  'Stephanie Tracey',
  'Stephanie Tracey',
  'محمد كمال'
  ,'احمد الشناوي'
  ,'احمد عوني',
  'محمد عادل عبد الوهاب عبد السميع','هاني عبد المجيد'
  ,'احمد صقر'
  ,
  'Jan',
  'Lily Tracey',
  'Michelle',
  'Sarah Tracey',
  'Rose Tracey',
  'Tracey',
  'Yvonne Tracey',
  'Stephanie Tracey',
  'Stephanie Tracey'
]

const renderItem = (item)=>{
  return (
          
    <View
      style={{
        // flex: 1,
        flexDirection: 'row',
        // alignContent :'space-between',
        // alignItems:'center',
        marginVertical: responsiveHeight(5),
        paddingHorizontal:responsiveWidth(10)
        // marginHorizontal:responsiveWidth(5)
      }}>
      <TouchableOpacity
        onPress={() => onSelect('existing')}
        style={styles.button}>
        <Text style={styles.btnTitle}>{item}</Text>
      </TouchableOpacity>
    </View>
  )
}
export const UserSelection = ({onSelect,chooseDr}) => {
  console.log('in select user')
  console.log(chooseDr)
  console.log(chooseDr)

  this.splitArr = chooseDr.text.split('\r\n');
  return (
    // <View>

          <View style={styles.container}>
                  <View style={{
                 
                   marginVertical: responsiveHeight(10),
                

                  }}>
                 {/* <Text style={styles.questionText}> اختر طبيبك المعالج ؟</Text>
                 <Text style={styles.questionText}>Choose your treating doctor</Text> */}
                 {this.splitArr.length == 1 ? (
              <View>
                <Text style={styles.questionText}>{this.splitArr[0]}</Text>
              </View>
            ) : (
              <View>
                <Text style={styles.questionText1}>{this.splitArr[0]}</Text>
                <Text style={styles.questionText2}>{this.splitArr[1]}</Text>
              </View>
            )}
           </View>
        <FlatList
       columnWrapperStyle={{ justifyContent: 'space-around' }}
         data={chooseDr.choices}
         // horizontal={false}
         renderItem={({item}) =>
        //  renderItem(item)
        <View
        style={{
          // flex: 1,
          flexDirection: 'row',
          // alignContent :'space-between',
          // alignItems:'center',
          marginVertical: responsiveHeight(5),
          paddingHorizontal:responsiveWidth(10)
          // marginHorizontal:responsiveWidth(5)
        }}>
        <TouchableOpacity
          onPress={() => onSelect(item)}
          style={styles.button}>
          <Text style={styles.btnTitle}>{item.choice}</Text>
        </TouchableOpacity>
      </View>
    
        }
         //Setting the number of column
         numColumns={4}
         keyExtractor={item => item.id.toString()}
       />
       {/* <TouchableOpacity
         onPress={() => onSelect('existing')}
         style={styles.button}>
         <Text style={styles.btnTitle}>Existing Customer</Text>
       </TouchableOpacity>
       <TouchableOpacity onPress={() => onSelect('new')} style={styles.button}>
         <Text style={styles.btnTitle}>New Customer</Text>
       </TouchableOpacity>
      */}
     </View>
        
    // {/* </View> */}
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    // marginVertical:responsiveHeight(3)
    // flex: 1,
    // justifyContent: 'center',
    // backgroundColor: 'white',
    marginTop:responsiveHeight(3)

  },
  button: {
   
    width: responsiveWidth(20),
    height: responsiveHeight(20),
    backgroundColor: '#44BC96',
    marginHorizontal: responsiveWidth(2.5),
    justifyContent: 'center',
    alignItems: 'center',
   
    // flex:1,
    borderRadius: 20,
shadowColor: "#000",
shadowOffset: {
	width: 0,
	height: 5,
},
shadowOpacity: 0.58,
shadowRadius: 8.00,

elevation: 10,
  },
  btnTitle: {
    fontSize: responsiveFontSize(1.8),
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
  },

  questionText: {
    fontSize: responsiveFontSize(3),
    marginTop: responsiveHeight(18),
    fontFamily: 'Roboto-Regular',
    textAlign: 'center',
  },
  questionText1: {
    fontSize: responsiveFontSize(3),
    marginTop: responsiveHeight(8),
    fontFamily: 'Roboto-Regular',
    textAlign: 'center',
  },
  questionText2: {
    fontSize: responsiveFontSize(3),
    marginTop: responsiveHeight(4),
    fontFamily: 'Roboto-Regular',
    textAlign: 'center',
  },
});
