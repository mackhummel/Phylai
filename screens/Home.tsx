import { Platform, ScrollView, StyleSheet, View, Image, Dimensions, Modal, Pressable } from 'react-native';
import { collection, addDoc, serverTimestamp, query, Timestamp, onSnapshot, orderBy, getDoc, getDocs, collectionGroup, where, updateDoc, doc, arrayUnion } from 'firebase/firestore';
import { getAuth, signOut } from "firebase/auth";
import React, { useContext, useEffect, useLayoutEffect, useState } from 'react';
import { getStorage, ref, uploadBytes } from '@firebase/storage';
import { getDownloadURL } from 'firebase/storage';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { Input, Text } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import { db } from '../config/firebase';
import * as ImagePicker from "expo-image-picker";
import AddGroup from '../components/AddGroup';
import { MyContext } from '../constants/context';
import { IconButton, List, useTheme, Button } from 'react-native-paper';
const anon = require('../assets/anon.png');


const Home = (props: any) => {
  const auth = getAuth();
  const theme = useTheme();
  const user = auth.currentUser;
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<any>([]);
  const [image, setImage] = useState<any>();
  const [uploading, setUploading] = useState(false);
  const [groupMessages, SetGroupMessages] = useState<any>([]);

  const { groups, uid } = useContext(MyContext);


  // useEffect(() => {
  //   const q = query(collection(db, "group"), where('member', 'array-contains', user?.uid));
  //   const unsubscribe = onSnapshot(q, (snapshot) => setGroups(snapshot.docs.map((doc) => ({
  //     ...({
  //       data: doc.data(),
  //       id: doc.id
  //     })
  //   }))));
  //   return unsubscribe;
  // }, []);
  
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
    <View style={{ flex: 1 }}>
      <View style={{ flex: 3 }}>
        <ScrollView >
          {/* {groups ? groups.map((group: any) => {
              return (<View style={styles.list} key={group.id} >
                <Button title={group.data.name} onPress={() =>
                  props.navigation.navigate('GroupDashboard', { gid: group.id, name: group.data.name, admin: group.data.admin.includes(user?.uid) as boolean, adminArray: group.data.admin, memberArray: group.data.member })
                }
                />
              </View>);
            }) : null} */}

          {groups ? <List.Section>{groups.map((group: any) => {
            return (<List.Item
              title={group.data.name}
              onPress={() => props.navigation.navigate('GroupDashboard', { gid: group.id, photoURL: group.data.photoURL ,name: group.data.name, admin: group.data.admin.includes(user?.uid) as boolean, adminArray: group.data.admin, memberArray: group.data.member })}
              left={() => <Image source={{uri: group.data.photoURL? group.data.photoURL : anon }} style={{ width: 48, height: 48, borderRadius: 48 / 4 }} />}
              right={() => (
                <>
                  <View style={{justifyContent:'center'}}>
                    <Text style={{textAlign:'center'}}>Members</Text>
                    <Text style={{textAlign:'center'}}>{group.data.member.length}</Text>
                  </View>
                  <IconButton icon='chevron-right'></IconButton>
                </>
              )}
            ></List.Item>);
          })}</List.Section> : null}
        </ScrollView>
      </View>
    </View>

  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
})
export default Home;



