import {GET_ALL_USER_DATA_FAIL, GET_ALL_USER_DATA_SUCCESS} from '../actions/types';

const INITIAL_STATE = {
  allData: [],
  loadingGetAllData: false,
  error:''
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_ALL_USER_DATA_SUCCESS: {
      console.log('in reducer get all data');
      console.log(action.payload);
      return {
        allData: action.payload.data,
        loadingGetAllData: true,
      };
    }
    case GET_ALL_USER_DATA_FAIL:
      return {...state};
    default:
      return state;
  }
};
