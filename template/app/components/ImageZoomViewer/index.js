import React, { Component } from 'react'
import {
  Animated,
  CameraRoll,
  Dimensions,
  Platform,
  Text,
  TouchableHighlight,
  View,
  StyleSheet,
} from 'react-native'
import FastImage from 'react-native-fast-image'
import ImageZoom from 'react-native-image-pan-zoom'

export default class ImageZoomViewer extends Component {
  constructor(props) {
    super(props)
    // 背景透明度渐变动画
    this.fadeAnim = new Animated.Value(0)

    // 当前基准位置
    this.standardPositionX = 0

    // 整体位移，用来切换图片用
    this.positionXNumber = 0
    this.positionX = new Animated.Value(0)

    // 是否执行过 layout. fix 安卓不断触发 onLayout 的 bug
    this.hasLayout = false

    // 记录已加载的图片 index
    this.loadedIndex = new Map()

    this.handleLongPressWithIndex = new Map()
    this.state = { currentShowIndex: props.index, isShowMenu: false }
  }

  showView = index => {
    // 立刻预加载要看的图
    this.loadImage(index)

    this.jumpToCurrentImage()

    // 显示动画
    Animated.timing(this.fadeAnim, {
      toValue: 1,
      duration: 200,
    }).start()
  }

  /**
   * 调到当前看图位置
   */
  jumpToCurrentImage = () => {
    // 跳到当前图的位置
    this.positionXNumber = -width * this.state.currentShowIndex || 0
    this.standardPositionX = this.positionXNumber
    this.positionX.setValue(this.positionXNumber)
  }

  /**
   * 加载图片
   */
  loadImage = index => {
    if (this.loadedIndex.has(index)) {
      return
    }
    this.loadedIndex.set(index, true)
    if (Platform.OS !== 'web') {
      if (this.props.imageUrls[index])
        FastImage.preload([{ uri: this.props.imageUrls[index].url }])
    }
  }

  /**
   * 触发溢出水平滚动
   */
  handleHorizontalOuterRangeOffset = offsetX => {
    this.positionXNumber = this.standardPositionX + offsetX
    this.positionX.setValue(this.positionXNumber)

    if (offsetX < 0) {
      if (this.state.currentShowIndex || this.props.imageUrls.length - 1 > 0) {
        this.loadImage((this.state.currentShowIndex || 0) + 1)
      }
    } else if (offsetX > 0) {
      if ((this.state.currentShowIndex || 0) > 0) {
        this.loadImage((this.state.currentShowIndex || 0) - 1)
      }
    }
  }

  /**
   * 手势结束，但是没有取消浏览大图
   */
  handleResponderRelease = vx => {
    if (vx > 0.7) {
      // 上一张
      this.goBack()

      // 这里可能没有触发溢出滚动，为了防止图片不被加载，调用加载图片
      if ((this.state.currentShowIndex || 0) > 0) {
        this.loadImage((this.state.currentShowIndex || 0) - 1)
      }
    } else if (vx < -0.7) {
      // 下一张
      this.goNext()
      if (this.state.currentShowIndex || this.props.imageUrls.length - 1 > 0) {
        this.loadImage((this.state.currentShowIndex || 0) + 1)
      }
    }

    if (
      this.positionXNumber - this.standardPositionX >
      this.props.flipThreshold
    ) {
      // 上一张
      this.goBack()
    } else if (
      this.positionXNumber - this.standardPositionX <
      -this.props.flipThreshold
    ) {
      // 下一张
      this.goNext()
    } else {
      // 回到之前的位置
      this.resetPosition()
    }
  }

  /**
   * 到上一张
   */
  goBack = () => {
    if (this.state.currentShowIndex === 0) {
      // 回到之前的位置
      this.resetPosition()
      return
    }

    this.positionXNumber = this.standardPositionX + width
    this.standardPositionX = this.positionXNumber
    Animated.timing(this.positionX, {
      toValue: this.positionXNumber,
      duration: 100,
    }).start()

    const nextIndex = (this.state.currentShowIndex || 0) - 1

    this.setState(
      {
        currentShowIndex: nextIndex,
      },
      () => {
        if (this.props.onChange) {
          this.props.onChange(this.state.currentShowIndex)
        }
      }
    )
  }

