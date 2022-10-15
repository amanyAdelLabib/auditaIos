import React, {useState, useEffect} from 'react';
import {
  View,
  TouchableWithoutFeedback,
  Text,
  Keyboard,
  FlatList,
  TouchableHighlight,
  Image,
} from 'react-native';
import {Input, Button, Icon} from 'react-native-elements';
import reactotron from 'reactotron-react-native';
import Modal from 'react-native-modal';
import Textarea from 'react-native-textarea';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import styles from './style';

export function TwoIcons({
  noteFlag,
  cameraFlag,
  onChangeNote,
  note,
  onInsertImages,
  images,
  deleteImageModal,
  openImage,
  closeModal
}) {
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [showImagesModal, setShowImagesModal] = useState(false);

  const [noteValue, setNoteValue] = useState(note);

  useEffect(() => {
    if (noteValue !== '') onChangeNote(noteValue);
  }, [noteValue]);
  return (
    <View style={styles.containerStyle}>
      {cameraFlag == 1 && (
        <Icon
          reverse
          name="camera"
          type="ionicon"
          color="#4eace9"
          size={15}
          onPress={() => setShowImagesModal(true)}
        />
      )}
      {noteFlag == 1 && (
        <Icon
          reverse
          name="pencil-square-o"
          type="font-awesome"
          color="#4eace9"
          size={15}
          onPress={() => setShowNoteModal(true)}
        />
      )}

      <Modal
        isVisible={showNoteModal}
        style={styles.modalStyle}
        avoidKeyboard={false}>
        <TouchableWithoutFeedback
          onPress={() => {
            Keyboard.dismiss(0);
          }}>
          <View style={styles.modalContainerStyle}>
            <View style={styles.innerContainerModalStyle}>
              <Text style={styles.commentLabel}>Please leave your note</Text>
              <Text style={styles.commentLabel}>برجاء كتابة تعليقك</Text>

              <Textarea
                containerStyle={styles.textareaContainer}
                style={styles.textarea}
                onChangeText={setNoteValue}
                value={noteValue}
                placeholder={'Leave an comment'}
                placeholderTextColor={'#c7c7c7'}
                underlineColorAndroid={'transparent'}
                onSubmitEditing={Keyboard.dismiss}
                returnKeyType="done"
                keyboardType="default"
                multiline={true}
                blurOnSubmit={true}
                onSubmitEditing={() => {
                  Keyboard.dismiss();
                }}
              />
           
            </View>
            <View style={[styles.buttonsViewStyle]}>
              <Button
                title="Submit"
                onPress={() => {
                  onChangeNote(noteValue);
                  setShowNoteModal(false);
                }}
                titleStyle={styles.titleSubmitBtn}
                buttonStyle={styles.submitBtn}
              />
              </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      <Modal
        isVisible={showImagesModal || openImage}
        style={[styles.modalStyle]}
        avoidKeyboard={false}>
        <TouchableWithoutFeedback
          onPress={() => {
            Keyboard.dismiss(0);
          }}>
          <View
            style={[
              styles.modalContainerStyle,
              {
                height:responsiveHeight(40)
              }
            ]}>
            <View style={[styles.innerContainerModalStyle,{
              // paddingVertical:responsiveHeight(5),
              marginHorizontal:responsiveWidth(7),
            }]}>
              <FlatList
                horizontal={true}
                data={images}
                keyExtractor={(item) => item.img.toString()}

                renderItem={({item, index}) => {
                  return (
                    <>
                      <TouchableHighlight
                        style={{
                          width: responsiveWidth(35),
                          marginHorizontal: responsiveWidth(1),
                        }}
                      >
                        <Image
                          source={{
                            uri: item.img,
                          }}
                          style={{
                            width: responsiveWidth(35),
                            height: responsiveHeight(15),
                            borderRadius: 20,
                          }}
                          // resizeMode="contain"
                        />
                      </TouchableHighlight>
                      <Icon
                        name="close"
                        type="antdesign"
                        color="red"
                        size={responsiveWidth(3)}
                        raised
                        containerStyle={{
                          // backgroundColor: '#ccc',
                          position: 'absolute',
                          right: 0,
                          top: 0,
                        }}
                        onPress={() => {
                          reactotron.log('delete image index', index);
                          deleteImageModal(index)
                          // setShowImagesModal(true);
                        }}
                      />
                    </>
                  );
                }}
              />
            </View>
            <View style={[styles.buttonsViewStyle]}>
            { images?.length < 2 &&(
           <>
          
                
                  <View style={[styles.btnView]}>
                <Button
                  title="Take a photo"
                  icon={{
                    name: 'camera',
                    type: 'font-awesome',
                    size: 13,
                    color: '#4eace9',
                  }}
                  onPress={() => {2
                    onInsertImages('modal');
                    setShowImagesModal(false);
                  }}
                  titleStyle={styles.titleUploadBtn}
                  buttonStyle={styles.buttonImagesStyle}
                />
              </View>
              <View style={styles.btnView}>
                <Button
                  title="Upload Image"
                  icon={{
                    name: 'cloud-upload',
                    type: 'font-awesome',
                    size: 13,
                    color: '#4eace9',
                  }}
                  onPress={() => {
                    onInsertImages('upload');
                    // setShowImagesModal(true);
                  }}
                  titleStyle={styles.titleUploadBtn}
                  buttonStyle={styles.buttonImagesStyle}
                />
              </View>
              </>
           
             )}
              </View>
              <View style={[styles.buttonsViewStyle]}>
               <Button
                title="Submit"
                onPress={() => {
                  setShowImagesModal(false)
                  closeModal()
                }}
                titleStyle={styles.titleSubmitBtn}
                buttonStyle={styles.submitBtn}
              />
              </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}
