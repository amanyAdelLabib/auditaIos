import {
  FlatList,
  Image,
  Keyboard,
  Platform,
  PermissionsAndroid,
  Text,
  TouchableOpacity,
  View,
  BackHandler,
  SafeAreaView,
  TouchableWithoutFeedback,
  ScrollView,
  KeyboardAvoidingView,
  Alert,
  TouchableHighlight,
  SectionList,
} from 'react-native';
import React, {Component} from 'react';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {connect} from 'react-redux';
import {Input, Button} from 'react-native-elements';
// import { DeviceEventEmitter } from 'react-native'
import IdleTimerManager from 'react-native-idle-timer';
import {isEqual as _isEqual, findIndex as _findIndex} from 'lodash';
import Modal from 'react-native-modal';
import Geolocation from 'react-native-geolocation-service';

import {postSurvey, getAllUserData} from '../actions';
import Textarea from 'react-native-textarea';
import RNFS from 'react-native-fs';
import {hideNavigationBar} from 'react-native-navigation-bar-color';
import {LoadingLottie, DropdownList, CounterBtn, TwoIcons} from '../components';
import {Icon} from 'react-native-elements';
import reactotron from 'reactotron-react-native';
import AwesomeAlert from 'react-native-awesome-alerts';
import styles from './surveyStyles';
import {RNCamera} from 'react-native-camera';
import DocumentPicker from 'react-native-document-picker';
import ImageResizer from 'react-native-image-resizer';
import Orientation from 'react-native-orientation';

class Survey extends Component {
  constructor(props) {
    super(props);
    this.testArr = [];
    this.testArrMulti = [];
    this.testArrMultiImages = [];
    this.testArrMultiState = [];
    this.itemSelectedMulti = [];

    this.arrayAnswers = [];
    this.arrayRequiredQuestion = [];
    this.arrayRequiredQuestionFromAnswers = [];
    this.arrayRequiredQuestionNotAnswered = [];
    this.arrValue = [];
    // this.firstTimeRequiredFlag=true;

    // this.selectedImageIndex = 0;
    this.state = {
      counter: 0,
      showProjectsList: true,
      answers: [],
      answersMulti: [],
      answersMultiImages: [],
      questionsList: [],
      itemSelected: [],
      isFocus: false,
      isOpenList: false,
      resourcePath: {},
      projectsState: [],
      projectIndex: null,
      areasState: [],
      selectedProject: {},
      selectedArea: {},
      areaIndex: '',
      errorFlag: false,
      takingPic: false,
      showCameraFlag: false,
      selectedQuestionForPhoto: {},
      submitFlag: false,
      questionRequiredNotSubmited: [],
      questionRequiredSubmited: [],
      isOpenedModelMsg: false,
      // commentSelectedImg: '',
      selectedImage: '',
      loadingPostSurveyState: false,
      postSurveySuccess: false,
      postSurveyFail: false,
      submitLoadingFlag: false,
      currentLongitude: '',
      currentLatitude: '',
      getLocation: false,

      surveyAnswers: [],
      selectedMainCategoryIndexForPhoto: 0,
      selectedMainQuestionIndexForPhoto: 0,
      commentOnSelectedImg: '',
      selectedTypeForPhotoModal: '',
      openImageModal: false,
      selectedImageIndex: 0,
      arrayRequiredQuestionNotAnsweredYet: [],
    };
  }

  componentDidMount() {
    hideNavigationBar();
    Orientation.lockToPortrait();
    IdleTimerManager.setIdleTimerDisabled(true);
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    if (this.props.allProjectsUser.projects !== this.state.projectsState) {
      const project = Object.keys(this.props.allProjectsUser.projects).map(
        (key) => {
          return {
            label: this.props.allProjectsUser.projects[key].name,
            value: this.props.allProjectsUser.projects[key].id,
          };
        },
      );
      this.setState({
        projectsState: project,
      });
    }
  }
  onButtonPress = () => {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    // then navigate
    navigate('NewScreen');
  };

