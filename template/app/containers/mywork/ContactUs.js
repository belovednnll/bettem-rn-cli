import React, { Component } from 'react'
import { View, Text, Dimensions, Linking } from 'react-native'
import { Toast } from '@ant-design/react-native'
import { styles } from './../../utils/styles'

/**
 * 联系客服
 */
class ContactUs extends Component {
  static navigationOptions = () => ({
    headerTitle: '联系客服',

    headerRight: <Text style={styles.filterText}>{}</Text>,
  })

  render() {
    return (
      <View style={styles.container2}>
        <View
          style={{
            width,
            height: 65,
            justifyContent: 'center',
            backgroundColor: '#ffffff',
          }}
        >
          <Text
            style={{ fontSize: 17, width, padding: 15 }}
            onPress={() => {
              if (Linking.canOpenURL('tel:0351-4151288'))
                Linking.openURL('tel:0351-4151288')
              else Toast.fail('当前设备不支持拨号功能', 3)
            }}
          >
            业务支持：0351-4151288{' '}
          </Text>
        </View>
        <View
          style={{
            width,
            height: 65,
            justifyContent: 'center',
            marginTop: 10,
            backgroundColor: '#ffffff',
          }}
        >
          <Text
            style={{ fontSize: 17, width, padding: 15 }}
            onPress={() => {
              if (Linking.canOpenURL('tel:15035110913'))
                Linking.openURL('tel:15035110913')
              else Toast.fail('当前设备不支持拨号功能', 3)
            }}
          >
            技术支持：15035110913{' '}
          </Text>
        </View>
      </View>
    )
  }
}

const { width } = Dimensions.get('window')

export default ContactUs
