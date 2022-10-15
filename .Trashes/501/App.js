import React from 'react';
import RouterComponent from './src/navigation/router';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware, compose} from 'redux';
import reducers from './src/reducers';
import ReduxThunk from 'redux-thunk';
import Reactotron from './src/ReactotronConfig';
import {persistStore, persistCombineReducers,} from 'redux-persist';
import AsyncStorage from '@react-native-community/async-storage';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import {PersistGate} from 'redux-persist/lib/integration/react';
import KeepAwake from 'react-native-keep-awake';

const config = {
  key: 'root',
  storage: AsyncStorage,
  // stateReconciler: autoMergeLevel2,
};

class App extends React.Component {
  middleware = applyMiddleware(ReduxThunk);
  reactortonEnhancer = Reactotron.createEnhancer();

  render() {
    const pReducers = persistCombineReducers(config, reducers);
    const store = createStore(
      pReducers,
      compose(this.middleware, this.reactortonEnhancer),
    );
    const persistor = persistStore(store);
    return (
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <RouterComponent />
          {KeepAwake.activate()}
        </PersistGate>
      </Provider>
    );
  }
}

export default App;
