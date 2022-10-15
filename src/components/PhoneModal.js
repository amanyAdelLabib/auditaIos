import React, {useState} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  Dimensions,
  StyleSheet,
  TextInput,
} from 'react-native';
import Modal from 'react-native-modal';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

const PhoneModal = ({visible, onSubmit, phone}) => {
  const [value, setValue] = useState(phone);
  const content = () => {
    return (
      <View style={styles.emailContainer}>
        <Text style={styles.emailTitle}>We are sorry for that! Please leave your phone number to get back to you.</Text>
        <Text style={styles.emailTitle}>نحن نأسف لسوء تجربتك … برجاء ترك رقم التليفون للتواصل </Text>
        <TextInput
          autoCompleteType={'tel'}
          autoCorrect={false}
          textContentType={'telephoneNumber'}
          keyboardType={'numeric'}
          value={value}
          onChangeText={(v) => setValue(v)}
          placeholder={'Phone number'}
          onSubmit={() => {
            onSubmit(value);
            setValue('');
          }}
          style={styles.emailInput}
        />
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity
            style={styles.btnContainer}
            onPress={() => {
              onSubmit(value);
              setValue('');
            }}>
            <Text style={styles.btnTitle}>Submit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.btnContainer, {marginLeft: 5}]}
            onPress={() => {
              onSubmit('');
              setValue('');
            }}>
            <Text style={styles.btnTitle}>Skip</Text>
          </TouchableOpacity>
        </View>
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
        onSubmit('');
        setValue('');
      }}>
      <View style={styles.container}>{content()}</View>
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
    width: '100%',
    backgroundColor: 'white',
    borderColor: '#44BC96',
    borderWidth: 2,
  },
  emailTitle: {
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
    paddingTop: 35,
    paddingHorizontal : 5
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

export default PhoneModal;
