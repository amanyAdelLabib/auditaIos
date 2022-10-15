import {NativeModules} from 'react-native';
import Reactotron, {trackGlobalErrors} from 'reactotron-react-native';
import {reactotronRedux} from 'reactotron-redux';
import AsyncStorage from '@react-native-community/async-storage';

const scriptURL = NativeModules.SourceCode.scriptURL;
const scriptHostname = scriptURL.split('://')[1].split(':')[0];

Reactotron.configure({host: scriptHostname})
  .use(
    trackGlobalErrors({
      veto: (frame) =>
        frame.fileName.indexOf('/node_modules/react-native/') >= 0,
    }),
  )
  .useReactNative()
  .use(reactotronRedux())
  .setAsyncStorageHandler(AsyncStorage);
if (__DEV__) {
  Reactotron.connect();
}
console.warn = Reactotron.log;

export default Reactotron;
