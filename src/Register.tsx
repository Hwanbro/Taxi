import { SafeAreaView, StyleSheet, Text, TouchableOpacity, TextInput, View, Alert } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome'
import { useState } from "react";
import { useNavigation,ParamListBase } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import api from './API'
import AsyncStorage from "@react-native-async-storage/async-storage";

function Register() : JSX.Element {
    console.log("-- Register()")

    const [userId,setUserId] = useState('');
    const [userPw,setUserPw] = useState('');
    const [userPw2,setUserPw2] = useState('');

    const isDisable = ()=>{
        if (userId && userPw && userPw2 && (userPw==userPw2)) {
            return false
        }
        else {
            return true
        }
    }

    const navigation = useNavigation<StackNavigationProp<ParamListBase>>()

    const onRegister=async()=> {
        let fcmToken = await AsyncStorage.getItem('fcmToken') || ""
        api.register(userId,userPw, `${fcmToken}`)
        .then(response=> {
            let {code, message} = response.data[0]
            let title = "알림"
            if (code==0) {
                navigation.pop()
            }
            else {
                title="오류"
            }

            Alert.alert(title, message, [{
                text: '확인',
                onPress: ()=> console.log('Cancel Pressed'),
                style: 'cancel'
            }])
        })
        .catch(err => {
            console.log(JSON.stringify(err))
        })
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={[styles.container, {justifyContent:'flex-end'}]}>
                <Icon name="drivers-license" size={80} color={'#3498db'}/>
            </View>
            <View style={[styles.container, {flex:2}]}>
                <TextInput style={styles.input} placeholder={'아이디'} onChangeText={newId => setUserId(newId)}/>
                <TextInput style={styles.input} placeholder={'패스워드'} secureTextEntry={true} onChangeText={newPw => setUserPw(newPw)}/>
                <TextInput style={styles.input} placeholder={'패스워드 확인'} secureTextEntry={true} onChangeText={newPw2 => setUserPw2(newPw2)}/>
            </View>
            <View style={[styles.container, {justifyContent:'flex-start'}]}>
                <TouchableOpacity disabled={isDisable()} style={isDisable() ? styles.buttonDisable : styles.button} onPress={onRegister}>
                    <Text style={styles.buttonText}>회원가입</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width:'100%',
    },
    input: {
        width: '70%',
        height: 40,
        borderWidth: 1,
        borderColor: 'gray',
        marginVertical: 10,
        padding: 10
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
    buttonDisable: {
        width:'70%',
        backgroundColor: 'gray',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    }
});

export default Register;
