import React from 'react'
import { AppRegistry } from 'react-native'
import { Provider } from '@ant-design/react-native'
import dva from './utils/dva'
import Router, { routerMiddleware, routerReducer } from './router'
import { AppModel } from './models/app';

const app = dva({
  initialState: {},
  models: [
    AppModel
  ],
  extraReducers: { router: routerReducer },
  onAction: [routerMiddleware],
  onError(e) {
    // console.log(e)
  },
})

const App = app.start(<Provider><Router /></Provider>)

AppRegistry.registerComponent('BettemRN', () => App)
