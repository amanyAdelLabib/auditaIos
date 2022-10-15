import {StyleSheet} from 'react-native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import { Colors } from '../../Utils/Colors';
const styles = StyleSheet.create({
  poweredByView: {
    position: 'absolute',
    alignSelf: 'center',
    backgroundColor: '#F2F2F2',
    flex: 1,
    bottom: 0,
    width: responsiveWidth(100),
  },
  poweredByText: {
    fontSize: responsiveFontSize(1.5),
    paddingVertical: responsiveHeight(1),
    fontFamily: 'Roboto-Regular',
    textAlign: 'center',
    color: '#808080',
  },

});
export default styles;
