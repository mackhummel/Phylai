import { Platform, ScrollView, StyleSheet, View } from 'react-native';
import { collection, addDoc, serverTimestamp,  query,  getDocs, QuerySnapshot, DocumentData, Timestamp,  orderBy} from 'firebase/firestore';
import { getAuth, signOut } from "firebase/auth";
import React, {  useState } from 'react';
import { getStorage, ref, uploadBytes, uploadBytesResumable } from '@firebase/storage';
import { getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import { Button, Input, Image, Text } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth, db } from '../config/firebase';
import ImagePicker from 'react-native-image-picker';

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
  const [filePath, setFilePath] = useState<any>(null);
  const [transferred, setTransferred] = useState(0);

 

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
    const q = query(collection(db, "message"), orderBy('timestamp','desc') );
    await getDocs(q).then((res) => {
      setChat(res);
      console.log("Got messages successfully");
    }).catch((error) => console.log("Message failed: " + error.message));
  }

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
      <SafeAreaView >
        <View style={styles.container}>
        
            <Text style={styles.title}>Hello {user?.displayName}</Text>
            <Button onPress={signOutUser} title="Sign Out" />
            <View style={styles.inputContainer}>
              <Input
                placeholder='Message'
                value={message}
                onChangeText={(text) => setMessage(text)}
              />
            </View>
            
            <Button
              onPress={() => sendMessage()}
              title="Send Message"
              buttonStyle={{ backgroundColor: 'rgba(111, 202, 186, 1)' }}
            />
            <Button
              onPress={() => getMessages()}
              title="Get Messages"
              buttonStyle={{ backgroundColor: 'rgba(247, 181, 0, 1)' }}
              
            />
            <Text style={{ marginTop:10,textDecorationLine:'underline', fontSize:20, fontStyle:'italic'}}>Message Board</Text>
            {chat === undefined ? null : chat.docs.map(doc => {
              return (
                <View style={styles.list} key={doc.id}>
                  <Text>
                    From: {doc.data().username}
                  </Text>
                  <Text>{"\n"}</Text>
                  <View style={{ alignItems: 'center', display: 'flex', marginBottom: 4 }}>
                    <Text style={{ textAlign: 'center' }}>
                      {doc.data().text}
                    </Text>
                  </View>
                  <Text>{"\n"}</Text>
                  <Text>
                    {(doc.data().timestamp as Timestamp).toDate().toString()}
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
    width: Platform.OS === 'ios' ? "80%":"40%",
    margin: 10,
    padding: 5
  },
  title: {
    fontSize: 27,
    fontWeight: 'bold',
    paddingBottom: 60
  },
  inputContainer: {
    marginTop:10,
    width: Platform.OS === 'ios' ? "80%":"40%",
  },
});
export default Home;


function setResponse(options: any, setResponse: any) {
  throw new Error('Function not implemented.');
}
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

