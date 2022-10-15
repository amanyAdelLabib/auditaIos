import {
  GET_QUESTIONS_SUCCESS,
  GET_QUESTIONS_FAIL,
  COMMENT_SURVEY_CHANGED,
  POST_SURVEY_SUCCESS,
  POST_SURVEY_FAIL,
  INITIAL_SCREEN,
  POST_SURVEY_PENDING

} from '../actions/types';

const INITIAL_STATE = {
  getQuestions: {},
  loadingGetQuestions: false,
  comment: '',
  failPostSurvey: false,
  successPostSurvey: false,
  loadingPostSurvey: false,
  loadingEnterComment:false,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_QUESTIONS_SUCCESS:
      return {
        ...state,
        ...INITIAL_STATE,
        getQuestions: action.payload.data,
        loadingGetQuestions: true,
        loadingPostSurvey: false,
        // successPostSurvey:false
      };
    case GET_QUESTIONS_FAIL:
      return {...state, loadingGetQuestions: true,loadingPostSurvey: false};
    case COMMENT_SURVEY_CHANGED: {
      return {...state, comment: action.payload,loadingEnterComment:true};
    }
    case POST_SURVEY_PENDING: {
      return {...state, loadingPostSurvey: true,failPostSurvey:false,successPostSurvey:false};
    }
    case POST_SURVEY_SUCCESS: {
      return {...state, loadingPostSurvey: false,successPostSurvey:true};
    }
    case POST_SURVEY_FAIL: {
      return {...state, loadingPostSurvey: false,failPostSurvey:true};
    }
    default:
      return state;
  }
};
