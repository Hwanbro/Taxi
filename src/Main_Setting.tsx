import { SafeAreaView, StyleSheet, Text, TouchableOpacity, FlatList} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation,ParamListBase } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

function Main_Setting() : JSX.Element {
    console.log("-- Main_Setting()")

    let arrSetMenu=[{id:0,name:"로그아웃"}]

    const navigation = useNavigation<StackNavigationProp<ParamListBase>>();
    const onLogout = ()=> {
        AsyncStorage.removeItem('userId').then(()=> {
            navigation.popToTop()
        })
    }

    return (
        <SafeAreaView style={styles.container}>
            <FlatList style={{width:'100%'}}
                data={arrSetMenu}
                renderItem={(row:any) => {
                    console.log("row = " + JSON.stringify(row))
                    return (
                        <TouchableOpacity style={[styles.container]} onPress={onLogout}>
                            <Text style={styles.textForm}>{row.item.name}</Text>
                        </TouchableOpacity>
                    )
                }}
                keyExtractor={(item:any)=>item.id}
            />
        </SafeAreaView>
    )
}


const styles = StyleSheet.create({
    container: {
        flex:1,
        justifyContent:"center",
        alignItems: "center"
    },
    textForm: {
        borderWidth:1,
        borderColor:'#3498db',
        padding:20,
        width:'100%',
        fontSize:18,
        textAlign: 'center',
        color:'#3498db',
        marginBottom:2
    }
});

export default Main_Setting;
