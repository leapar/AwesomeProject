'use strict';

import React from 'react';
import {
    Image,
    Platform,
    ImageBackground,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    FlatList,
    TouchableHighlight,
    ActivityIndicator
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

const styles = StyleSheet.create({
    row: {
        backgroundColor: 'white',
        margin: 0,

    },
    text: {
        color: '#fff',
        marginLeft: 5,

    },
    title: {
        color: '#000',
        fontSize: 18,
        marginTop: 10,

    },
    layout: {
        flex: 1,
        backgroundColor: 'white',
    },
    scrollview: {
        flex: 1,
    },
    image: {
        flex: 1,
        height: 170,
        flexDirection: 'row',
        padding: 10,
        justifyContent: 'space-between',
        backgroundColor: 'gray',

    },
    icon_row: {
        flexDirection: 'row',
        backgroundColor: '#000',
        padding: 5,
        borderColor: '#d7d7d7',
        borderWidth: 1,
        height: 30,
        alignSelf: 'flex-end',
    },
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#FAFAFA',
    },

});

class Row extends React.Component {
    _call(phone) {
        SendIntentAndroid.sendPhoneCall(phone);
    }

    _onClick() {
        this.props.onClick(this.props.data);
    }

    shouldComponentUpdate(nextProps, nextState) {
        return false;
    }

    render() {
        //    console.log("rendering row");
        return (
            <TouchableHighlight onPress={this._onClick} style={{ backgroundColor: 'white', }}
                underlayColor='transparent'
            >
                <View style={{
                    flexDirection: 'column', padding: 10, borderColor: '#ccc',
                    borderBottomWidth: 1,
                }}>
                    <View style={styles.row}>


                        <ImageBackground  style={styles.image} source={{ uri: this.props.data.thumb }}>
                            <View style={styles.icon_row}>
                                <Ionicons name='md-timer' color='white' size={18} />
                                <Text style={styles.text} numberOfLines={1}>
                                    {this.props.data.time}
                                </Text>
                            </View>
                            <View style={styles.icon_row}>
                                <Ionicons name='md-star' color='white' size={18} />
                                <Text style={styles.text}>
                                    {this.props.data.rating}
                                </Text>
                            </View>
                        </ImageBackground >    
                        <Text style={styles.title} numberOfLines={2}>
                            {this.props.data.title}
                        </Text>
                    </View>
                </View>
            </TouchableHighlight>
        );
    }
}



export default class VideoListScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = { isLoading: true }
    }

    componentDidMount() {
        return fetch('http://mvapi.yinyuetai.com/mvchannel/so?callback=success_jsonpCallback_so&sid=&tid=17%3B57&a=&p=&c=&s=pubdate&pageSize=20&page=12')
            .then((response) => response.text())
            .then((responseJson) => {
                responseJson = responseJson.replace("success_jsonpCallback_so(","");
                responseJson = responseJson.substring(0,responseJson.length -1);
                console.log(responseJson);
                responseJson = JSON.parse(responseJson);
                var videoList = [];
                responseJson.result.map(item => {
                    videoList.push({
                        thumb: "http:"+item.image,
                        time: item.duration,
                        rating: item.totalViews,
                        title: item.title
                    });
                })
                this.setState({
                    isLoading: false,
                    dataSource: videoList,
                }, function () {

                });

            })
            .catch((error) => {
                console.error(error);
            });
    }

    _onClick(rowData) {
        this.props.navigation.push('VideoList', { data: rowData, });

        //RNYouTubePlayer.play("AIzaSyDnHq8g0MqzS4Wf4xRdrNfa5_YyIA5pT6k", "xfeys7Jfnx8");
    }

    render() {
        if (this.state.isLoading) {
            return (
                <View style={{ flex: 1, padding: 20 }}>
                    <ActivityIndicator />
                </View>
            )
        }

        return (
            <View style={{ flex: 1, paddingTop: 20 }}>
                <FlatList
                    data={this.state.dataSource}
                    renderItem={({ item }) => <Row data={item} onClick={this._onClick.bind(this)}></Row>}
                    keyExtractor={(item, index) => index + ""}
                />
            </View>
        );
    }
}