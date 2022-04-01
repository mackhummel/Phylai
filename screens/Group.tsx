import { Platform, ScrollView, StyleSheet, View, Image , TextInput} from 'react-native';
import { collection, addDoc, serverTimestamp, query, Timestamp, onSnapshot, orderBy, getDoc, getDocs, collectionGroup, where, updateDoc, arrayUnion, doc, limit, arrayRemove } from 'firebase/firestore';
import { getAuth, signOut } from "firebase/auth";
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { getStorage, ref, uploadBytes } from '@firebase/storage';
import { getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { SafeAreaView } from 'react-native-safe-area-context';
import { db } from '../config/firebase';
import * as ImagePicker from "expo-image-picker";
import { Appbar, Avatar, Caption, List, Paragraph, Surface,  Title, useTheme, Text, IconButton } from 'react-native-paper';
import { TouchableOpacity } from 'react-native-gesture-handler';

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
    const { colors } = useTheme();
    const anon = require('../assets/anon.png');
    const [textInputHeight, setTextInputHeight] = useState(1);
    const height = 100;

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
        const q = query(collection(db, 'group', group.id, 'messages'), orderBy('timestamp', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => setChat(snapshot.docs.map((doc) => ({
            ...({
                data: doc.data(),
                id: doc.id
            })
        }))));

        return unsubscribe;
    }, []);


    const likeChat = async (mid: any) => {
        const docRef = doc(db, 'group', group.id, 'messages', mid);
        const docSnap = await getDoc(docRef);
        if (docSnap.data()?.likes.includes(user?.email)) {
            await updateDoc(docRef, {
                likes: arrayRemove(user?.email)
            })
        }
        else if (docSnap.data()?.dislikes.includes(user?.email)) {
            await updateDoc(docRef, {
                likes: arrayUnion(user?.email),
                dislikes: arrayRemove(user?.email)
            })
        }
        else {
            await updateDoc(docRef, {
                likes: arrayUnion(user?.email)
            })
        }
    }
    const dislikeChat = async (mid: any) => {
        const docRef = doc(db, 'group', group.id, 'messages', mid);
        const docSnap = await getDoc(docRef);
        if (docSnap.data()?.dislikes.includes(user?.email)) {
            await updateDoc(docRef, {
                dislikes: arrayRemove(user?.email)
            })
        }
        else if (docSnap.data()?.likes.includes(user?.email)) {
            await updateDoc(docRef, {
                dislikes: arrayUnion(user?.email),
                likes: arrayRemove(user?.email)
            })
        }
        else {
            await updateDoc(docRef, {
                dislikes: arrayUnion(user?.email)
            })
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
            likes: [],
            dislikes: [],
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
        <View style={{ flex: 1, }}>

            <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', backgroundColor: colors.surface }}>
                <Surface >
                    {chat === undefined ? null : chat.map((doc: any, index: number) => (
                        <List.Item
                        key={index}
                            title={() => (
                                <>
                                    <Text style={{ color: colors.primary }}>{doc.data.username}</Text>
                                    <Caption>{(doc?.data.timestamp as Timestamp)?.toDate()?.toDateString() + "  " + (doc?.data.timestamp as Timestamp)?.toDate()?.toLocaleTimeString('en-US')}</Caption>
                                </>
                            )}
                            
                            left={() => <Avatar.Image source={{ uri: doc.data.userImg }} size={25} />}
                            description={() => (
                                <View style={{ flex: 1 }}>
                                    <Paragraph style={{ flex: 1 }}>{doc.data.text}</Paragraph>
                                    {doc?.data.image ? <View><Image source={{ uri: doc.data.image }} style={{ width: '100%', height: 250, resizeMode: "contain" }} /></View> : null}
                                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                        <Text style={{ margin: 15, color: 'green' }}>{doc.data.likes.length}</Text>
                                        {doc.data.likes.includes(user?.email) ? <IconButton style={{ marginLeft: -15 }} icon='thumb-up' size={20} color='green' onPress={() => likeChat(doc.id)} /> :
                                            <IconButton style={{ marginLeft: -15 }} icon='thumb-up-outline' size={20} color='green' onPress={() => likeChat(doc.id)} />}
                                        <Text style={{ margin: 15, color: 'red' }}>{doc.data.dislikes.length}</Text>
                                        {doc.data.dislikes.includes(user?.email) ? <IconButton style={{ marginLeft: -15 }} icon='thumb-down' size={20} color='red' onPress={() => dislikeChat(doc.id)} /> :
                                            <IconButton style={{ marginLeft: -15 }} icon='thumb-down-outline' size={20} color='red' onPress={() => dislikeChat(doc.id)} />}

                                    </View>
                                </View>
                            )
                            }
                        />
                    ))

                    }

                </Surface>
            </ScrollView>

            <Surface style={{ backgroundColor: colors.primary, padding: 10, flexDirection:'row', justifyContent:'center', alignItems:'center' }}>
                
                
                    {sendImage ? <TouchableOpacity onPress={() => setSendImage(null)} style={{backgroundColor:'transparent',marginLeft: 1, flex:2 }}><Image source={{ uri: sendImage }} style={{ width:100,height: 100, resizeMode: "contain", marginLeft: 1, flex:2 }} /></TouchableOpacity> : null}

                

                <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                    <IconButton icon='image' onPress={() => selectPicture()} />
                </View>
                <View style={{flex:6}}><TextInput
                    style={{ maxWidth:'100%', padding:5,height: Platform.OS === 'web' ? textInputHeight: (textInputHeight < 30 ? 30:textInputHeight+10) , flexGrow: 1,backgroundColor:'white', marginTop:15, marginBottom:15, borderRadius:5, color:colors.surface}}
                    onChangeText={(text) => setMessage(text)}
                    onSubmitEditing={() => sendMessage()}
                    value={message}
                    placeholder='Send Message...'
                    multiline
                    onContentSizeChange={(e)=>{
                        setTextInputHeight(e.nativeEvent.contentSize.height)
                    }}
                /></View>
                
                <View style={{flex:1, justifyContent:'center', alignItems:'center'}}><IconButton icon='send' onPress={() => sendMessage()} /></View>
            </Surface>
    

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