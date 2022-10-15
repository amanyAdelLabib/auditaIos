import {GET_AREAS_FAIL, GET_AREAS_SUCCESS} from '../actions/types';

const INITIAL_STATE = {
  areas: [],
  loadingGetAreas: false,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_AREAS_SUCCESS: {
      console.log('in reducer areas');
      console.log(action.payload);
      return {
        areas: action.payload.data,
        loadingGetAreas: true,
      };
    }
    case GET_AREAS_FAIL:
      return {...state, loadingGetAreas: false};
    default:
      return state;
  }
};
