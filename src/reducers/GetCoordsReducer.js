import reactotron from 'reactotron-react-native';
import {GET_POSITION_INFO} from '../actions/types';

const INITIAL_STATE = {
  position: {},
};

export default (state = INITIAL_STATE, action) => {

  switch (action.type) {
    case GET_POSITION_INFO: {
      reactotron.log('in position 1');
      reactotron.log(action.payload);
      return {
        position: action.payload,
      };
    }
    default:
      {
        return state;
      }
      
  }
};
