import { StyleSheet, View } from 'react-native';
import { collection, addDoc, serverTimestamp, doc, setDoc, query, where, getDocs, QuerySnapshot, DocumentData, Timestamp, FieldValue, DocumentReference, DocumentSnapshot } from 'firebase/firestore';
import { RootTabScreenProps } from '../types';
import { getAuth, onAuthStateChanged, signOut, User, reload } from "firebase/auth";
import React, { useEffect, useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadBytes, uploadBytesResumable } from '@firebase/storage';
import { getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import { Button, Input, Image, Text } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth, db } from '../config/firebase';

// class Message {
//   timestamp: FieldValue;
//   username: string;
//   gid: any;
//   text: string;
//   uid: any;
//   constructor(timestamp: FieldValue, username: string, gid: any, text: string, uid: any ){
//     this.timestamp = timestamp;
//     this.username = username;
//     this.gid = gid;
//     this.text = text;
//     this.uid = uid;
//   }
// }

const Home = (props: any) => {
  const auth = getAuth();
  const user = auth.currentUser;
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<QuerySnapshot<DocumentData>>();
  const [load, setLoad] = useState(true);

  const loading = () => {
    setLoad(false);
  }

  const signOutUser = () => {
    signOut(auth).then(() => {
      props.navigation.replace("Login")
      console.log("Logout Successful")
    }).catch((error) => {
      console.log("Logout error: ", error.message);
    })
  }

  const sendMessage = async () => {
    if (message === "") {
      return;
    }
    await addDoc(collection(db, "message"), {
      timestamp: serverTimestamp(),
      username: user?.displayName,
      groupID: 1,
      text: message,
      userID: user?.uid
    }).then(() => {
      console.log("Message successfully sent")
      setMessage("")
    }).catch((error) => console.log("Message failed: " + error.message));
  }

  const getMessages = async () => {
    const q = query(collection(db,"message"), where("groupID", "==", 1));
    await getDocs(q).then((res)=>{
      setChat(res);
      console.log("Got messages successfully");
    }).catch((error) => console.log("Message failed: " + error.message));
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Hello {user?.displayName}</Text>
      <Button onPress={signOutUser} title="Sign Out" />
      <View style={styles.inputContainer}>
        <Input
          placeholder='Message'
          value={message}
          onChangeText={(text) => setMessage(text)}
        />
      </View>
      {chat === undefined ? null: chat.docs.map( doc => {
          return(
            <View style={styles.list}>
              <Text>
                From: {doc.data().username}
              </Text>
              <Text>{"\n"}</Text>
              <View style={{ alignItems:'center', display:'flex', marginBottom:4 }}>
                <Text style={{textAlign:'center'}}>
                 {doc.data().text}
                </Text>
              </View>
            </View>
          );
        })
      }
      <Button 
        onPress={() => sendMessage()} 
        title="Send Message" 
        buttonStyle={{backgroundColor: 'rgba(111, 202, 186, 1)'}}
        
      />
      <Button 
        onPress={() => getMessages()} 
        title="Get Messages" 
        buttonStyle={{backgroundColor: 'rgba(247, 181, 0, 1)'}}
        containerStyle={{padding:10}}
      />
      

    </SafeAreaView>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  list:{
    borderColor:"black",
    borderWidth: 2,
    width:'40%',
    margin:10,
    padding:5
  },
  title: {
    fontSize: 27,
    fontWeight: 'bold',
    paddingBottom: 60
  },
  inputContainer: {
    padding: "20px",
    width: "40%",
  },
});
export default Home;
// export default function Home({ navigation }: RootTabScreenProps<'TabOne'>) {
//   const [loading, setLoadingChange] = React.useState(true);
//   const [user, setUser] = React.useState<any>();
//   const [image, setImage] = React.useState<any>();
//   const pickImage = async () => {
//     // No permissions request is necessary for launching the image library
//     let result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.All,
//       allowsEditing: true,
//       aspect: [4, 3],
//       quality: 1,
//     });

//     console.log(result);

//     if (!result.cancelled) {
//       setImage(result.uri);
//     }
//   };
//   onAuthStateChanged(auth, (user:any) => {
//     setUser(user);
//     if(loading) setLoadingChange(false);
//   });

//   if(loading){
//     return (
//       <View>
//         <Text>Loading...</Text>
//       </View>
//     );
//   }
//   return (
// <View style={styles.container}>
//   <Text>Hello {user.displayName}</Text>
//   <Pressable style={styles.button} onPress={() => dbCall()}><Text style={styles.text}>Add to DB</Text></Pressable>

//   <Pressable style={styles.button} onPress={()=>SignOut()}><Text style={styles.text}>Sign Out</Text></Pressable>
//   <Pressable  style={styles.button} onPress={pickImage}><Text style={styles.text}>Select Image</Text></Pressable>
//   <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />
//   {image? <Pressable  style={styles.button} onPress={()=>UploadImage(image)}><Text style={styles.text}>Upload Image</Text></Pressable>:null}
// </View>
//   );
// }

// async function UploadImage(uri: any) {
//   const blob = await new Promise<any>((resolve, reject) => {
//     const xhr = new XMLHttpRequest();
//     xhr.onload = function () {
//       resolve(xhr.response);
//     };
//     xhr.onerror = function (e) {
//       console.log(e);
//       reject(new TypeError("Network request failed"));
//     };
//     xhr.responseType = "blob";
//     xhr.open("GET", uri, true);
//     xhr.send(null);
//   });

//   const fileRef = ref(getStorage(), uuidv4());
//   //const result = await uploadBytes(fileRef, blob);

//   // We're done with the blob, close and release it

// }
// async function dbCall() {
//   try {
//     const docRef = await addDoc(collection(db, "messages"), {
//       From: "Jane",
//       To: "John",
//       Message: "Hello John!"
//     });
//     console.log("Document written with ID: ", docRef.id);
//   } catch (e) {
//     console.error("Error adding document: ", e);
//   }

// }

// async function SignOut(){
//   signOut(auth).then(()=>{
//     console.log("Logout Successful")
//   }).catch((error)=>{
//     console.log("Logout error: ", error);
//   })
// }

