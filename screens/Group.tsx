import { Platform, ScrollView, StyleSheet, View, Image } from 'react-native';
import { collection, addDoc, serverTimestamp, query, Timestamp, onSnapshot, orderBy, getDoc, getDocs, collectionGroup, where, updateDoc, arrayUnion, doc, limit } from 'firebase/firestore';
import { getAuth, signOut } from "firebase/auth";
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { getStorage, ref, uploadBytes } from '@firebase/storage';
import { getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { Button, Input, Text } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import { db } from '../config/firebase';
import * as ImagePicker from "expo-image-picker";
import { Appbar, TextInput } from 'react-native-paper';

const Group = (props: any) => {
    const auth = getAuth();
    const group = props.group;
    const user = auth.currentUser;
    const [message, setMessage] = useState("");
    const [chat, setChat] = useState<any>([]);
    const [newMember, setNewMember] = useState("");
    const [sendImage, setSendImage] = useState<any>(null);
    const [uploading, setUploading] = useState(false);
    const admin = props.admin


    useEffect(() => {
        props.navigation.setOptions({
            header: () => (
                <Appbar.Header>
                    <Appbar.BackAction onPress={() => props.navigation.navigate("HomeTab")} />
                    <Image source={{ uri: group.data.photoURL ? group.data.photoURL : null }} style={{ width: 48, height: 48, borderRadius: 48 / 4 }} />
                    <Appbar.Content title={group.data.name} />
                    <Appbar.Action icon='account-group' onPress={() => props.navigation.replace('GroupMembers')} />
                    <Appbar.Action icon='calendar' onPress={() => props.navigation.replace('GroupCalendar')} />
                </Appbar.Header>
            )
        });
        const q = query(collection(db, 'group', group.id,'messages' ), orderBy('timestamp', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => setChat(snapshot.docs.map((doc) => ({ ...doc.data() }))));
        return unsubscribe;
    }, []);


    /*const addMember = async (username: any, gid: any) => {
        //Bad practice, update to only grab single user from firebase
        const document = doc(db, 'group', gid);
        const user = (await getDocs(query(collection(db, 'user'), where('username', "==", username), limit(1)))).docs.map((doc) => doc.data());
        const uid = user[0].uid;
        await updateDoc(document, {
            member: arrayUnion(uid)
        }).then(() => {
            console.log("Added Member successfully ");
            setNewMember("");
        }).catch((error) => console.log("Error in adding member: " + error.message));
    }*/
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
    const sendMessage = async () => {
        if ((sendImage === null) && (message === "")) {
            return;
        }
        const image = await uploadImage(sendImage);
        await addDoc(collection(db, "group", group.id, "messages"), {
            timestamp: serverTimestamp(),
            username: user?.displayName,
            text: message,
            email: user?.email,
            userImg: user?.photoURL,
            gid: group.id,
            image: image ? image : null,
        }).then(() => {
            console.log("Message successfully sent")
            setMessage("");
            setSendImage(null);
        }).catch((error) => console.log("Message failed: " + error.message));
    }
    const selectPicture = async () => {
        let pickerResult = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
        });
        try {
            setUploading(true);

            if (!pickerResult.cancelled) {
                setSendImage(pickerResult.uri);
            }
        } catch (e) {
            console.log(e);
            alert("Upload failed, sorry :(");
        } finally {
            setUploading(false);
        }
    };
    return (
        <View style={{flex: 1, backgroundColor: 'white'}}>
            <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
                <SafeAreaView >
                    <View style={styles.container}>
                        {admin ? <View style={styles.inputContainer}>
                        </View> : null}
                        <View style={styles.listContainer}>
                            {chat === undefined ? null : chat.map((doc: any) => { // Group Chat
                                return (
                                    <View style={styles.chatContainer}>
                                        <View style={styles.list} key={doc.id}>
                                            
                                                <View style={{width:"98%", flexDirection: 'row' }}>
                                                    <View style={{backgroundColor:"black", width: 25, height:25, borderRadius:25/2, alignItems:'center',justifyContent:'center'}}>
                                                        {doc?.userImg? <Image source={{uri:doc.userImg}} style={{width: 25, height:25, borderRadius:25/2}} /> : null}
                                                    </View>
                                                    <View style={{alignItems:'center', marginLeft: 5, marginBottom: 5, justifyContent:'center'}}>
                                                        <Text>{doc?.username}</Text>
                                                    </View>
                                                </View>  
                                                
                                                
                                                <View style={{ width:'98%', alignItems: 'flex-end', marginBottom: 5, flexDirection: 'row', flex:1  , }}>
                                                    {/* <Text>{"\n"}</Text> */}
                                                    <Text style={{fontStyle: 'italic', fontSize: 9, marginLeft: 5 }}>
                                                        {(doc?.timestamp as Timestamp)?.toDate()?.toDateString()}
                                                    </Text>
                                                    <Text style={{fontStyle: 'italic', fontSize: 9, marginLeft: 5 }}>
                                                        {(doc?.timestamp as Timestamp)?.toDate()?.toLocaleTimeString('en-US')}
                                                    </Text>

                                                </View>
                                            <Text style={{ fontSize: 10}}>{"\n"}</Text>
                                            <View style={{ alignItems: 'center', marginBottom: 4, flexDirection: 'row'}}>
                                        
                                        
                                                        <Text style={{ flex: 1, flexShrink: 1, flexWrap: 'wrap' }}>
                                                            {doc?.text}
                                                        </Text>
                                        
                                        
                                                <View style={styles.container}>{doc?.image ? <Image source={{ uri: doc.image }} style={{ width: 100, height: 100,flex:1, resizeMode: "contain", }} /> : null}</View>
                                            </View>
                                        </View>
                                    </View>
                                );
                            })
                        }
                        </View>
                    </View>
                </SafeAreaView>
            </ScrollView>
                <Appbar style={{ flexWrap: "wrap", minHeight:45, }}>
                {sendImage ? <Image source={{ uri: sendImage }} style={{ width: 50, height: 50, resizeMode: "contain", marginLeft:20 }} /> : null}
                    <Appbar.Action icon='image' onPress={() => selectPicture()}/>
                    <TextInput style={{flex:1, height:38}} autoComplete={false} onChangeText={(text) => setMessage(text)} onSubmitEditing={() => sendMessage()} value={message} />
                    <Appbar.Action icon = 'send' onPress={() => sendMessage()}/>
                </Appbar>
            {/* <View style={{backgroundColor: 'rgba(32, 68, 224, 1)'}}>
                <View style={styles.messageInputContainer}>
                    {sendImage ? <Image source={{ uri: sendImage }} style={{ width: 50, height: 50, marginRight: 15, resizeMode: "contain", }} /> : null}
                    <Button // Add Image Button
                        onPress={() => selectPicture()}
                        icon={{
                            name: 'image',
                            type: 'font-awesome',
                            size: 15,
                            color: 'rgba(32, 68, 224, 1)', // Changes send icon color
                        }}
                        title=""
                        buttonStyle={{ backgroundColor: 'white' , height: 40, width: 40, margin: 0, borderRadius: 50}}
                    />
                    <View>
                        <Input
                            placeholder='Send to group..'
                            value={message}
                            onChangeText={(text) => setMessage(text)}
                            inputStyle={{backgroundColor: 'white', marginTop: 10, borderRadius: 15, paddingHorizontal: 10, width: Platform.OS === 'ios' ? "70%" : "80%"}}
                        />
                    </View>
                    <Button
                            onPress={() => sendMessage()}
                            icon={{
                                name: 'paper-plane',
                                type: 'font-awesome',
                                size: 15,
                                color: 'rgba(32, 68, 224, 1)', // Changes send icon color
                            }}
                            title=""
                            buttonStyle={{ backgroundColor: 'white' , height: 40, width: 40, margin: 0, borderRadius: 50}}
                        />
                </View>


            </View> */}
                
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        
    },
    chatContainer: {
        width: "98%",
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: -16,
        marginTop: -5,
        padding: 7,
    },
    list: {
        backgroundColor: '#fff',
        borderColor: "#fff",
        borderWidth: 3,
        borderRadius: 5,
        padding: 5,
        marginBottom: 10,
        marginTop: 10,
        width: Platform.OS === 'ios' ? "95%" : "100%",
    },
    listContainer: {
        marginBottom: 50,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        minWidth: Platform.OS === 'ios' ? "95%" : "80%",
        maxWidth: Platform.OS === 'ios' ? "95%" : "80%",
        borderColor: "rgba(0, 0, 0, 0)",
        borderWidth: 5,
        borderRadius: 5,
    },
    title: {
        fontSize: 27,
        fontWeight: 'bold',
        paddingBottom: 60
    },
    inputContainer: {
        marginTop: 10,
        width: Platform.OS === 'ios' ? "80%" : "40%",
    },
    messageInputContainer: {
        padding: 10,
        width: Platform.OS === 'ios' ? "80%" : "40%",
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        flexDirection: 'row',
    },
    buttonClose: {
        backgroundColor: "#2196F3",
    },
    modalView: {
        margin: 20,
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
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    },
});
export default Group;