import React, { Component } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,Image
} from 'react-native'
import { Grid } from '@ant-design/react-native'
import { connect } from 'react-redux'
import { NavigationActions, colors,styles } from '../../utils'
import Icon from './../../components/Icon/Icon'

@connect(({ app }) => ({
  login: app.login,
}))
export default class Home extends Component {
  static navigationOptions = {
    header: null,
  }

  constructor(props) {
    super(props)
    this.data = [
      {
        icon: 'OIcon|mine',
        text: '案例分享',
        styless: [styles.cycleStyle,{backgroundColor:colors.color1}],
        router: 'HomeInfoGuide',
        select:'share'
      },
      {
        icon: 'OIcon|about',
        text: '新闻资讯',
        styless:  [styles.cycleStyle,{backgroundColor:colors.ico6}],
        router: 'HomeInfoGuide',
        select:'news'
      },
      {
        icon: 'OIcon|loginout',
        text: '政策法规',
        styless: [styles.cycleStyle,{backgroundColor:colors.ico5}],
        router: 'HomeInfoGuide',
        select:'policy'
      },
    ]
  }

  render() {
    return (
      <ScrollView style={styles.scrollview}>
        <TouchableOpacity
          onPress={()=>{
            this.props.dispatch(
              NavigationActions.navigate(
                { routeName:'ImageShow',
                  params:{
                    currentPos:0,
                    imageArr:[
                      {url:'https://user-gold-cdn.xitu.io/2019/9/2/16cefb5890b4226b?imageView2/1/w/1304/h/734/q/85/format/webp/interlace/1'},
                      {url:'https://user-gold-cdn.xitu.io/2019/9/4/16cfb84543a4b8ad?imageView2/1/w/1304/h/734/q/85/format/webp/interlace/1'}
                    ]}
                }
              )
            )
          }
        }>
          <Image
            source={require('../../images/bettem_headimg.jpg')}
            resizeMode="stretch"
            style={[styles.headImage,{marginBottom:20,height:200}]}
          />
        </TouchableOpacity>
        <Grid
          data={this.data}
          columnNum={4}
          renderItem={(dataItem, index) => (
            <TouchableOpacity
              style={{ width: 90, height: 100 }}
              onPress={() => {
                this.props.dispatch(
                  NavigationActions.navigate({ 
                    routeName: dataItem.router,
                    params:dataItem.router==='HomeInfoGuide'?{headTitle:dataItem.text,select:dataItem.select}:{headTitle:''}})
                )
              }}
            >
              <View style={[styles.gridContainer]}>
                <View style={dataItem.styless}>
                  <Icon
                    name={dataItem.icon}
                    size={index === 0 ? 32 : 34}
                    color="#ffffff"
                  />
                </View>
                <Text
                  style={{
                    fontSize: 13,
                    color: colors.textContent,
                  }}
                >
                  {dataItem.text}
                </Text>
              </View>
            </TouchableOpacity>
          )}
          hasLine={false}
        />
      </ScrollView>
    )
  }
}