  /**
   * 到下一张
   */
  goNext = () => {
    if (this.state.currentShowIndex === this.props.imageUrls.length - 1) {
      // 回到之前的位置
      this.resetPosition()
      return
    }

    this.positionXNumber = this.standardPositionX - width
    this.standardPositionX = this.positionXNumber
    Animated.timing(this.positionX, {
      toValue: this.positionXNumber,
      duration: 100,
    }).start()

    const nextIndex = (this.state.currentShowIndex || 0) + 1

    this.setState(
      {
        currentShowIndex: nextIndex,
      },
      () => {
        if (this.props.onChange) {
          this.props.onChange(this.state.currentShowIndex)
        }
      }
    )
  }

  /**
   * 回到原位
   */
  resetPosition = () => {
    this.positionXNumber = this.standardPositionX
    Animated.timing(this.positionX, {
      toValue: this.standardPositionX,
      duration: 150,
    }).start()
  }

  /**
   * 长按
   */
  handleLongPress = image => {
    if (this.props.saveToLocalByLongPress) {
      // 出现保存到本地的操作框
      this.setState({ isShowMenu: true })
    }

    if (this.props.onLongPress) {
      this.props.onLongPress(image)
    }
  }

  /**
   * 单击
   */
  handleClick = () => {
    if (this.props.onClick) {
      this.props.onClick(this.handleCancel)
    }
  }

  /**
   * 双击
   */
  handleDoubleClick = () => {
    if (this.props.onDoubleClick) {
      this.props.onDoubleClick(this.handleCancel)
    }
  }

  /**
   * 退出
   */
  handleCancel = () => {
    this.hasLayout = false
    if (this.props.onCancel) {
      this.props.onCancel()
    }
  }

  /**
   * 完成布局
   */
  handleLayout = event => {
    if (this.hasLayout) {
      return
    }

    this.hasLayout = true
    // 强制刷新
    this.forceUpdate()
    this.showView(this.props.index || 0)
  }

  /**
   * 获得整体内容
   */
  gotContent = () => {
    const ImageElements = this.props.imageUrls.map(image => (
      // if (!this.handleLongPressWithIndex.has(index)) {
      //   this.handleLongPressWithIndex.set(
      //     index,
      //     this.handleLongPress.bind(this, image)
      //   )
      // }

      //   let resizewidth = screenWidth
      //   let resizeheight = screenHeight
      //   // 如果宽大于屏幕宽度,整体缩放到宽度是屏幕宽度
      //   if (resizewidth > screenWidth) {
      //     const widthPixel = screenWidth / resizewidth
      //     resizewidth *= widthPixel
      //     resizeheight *= widthPixel
      //   }

      //   // 如果此时高度还大于屏幕高度,整体缩放到高度是屏幕高度
      //   if (resizeheight > screenHeight) {
      //     const HeightPixel = screenHeight / resizeheight
      //     resizewidth *= HeightPixel
      //     resizeheight *= HeightPixel
      //   }
      //  console.log(resizewidth,resizeheight)
      <ImageZoom
        key={image.url}
        cropWidth={width}
        cropHeight={height}
        maxOverflow={this.props.maxOverflow}
        horizontalOuterRangeOffset={this.handleHorizontalOuterRangeOffset}
        responderRelease={this.handleResponderRelease}
        // onLongPress={this.handleLongPressWithIndex.get(index)}
        // onPress={this.handleClick}
        onDoubleClick={this.handleDoubleClick}
        imageWidth={width}
        imageHeight={height - 80}
        enableSwipeDown
        onSwipeDown={this.handleSwipeDown}
      >
        <FastImage
          style={{ width, height: height - 80 }}
          source={{
            uri: image.url,
            headers: { Authorization: 'someAuthToken' },
            priority: FastImage.priority.normal,
          }}
          resizeMode={FastImage.resizeMode.contain}
        />
      </ImageZoom>
    ))
    const childWidth = width * this.props.imageUrls.length
    return (
      <Animated.View style={{ zIndex: 9999 }}>
        <Animated.View
          style={{ backgroundColor: 'transparent', opacity: this.fadeAnim }}
        >
          {this.props.renderHeader &&
            this.props.renderHeader(this.state.currentShowIndex)}

          <Animated.View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              transform: [{ translateX: this.positionX }],
              width: childWidth,
            }}
          >
            {ImageElements}
          </Animated.View>
          <View style={styles.count}>
            <Text style={styles.countText}>
              {(this.state.currentShowIndex || 0) +
                1 +
                '/' +
                this.props.imageUrls.length}
            </Text>
          </View>

