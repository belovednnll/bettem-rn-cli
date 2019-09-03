export const appFlag = "init" // "init":初始化 "dev":开发  "pro":生产

/**
 * app的版本号， versionCodeNum记录Android的版本数字
 */
export const version = 'Version 1.0.0'
export const versionCodeNum = 1

// 初始化项目的用户，开始开发后 appFlag 改为 dev
export const bettemInitUser = appFlag==='init'?{
  realName: '百得',
  deptName: '山西百得科技开发股份有限公司',
  userName: 'bettem',
  userPwd:'userPwd',
  status:'1'
}:{}