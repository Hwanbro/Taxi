/*
import React, { useEffect, useState } from 'react';
import { View, Text, Alert, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './API'; // 예시, 실제 API 모듈 경로를 사용하세요

const Main_List = () => {
  const [loading, setLoading] = useState(false);
  const [calls, setCalls] = useState([]);

  useEffect(() => {
    async function requestCallList() {
      try {
        setLoading(true);
        const userId = await AsyncStorage.getItem('userId') || "";
        
        if (!userId) {
          Alert.alert("Error", "유효한 사용자 ID를 찾을 수 없습니다.");
          return;
        }

        const response = await api.list(userId);
        const { code, data } = response.data[0];

        if (code === 0) {
          setCalls(data); // 서버에서 이미 formatted_time을 전달하므로 그대로 사용
        } else {
          Alert.alert("Error", "콜 목록을 불러오는 데 실패했습니다.");
        }
      } catch (error) {
        Alert.alert("Error", "네트워크 오류가 발생했습니다. 다시 시도해주세요.");
      } finally {
        setLoading(false);
      }
    }

    requestCallList();
  }, []);

  return (
    <View style={styles.container}>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={calls}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.callItem}>
              <Text style={styles.callText}>출발지: {item.start_addr}</Text>
              <Text style={styles.callText}>도착지: {item.end_addr}</Text>
              <Text style={styles.callText}>호출 시간: {item.formatted_time}</Text>
            </View>
          )}
          ListEmptyComponent={<Text style={styles.emptyMessage}>콜 목록이 없습니다.</Text>}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  callItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  callText: {
    fontSize: 16,
  },
  emptyMessage: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default Main_List;
*/
import { SafeAreaView, StyleSheet, Text, View, FlatList, RefreshControl, Modal, Alert } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { useEffect, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import React from "react";
import Icon from "react-native-vector-icons/FontAwesome";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from './API'
import messaging from "@react-native-firebase/messaging"

function Main_List() : JSX.Element {
    console.log("-- Main_List()")

    const [callList, setCallList] = useState([]);
    const [loading, setLoading] = useState(false);

    const requestCallList = async() => {
        let userId = await AsyncStorage.getItem('userId') || ""
        setLoading(true)

        api.list(userId)
        .then(response=> {
            let {code, message, data} = response.data[0]
            if (code==0) {
                setCallList(data)
            }
            else {
                Alert.alert("오류", message, [
                    {
                        text:'확인',
                        onPress:()=>console.log('cancel Pressed'),
                        style:'cancel'
                    }
                ])
            }
            setLoading(false)
        })
        .catch(err => {
            console.log(JSON.stringify(err))
            setLoading(false)
        })
    }

    const Header= ()=> (
        <View style={styles.header}>
            <Text style={[styles.headerText,{width:wp(80)}]}>출발지 / 도착지</Text>
            <Text style={[styles.headerText,{width:wp(20)}]}>상태</Text>
        </View>
    );

    const ListItem =(row:any)=> {
        console.log("row = " + JSON.stringify(row))
        return (
            <View style={{flexDirection:'row', marginBottom:5, width:wp(100)}}>
                <View style={[{width:wp(80)}]}>
                    <Text style={styles.textform}>{row.item.start_addr}</Text>
                    <Text style={[styles.textform,{borderTopWidth:0}]}>{row.item.end_addr}</Text>
                    <Text style={styles.textform}>{row.item.formatted_time}</Text>
                    </View>
                <View style={{width:wp(20),alignItems:'center', justifyContent:'center'}}>
                    {row.item.call_state=="RES" ? 
                    (<Text style={{color:'blue'}}>{row.item.call_state}</Text>) :
                    (<Text style={{color:'gray'}}>{row.item.call_state}</Text>)
                    }
                </View>
            </View>
        )
    }

    useFocusEffect(React.useCallback(()=>{
        requestCallList();
    },[]))

    useEffect(()=> {
        const message = messaging().onMessage(remoteMessage=> {
            console.log('[Remote Message] ', JSON.stringify(remoteMessage))
            requestCallList()
        })

        return message
    })

    return (
        <SafeAreaView style={styles.container}>
            <FlatList style={{flex:1}}
            data={callList}
            ListHeaderComponent={Header}
            renderItem={ListItem}
            keyExtractor={(item:any)=>item.id} 
            refreshControl={
                <RefreshControl refreshing={loading} onRefresh={requestCallList}/>
            }
            />
        </SafeAreaView>
    )
}


const styles = StyleSheet.create({
    container: {
        flex :1,
        justifyContent:"center",
        alignItems:'center',
        width:'100%',
        backgroundColor:'white'
    },
    header: {
        flexDirection : 'row',
        height : 50,
        marginBottom:5,
        backgroundColor:'#3498db',
        color:'white',
        alignItems:'center'
    },
    headerText: {
        fontSize:18,
        textAlign:'center',
        color:'white'
    },
    textform: {
        flex:1,
        borderWidth:1,
        borderColor:'#3498db',
        height: hp(5),
        paddingLeft:10,
        paddingRight:10
    }
});

export default Main_List;