          {/* {this.props.imageUrls[this.state.currentShowIndex || 0] &&
            this.props.imageUrls[this.state.currentShowIndex || 0]
              .originSizeKb &&
            this.props.imageUrls[this.state.currentShowIndex || 0]
              .originUrl && (
              <View style={styles.watchOrigin}>
                <TouchableOpacity style={styles.watchOriginTouchable}>
                  <Text style={styles.watchOriginText}>查看原图(2M)</Text>
                </TouchableOpacity>
              </View>
            )} */}
          <View style={{ bottom: 0, position: 'absolute', zIndex: 9999 }}>
            {this.props.renderFooter &&
              this.props.renderFooter(this.state.currentShowIndex)}
          </View>
        </Animated.View>
      </Animated.View>
    )
  }

  /**
   * 保存当前图片到本地相册
   */
  saveToLocal = () => {
    if (!this.props.onSave) {
      CameraRoll.saveToCameraRoll(
        this.props.imageUrls[this.state.currentShowIndex || 0].url
      )
      this.props.onSaveToCamera(this.state.currentShowIndex)
    } else {
      this.props.onSave(
        this.props.imageUrls[this.state.currentShowIndex || 0].url
      )
    }

    this.setState({ isShowMenu: false })
  }

  gotMenu = () => {
    if (!this.state.isShowMenu) {
      return null
    }

    return (
      <View style={styles.menuContainer}>
        <View style={styles.menuShadow} />
        <View style={styles.menuContent}>
          <TouchableHighlight
            underlayColor="#F2F2F2"
            onPress={this.saveToLocal}
            style={styles.operateContainer}
          >
            <Text style={styles.operateText}>
              {this.props.menuContext.saveToLocal}
            </Text>
          </TouchableHighlight>
          <TouchableHighlight
            underlayColor="#F2F2F2"
            onPress={this.handleLeaveMenu}
            style={styles.operateContainer}
          >
            <Text style={styles.operateText}>
              {this.props.menuContext.cancel}
            </Text>
          </TouchableHighlight>
        </View>
      </View>
    )
  }

  handleLeaveMenu = () => {
    this.setState({ isShowMenu: false })
  }

  handleSwipeDown = () => {
    if (this.props.onSwipeDown) {
      this.props.onSwipeDown()
    }
    this.handleCancel()
  }

  render() {
    return (
      <View
        onLayout={this.handleLayout}
        style={{ flex: 1, overflow: 'hidden', ...this.props.style }}
      >
        {this.gotContent()}
        {/* {this.getMenu()} */}
      </View>
    )
  }
}

const { width, height } = Dimensions.get('window')
const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  watchOrigin: {
    position: 'absolute',
    width,
    bottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  watchOriginTouchable: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 5,
    paddingBottom: 5,
    borderRadius: 30,
    borderColor: 'white',
    borderWidth: 0.5,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  watchOriginText: {
    color: 'white',
    backgroundColor: 'transparent',
  },

  container: {
    backgroundColor: 'transparent',
  },
  // 多图浏览需要调整整体位置的盒子
  moveBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuContainer: {
    position: 'absolute',
    width,
    height,
    left: 0,
    bottom: 0,
  },
  menuShadow: {
    position: 'absolute',
    width,
    height,
    backgroundColor: 'black',
    left: 0,
    bottom: 0,
    opacity: 0.2,
    zIndex: 10,
  },
  menuContent: {
    position: 'absolute',
    width,
    left: 0,
    bottom: 0,
    zIndex: 11,
  },
  operateContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    height: 40,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  operateText: {
    color: '#333',
  },
  loadingTouchable: {
    width,
    height,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowLeftContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    justifyContent: 'center',
  },
  arrowRightContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    justifyContent: 'center',
  },
  count: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  countText: {
    color: 'white',
    fontSize: 16,
    backgroundColor: 'transparent',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: {
      width: 0,
      height: 0.5,
    },
    textShadowRadius: 0,
  },
})
