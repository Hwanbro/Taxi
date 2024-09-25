import {
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    FlatList,
    RefreshControl,
    Alert,
    TouchableOpacity,
  } from "react-native";
  import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
  import { useState, useEffect } from "react";
  import { useFocusEffect } from "@react-navigation/native";
  import React from "react";
  import Icon from "react-native-vector-icons/FontAwesome";
  import AsyncStorage from "@react-native-async-storage/async-storage";
  import api from "./API";
  import messaging from "@react-native-firebase/messaging";
  
  function Main_List(): JSX.Element {
    console.log("-- Main_List()");
  
    const [callList, setCallList] = useState([]);
    const [filteredCalls, setFilteredCalls] = useState([]); // 필터링된 콜 목록
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState(""); // 필터 상태 저장
  
    const requestCallList = async () => {
      let userId = (await AsyncStorage.getItem("userId")) || "";
      setLoading(true);
  
      api.list(userId)
        .then((response) => {
          let { code, message, data } = response.data[0];
          if (code == 0) {
            setCallList(data);
            setFilteredCalls(data); // 기본적으로 전체 콜 목록을 표시합니다.
          } else {
            Alert.alert("오류", message, [
              {
                text: "확인",
                onPress: () => console.log("cancel Pressed"),
                style: "cancel",
              },
            ]);
          }
          setLoading(false);
        })
        .catch((err) => {
          console.log(JSON.stringify(err));
          setLoading(false);
        });
    };
  
    const onAccept = async (item: any) => {
      let userId = (await AsyncStorage.getItem("userId")) || "";
      setLoading(true);
      api.accept(userId, item.id, item.user_id)
        .then((response) => {
          let { code, message, data } = response.data[0];
          if (code == 0) {
            requestCallList();
          } else {
            Alert.alert("오류", message, [
              {
                text: "확인",
                style: "cancel",
              },
            ]);
          }
          setLoading(false);
        })
        .catch((err) => {
          console.log(JSON.stringify(err));
          setLoading(false);
        });
    };
  
    const Header = () => (
      <View style={styles.header}>
        <Text style={[styles.headerText, { width: wp(80) }]}>출발지 / 도착지</Text>
        <Text style={[styles.headerText, { width: wp(20) }]}>상태</Text>
      </View>
    );
  
    const ListItem = (row: any) => {
      console.log("row = " + JSON.stringify(row));
      return (
        <View style={{ flexDirection: "row", marginBottom: 5, width: wp(100) }}>
          <View style={[{ width: wp(80) }]}>
            <Text style={styles.textform}>{row.item.start_addr}</Text>
            <Text style={[styles.textform, { borderTopWidth: 0 }]}>{row.item.end_addr}</Text>
          </View>
          <View style={{ width: wp(20), alignItems: "center", justifyContent: "center" }}>
            {row.item.call_state == "REQ" ? (
              <TouchableOpacity style={styles.button} onPress={() => onAccept(row.item)}>
                <Text style={styles.buttonText}>{row.item.call_state}</Text>
              </TouchableOpacity>
            ) : (
              <Text>{row.item.call_state}</Text>
            )}
          </View>
        </View>
      );
    };
  
    const filterCalls = () => {
      if (filter === "") {
        setFilteredCalls(callList); // 필터가 없을 때 전체 목록을 표시
      } else {
        setFilteredCalls(callList.filter((call:any) => call.call_state === filter)); // 필터된 목록을 설정
      }
    };
  
    useFocusEffect(
      React.useCallback(() => {
        requestCallList();
      }, [])
    );
  
    useEffect(() => {
      const message = messaging().onMessage((remoteMessage) => {
        console.log("[Remote Message] ", JSON.stringify(remoteMessage));
        requestCallList();
      });
  
      return message;
    }, []);
  
    useEffect(() => {
      filterCalls(); // 필터가 변경될 때마다 필터링 수행
    }, [filter, callList]);
  
    return (
      <SafeAreaView style={styles.container}>
        {/* 필터 버튼들 */}
        <View style={{ flexDirection: "row", justifyContent: "space-around", marginVertical: 10 }}>
          <TouchableOpacity style={[styles.button, {flex:1}]} onPress={() => setFilter("")}>
            <Text style={{ color: filter === "" ? "blue" : "black" }}>전체</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, {flex:1}]} onPress={() => setFilter("REQ")}>
            <Text style={{ color: filter === "REQ" ? "blue" : "black" }}>REQ</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, {flex:1}]} onPress={() => setFilter("RES")}>
            <Text style={{ color: filter === "RES" ? "blue" : "black" }}>RES</Text>
          </TouchableOpacity>
        </View>
  
        <FlatList
          style={{ flex: 1 }}
          data={filteredCalls}
          ListHeaderComponent={Header}
          renderItem={ListItem}
          keyExtractor={(item: any) => item.id}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={requestCallList} />}
        />
      </SafeAreaView>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
      backgroundColor: "white",
    },
    header: {
      flexDirection: "row",
      height: 50,
      marginBottom: 5,
      backgroundColor: "#3498db",
      color: "white",
      alignItems: "center",
    },
    headerText: {
      fontSize: 18,
      textAlign: "center",
      color: "white",
    },
    textform: {
      flex: 1,
      borderWidth: 1,
      borderColor: "#3498db",
      height: hp(5),
      paddingLeft: 10,
      paddingRight: 10,
    },
    button: {
      width: "70%",
      backgroundColor: "#3498db",
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 5,
    },
    buttonText: {
      color: "white",
      fontSize: 16,
      textAlign: "center",
    },
  });
  
  export default Main_List;
  

/*
import { SafeAreaView, StyleSheet, Text, View, FlatList, RefreshControl, Modal, Alert, TouchableOpacity } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { useState,useEffect } from "react";
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

    const onAccept= async(item:any)=> {
        let userId = await AsyncStorage.getItem('userId') || ""
        setLoading(true)
        api.accept(userId, item.id, item.user_id)
        .then(response => {
            let {code, message, data} = response.data[0]
            if (code==0) {
                requestCallList()
            }
            else {
                Alert.alert("오류",message, [{
                    text:'확인',style:'cancel'
                }])
            }
            setLoading(false)
        })
        .catch(err=> {
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
                </View>
                <View style={{width:wp(20),alignItems:'center', justifyContent:'center'}}>
                    {row.item.call_state=='REQ' ? (
                        <TouchableOpacity style={styles.button}
                        onPress={()=>onAccept(row.item)}>
                            <Text style={styles.buttonText}>{row.item.call_state}</Text>
                        </TouchableOpacity>
                    ) : (
                        <Text>{row.item.call_state}</Text>
                    )}
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
    },
    button: {
        width: '70%',
        backgroundColor: '#3498db',
        paddingVertical: 10,
        paddingHorizontal : 20,
        borderRadius:5
    },
    buttonText : {
        color:'white',
        fontSize:16,
        textAlign: 'center'
    },
});

export default Main_List;
*/