import {GET_PROJECTS_SUCCESS, GET_PROJECTS_FAIL} from '../actions/types';

const INITIAL_STATE = {
  projects: [],
  loadingGetProjects: false,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_PROJECTS_SUCCESS: {
      console.log('in reducer projects');
      console.log(action.payload);
      return {
        projects: action.payload.data,
        loadingGetProjects: true,
      };
    }
    case GET_PROJECTS_FAIL:
      return {...state, loadingGetProjects: false};
    default:
      return state;
  }
};
