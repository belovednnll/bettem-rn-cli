import React, { Component } from 'react'
import { View, Text, Dimensions } from 'react-native'
import FastImage from 'react-native-fast-image'
import { styles } from './../../utils/styles'
import { version } from '../../utils/baseConfig';

/**
 *关于我们
 */
class Aboutus extends Component {
  static navigationOptions = () => ({
    headerTitle: '关于我们',
    headerRight: <Text style={styles.filterText}>{}</Text>,
  })

  render() {
    return (
      <View style={styles.container_graybg_wh_flexstart_flexstart}>
        <View
          style={{
            width,
            height: 65,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text style={{ fontSize: 15, padding: 15 }}>当前版本号: {version}</Text>
        </View>
        <View
          style={{
            width,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 10,
          }}
        >
          <FastImage
            style={styles.qrCode}
            source={require('../../images/bettem_download.png')}
            resizeMode={FastImage.resizeMode.stretch}
          />
        </View>
      </View>
    )
  }
}

const { width } = Dimensions.get('window')

export default Aboutus
