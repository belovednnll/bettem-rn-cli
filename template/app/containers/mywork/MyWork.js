import React, { Component } from 'react'
import {
  View,
  Text,
  Dimensions,
  Image,
  Platform,
  DeviceEventEmitter,NativeModules
} from 'react-native'
import { ConfirmDialog,Dialog } from 'react-native-simple-dialogs';
import {
  List,
  Toast,
  ActivityIndicator,
  Progress,
} from '@ant-design/react-native'
import { connect } from 'react-redux'
import ParallaxScrollView from 'react-native-parallax-scroll-view'
import FastImage from 'react-native-fast-image'
import { init, Geolocation, stop } from "react-native-amap-geolocation";
import { createAction, NavigationActions, colors, styles } from '../../utils'
import Icon from './../../components/Icon/Icon'
import { iosStatusHeight } from '../../utils/resolution';

@connect(({ app }) => ({
  login: app.login,
  viewStaus: app.viewStaus,
  percent: app.percent,
  url: app.url,
  versionCode: app.versionCode,
}))
class MyWork extends Component {
  static navigationOptions = {
    header: null,
  }

  componentDidMount() {
    // 初始化定位模块
    init({
      ios: "68fb2ebd6f24a03a7a3ef70389438bab",
      android: "d9dae7491926c4f1ccbd1bdcfe13bb8d"
    });
    // Android 监听下载更新包的进度
    if (Platform.OS !== 'ios') {
      DeviceEventEmitter.addListener('LOAD_PROGRESS', progress => {
        if (progress - this.percent > 1) {
          this.percent = progress
          this.props.dispatch(
            createAction('app/changeView')({ percent: this.percent })
          )
        }
        if(progress===100){
          this.props.dispatch(createAction('app/changeView')({ viewStaus: 'downloadComplete' }))
        }
      })
    }
  }

  componentWillUnmount() {
    // 停止并销毁定位服务
    stop()
  }

  gotoView = (name, params) => {
    this.props.dispatch(NavigationActions.navigate({ routeName: name, params }))
  }

  logout = () => {
    // 退出登录
    this.props.dispatch(createAction('app/logout')())
    this.props.dispatch(createAction('noticeList/initState')())
    this.props.dispatch(createAction('infoGuide/initState')())
  }

  signIn = () => { // 首先获取地理位置
    Geolocation.getCurrentPosition(({ location }) => {
      if (location&&location.latitude) {
        this.props.dispatch(
          createAction('app/signIn')({
            signinAddress: location.address,
            latitude: location.latitude + '' || '0',
            longitude: location.longitude + '' || '0',
          })
        )
        stop()
      } else{
        Toast.fail('签到失败，请检查定位服务是否开启', 2)
      }
    });
  }

  render() {
    const { login, viewStaus, percent, url, versionCode } = this.props
    return (
      <ParallaxScrollView
        backgroundColor={colors.graybg}
        contentBackgroundColor={colors.graybg}
        stickyHeaderHeight={45+iosStatusHeight}
        parallaxHeaderHeight={200}
        renderForeground={() => (
          <View style={{ height: 200, width,                
            alignItems: 'center',
            justifyContent: 'space-around',
            backgroundColor:'#0D7FFE69',
            flexDirection: 'row', flex: 1 }}>
            <View
              style={{
                flex: 2,
                alignItems: 'flex-end',
                justifyContent: 'center',
              }}
            >
              <FastImage
                style={styles.header}
                source={require('../../images/bettem_logo.png')}
                resizeMode={FastImage.resizeMode.stretch}
              />
            </View>

            <View
              style={{
                flex: 3,
                alignItems: 'flex-start',
                justifyContent: 'space-around',
                marginLeft:10,
                height:80
              }}
            >
              <Text
                style={{
                  fontSize: 22,
                  color: '#fff',
                  fontWeight:'bold'
                }}
              >
                {login.realName ? login.realName : '未登录'}
              </Text>
              <Text
                style={{
                  fontSize: 15,
                  color: '#fff',fontWeight:'bold'
                }}
              >
                {login.deptName ? login.deptName : ''}
              </Text>
            </View>
          </View>
        )}
        renderBackground={() => (
          <View style={{ height: 200, flex: 1 }}>
            <Image
              style={[styles.headImage,{marginBottom:20}]}
              source={require('../../images/bettem_headimg.jpg')}
              resizeMode={Image.resizeMode.stretch}
            />
          </View>
        )}
      >
        <List renderHeader={() => '  '}>
          <List.Item
            thumb={
              <Icon
                name="OIcon|about"
                size={20}
                color={colors.primary}
              />
            }
            arrow="horizontal"
            onPress={() => {
              this.gotoView('Aboutus')
            }}
          >
            {' 关于我们'}
          </List.Item>
          {Platform.OS !== 'ios'&&<List.Item
            thumb={
              <Icon name="OIcon|upgrade" size={20} color={colors.ico5} />
            }
            arrow="empty"
            onPress={() => {
                this.props.dispatch(createAction('app/checkUpdate')())
            }}
          >
            {' 检查版本'}
          </List.Item>
          }
        </List>
        <List renderHeader={() => '  '}>
          <List.Item
            thumb={<Icon name="OIcon|loginout" size={26} color={colors.ico4} />}
            arrow="empty"
            onPress={this.logout}
          >
            {'退出登录'}
          </List.Item>
        </List>
        {viewStaus === 'getVersion' && (
          <ActivityIndicator toast text="检查版本..." />
        )}
        <Dialog
          animationType="fade"
          contentStyle={{alignItems: "center",justifyContent: "center"}}
          visible={viewStaus === 'downloading'}>
          <View>
            <Text style={{ fontSize: 16, color: colors.primary, margin: 10 }}>
                {`正在下载，请耐心等待 ${percent||0}% `}
              </Text>
              <View
                style={{
                  width: 285,
                  height: 5,
                }}
              >
                <Progress percent={percent || 0} position="normal" />
              </View>
          </View>
        </Dialog>
         <ConfirmDialog
            title={`发现新版本 ${versionCode} 是否更新?`}
            visible={viewStaus === 'haveNewVersion'}
            positiveButton={{
                title: "更新",
                onPress: () => {
                  this.props.dispatch(
                    createAction('app/changeView')({ viewStaus: 'downloading' })
                  )
                  NativeModules.upgrade.upgrade(url);
                }
            }}
            negativeButton={{ 
              title: "暂不更新",
              onPress: () =>  this.props.dispatch(
                createAction('app/changeView')({
                  viewStaus: 'NotNewVersion',
                })
              )
            }}
          />
          <ConfirmDialog
            title='已是新版本'
            visible={viewStaus === 'isNewVersion'}
            positiveButton={{
              title: "知道了",
              onPress: () =>  this.props.dispatch(
                createAction('app/changeView')({
                  viewStaus: 'NotNewVersion',
                })
              )
            }}
          />
      </ParallaxScrollView>
    )
  }
}

const { width } = Dimensions.get('window')

export default MyWork
