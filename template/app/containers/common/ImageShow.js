import React, { Component } from 'react'
import { View, Platform, Text, Dimensions } from 'react-native'
import ImageZoomViewer from '../../components/ImageZoomViewer'
import { styles, colors } from '../../utils'

export default class ImageShow extends Component {
  static navigationOptions = Platform.OS === 'ios'
    ? {
        headerTitle: '查看图片',
        headerBackTitle: '返回',
        headerTintColor: '#fff',
        headerTitleStyle: {
          alignSelf: 'center',
        },
        headerRight: (
          <Text onPress={() => {}} style={styles.filterText}>
            {}
          </Text>
        ),
      }
    : {
        header: null,
      }

  render() {
    const {imageArr,currentPos} =  this.props.navigation.state.params
    return (
      <View style={styles.container_white_wh_center_center}>
        <ImageZoomViewer
          imageUrls={imageArr} // 照片路径
          enableImageZoom // 是否开启手势缩放
          index={currentPos} // 初始显示第几张
          // failImageSource={aaa} // 加载失败图片
          // onChange={(index) => {}} // 图片切换时触发
          // onPress={() => {
          //   // 图片单击事件
          //   this.props.dispatch(
          //     NavigationActions.back({ routeName: 'Account' })
          //   )
          // }}
          style={{ backgroundColor: colors.black, width, height }}
        />
      </View>
    )
  }
}

const { width, height } = Dimensions.get('window')
