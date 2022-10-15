import {combineReducers} from 'redux';
import Auth from './authReducer';
import Survey from './surveyReducer';
import Projects from './ProjectsReducer';
import Areas from './AreasReducer';
import getAllData from './getAllUserDataReducer';
import getCoords from './GetCoordsReducer';

export default {
  auth: Auth,
  survey: Survey,
  projects: Projects,
  areas: Areas,
  getUserData: getAllData,
  coordsPosition: getCoords,
};
