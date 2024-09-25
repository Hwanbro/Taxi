import { SafeAreaView, StyleSheet, Text, TouchableOpacity, TextInput, View, Alert} from "react-native";
import { useNavigation, ParamListBase } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import Icon from "react-native-vector-icons/FontAwesome";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "./API";

function Login() : JSX.Element {
    console.log("-- Login()")

    const navigation = useNavigation<StackNavigationProp<ParamListBase>>()

    const [userId, setUserId] = useState('')
    const [userPw, setUserPw] = useState('')
    const [disable, setDisable] = useState(true)

    const onIdChange = (newId: string) => {
        newId && userPw ? setDisable(false) : setDisable(true)
        setUserId(newId)
    }
    const onPwChange = (newPw: string) => {
        newPw && userId ? setDisable(false) : setDisable(true)
        setUserPw(newPw)
    }

    const gotoRegister = ()=> {
        navigation.push("Register")
    }
    const gotoMain = ()=> {
        AsyncStorage.setItem('userId', userId).then(()=>{
            navigation.push("Main")
        })
    }

    const onLogin= async()=> {
        let fcmToken = await AsyncStorage.getItem('fcmToken') || ""
        api.login(userId,userPw, `${fcmToken}`).then( response => {
            console.log("API login / data = " + JSON.stringify(response.data[0]))
            let {code,message} = response.data[0]
            console.log("API login / code = " + code + ", message = " + message)
            if (code==0) {
                gotoMain()
            }
            else {
                Alert.alert("오류",message,[{
                    text: '확인',
                    onPress: ()=> console.log('cancel Pressed'),
                    style: 'cancel'
                }])
            }
        })
        .catch(err=> {
            console.log(JSON.stringify(err))
        })
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.container}>
                <Icon name="drivers-license" size={80} color={'#3498db'}/>
            </View>
            <View style={styles.container}>
                <TextInput style={styles.input} placeholder={'아이디'} onChangeText={onIdChange}/>
                <TextInput style={styles.input} placeholder={'패스워드'} secureTextEntry={true} onChangeText={onPwChange}/>
            </View>
            <View style={styles.container}>
            <TouchableOpacity style={disable? styles.buttonDisable : styles.button} disabled={disable} onPress={onLogin}>
                    <Text style={styles.buttonText}>로그인</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button,{marginTop:5}]} onPress={gotoRegister}>
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

export default Login;
