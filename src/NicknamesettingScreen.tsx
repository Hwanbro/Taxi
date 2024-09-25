import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, Alert, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

function NicknameSettingScreen(): JSX.Element {
    const [nickname, setNickname] = useState('');
    const [inputNickname, setInputNickname] = useState('');

    useEffect(() => {
        const loadNickname = async () => {
            try {
                const storedNickname = await AsyncStorage.getItem('nickname');
                if (storedNickname !== null) {
                    setNickname(storedNickname);
                }
            } catch (error) {
                console.error('Failed to load nickname.', error);
            }
        };

        loadNickname();
    }, []);

    const saveNickname = async () => {
        if (inputNickname.trim() === '') {
            Alert.alert('오류', '닉네임을 입력하세요.');
            return;
        }

        try {
            await AsyncStorage.setItem('nickname', inputNickname);
            setNickname(inputNickname);
            Alert.alert('성공', '닉네임이 저장되었습니다.');
        } catch (error) {
            console.error('Failed to save nickname.', error);
            Alert.alert('오류', '닉네임 저장에 실패했습니다.');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.itemContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="닉네임 입력"
                    value={inputNickname}
                    onChangeText={setInputNickname}
                />
                <TouchableOpacity style={styles.button} onPress={saveNickname}>
                    <Text style={styles.buttonText}>저장</Text>
                </TouchableOpacity>
                <Text style={styles.currentNickname}>
                    {nickname ? `현재 닉네임: ${nickname}` : '닉네임이 설정되지 않았습니다.'}
                </Text>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    itemContainer: {
        justifyContent: "center",
        alignItems: "center",
        width: '100%'
    },
    input: {
        height: 40,
        borderColor: '#ddd',
        borderWidth: 1,
        paddingHorizontal: 10,
        marginBottom: 20,
        width: '80%',
        alignSelf: 'center'
    },
    button: {
        backgroundColor: '#007BFF',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        alignSelf: 'center'
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
    currentNickname: {
        marginTop: 20,
        fontSize: 16,
        color: '#333'
    }
});

export default NicknameSettingScreen;