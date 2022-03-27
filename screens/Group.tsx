import { Platform, ScrollView, StyleSheet, View, Image, Dimensions, Modal, Pressable } from 'react-native';
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

const Group = (props: any) => {
    const auth = getAuth();
    const { gid, name, admin } = props.route.params;
    const user = auth.currentUser;
    const [message, setMessage] = useState("");
    const [chat, setChat] = useState<any>([]);
    const [newMember, setNewMember] = useState("");
    const [sendImage, setSendImage] = useState<any>(null);
    const [uploading, setUploading] = useState(false);


    useEffect(() => {
        const q = query(collectionGroup(db, 'messages'), where("gid", "==", gid), orderBy('timestamp', 'desc'));
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
        await addDoc(collection(db, "group", gid, "messages"), {
            timestamp: serverTimestamp(),
            username: user?.displayName,
            text: message,
            userID: user?.uid,
            userImg: user?.photoURL,
            gid: gid,
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
        <View style={{flex: 1}}>
            <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
                <SafeAreaView >
                    <View style={styles.container}>
                        {admin ? <View style={styles.inputContainer}>
                        </View> : null}
                        {sendImage ? <Image source={{ uri: sendImage }} style={{ width: 100, height: 100, resizeMode: "contain", }} /> : null}
                        <View style={styles.listContainer}>
                            {chat === undefined ? null : chat.map((doc: any) => { // Group Chat
                                return (
                                    <View style={styles.chatContainer}>
                                        <View style={styles.list} key={doc.id}>
                                            <Text style={{fontWeight: 'bold'}}>
                                                <View style={{width:"98%", flexDirection: 'row' }}>
                                                    <View style={{backgroundColor:"black", width: 25, height:25, borderRadius:25/2, alignItems:'center',justifyContent:'center'}}>
                                                        {doc?.userImg? <Image source={{uri:doc.userImg}} style={{width: 25, height:25, borderRadius:25/2}} /> : null}
                                                    </View>
                                                    <View style={{alignItems:'center', marginLeft: 5, marginBottom: 5, justifyContent:'center'}}>
                                                        {doc?.username}
                                                    </View>
                                                </View>  
                                                <View style={{ width:'98%', alignItems: 'flex-end', marginBottom: 5, flexDirection: 'row' }}>
                                                    <Text style={{ fontSize: 10}}>{"\n"}</Text>
                                                    <Text style={{fontStyle: 'italic', fontSize: 12, marginLeft: 5 }}>
                                                        {(doc?.timestamp as Timestamp)?.toDate()?.toDateString()}
                                                    </Text>
                                                    <Text style={{fontStyle: 'italic', fontSize: 12, marginLeft: 5 }}>
                                                        {(doc?.timestamp as Timestamp)?.toDate()?.toLocaleTimeString('en-US')}
                                                    </Text>

                                                </View>
                                                
                                            </Text>
                                            <Text style={{ fontSize: 10}}>{"\n"}</Text>
                                            <View style={{ alignItems: 'center', marginBottom: 4, flexDirection: 'row'}}>
                                        
                                        
                                                        <Text style={{ flex: 1, flexShrink: 1, flexWrap: 'wrap' }}>
                                                            {doc?.text}
                                                        </Text>
                                        
                                        
                                                <View style={styles.container}>{doc?.image ? <Image source={{ uri: doc.image }} style={{ width: 100, height: 100, resizeMode: "contain", }} /> : null}</View>
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
            <View style={styles.messageInputContainer}>
            <Button // Add Image Button
                            title="Add Image"
                            onPress={() => selectPicture()}
            />
            <Input
                placeholder='Message'
                value={message}
                onChangeText={(text) => setMessage(text)}
            />
            <Button
                            onPress={() => sendMessage()}
                            icon={{
                                name: 'paper-plane',
                                type: 'font-awesome',
                                size: 15,
                                color: 'white', // Changes send icon color
                            }}
                            title=""
                            buttonStyle={{ backgroundColor: 'rgba(32, 68, 224, 1)' , width: Platform.OS === 'ios' ? "50%" : "75%", margin: 0}}
                        />
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        
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
        borderColor: "#a0a2a3",
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
        padding: 7,
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