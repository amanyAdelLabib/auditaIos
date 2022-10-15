import React from 'react';
import { Text,View} from 'react-native';
import styles from './style';

export function PoweredBy() {
 
  return (
    <View style={styles.poweredByView}>
    <Text style={styles.poweredByText}>Powered by AHT Analytics</Text>
  </View>

  );
}
