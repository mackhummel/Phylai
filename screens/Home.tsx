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
import { IconButton, List, useTheme, Button, Divider, TextInput, Title, Badge, Chip, Surface } from 'react-native-paper';
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
    <View key={1} style={{ flex: 1 }}>
      <View style={{ flex: 3 }}>
        <ScrollView >
          <Surface>
            {groups ? <>{groups.map((group: any, index: number) => {
              return (<View
                key={index}
              ><List.Item
                key={index}
                title={() => <Title>{group.data.name}</Title>}
                // description={()=><Chip>{"Members: " + group.data.member.length}</Chip>}
                onPress={() => props.navigation.navigate('GroupDashboard', { gid: group.id })}
                left={() => <Image source={{ uri: group.data.photoURL ? group.data.photoURL : anon }} style={{ width: 60, height: 60, borderRadius: 60 / 4 }} />}
                right={() => (
                  <>
                    <Chip icon="account-group-outline" style={{ margin: 10, backgroundColor: theme.colors.primary }}>{"Members: " + group.data.member.length}</Chip>
                    <IconButton icon='chevron-right' style={{ marginTop: 15 }}></IconButton>
                  </>
                )}
              >
                </List.Item>
                <Divider style={{ height: 2, backgroundColor: 'white' }} /></View>
              );
            })}</> : null}
          </Surface>
        </ScrollView>

      </View>
      <AddGroup />
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