  handleBackButton = () => {
    Alert.alert(
      'Exit App',
      'Exiting the application?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => BackHandler.exitApp(),
        },
      ],
      {
        cancelable: false,
      },
    );
    return true;
  };

  componentWillUnmount() {
    IdleTimerManager.setIdleTimerDisabled(false);

    this.setState({
      counter: 0,
      answers: [],
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.loadingPostSurvey !== this.state.loadingPostSurveyState) {
      this.setState({
        loadingPostSurveyState: true,
      });
    }
    if (nextProps.failPostSurvey && this.state.loadingPostSurveyState) {
      this.setState({
        postSurveyFail: true,
      });
    }
    if (nextProps.successPostSurvey && this.state.loadingPostSurveyState) {
      this.setState({
        postSurveySuccess: true,
      });
    }
  }

  getSpecificAreas(index) {
    const area = Object.keys(
      this.props.allProjectsUser.projects[index].areas,
    ).map((key) => {
      return {
        label: this.props.allProjectsUser.projects[index].areas[key].name,
        value: this.props.allProjectsUser.projects[index].areas[key].id,
      };
    });
    this.setState({
      areasState: area,
    });
  }

  //  ****************************** function that insert data in anser array fo (radio,number,text,dropDownSingle)
  selectedSingleValue(
    arr,
    childQuestion,
    option,
    mainCategoryIndex,
    mainQuestionIndex,
  ) {
    if (
      arr.findIndex(
        (x) =>
          x.question_id == childQuestion.item.id &&
          x.main_question_index == mainQuestionIndex &&
          x.main_category_index == mainCategoryIndex &&
          x.child_question_index == childQuestion.index,
      ) !== -1
    ) {
      arr[
        arr.findIndex(
          (x) =>
            x.question_id == childQuestion.item.id &&
            x.main_question_index == mainQuestionIndex &&
            x.main_category_index == mainCategoryIndex &&
            x.child_question_index == childQuestion.index,
        )
      ].value = option;
    } else {
      arr.push({
        question_id: childQuestion.item.id,
        value: option,
        images: [],
        note: '',
        main_category_index: mainCategoryIndex,
        child_question_index: childQuestion.index,
        main_question_index: mainQuestionIndex,
        is_required: childQuestion.item.required,
      });
    }
    this.setState({surveyAnswers: arr});
  }
  //  ****************************** function that select note in anser array fo (all questions)
  selectedNoteValue(arr, childQuestion, mainCategoryIndex, mainQuestionIndex) {
    if (
      arr.findIndex(
        (x) =>
          x.question_id == childQuestion.item.id &&
          x.main_question_index == mainQuestionIndex &&
          x.main_category_index == mainCategoryIndex &&
          x.child_question_index == childQuestion.index,
      ) !== -1
    ) {
      return arr[
        arr.findIndex(
          (x) =>
            x.question_id == childQuestion.item.id &&
            x.main_question_index == mainQuestionIndex &&
            x.main_category_index == mainCategoryIndex &&
            x.child_question_index == childQuestion.index,
        )
      ].note;
    } else {
      return '';
    }
  }
  //  ****************************** function that insert note in anser array fo (all questions)
  insertNoteValue(
    arr,
    childQuestion,
    note,
    questionType,
    mainCategoryIndex,
    mainQuestionIndex,
  ) {
    if (
      arr.findIndex(
        (x) =>
          x.question_id == childQuestion.item.id &&
          x.main_question_index == mainQuestionIndex &&
          x.main_category_index == mainCategoryIndex &&
          x.child_question_index == childQuestion.index,
      ) !== -1
    ) {
      arr[
        arr.findIndex(
          (x) =>
            x.question_id == childQuestion.item.id &&
            x.main_question_index == mainQuestionIndex &&
            x.main_category_index == mainCategoryIndex &&
            x.child_question_index == childQuestion.index,
        )
      ].note = note;
    } else {
      arr.push({
        question_id: childQuestion.item.id,
        value:
          questionType == 'checkbox' || questionType == 'dropdown_multiple'
            ? []
            : '',
        images: [],
        note: note,
        main_category_index: mainCategoryIndex,
        child_question_index: childQuestion.index,
        main_question_index: mainQuestionIndex,
        is_required: childQuestion.item.required,
      });
    }
  }
  //  ****************************** function that insert note in anser array fo (all questions)
  insertTextValue(
    arr,
    childQuestion,
    value,
    mainCategoryIndex,
    mainQuestionIndex,
  ) {
    if (
      arr.findIndex(
        (x) =>
          x.question_id == childQuestion.item.id &&
          x.main_question_index == mainQuestionIndex &&
          x.main_category_index == mainCategoryIndex &&
          x.child_question_index == childQuestion.index,
      ) !== -1
    ) {
      arr[
        arr.findIndex(
          (x) =>
            x.question_id == childQuestion.item.id &&
            x.main_question_index == mainQuestionIndex &&
            x.main_category_index == mainCategoryIndex &&
            x.child_question_index == childQuestion.index,
        )
      ].value = value;
    } else {
      arr.push({
        question_id: childQuestion.item.id,
        value: value,
        images: [],
        note: '',
        main_category_index: mainCategoryIndex,
        child_question_index: childQuestion.index,
        main_question_index: mainQuestionIndex,
        is_required: childQuestion.item.required,
      });
    }
  }
  //  ****************************** function that insert data in anser array fo (checkbox,drop multi)
  selectedMultipleValue(
    arr,
    childQuestion,
    option,
    mainCategoryIndex,
    mainQuestionIndex,
  ) {
    if (
      arr.findIndex(
        (x) =>
          x.question_id == childQuestion.item.id &&
          x.main_question_index == mainQuestionIndex &&
          x.main_category_index == mainCategoryIndex &&
          x.child_question_index == childQuestion.index,
      ) !== -1
    ) {
      this.indexQuestion = arr.findIndex(
        (x) =>
          x.question_id == childQuestion.item.id &&
          x.main_question_index == mainQuestionIndex &&
          x.main_category_index == mainCategoryIndex &&
          x.child_question_index == childQuestion.index,
      );
      if (arr[this.indexQuestion].value.includes(option)) {
        this.indexValue = arr[this.indexQuestion].value.findIndex(
          (x) => x == option,
        );
        arr[this.indexQuestion].value.splice(this.indexValue, 1);
      } else {
        arr[this.indexQuestion].value.push(option);
      }
    } else {
      arr.push({
        question_id: childQuestion.item.id,
        value: [option],
        images: [],
        note: '',
        main_category_index: mainCategoryIndex,
        child_question_index: childQuestion.index,
        main_question_index: mainQuestionIndex,
        is_required: childQuestion.item.required,
      });
    }
    this.setState({surveyAnswers: arr});
  }

  //  ****************************** function that insert data in anser array fo (drop multi)
  selectedMultipleValueDropList(
    arr,
    childQuestion,
    option,
    mainCategoryIndex,
    mainQuestionIndex,
  ) {
    if (
      arr.findIndex(
        (x) =>
          x.question_id == childQuestion.item.id &&
          x.main_question_index == mainQuestionIndex &&
          x.main_category_index == mainCategoryIndex &&
          x.child_question_index == childQuestion.index,
      ) !== -1
    ) {
      this.indexQuestion = arr.findIndex(
        (x) =>
          x.question_id == childQuestion.item.id &&
          x.main_question_index == mainQuestionIndex &&
          x.main_category_index == mainCategoryIndex &&
          x.child_question_index == childQuestion.index,
      );
      arr[this.indexQuestion].value = option;
    } else {
      arr.push({
        question_id: childQuestion.item.id,
        value: option,
        images: [],
        note: '',
        main_category_index: mainCategoryIndex,
        child_question_index: childQuestion.index,
        main_question_index: mainQuestionIndex,
        is_required: childQuestion.item.required,
      });
    }
  }

  //  ****************************** function that check  data in anser array fo (radio)
  selectedfoundSingleOption(
    arr,
    childQuestion,
    option,
    mainCategoryIndex,
    mainQuestionIndex,
  ) {
    if (
      arr.findIndex(
        (x) =>
          x.question_id == childQuestion.item.id &&
          x.main_question_index == mainQuestionIndex &&
          x.main_category_index == mainCategoryIndex &&
          x.child_question_index == childQuestion.index,
      ) !== -1
    ) {
      if (
        arr[
          arr.findIndex(
            (x) =>
              x.question_id == childQuestion.item.id &&
              x.main_question_index == mainQuestionIndex &&
              x.main_category_index == mainCategoryIndex &&
              x.child_question_index == childQuestion.index,
          )
        ].value == option
      ) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  //  ****************************** function that check data in anser array fo (checkbox)
  selectedFoundMultipleOptions(
    arr,
    childQuestion,
    option,
    mainCategoryIndex,
    mainQuestionIndex,
  ) {
    if (
      arr.findIndex(
        (x) =>
          x.question_id == childQuestion.item.id &&
          x.main_question_index == mainQuestionIndex &&
          x.main_category_index == mainCategoryIndex &&
          x.child_question_index == childQuestion.index,
      ) !== -1
    ) {
      this.indexQuestion = arr.findIndex(
        (x) =>
          x.question_id == childQuestion.item.id &&
          x.main_question_index == mainQuestionIndex &&
          x.main_category_index == mainCategoryIndex &&
          x.child_question_index == childQuestion.index,
      );
      if (arr[this.indexQuestion].value.includes(option)) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  //  ****************************** function that get data  imagesin anser array fo (images) flag
  getImageValues(arr, childQuestion, mainCategoryIndex, mainQuestionIndex) {
    if (arr.length > 0) {
      if (
        arr.findIndex(
          (x) =>
            x.question_id == childQuestion.item.id &&
            x.main_question_index == mainQuestionIndex &&
            x.main_category_index == mainCategoryIndex &&
            x.child_question_index == childQuestion.index,
        ) !== -1
      ) {
        if (
          arr[
            arr.findIndex(
              (x) =>
                x.question_id == childQuestion.item.id &&
                x.main_question_index == mainQuestionIndex &&
                x.main_category_index == mainCategoryIndex &&
                x.child_question_index == childQuestion.index,
            )
          ].value.length > 0
        ) {
          return arr[
            arr.findIndex(
              (x) =>
                x.question_id == childQuestion.item.id &&
                x.main_question_index == mainQuestionIndex &&
                x.main_category_index == mainCategoryIndex &&
                x.child_question_index == childQuestion.index,
            )
          ].value;
        } else {
          return [];
        }
      } else {
        return [];
      }
    } else {
      return [];
    }
  }
  //  ****************************** function that get data  text  anser array fo (text questions)
  getTextValue(arr, childQuestion, mainCategoryIndex, mainQuestionIndex) {
    if (
      arr.findIndex(
        (x) =>
          x.question_id == childQuestion.item.id &&
          x.main_question_index == mainQuestionIndex &&
          x.main_category_index == mainCategoryIndex &&
          x.child_question_index == childQuestion.index,
      ) !== -1
    ) {
      return arr[
        arr.findIndex(
          (x) =>
            x.question_id == childQuestion.item.id &&
            x.main_question_index == mainQuestionIndex &&
            x.main_category_index == mainCategoryIndex &&
            x.child_question_index == childQuestion.index,
        )
      ].value;
    } else {
      return '';
    }
  }
  //  ****************************** function that get data  imagesin anser array fo (images)
  getImageValuesFlag(arr, childQuestion, mainCategoryIndex, mainQuestionIndex) {
    if (arr.length > 0) {
      if (
        arr.findIndex(
          (x) =>
            x.question_id == childQuestion.item.id &&
            x.main_question_index == mainQuestionIndex &&
            x.main_category_index == mainCategoryIndex &&
            x.child_question_index == childQuestion.index,
        ) !== -1
      ) {
        if (
          arr[
            arr.findIndex(
              (x) =>
                x.question_id == childQuestion.item.id &&
                x.main_question_index == mainQuestionIndex &&
                x.main_category_index == mainCategoryIndex &&
                x.child_question_index == childQuestion.index,
            )
          ].value.length > 0
        ) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  // ************************************** select single image & multi
  selectImageQuestion = async (
    arr,
    childQuestion,
    mainCategoryIndex,
    mainQuestionIndex,
  ) => {
    console.log('111111111')
    const result = await DocumentPicker.pick({
      type: DocumentPicker.types.images,
    });
       // await DocumentPicker.pickMultiple({
    //   type: DocumentPicker.types.allFiles
    ImageResizer.createResizedImage(result.uri, 300, 300, 'PNG', 90, 0).then(
      async (response) => {
        var dataImage = await RNFS.readFile(response.uri, 'base64').then(
          (res) => {
            return res;
          },
        );
        var dataBase64 = 'data:image/png;base64,' + dataImage;
        if (
          arr.findIndex(
            (x) =>
              x.question_id == childQuestion.item.id &&
              x.main_question_index == mainQuestionIndex &&
              x.main_category_index == mainCategoryIndex &&
              x.child_question_index == childQuestion.index,
          ) !== -1
        ) {
          if (childQuestion.item.type == 'image_multiple') {
            arr[
              arr.findIndex(
                (x) =>
                  x.question_id == childQuestion.item.id &&
                  x.main_question_index == mainQuestionIndex &&
                  x.main_category_index == mainCategoryIndex &&
                  x.child_question_index == childQuestion.index,
              )
            ].value.push({
              img: dataBase64,
              comment: '',
            });
          } else {
            arr[
              arr.findIndex(
                (x) =>
                  x.question_id == childQuestion.item.id &&
                  x.main_question_index == mainQuestionIndex &&
                  x.main_category_index == mainCategoryIndex &&
                  x.child_question_index == childQuestion.index,
              )
            ].value[0] = {
              img: dataBase64,
              comment: '',
            };
          }
        } else {
          arr.push({
            question_id: childQuestion.item.id,
            value: [{img: dataBase64, comment: ''}],
            images: [],
            note: '',
            main_category_index: mainCategoryIndex,
            child_question_index: childQuestion.index,
            main_question_index: mainQuestionIndex,
            is_required: childQuestion.item.required,
          });
        }
        this.setState({surveyAnswers: arr});
      },
    );
  };

  // ************************************** insert images with every question
  insertImageModalQuestion = async (
    arr,
    childQuestion,
    mainCategoryIndex,
    mainQuestionIndex,
  ) => {
    const result = await DocumentPicker.pick({
      type: DocumentPicker.types.images,
    });

    ImageResizer.createResizedImage(result.uri, 300, 300, 'PNG', 90, 0).then(
      async (response) => {
        var dataImage = await RNFS.readFile(response.uri, 'base64').then(
          (res) => {
            return res;
          },
        );
        var dataBase64 = 'data:image/png;base64,' + dataImage;
        if (
          arr.findIndex(
            (x) =>
              x.question_id == childQuestion.item.id &&
              x.main_question_index == mainQuestionIndex &&
              x.main_category_index == mainCategoryIndex &&
              x.child_question_index == childQuestion.index,
          ) !== -1
        ) {
          arr[
            arr.findIndex(
              (x) =>
                x.question_id == childQuestion.item.id &&
                x.main_question_index == mainQuestionIndex &&
                x.main_category_index == mainCategoryIndex &&
                x.child_question_index == childQuestion.index,
            )
          ].images.push({img: dataBase64, comment: ''});
        } else {
          arr.push({
            question_id: childQuestion.item.id,
            value:
              childQuestion.item.type == 'checkbox' ||
              childQuestion.item.type == 'dropdown_multiple' ||
              childQuestion.item.type == 'image_multiple' ||
              childQuestion.item.type == 'image_single'
                ? []
                : '',
            images: [{img: dataBase64, comment: ''}],
            note: '',
            main_category_index: mainCategoryIndex,
            child_question_index: childQuestion.index,
            main_question_index: mainQuestionIndex,
            is_required: childQuestion.item.required,
          });
        }

        this.setState({surveyAnswers: arr});
      },
    );
  };
  // ************************************** select images with every question

  selectedImagesModalValue(
    arr,
    childQuestion,
    mainCategoryIndex,
    mainQuestionIndex,
  ) {
    if (
      arr.findIndex(
        (x) =>
          x.question_id == childQuestion.item.id &&
          x.main_question_index == mainQuestionIndex &&
          x.main_category_index == mainCategoryIndex &&
          x.child_question_index == childQuestion.index,
      ) !== -1
    ) {
      if (
        arr[
          arr.findIndex(
            (x) =>
              x.question_id == childQuestion.item.id &&
              x.main_question_index == mainQuestionIndex &&
              x.main_category_index == mainCategoryIndex &&
              x.child_question_index == childQuestion.index,
          )
        ].images.length > 0
      ) {
        return arr[
          arr.findIndex(
            (x) =>
              x.question_id == childQuestion.item.id &&
              x.main_question_index == mainQuestionIndex &&
              x.main_category_index == mainCategoryIndex &&
              x.child_question_index == childQuestion.index,
          )
        ].images;
      } else {
        return [];
      }
    } else {
      return [];
    }
  }
  // ********************************** delete imges with every quistion
  onPressDeleteImageModal = (
    arr,
    childQuestion,
    mainCategoryIndex,
    mainQuestionIndex,
    valueIndex,
  ) => {
    if (
      arr.findIndex(
        (x) =>
          x.question_id == childQuestion.item.id &&
          x.main_question_index == mainQuestionIndex &&
          x.main_category_index == mainCategoryIndex &&
          x.child_question_index == childQuestion.index,
      ) !== -1
    ) {
      arr[
        arr.findIndex(
          (x) =>
            x.question_id == childQuestion.item.id &&
            x.main_question_index == mainQuestionIndex &&
            x.main_category_index == mainCategoryIndex &&
            x.child_question_index == childQuestion.index,
        )
      ].images.splice(valueIndex, 1);

      this.setState({
        surveyAction: arr,
      });
    }
  };
  onPressImage = (
    arr,
    childQuestion,
    mainCategoryIndex,
    mainQuestionIndex,
    index,
  ) => {
    // this.selectedImageIndex = index;
    this.arrValue = this.getImageValues(
      arr,
      childQuestion,
      mainCategoryIndex,
      mainQuestionIndex,
    );
    this.setState({
      isOpenedModelMsg: true,
      selectedImageIndex: index,
      commentOnSelectedImg: this.arrValue[index].comment,
    });
  };

  // ********************************** delete imges
  onPressDeleteImageUploaded = (
    arr,
    childQuestion,
    mainCategoryIndex,
    mainQuestionIndex,
    valueIndex,
  ) => {
    if (
      arr.findIndex(
        (x) =>
          x.question_id == childQuestion.item.id &&
          x.main_question_index == mainQuestionIndex &&
          x.main_category_index == mainCategoryIndex &&
          x.child_question_index == childQuestion.index,
      ) !== -1
    ) {
      if (childQuestion.item.type == 'image_multiple') {
        arr[
          arr.findIndex(
            (x) =>
              x.question_id == childQuestion.item.id &&
              x.main_question_index == mainQuestionIndex &&
              x.main_category_index == mainCategoryIndex &&
              x.child_question_index == childQuestion.index,
          )
        ].value.splice(valueIndex, 1);
      } else {
        arr.splice(
          arr.findIndex(
            (x) =>
              x.question_id == childQuestion.item.id &&
              x.main_question_index == mainQuestionIndex &&
              x.main_category_index == mainCategoryIndex &&
              x.child_question_index == childQuestion.index,
          ),
          1,
        );
      }
      this.setState({
        surveyAction: arr,
      });
    }
  };

  // ********************************** add reply on selected img **********
  onPressSubmitCommentSelectedImg = () => {
    // if (value.length > 0) {
    this.arrValue[
      this.state.selectedImageIndex
    ].comment = this.state.commentOnSelectedImg;
    // }

    this.setState({
      commentOnSelectedImg: '',
      isOpenedModelMsg: false,
      selectedImage: '',
      selectedImageIndex: 0,
    });
  };

  collectRequiredItemsInArray = (
    arr,
    childQuestion,
    mainQuestionIndex,
    mainCategoryIndex,
  ) => {
    if (
      arr.findIndex(
        (x) =>
          x.question_id == childQuestion.item.id &&
          x.main_question_index == mainQuestionIndex &&
          x.main_category_index == mainCategoryIndex &&
          x.child_question_index == childQuestion.index &&
          x.is_required == childQuestion.item.required,
      ) == -1 &&
      childQuestion.item.required
    ) {
      arr.push({
        question_id: childQuestion.item.id,
        main_category_index: mainCategoryIndex,
        child_question_index: childQuestion.index,
        main_question_index: mainQuestionIndex,
        is_required: childQuestion.item.required,
      });
    }
    // childQuestion.item.required &&
    // this.arrayRequiredQuestion.push({
    //   main_category_index: mainCategoryIndex,
    //   child_question_index: childQuestion.index,
    //   main_question_index: mainQuestionIndex,
    //   isRequired: childQuestion.item.required,
    // });
  };
  renderQuestionType(mainCategoryIndex, mainQuestionIndex, childQuestion) {
    // {
    this.collectRequiredItemsInArray(
      this.arrayRequiredQuestion,
      childQuestion,
      mainQuestionIndex,
      mainCategoryIndex,
    );

    // }

    if (childQuestion.item.type === 'checkbox') {
      this.arrMulti = [];
      return (
        <View
          style={[
            styles.answersContainer,
            {
              justifyContent:
                childQuestion.item.image == 1 || childQuestion.item.note == 1
                  ? 'flex-start'
                  : 'center',
            },
          ]}>
          {/* <ScrollView> */}
          <FlatList
            data={childQuestion.item.options}
            renderItem={({item, index}) => (
              <View style={{}}>
                <TouchableOpacity
                  onPress={() => {
                    this.selectedMultipleValue(
                      this.arrayAnswers,
                      childQuestion,
                      item.option,
                      mainCategoryIndex,
                      mainQuestionIndex,
                    );
                  }}
                  style={[styles.buttonRate]}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                    <Icon
                      name={
                        this.selectedFoundMultipleOptions(
                          this.arrayAnswers,
                          childQuestion,
                          item.option,
                          mainCategoryIndex,
                          mainQuestionIndex,
                        )
                          ? 'check-square'
                          : 'square'
                      }
                      type="feather"
                      color={
                        this.selectedFoundMultipleOptions(
                          this.arrayAnswers,
                          childQuestion,
                          item.option,
                          mainCategoryIndex,
                          mainQuestionIndex,
                        )
                          ? '#4eace9'
                          : '#8b8b8b'
                      }
                      containerStyle={{
                        width: responsiveWidth(5),
                        marginRight: responsiveWidth(2),
                      }}
                    />

                    <Text
                      style={[
                        styles.btnTitleRate,
                        this.selectedFoundMultipleOptions(
                          this.arrayAnswers,
                          childQuestion,
                          item.option,
                          mainCategoryIndex,
                          mainQuestionIndex,
                        )
                          ? {color: '#4eace9'}
                          : {color: '#8b8b8b'},
                      ]}>
                      {item.option}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            )}
            keyExtractor={(item) => item.id.toString()}

            // extraData={this.state}
          />
          {/* </ScrollView> */}

          {(childQuestion.item.image == 1 || childQuestion.item.note == 1) && (
            <TwoIcons
              cameraFlag={childQuestion?.item?.image}
              noteFlag={childQuestion?.item?.note}
              onChangeNote={(val) =>
                this.insertNoteValue(
                  this.arrayAnswers,
                  childQuestion,
                  val,
                  childQuestion.item.type,
                  mainCategoryIndex,
                  mainQuestionIndex,
                )
              }
              note={this.selectedNoteValue(
                this.arrayAnswers,
                childQuestion,
                mainCategoryIndex,
                mainQuestionIndex,
              )}
              onInsertImages={(val) => {
                if (val == 'upload') {
                  this.insertImageModalQuestion(
                    this.arrayAnswers,
                    this.state.openImageModal
                      ? this.state.selectedQuestionForPhoto
                      : childQuestion,
                    this.state.openImageModal
                      ? this.state.selectedMainCategoryIndexForPhoto
                      : mainCategoryIndex,
                    this.state.openImageModal
                      ? this.state.selectedMainQuestionIndexForPhoto
                      : mainQuestionIndex,
                  );
                } else {
                  this.onPressTakePhotoModal(
                    this.state.openImageModal
                      ? this.state.selectedQuestionForPhoto
                      : childQuestion,
                    this.state.openImageModal
                      ? this.state.selectedMainCategoryIndexForPhoto
                      : mainCategoryIndex,
                    this.state.openImageModal
                      ? this.state.selectedMainQuestionIndexForPhoto
                      : mainQuestionIndex,
                    'modal',
                  );
                }
              }}
              images={this.selectedImagesModalValue(
                this.arrayAnswers,
                this.state.openImageModal
                  ? this.state.selectedQuestionForPhoto
                  : childQuestion,
                this.state.openImageModal
                  ? this.state.selectedMainCategoryIndexForPhoto
                  : mainCategoryIndex,
                this.state.openImageModal
                  ? this.state.selectedMainQuestionIndexForPhoto
                  : mainQuestionIndex,
              )}
              deleteImageModal={(val) => {
                this.onPressDeleteImageModal(
                  this.arrayAnswers,
                  this.state.openImageModal
                    ? this.state.selectedQuestionForPhoto
                    : childQuestion,
                  this.state.openImageModal
                    ? this.state.selectedMainCategoryIndexForPhoto
                    : mainCategoryIndex,
                  this.state.openImageModal
                    ? this.state.selectedMainQuestionIndexForPhoto
                    : mainQuestionIndex,
                  val,
                );
              }}
              closeModal={() => {
                this.setState({
                  selectedQuestionForPhoto: {},
                  selectedMainCategoryIndexForPhoto: 0,
                  selectedMainQuestionIndexForPhoto: 0,
                  openImageModal: false,
                });
              }}
              openImage={
                Object.keys(this.state.selectedQuestionForPhoto).length === 0 &&
                this.state.selectedQuestionForPhoto.item.id ===
                  childQuestion.item.id &&
                this.state.selectedQuestionForPhoto.index ===
                  childQuestion.index &&
                this.state.selectedMainCategoryIndexForPhoto ===
                  mainCategoryIndex &&
                this.state.selectedMainQuestionIndexForPhoto ===
                  mainQuestionIndex
                  ? this.state.openImageModal && !this.state.showCameraFlag
                  : false
              }
            />
          )}
        </View>
      );
    } else if (childQuestion.item.type === 'radio') {
      return (
        <View
          style={[
            styles.answersContainer,
            {
              justifyContent:
                childQuestion.item.image == 1 || childQuestion.item.notek == 1
                  ? 'flex-start'
                  : 'center',
            },
          ]}>
          {/* <ScrollView> */}
          <FlatList
            data={childQuestion.item.options}
            renderItem={({item, index}) => (
              <View style={{}}>
                <TouchableOpacity
                  onPress={() => {
                    this.selectedSingleValue(
                      this.arrayAnswers,
                      childQuestion,
                      item.option,
                      mainCategoryIndex,
                      mainQuestionIndex,
                    );
                  }}
                  style={[styles.buttonRate]}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                    <Icon
                      name={
                        this.selectedfoundSingleOption(
                          this.arrayAnswers,
                          childQuestion,
                          item.option,
                          mainCategoryIndex,
                          mainQuestionIndex,
                        )
                          ? 'check-circle'
                          : 'circle'
                      }
                      type="feather"
                      color={
                        this.selectedfoundSingleOption(
                          this.arrayAnswers,
                          childQuestion,
                          item.option,
                          mainCategoryIndex,
                          mainQuestionIndex,
                        )
                          ? '#4eace9'
                          : '#8b8b8b'
                      }
                      containerStyle={{
                        width: responsiveWidth(5),
                        marginRight: responsiveWidth(2),
                      }}
                    />
                    <Text
                      style={[
                        styles.btnTitleRate,
                        this.selectedfoundSingleOption(
                          this.arrayAnswers,
                          childQuestion,
                          item.option,
                          mainCategoryIndex,
                          mainQuestionIndex,
                        )
                          ? {color: '#4eace9'}
                          : {color: '#8b8b8b'},
                      ]}>
                      {item.option}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            )}
            keyExtractor={(item) => item.id.toString()}

            // extraData={this.state}
          />
          {/* </ScrollView> */}
          {childQuestion.item.image == 1 ||
            (childQuestion.item.note == 1 && (
              <TwoIcons
                cameraFlag={childQuestion?.item?.image}
                noteFlag={childQuestion?.item?.note}
                onChangeNote={(val) =>
                  this.insertNoteValue(
                    this.arrayAnswers,
                    childQuestion,
                    val,
                    childQuestion.item.type,
                    mainCategoryIndex,
                    mainQuestionIndex,
                  )
                }
                note={this.selectedNoteValue(
                  this.arrayAnswers,
                  childQuestion,
                  mainCategoryIndex,
                  mainQuestionIndex,
                )}
                onInsertImages={(val) => {
                  if (val == 'upload') {
                    this.insertImageModalQuestion(
                      this.arrayAnswers,
                      this.state.openImageModal
                        ? this.state.selectedQuestionForPhoto
                        : childQuestion,
                      this.state.openImageModal
                        ? this.state.selectedMainCategoryIndexForPhoto
                        : mainCategoryIndex,
                      this.state.openImageModal
                        ? this.state.selectedMainQuestionIndexForPhoto
                        : mainQuestionIndex,
                    );
                  } else {
                    this.onPressTakePhotoModal(
                      this.state.openImageModal
                        ? this.state.selectedQuestionForPhoto
                        : childQuestion,
                      this.state.openImageModal
                        ? this.state.selectedMainCategoryIndexForPhoto
                        : mainCategoryIndex,
                      this.state.openImageModal
                        ? this.state.selectedMainQuestionIndexForPhoto
                        : mainQuestionIndex,
                      'modal',
                    );
                  }
                }}
                images={this.selectedImagesModalValue(
                  this.arrayAnswers,
                  this.state.openImageModal
                    ? this.state.selectedQuestionForPhoto
                    : childQuestion,
                  this.state.openImageModal
                    ? this.state.selectedMainCategoryIndexForPhoto
                    : mainCategoryIndex,
                  this.state.openImageModal
                    ? this.state.selectedMainQuestionIndexForPhoto
                    : mainQuestionIndex,
                )}
                deleteImageModal={(val) => {
                  this.onPressDeleteImageModal(
                    this.arrayAnswers,
                    this.state.openImageModal
                      ? this.state.selectedQuestionForPhoto
                      : childQuestion,
                    this.state.openImageModal
                      ? this.state.selectedMainCategoryIndexForPhoto
                      : mainCategoryIndex,
                    this.state.openImageModal
                      ? this.state.selectedMainQuestionIndexForPhoto
                      : mainQuestionIndex,
                    val,
                  );
                }}
                closeModal={() => {
                  this.setState({
                    selectedQuestionForPhoto: {},
                    selectedMainCategoryIndexForPhoto: 0,
                    selectedMainQuestionIndexForPhoto: 0,
                    openImageModal: false,
                  });
                }}
                openImage={
                  this.state.selectedQuestionForPhoto?.item?.id ===
                    childQuestion?.item.id &&
                  this.state.selectedQuestionForPhoto?.index ===
                    childQuestion.index &&
                  this.state.selectedMainCategoryIndexForPhoto ===
                    mainCategoryIndex &&
                  this.state.selectedMainQuestionIndexForPhoto ===
                    mainQuestionIndex
                    ? this.state.openImageModal && !this.state.showCameraFlag
                    : false
                }
              />
            ))}
        </View>
      );
    } else if (childQuestion.item.type === 'text') {
      return (
        <View
          style={[
            styles.answersContainer,
            {
              justifyContent:
                childQuestion.item.image == 1 || childQuestion.item.note == 1
                  ? 'flex-start'
                  : 'center',
            },
          ]}>
          <Textarea
            key={childQuestion.item.id}
            containerStyle={styles.textareaContainer}
            style={styles.textarea}
            onChangeText={(value) => {
              this.insertTextValue(
                this.arrayAnswers,
                childQuestion,
                value,
                mainCategoryIndex,
                mainQuestionIndex,
              );
            }}
            placeholder={'Leave an answer'}
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

          {(childQuestion.item.image == 1 || childQuestion.item.note == 1) && (
            <TwoIcons
              cameraFlag={childQuestion?.item?.image}
              noteFlag={childQuestion?.item?.note}
              onChangeNote={(val) =>
                this.insertNoteValue(
                  this.arrayAnswers,
                  childQuestion,
                  val,
                  childQuestion.item.type,
                  mainCategoryIndex,
                  mainQuestionIndex,
                )
              }
              note={this.selectedNoteValue(
                this.arrayAnswers,
                childQuestion,
                mainCategoryIndex,
                mainQuestionIndex,
              )}
              onInsertImages={(val) => {
                if (val == 'upload') {
                  this.insertImageModalQuestion(
                    this.arrayAnswers,
                    this.state.openImageModal
                      ? this.state.selectedQuestionForPhoto
                      : childQuestion,
                    this.state.openImageModal
                      ? this.state.selectedMainCategoryIndexForPhoto
                      : mainCategoryIndex,
                    this.state.openImageModal
                      ? this.state.selectedMainQuestionIndexForPhoto
                      : mainQuestionIndex,
                  );
                } else {
                  this.onPressTakePhotoModal(
                    this.state.openImageModal
                      ? this.state.selectedQuestionForPhoto
                      : childQuestion,
                    this.state.openImageModal
                      ? this.state.selectedMainCategoryIndexForPhoto
                      : mainCategoryIndex,
                    this.state.openImageModal
                      ? this.state.selectedMainQuestionIndexForPhoto
                      : mainQuestionIndex,
                    'modal',
                  );
                }
              }}
              images={this.selectedImagesModalValue(
                this.arrayAnswers,
                this.state.openImageModal
                  ? this.state.selectedQuestionForPhoto
                  : childQuestion,
                this.state.openImageModal
                  ? this.state.selectedMainCategoryIndexForPhoto
                  : mainCategoryIndex,
                this.state.openImageModal
                  ? this.state.selectedMainQuestionIndexForPhoto
                  : mainQuestionIndex,
              )}
              deleteImageModal={(val) => {
                this.onPressDeleteImageModal(
                  this.arrayAnswers,
                  this.state.openImageModal
                    ? this.state.selectedQuestionForPhoto
                    : childQuestion,
                  this.state.openImageModal
                    ? this.state.selectedMainCategoryIndexForPhoto
                    : mainCategoryIndex,
                  this.state.openImageModal
                    ? this.state.selectedMainQuestionIndexForPhoto
                    : mainQuestionIndex,
                  val,
                );
              }}
              closeModal={() => {
                this.setState({
                  selectedQuestionForPhoto: {},
                  selectedMainCategoryIndexForPhoto: 0,
                  selectedMainQuestionIndexForPhoto: 0,
                  openImageModal: false,
                });
              }}
              openImage={
                this.state.selectedQuestionForPhoto?.item?.id ===
                  childQuestion?.item.id &&
                this.state.selectedQuestionForPhoto?.index ===
                  childQuestion.index &&
                this.state.selectedMainCategoryIndexForPhoto ===
                  mainCategoryIndex &&
                this.state.selectedMainQuestionIndexForPhoto ===
                  mainQuestionIndex
                  ? this.state.openImageModal && !this.state.showCameraFlag
                  : false
              }
            />
          )}
        </View>
      );
    } else if (
      childQuestion.item.type === 'image_single' ||
      childQuestion.item.type === 'image_multiple'
    ) {
      return (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            marginTop: responsiveHeight(1),
          }}>
          {this.getImageValuesFlag(
            this.arrayAnswers,
            childQuestion,
            mainCategoryIndex,
            mainQuestionIndex,
          ) ? (
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignSelf: 'center',
                height: responsiveHeight(19),
                width:
                  childQuestion.item.type == 'image_multiple'
                    ? responsiveWidth(70)
                    : responsiveWidth(42),
              }}>
              <>
                <FlatList
                  horizontal={
                    childQuestion.item.type == 'image_multiple' ? true : false
                  }
                  data={this.getImageValues(
                    this.arrayAnswers,
                    childQuestion,
                    mainCategoryIndex,
                    mainQuestionIndex,
                  )}
                  renderItem={({item, index}) => {
                    return (
                      <>
                        <TouchableHighlight
                          style={{
                            width: responsiveWidth(40),
                            marginHorizontal: responsiveWidth(1),
                          }}
                          onPress={() => {
                            this.onPressImage(
                              this.arrayAnswers,
                              childQuestion,
                              mainCategoryIndex,
                              mainQuestionIndex,
                              index,
                            );
                          }}>
                          <Image
                            source={{
                              uri: item.img,
                            }}
                            style={{
                              width: responsiveWidth(40),
                              height: responsiveHeight(18),
                              borderRadius: 20,
                            }}
                          />
                        </TouchableHighlight>
                        <Icon
                          name="close"
                          type="antdesign"
                          color="red"
                          size={responsiveWidth(3)}
                          raised
                          containerStyle={{
                            position: 'absolute',
                            right: 0,
                            top: 0,
                          }}
                          onPress={() => {
                            this.onPressDeleteImageUploaded(
                              this.arrayAnswers,
                              childQuestion,
                              mainCategoryIndex,
                              mainQuestionIndex,
                              index,
                            );
                          }}
                        />
                      </>
                    );
                  }}
                  keyExtractor={(item, index) => index.toString()}
                />
                {this.getImageValues(
                  this.arrayAnswers,
                  childQuestion,
                  mainCategoryIndex,
                  mainQuestionIndex,
                ).length > 0 && (
                  <Modal
                    isVisible={this.state.isOpenedModelMsg}
                    style={styles.modalStyle}
                    avoidKeyboard={false}>
                    <TouchableWithoutFeedback
                      onPress={() => {
                        Keyboard.dismiss(0);
                      }}>
                      <View style={styles.mainContainerModal}>
                        <View
                          style={{
                            marginHorizontal: responsiveWidth(2),
                            justifyContent: 'center',
                          }}>
                          <Text style={styles.commentLabel}>
                            Please leave your comment on the photo
                          </Text>
                          <Text style={styles.commentLabel}>
                            برجاء كتابة تعليقك علي الصورة
                          </Text>

                          <Textarea
                            containerStyle={[
                              styles.textareaContainer,
                              {width: responsiveWidth(80)},
                            ]}
                            style={[styles.textarea]}
                            onChangeText={(val) => {
                              this.setState({
                                commentOnSelectedImg: val,
                              });
                            }}
                            value={this.state.commentOnSelectedImg}
                            maxLength={200}
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
                          <Button
                            title="Submit"
                            onPress={() => {
                              this.onPressSubmitCommentSelectedImg();
                            }}
                            titleStyle={styles.titleSubmitBtn}
                            buttonStyle={styles.submitBtn}
                          />
                        </View>
                      </View>
                    </TouchableWithoutFeedback>
                  </Modal>
                )}
              </>
            </View>
          ) : null}
          <View
            style={[
              styles.answersContainer,
              {
                justifyContent:
                  childQuestion.item.image == 1 || childQuestion.item.note == 1
                    ? 'flex-start'
                    : 'center',
              },
            ]}>
            <View style={[styles.buttonsViewStyle]}>
              {this.getImageValues(
                this.arrayAnswers,
                childQuestion,
                mainCategoryIndex,
                mainQuestionIndex,
              )?.length < 5 &&
                childQuestion.item.type === 'image_multiple' && (
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
                        onPress={() => {
                          this.onPressUploadImage(
                            childQuestion,
                            mainCategoryIndex,
                            mainQuestionIndex,
                          );
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
                          this.selectImageQuestion(
                            this.arrayAnswers,
                            childQuestion,
                            mainCategoryIndex,
                            mainQuestionIndex,
                          );
                        }}
                        titleStyle={styles.titleUploadBtn}
                        buttonStyle={styles.buttonImagesStyle}
                      />
                    </View>
                  </>
                )}
              {this.getImageValues(
                this.arrayAnswers,
                childQuestion,
                mainCategoryIndex,
                mainQuestionIndex,
              )?.length < 1 &&
                childQuestion.item.type === 'image_single' && (
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
                        onPress={() => {
                          this.onPressUploadImage(
                            childQuestion,
                            mainCategoryIndex,
                            mainQuestionIndex,
                          );
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
                          this.selectImageQuestion(
                            this.arrayAnswers,
                            childQuestion,
                            mainCategoryIndex,
                            mainQuestionIndex,
                          );
                        }}
                        titleStyle={styles.titleUploadBtn}
                        buttonStyle={styles.buttonImagesStyle}
                      />
                    </View>
                  </>
                )}
            </View>
            {(childQuestion.item.image == 1 ||
              childQuestion.item.note == 1) && (
              <TwoIcons
                cameraFlag={childQuestion?.item?.image}
                noteFlag={childQuestion?.item?.note}
                onChangeNote={(val) =>
                  this.insertNoteValue(
                    this.arrayAnswers,
                    childQuestion,
                    val,
                    childQuestion.item.type,
                    mainCategoryIndex,
                    mainQuestionIndex,
                  )
                }
                note={this.selectedNoteValue(
                  this.arrayAnswers,
                  childQuestion,
                  mainCategoryIndex,
                  mainQuestionIndex,
                )}
                onInsertImages={(val) => {
                  if (val == 'upload') {
                    this.insertImageModalQuestion(
                      this.arrayAnswers,
                      this.state.openImageModal
                        ? this.state.selectedQuestionForPhoto
                        : childQuestion,
                      this.state.openImageModal
                        ? this.state.selectedMainCategoryIndexForPhoto
                        : mainCategoryIndex,
                      this.state.openImageModal
                        ? this.state.selectedMainQuestionIndexForPhoto
                        : mainQuestionIndex,
                    );
                  } else {
                    this.onPressTakePhotoModal(
                      this.state.openImageModal
                        ? this.state.selectedQuestionForPhoto
                        : childQuestion,
                      this.state.openImageModal
                        ? this.state.selectedMainCategoryIndexForPhoto
                        : mainCategoryIndex,
                      this.state.openImageModal
                        ? this.state.selectedMainQuestionIndexForPhoto
                        : mainQuestionIndex,
                      'modal',
                    );
                  }
                }}
                images={this.selectedImagesModalValue(
                  this.arrayAnswers,
                  this.state.openImageModal
                    ? this.state.selectedQuestionForPhoto
                    : childQuestion,
                  this.state.openImageModal
                    ? this.state.selectedMainCategoryIndexForPhoto
                    : mainCategoryIndex,
                  this.state.openImageModal
                    ? this.state.selectedMainQuestionIndexForPhoto
                    : mainQuestionIndex,
                )}
                deleteImageModal={(val) => {
                  this.onPressDeleteImageModal(
                    this.arrayAnswers,
                    this.state.openImageModal
                      ? this.state.selectedQuestionForPhoto
                      : childQuestion,
                    this.state.openImageModal
                      ? this.state.selectedMainCategoryIndexForPhoto
                      : mainCategoryIndex,
                    this.state.openImageModal
                      ? this.state.selectedMainQuestionIndexForPhoto
                      : mainQuestionIndex,
                    val,
                  );
                }}
                closeModal={() => {
                  this.setState({
                    selectedQuestionForPhoto: {},
                    selectedMainCategoryIndexForPhoto: 0,
                    selectedMainQuestionIndexForPhoto: 0,
                    openImageModal: false,
                  });
                }}
                openImage={
                  this.state.selectedQuestionForPhoto?.item?.id ===
                    childQuestion?.item.id &&
                  this.state.selectedQuestionForPhoto?.index ===
                    childQuestion.index &&
                  this.state.selectedMainCategoryIndexForPhoto ===
                    mainCategoryIndex &&
                  this.state.selectedMainQuestionIndexForPhoto ===
                    mainQuestionIndex
                    ? this.state.openImageModal && !this.state.showCameraFlag
                    : false
                }
              />
            )}
          </View>
        </View>
      );
    } else if (childQuestion.item.type === 'number') {
      return (
        <View
          style={[
            styles.answersContainer,
            {
              justifyContent:
                childQuestion.item.image == 1 || childQuestion.item.note == 1
                  ? 'flex-start'
                  : 'center',
            },
          ]}>
          <CounterBtn
            onChangeCounter={(val) => {
              this.selectedSingleValue(
                this.arrayAnswers,
                childQuestion,
                val,
                mainCategoryIndex,
                mainQuestionIndex,
              );
            }}
          />
          {(childQuestion.item.image == 1 || childQuestion.item.note == 1) && (
            <TwoIcons
              cameraFlag={childQuestion?.item?.image}
              noteFlag={childQuestion?.item?.note}
              onChangeNote={(val) =>
                this.insertNoteValue(
                  this.arrayAnswers,
                  childQuestion,
                  val,
                  childQuestion.item.type,
                  mainCategoryIndex,
                  mainQuestionIndex,
                )
              }
              note={this.selectedNoteValue(
                this.arrayAnswers,
                childQuestion,
                mainCategoryIndex,
                mainQuestionIndex,
              )}
              onInsertImages={(val) => {
                if (val == 'upload') {
                  this.insertImageModalQuestion(
                    this.arrayAnswers,
                    this.state.openImageModal
                      ? this.state.selectedQuestionForPhoto
                      : childQuestion,
                    this.state.openImageModal
                      ? this.state.selectedMainCategoryIndexForPhoto
                      : mainCategoryIndex,
                    this.state.openImageModal
                      ? this.state.selectedMainQuestionIndexForPhoto
                      : mainQuestionIndex,
                  );
                } else {
                  this.onPressTakePhotoModal(
                    this.state.openImageModal
                      ? this.state.selectedQuestionForPhoto
                      : childQuestion,
                    this.state.openImageModal
                      ? this.state.selectedMainCategoryIndexForPhoto
                      : mainCategoryIndex,
                    this.state.openImageModal
                      ? this.state.selectedMainQuestionIndexForPhoto
                      : mainQuestionIndex,
                    'modal',
                  );
                }
              }}
              images={this.selectedImagesModalValue(
                this.arrayAnswers,
                this.state.openImageModal
                  ? this.state.selectedQuestionForPhoto
                  : childQuestion,
                this.state.openImageModal
                  ? this.state.selectedMainCategoryIndexForPhoto
                  : mainCategoryIndex,
                this.state.openImageModal
                  ? this.state.selectedMainQuestionIndexForPhoto
                  : mainQuestionIndex,
              )}
              deleteImageModal={(val) => {
                this.onPressDeleteImageModal(
                  this.arrayAnswers,
                  this.state.openImageModal
                    ? this.state.selectedQuestionForPhoto
                    : childQuestion,
                  this.state.openImageModal
                    ? this.state.selectedMainCategoryIndexForPhoto
                    : mainCategoryIndex,
                  this.state.openImageModal
                    ? this.state.selectedMainQuestionIndexForPhoto
                    : mainQuestionIndex,
                  val,
                );
              }}
              closeModal={() => {
                this.setState({
                  selectedQuestionForPhoto: {},
                  selectedMainCategoryIndexForPhoto: 0,
                  selectedMainQuestionIndexForPhoto: 0,
                  openImageModal: false,
                });
              }}
              openImage={
                this.state.selectedQuestionForPhoto?.item?.id ===
                  childQuestion?.item.id &&
                this.state.selectedQuestionForPhoto?.index ===
                  childQuestion.index &&
                this.state.selectedMainCategoryIndexForPhoto ===
                  mainCategoryIndex &&
                this.state.selectedMainQuestionIndexForPhoto ===
                  mainQuestionIndex
                  ? this.state.openImageModal && !this.state.showCameraFlag
                  : false
              }
            />
          )}
        </View>
      );
    } else if (childQuestion.item.type === 'dropdown_single') {
      return (
        <View
          style={[
            styles.answersContainer,
            {
              justifyContent:
                childQuestion.item.image == 1 || childQuestion.item.note == 1
                  ? 'flex-start'
                  : 'center',
            },
          ]}>
          <DropdownList
            options={childQuestion.item.options.map(({id, option}) => ({
              label: option,
              value: option,
            }))}
            multiFlag={false}
            onChange={(item) => {
              this.selectedSingleValue(
                this.arrayAnswers,
                childQuestion,
                item,
                mainCategoryIndex,
                mainQuestionIndex,
              );
            }}
            value={this.state.selectedProject}
            maxHeight={responsiveHeight(20)}
            listMode="MODAL"
            placeholder="Choose an option"
            modalContentContainerStyle={{
              backgroundColor: '#fff',
              height: responsiveHeight(40),
            }}
            modalTitle="Select an option"
            modalTitleStyle={{
              fontWeight: 'bold',
              color: '#4eace9',
            }}
            containerStyle={{
              width: responsiveWidth(58),
            }}
          />

          {(childQuestion.item.image == 1 || childQuestion.item.note == 1) && (
            <TwoIcons
              cameraFlag={childQuestion?.item?.image}
              noteFlag={childQuestion?.item?.note}
              onChangeNote={(val) =>
                this.insertNoteValue(
                  this.arrayAnswers,
                  childQuestion,
                  val,
                  childQuestion.item.type,
                  mainCategoryIndex,
                  mainQuestionIndex,
                )
              }
              note={this.selectedNoteValue(
                this.arrayAnswers,
                childQuestion,
                mainCategoryIndex,
                mainQuestionIndex,
              )}
              onInsertImages={(val) => {
                if (val == 'upload') {
                  this.insertImageModalQuestion(
                    this.arrayAnswers,
                    this.state.openImageModal
                      ? this.state.selectedQuestionForPhoto
                      : childQuestion,
                    this.state.openImageModal
                      ? this.state.selectedMainCategoryIndexForPhoto
                      : mainCategoryIndex,
                    this.state.openImageModal
                      ? this.state.selectedMainQuestionIndexForPhoto
                      : mainQuestionIndex,
                  );
                } else {
                  this.onPressTakePhotoModal(
                    this.state.openImageModal
                      ? this.state.selectedQuestionForPhoto
                      : childQuestion,
                    this.state.openImageModal
                      ? this.state.selectedMainCategoryIndexForPhoto
                      : mainCategoryIndex,
                    this.state.openImageModal
                      ? this.state.selectedMainQuestionIndexForPhoto
                      : mainQuestionIndex,
                    'modal',
                  );
                }
              }}
              images={this.selectedImagesModalValue(
                this.arrayAnswers,
                this.state.openImageModal
                  ? this.state.selectedQuestionForPhoto
                  : childQuestion,
                this.state.openImageModal
                  ? this.state.selectedMainCategoryIndexForPhoto
                  : mainCategoryIndex,
                this.state.openImageModal
                  ? this.state.selectedMainQuestionIndexForPhoto
                  : mainQuestionIndex,
              )}
              deleteImageModal={(val) => {
                this.onPressDeleteImageModal(
                  this.arrayAnswers,
                  this.state.openImageModal
                    ? this.state.selectedQuestionForPhoto
                    : childQuestion,
                  this.state.openImageModal
                    ? this.state.selectedMainCategoryIndexForPhoto
                    : mainCategoryIndex,
                  this.state.openImageModal
                    ? this.state.selectedMainQuestionIndexForPhoto
                    : mainQuestionIndex,
                  val,
                );
              }}
              closeModal={() => {
                this.setState({
                  selectedQuestionForPhoto: {},
                  selectedMainCategoryIndexForPhoto: 0,
                  selectedMainQuestionIndexForPhoto: 0,
                  openImageModal: false,
                });
              }}
              openImage={
                this.state.selectedQuestionForPhoto?.item?.id ===
                  childQuestion?.item.id &&
                this.state.selectedQuestionForPhoto?.index ===
                  childQuestion.index &&
                this.state.selectedMainCategoryIndexForPhoto ===
                  mainCategoryIndex &&
                this.state.selectedMainQuestionIndexForPhoto ===
                  mainQuestionIndex
                  ? this.state.openImageModal && !this.state.showCameraFlag
                  : false
              }
            />
          )}
        </View>
      );
    } else if (childQuestion.item.type === 'dropdown_multiple') {
      return (
        <View
          style={[
            styles.answersContainer,
            {
              justifyContent:
                childQuestion.item.image == 1 || childQuestion.item.note == 1
                  ? 'flex-start'
                  : 'center',
            },
          ]}>
          <DropdownList
            options={childQuestion.item.options.map(({id, option}) => ({
              label: option,
              value: option,
            }))}
            multiFlag={true}
            onChange={(item) => {
              this.selectedMultipleValueDropList(
                this.arrayAnswers,
                childQuestion,
                item,
                mainCategoryIndex,
                mainQuestionIndex,
              );
            }}
            maxHeight={responsiveHeight(20)}
            listMode="MODAL"
            placeholder="Choose an option multi"
            modalContentContainerStyle={{
              backgroundColor: '#fff',
              height: responsiveHeight(40),
            }}
            modalTitle="Select an option"
            modalTitleStyle={{
              fontWeight: 'bold',
              color: '#4eace9',
            }}
            containerStyle={{
              width: responsiveWidth(58),
            }}
          />

          {(childQuestion.item.image == 1 || childQuestion.item.note == 1) && (
            <TwoIcons
              cameraFlag={childQuestion?.item?.image}
              noteFlag={childQuestion?.item?.note}
              onChangeNote={(val) =>
                this.insertNoteValue(
                  this.arrayAnswers,
                  childQuestion,
                  val,
                  childQuestion.item.type,
                  mainCategoryIndex,
                  mainQuestionIndex,
                )
              }
              note={this.selectedNoteValue(
                this.arrayAnswers,
                childQuestion,
                mainCategoryIndex,
                mainQuestionIndex,
              )}
              onInsertImages={(val) => {
                if (val == 'upload') {
                  this.insertImageModalQuestion(
                    this.arrayAnswers,
                    this.state.openImageModal
                      ? this.state.selectedQuestionForPhoto
                      : childQuestion,
                    this.state.openImageModal
                      ? this.state.selectedMainCategoryIndexForPhoto
                      : mainCategoryIndex,
                    this.state.openImageModal
                      ? this.state.selectedMainQuestionIndexForPhoto
                      : mainQuestionIndex,
                  );
                } else {
                  this.onPressTakePhotoModal(
                    this.state.openImageModal
                      ? this.state.selectedQuestionForPhoto
                      : childQuestion,
                    this.state.openImageModal
                      ? this.state.selectedMainCategoryIndexForPhoto
                      : mainCategoryIndex,
                    this.state.openImageModal
                      ? this.state.selectedMainQuestionIndexForPhoto
                      : mainQuestionIndex,
                    'modal',
                  );
                }
              }}
              images={this.selectedImagesModalValue(
                this.arrayAnswers,
                this.state.openImageModal
                  ? this.state.selectedQuestionForPhoto
                  : childQuestion,
                this.state.openImageModal
                  ? this.state.selectedMainCategoryIndexForPhoto
                  : mainCategoryIndex,
                this.state.openImageModal
                  ? this.state.selectedMainQuestionIndexForPhoto
                  : mainQuestionIndex,
              )}
              deleteImageModal={(val) => {
                this.onPressDeleteImageModal(
                  this.arrayAnswers,
                  this.state.openImageModal
                    ? this.state.selectedQuestionForPhoto
                    : childQuestion,
                  this.state.openImageModal
                    ? this.state.selectedMainCategoryIndexForPhoto
                    : mainCategoryIndex,
                  this.state.openImageModal
                    ? this.state.selectedMainQuestionIndexForPhoto
                    : mainQuestionIndex,
                  val,
                );
              }}
              closeModal={() => {
                this.setState({
                  selectedQuestionForPhoto: {},
                  selectedMainCategoryIndexForPhoto: 0,
                  selectedMainQuestionIndexForPhoto: 0,
                  openImageModal: false,
                });
              }}
              openImage={
                this.state.selectedQuestionForPhoto?.item?.id ===
                  childQuestion?.item.id &&
                this.state.selectedQuestionForPhoto?.index ===
                  childQuestion.index &&
                this.state.selectedMainCategoryIndexForPhoto ===
                  mainCategoryIndex &&
                this.state.selectedMainQuestionIndexForPhoto ===
                  mainQuestionIndex
                  ? this.state.openImageModal && !this.state.showCameraFlag
                  : false
              }
            />
          )}
        </View>
      );
    }
  }

  renderChooseProjectView = () => {
    return (
      <View
        style={{
          height: responsiveHeight(100),
          paddingHorizontal: responsiveWidth(3),
        }}>
        <KeyboardAvoidingView>
          <View
            style={{
              marginHorizontal: responsiveWidth(10),
              marginVertical: responsiveHeight(5),
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image
              style={{
                width: responsiveWidth(50),
                height: responsiveHeight(30),
                resizeMode: 'contain',
              }}
              source={
                this.props.allProjectsUser.image
                  ? {
                      uri:
                        'https://audita.app/' +
                        this.props.allProjectsUser.image,
                    }
                  : require('../assets/icons/icon3.jpeg')
              }
            />
          </View>

          <View style={{minHeight: responsiveHeight(40)}}>
            {this.props.allProjectsUserLoading && this.state.projectsState && (
              <>
                <DropdownList
                  // zIndex={3000}
                  labelStyle={{color: '#0d008e'}}
                  listItemLabelStyle={{
                    color: '#8b8b8b',
                  }}
                  options={this.state.projectsState}
                  onChange={(item) => {
                    this.setState(
                      {
                        selectedProject: item,
                        projectIndex: this.props.allProjectsUser.projects.findIndex(
                          (object) => {
                            return object.id === item;
                          },
                        ),
                        loadingPostSurveyState: false,
                      },
                      function () {
                        this.getSpecificAreas(this.state.projectIndex);
                        this.setState(
                          {
                            questionsList: this.props.allProjectsUser.projects[
                              this.state.projectIndex
                            ].areas,
                          },
                          function () {},
                        );
                      },
                    );
                  }}
                  label="Choose Project"
                  value={this.state.selectedProject}
                  maxHeight={responsiveHeight(20)}
                  listMode="SCROLLVIEW"
                  placeholder="Choose Project"
                  searchable={true}
            
                />
              </>
            )}

            {this.state.areasState.length && this.state.areasState ? (
              <DropdownList
                // zIndex={1000}
                labelStyle={{color: '#0d008e'}}
                listItemLabelStyle={{
                  color: '#8b8b8b',
                }}
                wrapperStyle={{marginTop: responsiveHeight(5)}}
                options={this.state.areasState}
                onChange={(item, index) => {
                  console.log(item);

                  this.setState({
                    areaIndex: this.state.areasState.findIndex((obj) => {
                      return obj.value == item;
                    }),

                    selectedArea: item,
                    showProjectsList: false,
                    areasState: [],
                  });
                }}
                label="Choose Area"
                value={this.state.selectedArea}
                maxHeight={responsiveHeight(20)}
                listMode="SCROLLVIEW"
                placeholder="Choose Area"
              />
            ) : null}
          </View>
        </KeyboardAvoidingView>
      </View>
    );
  };

  /***************** function render flatlist questions **************** */
  renderItemSubQuestions = (
    mainCategoryIndex,
    mainQuestionIndex,
    childQuestion,
  ) => {
    this.splitArr = childQuestion.item.question.split('\r\n');
    return (
      <View key={childQuestion.item.id} style={{zIndex: 1000}}>
        {this.splitArr.length == 1 ? (
          <View>
            <Text
              style={[
                styles.questionText,
                this.state.arrayRequiredQuestionNotAnsweredYet.filter(
                  (el) =>
                    el.question_id == childQuestion.item.id &&
                    el.main_category_index == mainCategoryIndex &&
                    el.child_question_index == childQuestion.index &&
                    el.main_question_index == mainQuestionIndex,
                ).length > 0 && childQuestion.item.required == 1
                  ? {color: 'red'}
                  : {color: '#8b8b8b'},
              ]}>
              {this.splitArr[0]}{' '}
              {childQuestion.item.required == 1 && <Text>*</Text>}
            </Text>
          </View>
        ) : (
          <View>
            <Text
              style={[
                styles.questionText1,
                this.state.arrayRequiredQuestionNotAnsweredYet.filter(
                  (el) =>
                    el.question_id == childQuestion.item.id &&
                    el.main_category_index == mainCategoryIndex &&
                    el.child_question_index == childQuestion.index &&
                    el.main_question_index == mainQuestionIndex,
                ).length > 0 && childQuestion.item.required == 1
                  ? {color: 'red'}
                  : {color: '#8b8b8b'},
              ]}>
              {this.splitArr[0]}{' '}
              {childQuestion.item.required == 1 && <Text>*</Text>}
            </Text>
            <Text style={styles.questionText2}>{this.splitArr[1]}</Text>
          </View>
        )}

        {this.renderQuestionType(
          mainCategoryIndex,
          mainQuestionIndex,
          childQuestion,
        )}
      </View>
    );
  };
  //  ********************** onPress to take aphoto

  onPressUploadImage = (
    childQuestion,
    mainCategoryIndex,
    mainQuestionIndex,
  ) => {
    this.setState({
      showCameraFlag: true,
      selectedQuestionForPhoto: childQuestion,
      selectedMainCategoryIndexForPhoto: mainCategoryIndex,
      selectedMainQuestionIndexForPhoto: mainQuestionIndex,
      selectedTypeForPhotoModal: 'main',
    });
  };
  //  ********************** onPress to take aphoto for modal
  onPressTakePhotoModal = (
    childQuestion,
    mainCategoryIndex,
    mainQuestionIndex,
    type,
  ) => {
    console.log('on press camera             ', childQuestion);
    this.setState({
      showCameraFlag: true,
      selectedQuestionForPhoto: childQuestion,
      selectedMainCategoryIndexForPhoto: mainCategoryIndex,
      selectedMainQuestionIndexForPhoto: mainQuestionIndex,
      selectedTypeForPhotoModal: type,
    });
  };

  checkRequired = () => {
    this.arrayRequiredQuestionNotAnswered = [];
    this.arrayRequiredQuestionFromAnswers = this.arrayAnswers.filter((obj) => {
      return (obj.is_required === 1 && 
        (typeof obj.value =='number'?obj.value!==0:obj.value.length>0)
        );
    });

    for (let i = 0; i < this.arrayRequiredQuestion.length; i++) {
      let found = this.arrayRequiredQuestionFromAnswers.some(
        (el) => {
          if (
            el.question_id == this.arrayRequiredQuestion[i].question_id &&
            el.main_category_index ==
              this.arrayRequiredQuestion[i].main_category_index &&
            el.child_question_index ==
              this.arrayRequiredQuestion[i].child_question_index &&
            el.main_question_index ==
              this.arrayRequiredQuestion[i].main_question_index
          ) {
            return true;
          }

          return false;
        },
      )
      // if (  this.arrayRequiredQuestionFromAnswers.filter(
      //   (el) =>
      //     el.question_id == this.arrayRequiredQuestion[i].question_id &&
      //     el.main_category_index ==  this.arrayRequiredQuestion[i].main_category_index &&
      //     el.child_question_index ==  this.arrayRequiredQuestion[i].child_question_index &&
      //     el.main_question_index ==  this.arrayRequiredQuestion[i].main_question_index,
      // ).length <0) {
        if(!found){
        this.arrayRequiredQuestionNotAnswered.push({
          question_id: this.arrayRequiredQuestion[i].question_id,
          main_category_index: this.arrayRequiredQuestion[i]
            .main_category_index,
          child_question_index: this.arrayRequiredQuestion[i]
            .child_question_index,
          main_question_index: this.arrayRequiredQuestion[i]
            .main_question_index,
          is_required: this.arrayRequiredQuestion[i].is_required,
        });
      }
    }

    if (
      this.arrayRequiredQuestion.length ==
        this.arrayRequiredQuestionFromAnswers.length &&
      this.arrayAnswers.length > 0 &&
      this.arrayRequiredQuestionNotAnswered.length == 0
    ) {
      this.arrayRequiredQuestionFromAnswers = [];
      this.arrayRequiredQuestionNotAnswered=[];
      this.arrayRequiredQuestion=[];
      this.getOneTimeLocation();
    } else {
      this.flagSubmit = true;
      this.arrayRequiredQuestionFromAnswers = [];

      this.setState(
        {
          errorFlag: true,
          arrayRequiredQuestionNotAnsweredYet: this
            .arrayRequiredQuestionNotAnswered,
        },
        function () {
          this.arrayRequiredQuestionNotAnswered = [];
        },
      );
    }
  };
  surveyAction = () => {
    let today=new Date()
    let date=today.getFullYear()+ '-' +(today.getMonth()+1) + '-' + today.getDate();
    let time=today.getHours()+ ':' +today.getMinutes() + ':' + today.getSeconds();
    let date_time=date + ' '+ time;
    this.setState({submitFlag: true});
    console.log('aaaaaaaaaaa')
    console.log( this.props.coords?.latitude +'      '+
      this.props.coords?.longitude)
      console.log('dataaaaaa')
      console.log(Date(Date.now()).toString())
      console.log(today.toString().replace('T',' '))
      console.log(date_time)

    //  *************** last function
    this.checkRequired();
    };
  sortAnswersByCategoryIndex = (a, b) => {
    if (a.main_category_index < b.main_category_index) {
      return -1;
    }
    if (a.main_category_index > b.main_category_index) {
      return 1;
    }
    return 0;
  };
  sortAnswersByMainQuestionIndex = (a, b) => {
    if (a.main_question_index < b.main_question_index) {
      return -1;
    }
    if (a.main_question_index > b.main_question_index) {
      return 1;
    }
    // if (a.main_question_index === b.main_question_index) {
    //   return a.child_question_index - b.child_question_index;
    // }
    return 0;
  };
  sortAnswersByChildQuestionIndex = (a, b) => {
    if (a.main_question_index === b.main_question_index) {
      if (a.child_question_index < b.child_question_index) {
        return -1;
      }
      if (a.child_question_index > b.child_question_index) {
        return 1;
      }
      return 0;
    }
  };
  onPressSubmit = () => {
    this.keysAnswers = this.getAllKeyObjectInArray(this.testArrMultiImages);

    this.surveyAction();
    // this.checkedRequiredQuestions();
  };
  getItem = (item, index) => ({
    id: Math.random().toString(12).substring(0),
    data: item[index],
  });

  getItemCount = (data) => data.length;

  content = () => {
    return (
      <>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {
            Keyboard.dismiss(0);
          }}>
          <View style={styles.mainContainer}>
            {this.state.showProjectsList ? (
              this.renderChooseProjectView()
            ) : (
              <View>
                <SafeAreaView style={{flex: 1}}>
                  <FlatList
                    data={
                      this.state.questionsList[this.state.areaIndex].categories
                    }
                    renderItem={({item, index: indexCategory}) => (
                      <>
                        {item.questions.length > 0 && (
                          <View style={styles.mainContainerCategoryStyle}>
                            <Text style={styles.categoryTextStyle}>
                              {item.name}
                            </Text>
                            <FlatList
                              style={{
                                marginHorizontal: responsiveWidth(2),
                              }}
                              keyExtractor={(item) => item.id.toString()}
                              data={item.questions}
                              renderItem={({
                                item,
                                index: indexMainQuestion,
                              }) => {
                                // this.arrayRequiredQuestion=[];
                                return (
                                  <View
                                    style={{
                                      borderBottomColor: '#4eace9',
                                      borderBottomWidth: 1,
                                    }}>
                                    {/* <Text> {index2 } {item.type}</Text> */}
                                    {item.type !== 'hidden' && (
                                      <Text
                                        style={{
                                          color: '#4eace9',
                                          fontSize: responsiveFontSize(2),
                                          marginVertical: responsiveHeight(1),
                                          fontFamily: 'Roboto-Regular',
                                          textAlign: 'center',
                                        }}>
                                        {item.question}
                                      </Text>
                                    )}

                                    <FlatList
                                      keyExtractor={(item) =>
                                        item.id.toString()
                                      }
                                      data={item.sub_questions}
                                      renderItem={({item, index}) => {
                                        return this.renderItemSubQuestions(
                                          indexCategory,
                                          indexMainQuestion,
                                          {
                                            item,
                                            index,
                                          },
                                        );
                                      }}
                                    />
                                  </View>
                                );
                              }}
                            />
                          </View>
                        )}
                      </>
                    )}
                    keyExtractor={(item) => item.id.toString()}
                  />
                </SafeAreaView>

                <View
                  style={[styles.btnView, {marginTop: responsiveHeight(3)}]}>
                  <Button
                    title="Submit"
                    loading={this.props.loadingPostSurvey}
                    onPress={this.onPressSubmit.bind(this)}
                    titleStyle={styles.titleSubmitBtn}
                    buttonStyle={styles.buttonStyle}
                  />
                </View>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </>
    );
  };
  closeErrorAlert = () => {
    this.setState({
      errorFlag: false,
    });
  };

  takePicture = async () => {
    if (this.camera && !this.state.takingPic) {
      let options = {
        quality: 0.85,
        fixOrientation: true,
        forceUpOrientation: true,
      };

      this.setState({takingPic: true});

      try {
        const form = new FormData();
        const data = await this.camera.takePictureAsync(options);
        ImageResizer.createResizedImage(data.uri, 500, 500, 'PNG', 90, 0)
          .then(async (response) => {
            var dataImage = await RNFS.readFile(response.uri, 'base64').then(
              (res) => {
                return res;
              },
            );
            var dataBase64 = 'data:image/png;base64,' + dataImage;

            // **********************take asd

            if (this.state.selectedTypeForPhotoModal == 'modal') {
              if (
                this.arrayAnswers.findIndex(
                  (x) =>
                    x.question_id ==
                      this.state.selectedQuestionForPhoto.item.id &&
                    x.main_question_index ==
                      this.state.selectedMainQuestionIndexForPhoto &&
                    x.main_category_index ==
                      this.state.selectedMainCategoryIndexForPhoto &&
                    x.child_question_index ==
                      this.state.selectedQuestionForPhoto.index,
                ) !== -1
              ) {
                this.arrayAnswers[
                  this.arrayAnswers.findIndex(
                    (x) =>
                      x.question_id ==
                        this.state.selectedQuestionForPhoto.item.id &&
                      x.main_question_index ==
                        this.state.selectedMainQuestionIndexForPhoto &&
                      x.main_category_index ==
                        this.state.selectedMainCategoryIndexForPhoto &&
                      x.child_question_index ==
                        this.state.selectedQuestionForPhoto.index,
                  )
                ].images.push({img: dataBase64, comment: ''});
              } else {
                this.arrayAnswers.push({
                  question_id: this.state.selectedQuestionForPhoto.item.id,
                  is_required: this.state.selectedQuestionForPhoto.item.required,
                  value:
                    this.state.selectedQuestionForPhoto.item.type ==
                      'checkbox' ||
                    this.state.selectedQuestionForPhoto.item.type ==
                      'dropdown_multiple' ||
                    this.state.selectedQuestionForPhoto.item.type ==
                      'image_multiple' ||
                    this.state.selectedQuestionForPhoto.item.type ==
                      'image_single'
                      ? []
                      : '',
                  images: [{img: dataBase64, comment: ''}],
                  note: '',
                  main_category_index: this.state
                    .selectedMainCategoryIndexForPhoto,
                  child_question_index: this.state.selectedQuestionForPhoto
                    .index,
                  main_question_index: this.state
                    .selectedMainQuestionIndexForPhoto,
                 
                });
              }
              this.setState({
                openImageModal: true,
              });
            } else {
              if (
                this.arrayAnswers.findIndex(
                  (x) =>
                    x.question_id ==
                      this.state.selectedQuestionForPhoto.item.id &&
                    x.main_question_index ==
                      this.state.selectedMainQuestionIndexForPhoto &&
                    x.main_category_index ==
                      this.state.selectedMainCategoryIndexForPhoto &&
                    x.child_question_index ==
                      this.state.selectedQuestionForPhoto.index,
                ) !== -1
              ) {
                if (
                  this.state.selectedQuestionForPhoto.item.type ==
                  'image_multiple'
                ) {
                  this.arrayAnswers[
                    this.arrayAnswers.findIndex(
                      (x) =>
                        x.question_id ==
                          this.state.selectedQuestionForPhoto.item.id &&
                        x.main_question_index ==
                          this.state.selectedMainQuestionIndexForPhoto &&
                        x.main_category_index ==
                          this.state.selectedMainCategoryIndexForPhoto &&
                        x.child_question_index ==
                          this.state.selectedQuestionForPhoto.index,
                    )
                  ].value.push({img: dataBase64, comment: ''});
                } else {
                  this.arrayAnswers[
                    this.arrayAnswers.findIndex(
                      (x) =>
                        x.question_id ==
                          this.state.selectedQuestionForPhoto.item.id &&
                        x.main_question_index ==
                          this.state.selectedMainQuestionIndexForPhoto &&
                        x.main_category_index ==
                          this.state.selectedMainCategoryIndexForPhoto &&
                        x.child_question_index ==
                          this.state.selectedQuestionForPhoto.index,
                    )
                  ].value[0] = {img: dataBase64, comment: ''};
                }
              } else {
                this.arrayAnswers.push({
                  question_id: this.state.selectedQuestionForPhoto.item.id,
                  is_required: this.state.selectedQuestionForPhoto.item.required,
                  value: [{img: dataBase64, comment: ''}],
                  images: [],
                  note: '',
                  main_category_index: this.state
                    .selectedMainCategoryIndexForPhoto,

                  child_question_index: this.state.selectedQuestionForPhoto
                    .index,
                  main_question_index: this.state
                    .selectedMainQuestionIndexForPhoto,

                });
              }
              this.setState({
                surveyAnswers: this.arrayAnswers,
                showCameraFlag: false,
                selectedQuestionForPhoto: {},
                selectedMainCategoryIndexForPhoto: 0,
                selectedMainQuestionIndexForPhoto: 0,
                selectedTypeForPhotoModal: '',
                openImageModal: false,
              });
            }
            this.setState({
              surveyAnswers: this.arrayAnswers,
              showCameraFlag: false,
              // selectedQuestionForPhoto: {},
              // selectedMainCategoryIndexForPhoto: 0,
              // selectedMainQuestionIndexForPhoto: 0,
              // selectedTypeForPhotoModal:''
            });
          })
          .catch((err) => {
            // Oops, something went wrong. Check that the filename is correct and
            // inspect err to get more details.
          });
      } catch (err) {
        Alert.alert('Error', 'Failed to take picture: ' + (err.message || err));
        return;
      } finally {
        this.setState({takingPic: false});
      }
    }
  };

  findRequiredQuestions() {
    return this.state.questionsList
      .filter((el) => el.required === 1)
      .map((obj) => obj.id);
  }
  getAllKeyObjectInArray(param) {
    return Object.keys(Object.assign({}, ...param));
  }
  getOneTimeLocation = async () => {
    this.arrayAnswers.sort(this.sortAnswersByCategoryIndex);

    this.arrayAnswers.sort(function (a, b) {
      if (a.main_category_index == b.main_category_index) {
        if (a.main_question_index != b.main_question_index) {
          return a.main_question_index - b.main_question_index;
        } else if (a.main_question_index == b.main_question_index) {
          return a.child_question_index - b.child_question_index;
        }
      } else {
        return a.main_category_index - b.main_category_index;
      }
    });

    let today=new Date()
    let date=today.getFullYear()+ '-' +(today.getMonth()+1) + '-' + today.getDate();
    let time=today.getHours()+ ':' +today.getMinutes() + ':' + today.getSeconds();
    let date_time=date + ' '+ time;
      console.log('test ,'+ today.toString().replace('T',' '))
    this.props.postSurvey({
      secret: this.props.userData.secret,
      answers: this.arrayAnswers,
      token: this.props.userData.token,
      url: this.props.userData.url,
      area_id: this.state.selectedArea,
      project_id: this.state.selectedProject,
      location: {
        latitude: this.props.coords?.latitude,
        longitude: this.props.coords?.longitude,
      },
      survey_date_time:date_time
      // survey_date_time:Platform.OS==='ios'?today.toString().replace('T',' '):Date(Date.now()).toString()
    });
    this.setState({
      surveyAnswers: [],
      arrayRequiredQuestionNotAnsweredYet:[]
    });
    this.arrayAnswers = [];

  };

  render() {
    const {askedPhone, phone, doctorData} = this.state;
    hideNavigationBar();

    if (this.props.allProjectsUser?.projects.length !== 0) {
      return (
        <View style={{flex: 1, backgroundColor: 'white'}}>
          <KeyboardAvoidingView
            style={{
              flex: 1,
              flexDirection: 'column',
              justifyContent: 'center',
            }}
            behavior="height"
            enabled>
            {this.state.showCameraFlag && (
              <RNCamera
                ref={(cam) => {
                  this.camera = cam;
                }}
                style={{height: '100%'}}>
                <View style={{height: '100%'}}>
                  <TouchableOpacity
                    style={styles.backIconCamera}
                    onPress={() => {
                      this.setState({
                        showCameraFlag: false,
                      });
                    }}>
                    <Icon
                      name="md-arrow-back"
                      type="ionicon"
                      color="#DCDCDC"
                      size={responsiveWidth(15)}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      flex: 1,
                      flexDirection: 'column',
                      justifyContent: 'flex-end',

                      marginBottom: 10,
                    }}
                    onPress={this.takePicture}>
                    <Icon
                      name="camera"
                      type="feather"
                      color="#DCDCDC"
                      size={responsiveWidth(15)}
                    />
                  </TouchableOpacity>
                </View>
              </RNCamera>
            )}
            <ScrollView>
              {this.content()}

              <AwesomeAlert
                show={this.state.errorFlag}
                showProgress={false}
                title="Error Message"
                message="Please, you must answer all required questions  "
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

              <AwesomeAlert
                show={this.state.postSurveySuccess}
                showProgress={false}
                title="Success Message"
                message="Your survey has been sent successfully  "
                // closeOnTouchOutside={true}
                closeOnHardwareBackPress={false}
                showCancelButton={true}
                cancelText="Close"
                cancelButtonColor="#4eace9"
                titleStyle={{color: '#4eace9', fontWeight: 'bold'}}
                onCancelPressed={() => {
                  this.testArr = [];
                  this.testArrMulti = [];
                  this.testArrMultiState = [];
                  this.itemSelectedMulti = [];
                  this.testArrMultiImages = [];
                  this.setState({
                    showProjectsList: true,
                    answers: [],
                    answersMulti: [],
                    selectedProject: {},
                    selectedArea: {},
                    showCameraFlag: false,
                    imageUploaded: '',
                    answersMultiImages: [],
                    postSurveySuccess: false,
                  });
                }}
              />

              <AwesomeAlert
                show={this.state.postSurveyFail}
                showProgress={false}
                title="Error Message"
                message="Please, Make permission to access your location"
                closeOnTouchOutside={true}
                closeOnHardwareBackPress={false}
                showCancelButton={true}
                cancelText="Close"
                cancelButtonColor="#DD6B55"
                titleStyle={{color: '#DD6B55', fontWeight: 'bold'}}
                onCancelPressed={() => {
                  this.testArr = [];
                  this.testArrMulti = [];
                  this.testArrMultiState = [];
                  this.itemSelectedMulti = [];
                  this.testArrMultiImages = [];
                  this.setState({
                    showProjectsList: true,
                    answers: [],
                    answersMulti: [],
                    selectedProject: {},
                    selectedArea: {},
                    showCameraFlag: false,
                    imageUploaded: '',
                    answersMultiImages: [],
                    postSurveyFail: false,
                  });
                }}
              />
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      );
    } else {
      return (
        <View>
          <LoadingLottie />
        </View>
      );
    }
  }
}

const mapStateToProps = (state) => {
  return {
    secretKey: state.auth.secretKey,
    secretUrl: state.auth.secretUrl,
    userData: state.auth.userData,
    getQues: state.survey.getQuestions,
    commentSurvey: state.survey.comment,
    loadingGetQuestions: state.survey.loadingGetQuestions,
    failPostSurvey: state.survey.failPostSurvey,
    loadingPostSurvey: state.survey.loadingPostSurvey,
    successPostSurvey: state.survey.successPostSurvey,
    fullName: state.survey.fullName,
    number: state.survey.number,
    loadingEnterFullName: state.survey.loadingEnterFullName,
    loadingEnterNumber: state.survey.loadingEnterNumber,
    getProjects: state.projects.projects,
    loadingGetProjects: state.projects.loadingGetProjects,
    getAreas: state.areas.areas,
    loadingGetAreas: state.areas.loadingGetAreas,
    allProjectsUser: state.getUserData.allData,
    allProjectsUserLoading: state.getUserData.loadingGetAllData,
    coords: state.coordsPosition.position,
  };
};

const SurveyRedux = connect(mapStateToProps, {
  postSurvey,
  getAllUserData,
})(Survey);
export {SurveyRedux as Survey};
