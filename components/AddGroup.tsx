import { StyleSheet, View, Platform } from 'react-native';
import React, { useState } from "react";
import { Input } from 'react-native-elements';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import * as ImagePicker from "expo-image-picker";
import { getAuth } from 'firebase/auth';
import { db } from '../config/firebase';
import { v4 as uuidv4 } from 'uuid';
import { useTheme, Button, TextInput, Divider, IconButton, FAB, Modal, Portal, Avatar, Title, Headline } from 'react-native-paper';



/*
For line 112
<View style={styles.imgContainer}>
                            {
                                profPic 
                                ? <Image source={{uri:profPic}} style={{ width: 60, height: 60, borderRadius: 60 / 2 }} />
                                : <Image source={anon} style={{ width: 60, height: 60, borderRadius: 60 / 2 }
                            } />}       
                        </View>

*/
const anon = require('../assets/anon.png');
const AddGroup = (props: any) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [groupName, setGroupName] = useState('');
    const [profPic, setProfPic] = useState<any>();
    const auth = getAuth();
    const user = auth.currentUser;
    const { colors } = useTheme();

    const selectProfPic = async () => {
        let pickerResult = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        try {
            if (!pickerResult.cancelled) {
                setProfPic(pickerResult.uri);
            }
        } catch (e) {
            console.log(e);
            alert("Upload failed, sorry :(");
        }
    }

    const uploadImage = async (uri: any) => {
        if (uri === null) {
            return null;
        }
        const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
        const blob = await new Promise<any>((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = function () {
                resolve(xhr.response);
            };
            xhr.onerror = function (e) {
                console.log(e);
                reject(new TypeError("Network request failed"));
            };
            xhr.responseType = "blob";
            xhr.open("GET", uri, true);
            xhr.send(null);
        });
        const fileRef = ref(getStorage(), uuidv4());
        const result = await uploadBytesResumable(fileRef, blob);
        return await getDownloadURL(fileRef);
    }


    const createGroup = async () => {
        if (groupName === "") {
            return;
        }
        const image = profPic ? await uploadImage(profPic) : null;
        await addDoc(collection(db, "group"), {
            timestamp: serverTimestamp(),
            name: groupName,
            owner: user?.email,
            admin: [user?.email],
            member: [user?.email],
            photoURL: image

        }).then(async (res) => {
            // await addDoc(collection(db, 'group',res.id, 'admin'), {
            //     admins: [user?.uid]
            // })
            // await addDoc(collection(db, 'group',res.id, 'member'), {
            //     members:user?.uid,
            // })
            // setGroupName("");
            setModalVisible(false);
        }).catch((error) => console.log("Group Create failed: " + error.message));
    }
    return (
        <View>
            <FAB
                style={styles.fab}
                icon='account-multiple-plus-outline'
                onPress={() => setModalVisible(!modalVisible)}
                color={colors.surface}
            />
            <Portal>
                <Modal
                    visible={modalVisible}
                    contentContainerStyle={styles.container}
                    onDismiss={() => setModalVisible(!modalVisible)}
                >
                    <Headline  style={{marginBottom:20}} >Group Creation</Headline>
                    <Avatar.Image size={80} source={profPic ? { uri: profPic } : anon} />
                    <View style={{ flexDirection:'row', margin:10}}>
                        <View style={styles.inputContainer}><TextInput
                            mode='outlined'
                            textContentType='name'
                            placeholder='Group Name...'
                            value={groupName}
                            onChangeText={(text) => setGroupName(text)}
                            onSubmitEditing={() => createGroup()}
                            multiline={true}
                            autoComplete={false}
                            theme={{colors:{placeholder:'white'}}}
                        /></View>
                        
                        <View style={{flex:1}}><IconButton icon='image-plus' color={colors.surface} size={40} onPress={() => selectProfPic()}> </IconButton></View>
                    </View>
                    <Button icon='account-multiple-plus-outline' mode='contained' onPress={() => createGroup()} color='green'>
                        Create Group
                    </Button>
                    <Button style={{marginTop:10}} icon='close-outline' mode='contained' onPress={() => setModalVisible(!modalVisible)} color='red'>
                        Cancel
                    </Button>
                </Modal>
            </Portal>

            {/* <Modal
                animationType='slide'
                transparent={false}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(!modalVisible)}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>Create New Group</Text>   
                        <View style={styles.imgContainer}>
                            {
                                profPic 
                                ? <Image source={{uri:profPic}} style={{ width: 60, height: 60, borderRadius: 60 / 4 }} />
                                : <Image source={anon} style={{ width: 60, height: 60, borderRadius: 60 / 4 }
                            } />}       
                        </View> 

                        
                        <Input
                            placeholder='Name'
                            value={groupName}
                            textContentType='name'
                            onChangeText={(text) => setGroupName(text)}
                            onSubmitEditing={() => createGroup()}
                        />
                        <Button onPress={() => createGroup()}>
                            Create
                        </Button>

                        <Button onPress={() => setModalVisible(!modalVisible)}>
                            Cancel
                        </Button>
                        <View style={{ alignItems: 'center', justifyContent: 'center', flexDirection:'row', }}>
                            <IconButton icon='image-plus'  size={40} onPress={() => selectProfPic()}> </IconButton>
                            <Text style={{color:colors.text}}>Add Profile Photo</Text>
                        </View>
                    </View>
                </View>
            </Modal> */}
        </View>
    )
}
const styles = StyleSheet.create({
    inputContainer: {
        flex:5,
        width: Platform.OS === 'ios' ? "80%" : "50%",
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignContent: 'center',
        padding: 20,

    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    },
    modalView: {
        backgroundColor: "blue",
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
        elevation: 5,
        justifyContent: 'center',
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
    imgContainer: {
        width: '30%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    container: {
        backgroundColor: '#4B9CD3',
        padding: 20,
        margin: Platform.OS === 'web' ? '25%' : "0%",
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
    }


})
export default AddGroup;
