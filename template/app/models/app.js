import { Toast } from '@ant-design/react-native'
import { createAction, NavigationActions, Storage,StackActions } from '../utils'
import * as API from '../services/api'
import { colors } from './../utils/colors'
import { bettemInitUser } from '../utils/baseConfig';

export const AppModel = {
  namespace: 'app',
  state: {
    login: false,
    loading: true,
    fetching: false,
    loginBtnEnable: false,
    viewStaus: 'init',
    loginInfo: { userName: '', userPwd: '' },
    signinList: {},
    baseStat:{} // 基础统计信息
  },
  reducers: {
    updateState(state, { payload }) {
      return { ...state, ...payload }
    },
  },
  effects: {
    *loadStorage(action, { call, put }) {
      // const login = yield call(Storage.get, 'login', false)
      const loginInfo = yield call(Storage.get, 'loginInfo',bettemInitUser)
      const date = new Date()
      const dateStr =
        date.getFullYear + '-' + (date.getMonth + 1) + '-' + date.getDate()
      const signinDateStatus = yield call(Storage.get, `${dateStr}`, false) // 默认false，未签到
      yield put(
        createAction('updateState')(
          { loginInfo, loading: false, viewStaus: signinDateStatus?'signInComplete':'init',loginBtnEnable:loginInfo.userName.length>0&&loginInfo.userPwd.length>0 }
        )
      )
      return loginInfo
    },

    *changeView({ payload }, { put }) {
      yield put(createAction('updateState')(payload))
    },

    *autoLogin({ payload }, { call, put }) {
      const login = yield call(API.login, payload) // 自动登录
      if (login && (login.status === 1 || login.status === '1')) {
        yield put(createAction('updateState')({ login, loading: false }))
        Storage.set('login', login)
        yield put(NavigationActions.navigate({ routeName: 'Main' }))
      } else {
        yield put(createAction('updateState')({ loading: false }))
        if (login.status === 0 || login.status === '0')
          Toast.fail('账号或密码错误', 2)
        else Toast.fail(login ? login + '' : '后台服务异常', 2)
      }
      return login;
    },
    *login({ payload }, { call, put }) {
      yield put(createAction('updateState')({ fetching: true }))
      const login = yield call(API.login, payload)
      if (login && login.status === '1') {
        yield put(createAction('updateState')({ login,loginInfo:payload,fetching: false}))
        Storage.set('login', login)
        Storage.set('loginInfo',payload)

        yield put(NavigationActions.navigate({ routeName: 'Main' }))
      } else {
        yield put(createAction('updateState')({ fetching: false }))
        Storage.set('loginInfo', payload)
        if (login.status === 0 || login.status === '0')
          Toast.fail('账号或密码错误', 2)
        else Toast.fail(login ? login + '' : '后台服务异常', 2)
      }
    },
    *logout(action, { call, put }) {
      yield call(Storage.set, 'login', false)
      yield put(createAction('updateState')({ login: false }))
      yield put(
        StackActions.reset({
          index: 0,
          actions: [
            NavigationActions.navigate({
              routeName: 'Login',
              params: { isAutoLogin: false },
            }),
          ],
        })
      )
    },

    *changeLoginButton({ payload }, { put }) {
      yield put(createAction('updateState')({ loginBtnEnable: payload }))
    },

    *checkUpdate(action, { put, call }) {
      yield put(createAction('updateState')({ viewStaus: 'getVersion' }))
      const resp = yield call(
        API.baseRequest,
        'mobileAnalysisController.do?reloadAPPList',
        { begin: 1, rows: 5 }
      )
      const respParams = {}
      if (resp && resp.status === '1') {
        const versionCode = resp.values.appVersion
        if (versionCode > 12) { // V1.2.1
          // 发布版本时这里需要修改和android的versionCode一致
          respParams.viewStaus = 'haveNewVersion'
          respParams.url = resp.values.appUrl
          respParams.versionCode = resp.values.appVersion
          yield put(createAction('updateState')(respParams))
        } else {
          yield put(
            createAction('updateState')({ viewStaus: 'isNewVersion' })
          )
        }
      } else
        yield put(
          createAction('updateState')({ viewStaus: 'getVersionComplete' })
        )
    },
  },
  subscriptions: {
    setup({ dispatch }) {
      dispatch({ type: 'loadStorage' })
    },
  },
}
