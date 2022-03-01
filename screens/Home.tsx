import { Platform, ScrollView, StyleSheet, View, Image, Dimensions, Modal, Pressable } from 'react-native';
import { collection, addDoc, serverTimestamp, query,  Timestamp, onSnapshot, orderBy, getDoc, getDocs, collectionGroup, where, updateDoc, doc, arrayUnion } from 'firebase/firestore';
import { getAuth, signOut } from "firebase/auth";
import React, { useEffect, useState } from 'react';
import { getStorage, ref, uploadBytes } from '@firebase/storage';
import { getDownloadURL } from 'firebase/storage';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { Button, Input, Text } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import { db } from '../config/firebase';
import * as ImagePicker from "expo-image-picker";
import AddGroup from '../components/AddGroup';

const Home = (props: any) => {
  const auth = getAuth();
  const user = auth.currentUser;
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<any>([]);
  const [image, setImage] = useState<any>();
  const [uploading, setUploading] = useState(false);
  const [groups, setGroups] = useState<any>();
  const [groupMessages, SetGroupMessages] = useState<any>([]);

  useEffect(() => {
    const q = query(collection(db, "group"),where('member','array-contains',user?.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => setGroups(snapshot.docs.map((doc) => ({ ...({
             data:doc.data(),
             id: doc.id
           }) }))));
    return unsubscribe;
  }, []);
  const selectProfPic = async () => {
    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,

    });
    try {
      setUploading(true);

      if (!pickerResult.cancelled) {
        const uploadUrl = await uploadImage(pickerResult.uri);
        setImage(uploadUrl)
      }
    } catch (e) {
      console.log(e);
      alert("Upload failed, sorry :(");
    } finally {
      setUploading(false);
    }
  };
  async function uploadImage(uri: any) {
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
    const result = await uploadBytes(fileRef, blob);
    return await getDownloadURL(fileRef);
  }
  

  const signOutUser = () => {
    signOut(auth).then(() => {
      props.navigation.replace("Login")
      console.log("Logout Successful")
    }).catch((error) => {
      console.log("Logout error: ", error.message);
    })
  }



  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
      <SafeAreaView >
        <View style={styles.container}>
        {user?.photoURL? <Image source={{uri:user.photoURL}} style={{ width: 100, height:100, borderRadius:100/2, marginBottom:20 }} /> : null}
          <Text style={styles.title}>Hello {user?.displayName}</Text>
          <Text style={styles.title}> Your Groups:</Text>
          {groups? groups.map((group:any)=>{
            return(<View style={styles.list} key={group.id} >
              <Button title={group.data.name} onPress={()=>
              props.navigation.navigate('GroupDashboard',{ gid: group.id, name:group.data.name, admin: group.data.admin.includes(user?.uid) as boolean })
            }
              
              />
            </View>);
          }):null}
          <AddGroup/>
          <Button title="Personal Calendar" onPress={()=>
              props.navigation.navigate('PersonalCalendar')
            }
              
          />
          <Button onPress={signOutUser} title="Sign Out" />
          {/* <Button onPress={() => selectProfPic()} title="Upload Image" />
          {image ? <Image source={{ uri: image }} style={{ width: Dimensions.get('window').width / 1.5, height: Dimensions.get('window').width / 3, resizeMode: "contain", }} /> : null}
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
          <Text style={{ marginTop: 10, textDecorationLine: 'underline', fontSize: 20, fontStyle: 'italic' }}>Message Board</Text>
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
                </View>
                <Text>{"\n"}</Text>
                <Text>
                  {(doc?.timestamp as Timestamp)?.toDate()?.toString()}
                </Text>
              </View>
            );
          })
          } */}
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
export default Home;



