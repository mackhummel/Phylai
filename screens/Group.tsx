import { Platform, ScrollView, StyleSheet, View, Image, Dimensions, Modal, Pressable } from 'react-native';
import { collection, addDoc, serverTimestamp, query, Timestamp, onSnapshot, orderBy, getDoc, getDocs, collectionGroup, where, updateDoc, arrayUnion, doc } from 'firebase/firestore';
import { getAuth, signOut } from "firebase/auth";
import React, { useEffect, useState } from 'react';
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


    const addMember = async (username: any, gid: any) => {
        //Bad practice, update to only grab single user from firebase
        const document = doc(db, 'group', gid);
        const user = (await getDocs(query(collection(db, 'user'), where('username', "==", username)))).docs.map((doc) => doc.data());
        const uid = user[0].uid;
        await updateDoc(document, {
            member: arrayUnion(uid)
        }).then(() => {
            console.log("Added Member successfully ");
            setNewMember("");
        }).catch((error) => console.log("Error in adding member: " + error.message));
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
    const sendMessage = async () => {
        if((sendImage === null) && (message === "")){
            return;
        }
        const image = await uploadImage(sendImage);
        await addDoc(collection(db, "group", gid, "messages"), {
            timestamp: serverTimestamp(),
            username: user?.displayName,
            text: message,
            userID: user?.uid,
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
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
            <SafeAreaView >
                <View style={styles.container}>
                    <Text style={styles.title}>
                        {name}
                    </Text>
                    {admin ? <View>
                        <Input
                            placeholder='Username'
                            value={newMember}
                            onChangeText={(text) => setNewMember(text)}
                        />
                        <Button
                            onPress={() => addMember(newMember, gid)}
                            title="Add Member"
                            buttonStyle={{ backgroundColor: 'rgba(111, 202, 186, 1)' }}
                        />

                    </View> : null}
                    <View style={styles.inputContainer}>
                        <Input
                            placeholder='Message'
                            value={message}
                            onChangeText={(text) => setMessage(text)}
                        />
                    </View>
                    {sendImage ? <Image source={{uri:sendImage}} style={{ width: 100, height:100, resizeMode: "contain", }} /> : null}
                    <Button
                        title="Add Image"
                        onPress={() => selectPicture()}
                    />
                    <Button
                        onPress={() => sendMessage()}
                        title="Send Message"
                        buttonStyle={{ backgroundColor: 'rgba(111, 202, 186, 1)' }}
                    />
                    {chat === undefined ? null : chat.map((doc: any) => {
                        return (
                            <View style={styles.list} key={doc?.id}>
                                <Text>
                                    From: {doc?.username}
                                </Text>
                                <Text>{"\n"}</Text>
                                <View style={{ alignItems: 'center', display: 'flex', marginBottom: 4 }}>
                                    <Text style={{ textAlign: 'center' }}>
                                        {doc?.text}
                                    </Text>
                                    <View style={styles.container}>{doc?.image ? <Image source={{uri:doc.image}} style={{ width: 100, height:100, resizeMode: "contain", }} /> : null}</View>
                                </View>
                                <Text>{"\n"}</Text>
                                <Text>
                                    {(doc?.timestamp as Timestamp)?.toDate()?.toString()}
                                </Text>
                            </View>
                        );
                    })
                    }
                </View>
            </SafeAreaView>
        </ScrollView>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    list: {
        borderColor: "black",
        borderWidth: 2,
        width: Platform.OS === 'ios' ? "80%" : "40%",
        margin: 10,
        padding: 5
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
    }
});
export default Group;



