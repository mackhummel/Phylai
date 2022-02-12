import { StyleSheet, View, Modal, Pressable, Text, Platform } from 'react-native';
import React, { useState } from "react";
import { Button, Input } from 'react-native-elements';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../config/firebase';
import { v4 as uuidv4 } from 'uuid';



const AddGroup = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [groupName, setGroupName] = useState('');
    const auth = getAuth();
    const user = auth.currentUser;

    const createGroup = async () => {
        if (groupName === "") {
            return;
        }
        await addDoc(collection(db, "group"), {
            timestamp: serverTimestamp(),
            name: groupName,
            owner: user?.uid,

        }).then(async (res) => {
            await addDoc(collection(db, 'group', res.id, 'admin'), {
                admin: [user?.uid]
            })
            await addDoc(collection(db, 'group', res.id, 'member'), {
                admin: [user?.uid]
            })
            setGroupName("");
            setModalVisible(false);
        }).catch((error) => console.log("Group Create failed: " + error.message));
    }
    return (
        <View>
            <Button onPress={() => setModalVisible(!modalVisible)} title="Add group" />
            <Modal
                animationType='slide'
                transparent={false}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(!modalVisible)}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>Create New Group</Text>

                        <Input
                            placeholder='Name'
                            value={groupName}
                            textContentType='name'
                            onChangeText={(text) => setGroupName(text)}
                            onSubmitEditing={() => createGroup()}
                        />

                        <Button
                            onPress={() => createGroup()}
                            title='Create'
                        ></Button>
                        <Button
                            onPress={() => setModalVisible(!modalVisible)}
                            title='Cancel'
                        >
                        </Button>
                    </View>
                </View>
            </Modal>
        </View>
    )
}
const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        padding:20
    },
    modalView: {
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2
    },
    buttonOpen: {
        backgroundColor: "#F194FF",
    },
    buttonClose: {
        backgroundColor: "#2196F3",
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 15,
        fontSize: 20,
        textAlign: "center",
        fontWeight: 'bold'
    },



})
export default AddGroup;
