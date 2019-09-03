import { View, Text, Dimensions ,Platform,TouchableOpacity} from 'react-native'
import { connect } from 'react-redux'
import { Button, Checkbox, InputItem, ActivityIndicator } from '@ant-design/react-native'
import React from 'react'
import SplashScreen from 'react-native-splash-screen';
import FastImage from 'react-native-fast-image'
import {requestPermission} from 'react-native-android-permissions';

// import FileManager from 'react-native-filesystem';
import { createAction, colors } from '../utils'
import { Icon, BaseForm } from '../components'
import { styles } from './../utils/styles'

@connect(({ app }) => ({ app }))
class Login extends BaseForm {
  constructor(props) {
    super(props)
    const { loginInfo } = this.props.app
    this.state = {...loginInfo,passwordShow:false}
    const isAuto = this.props.navigation.state.params
    if(Platform.OS==='android')
      this.requestPermission(isAuto)
    else  
      this.autoLogin(isAuto)
  }

  componentDidMount() {
    this.onChangeButton()
  }

  requestPermission=(isAuto)=>{
    requestPermission(["android.permission.ACCESS_FINE_LOCATION","android.permission.CAMERA",
    "android.permission.WRITE_EXTERNAL_STORAGE","android.permission.READ_EXTERNAL_STORAGE",
    "android.permission.ACCESS_COARSE_LOCATION"]).then(() => {
     this.autoLogin(isAuto)
    }, () => {
      this.requestPermission(isAuto)
    });
  }

  autoLogin = (isAuto)=>{
    if (isAuto === undefined)
      this.props.dispatch(createAction('app/loadStorage')()).then(loginInfo0=>{
        if(loginInfo0.userName){
          this.setState({...loginInfo0})
          this.props.dispatch(createAction('app/autoLogin')({...loginInfo0})).then(()=>{
            SplashScreen.hide();
          })
        }else{
          SplashScreen.hide();
        }
      })
    else
      SplashScreen.hide();
  }

  static navigationOptions = {
    title: '登录',
    header: null,
  }

  onLogin = () => {
    const { userName, userPwd } = this.state
    this.props.dispatch(createAction('app/login')({ userName, userPwd }))
  }

  onChangeButton = () => {
    const flag = this.validate({
      userName: { title: '用户名', required: true },
      userPwd: { title: '密码', required: true },
    })
    this.props.dispatch(createAction('app/changeLoginButton')(flag))
  }

  onChangeUserName = userName => {
    if (
      (userName === '' && this.state.userName !== '') ||
      (userName !== '' && this.state.userName === '')
    )
      this.setState({ userName }, this.onChangeButton)
    else this.setState({ userName })
  }

  onChangePass = userPwd => {
    if (
      (userPwd === '' && this.state.userPwd !== '') ||
      (userPwd !== '' && this.state.userPwd === '')
    )
      this.setState({ userPwd }, this.onChangeButton)
    else this.setState({ userPwd })
  }

  renderPasswordExtra = (userPwd,passwordShow)=>{
    if(userPwd===null||userPwd===''||userPwd===undefined)
      return null
    return <TouchableOpacity 
      onPress={() =>{this.setState({passwordShow:!passwordShow})}}>
        <Icon name={`OIcon|${passwordShow?'open_eye':'close_eye'}`} size={20} color={colors.textSubContent} />
    </TouchableOpacity>
  }

  render() {
    const { fetching, loginBtnEnable } = this.props.app
    const { width, height } = Dimensions.get('window')
    const { userName,userPwd,passwordShow} =this.state
    return (
      <View
        style={{
          justifyContent: 'flex-start',
          alignItems: 'center',
          backgroundColor: '#ffffff',
          width,
          height,
        }}
      >
        <FastImage
          style={styles.login_logo}
          source={require('../images/bettem_logo.png')}
          resizeMode={FastImage.resizeMode.stretch}
        />
        <Text
          style={{
            fontSize: 25,
            color: colors.primary,
            fontWeight: 'bold',
            marginBottom: 15,
          }}
        >
          百得
        </Text>
        <View
          style={{
            width: Math.round(0.65 * width),
            height: Math.round(height * 0.25),
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            paddingHorizontal: 20,
          }}
        >
          <InputItem
            placeholder="请输入您的账号"
            clear
            labelNumber={2}
            onChange={this.onChangeUserName}
            value={userName}
          >
            <Icon name="OIcon|username" size={20} color={colors.textSubContent} />
          </InputItem>
          <InputItem
            placeholder="请输入您的密码"
            type={passwordShow?"text":"password"}
            labelNumber={2}
            onChange={this.onChangePass}
            value={this.state.userPwd}
            extra={this.renderPasswordExtra(userPwd,passwordShow)}
          >
            <Icon
              name="OIcon|password"
              size={20}
              color={colors.textSubContent}
            />
          </InputItem>
          <View
            style={{
              padding: 10,
            }}
          />
          <Checkbox.AgreeItem defaultChecked onChange={e => e}>
            <Text style={{ fontSize: 13, color: colors.textContent }}>
              自动登录
            </Text>
          </Checkbox.AgreeItem>
        </View>
        {loginBtnEnable && (
          <Button type="primary" size="large" onPress={this.onLogin}>
            {'       登       录       '}
          </Button>
        )}
        {!loginBtnEnable && (
          <Button type="primary" size="large" disabled>
            {'       登       录       '}
          </Button>
        )}
        {fetching && <ActivityIndicator toast text="登录中..." />}
      </View>
    )
  }
}

export default Login
