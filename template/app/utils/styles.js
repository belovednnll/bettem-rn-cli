import { Dimensions, StyleSheet } from 'react-native'
import InputItemStyle from '@ant-design/react-native/lib/input-item/style/index'
import { colors } from './colors'

const { width, height } = Dimensions.get('window')

export const styles = StyleSheet.create({
  container_white_wh_center_center: {
    width,
    height,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  container_graybg_wh_flexstart_flexstart: {
    width,
    height,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    backgroundColor: colors.graybg,
  },
  container_white_flex_flexstart: {
    flex: 1,
    width,
    justifyContent: 'flex-start',
    // alignItems: 'center',
    backgroundColor:'#ffffff',
  },
  scrollview: {
    width,
    backgroundColor: colors.white,
  },
  mainView: {
    width,
    paddingHorizontal: 10,
    backgroundColor: colors.white,
  },
  mainContent: {
    width,
    flex: 2,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  horizontal_flex_flexstart_center: {
    flex:1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  horizontal_flex_center_center: {
    flex:1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  login_logo: {
    width: 120,
    height: 120,
    borderWidth: 1,
    borderColor: colors.graybg,
    borderRadius: 60,
    marginBottom: 15,
    marginTop: Math.round(0.15 * height),
  },
  header: {
    width: 85,
    height: 85,
    borderWidth: 1,
    borderRightWidth: 2,
    borderColor: colors.graybg,
  },
  titleText: {
    fontSize: 14,
    width,
    color: colors.black,
    backgroundColor: colors.graybg,
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  filterText: {
    color: colors.white,
    fontSize: 16,
    marginRight: 10,
  },
  memberTitle: {
    fontSize: 14,
    color: '#000',
    flex: 1,
    height: 30,
  },
  memberContent: {
    fontSize: 13,
    color: colors.grayText,
    flex: 1,
    height: 40,
  },
  poorStatusContent: {
    fontSize: 14,
    color: colors.textContent,
    paddingLeft:8,
    flex: 1,
  },
  webview: {
    width,
    height: height - 160,
    backgroundColor: colors.white,
  },
  qrCode: {
    width: 180,
    height: 180,
    borderWidth: 1,
    borderRightWidth: 2,
  },
  detailText: {
    fontSize: 12,
    paddingLeft: 15,
    width: width / 3,
    height: 25,
  },
  cycleStyle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headImage: {
    width,
    alignItems: 'center',
    height: Math.round(0.6*width),
    backgroundColor:colors.home_status_bar,
  },
  gridContainer: {
    flex: 1,
    paddingBottom: 10,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
})

export const newInputItemStyle = StyleSheet.create({
  ...InputItemStyle,
  container: {
    height: 33,
    borderBottomWidth: 0.7,
    borderBottomColor:colors.border_color_base,
    marginLeft: 15,
    paddingRight:15,
    marginTop: 0,
    marginBottom: 0,
    flexDirection: 'row',
    alignItems: 'center'
  },
  text: {
    marginRight: 2,
    textAlign:'left',
    textAlignVertical: 'center',
    fontSize: 15,
    color: colors.textContent
  },
  input: {
      flex: 1,
      textAlign:'right',
      backgroundColor: 'transparent',
      paddingVertical:8,
      alignItems:'flex-end',
      fontSize: 16,
      color: colors.grayText
  },
  extra: {
    marginLeft:0,
    fontSize: 11,
    color: colors.grayText,
  },
})
