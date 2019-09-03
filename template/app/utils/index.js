export { NavigationActions,StackActions } from 'react-navigation'

export { default as Storage } from './storage'

export { colors } from './colors'
export { styles } from './styles'

/**
 * 延迟几秒执行
 * @param {*} time 
 */
export const delay = time => new Promise(resolve => setTimeout(resolve, time))

/**
 * 在使用 dva 的dispatch方法时使用
 * @param {*} type 
 */
export const createAction = type => payload => ({
  type,
  payload
})

const logging = false // 打包时改为false
// export { default as Resolution } from "./resolution" // 屏幕适配
export const logUtils =(...content)=>{
    if(logging)
        console.log(...content)
}



