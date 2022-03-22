import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, View, Image, Text } from 'react-native';
import React, { useState } from "react";
import { createUserWithEmailAndPassword, getAuth, updateProfile } from '@firebase/auth';
import { db } from '../config/firebase';
import { addDoc, collection, doc, setDoc } from 'firebase/firestore';
import * as ImagePicker from "expo-image-picker";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import { useTheme, Button, TextInput, Divider, IconButton, } from 'react-native-paper';
import { Icon } from 'react-native-paper/lib/typescript/components/Avatar/Avatar';

const logo = require('../assets/Phylai.png');
const anon = require('../assets/anon.png');
const SignUp = (props: any) => {

  const { colors } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [hidden, setHidden] = useState(true);
  const [profPic, setProfPic] = useState<any>();
  const [rememberMe, setRemember] = useState(false);
  const auth = getAuth();

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
  const createAccount = async () => {
    const image = profPic ? await uploadImage(profPic) : null;
    await createUserWithEmailAndPassword(auth, email, password)
      .then(async (authUser) => {
        console.log("Created Account Successfully");
        await updateProfile(authUser.user, {
          displayName: username,
          photoURL: image
        }).then(async () => {
          console.log("Updated Account Successfully");
          await setDoc(doc(db, "user", authUser.user.uid), {
            uid: authUser.user.uid,
            firstName: firstName,
            lastName: lastName,
            username: username,
            email: email,
            siteAdmin: true,
            photoURL: image
          }).then(() => {
            console.log("Added user to DB successfully");
            props.navigation.replace('Login');
          })
            .catch((error) => console.log("Error adding to DB: " + error.message))
        }).catch((error) => console.log("Error updating user: " + error.message))
      }).catch((error) => {
        console.log("Login Error: " + error.message);
      })
  }
  const login = () => {
    props.navigation.replace('Login');
  }
  return (
    <View style={{backgroundColor:colors.surface,
      flex: 1,
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',}}>
      <Image source={logo} style={styles.image} />
      <Text style={{ marginTop: 15, marginBottom:15, fontSize: 35, color:colors.text }}> Create Account </Text>
      <View style={styles.imgContainer}>{profPic ?  <Image source={{uri:profPic}} style={{ width: 60, height: 60, borderRadius: 60 / 2 }} /> : <Image source={anon} style={{ width: 60, height: 60, borderRadius: 60 / 2 }} />}</View>
      <View style={styles.inputContainer}>
        <View style={styles.vertical}>
          <TextInput
            autoComplete='never'
            placeholder='First Name'
            value={firstName}
            textContentType='name'
            onChangeText={(text) => setFirstName(text)}
            style={{
              width: '48%',
            }}
          />
          <Divider style={{ width: "4%", backgroundColor: 'transparent' }} />
          <TextInput
            autoComplete='never'
            placeholder='Last Name'
            value={lastName}
            textContentType='name'
            onChangeText={(text) => setLastName(text)}
            style={{
              width: '48%',
            }}
          />
        </View>
        <TextInput
          style={styles.textInput}
          autoComplete='never'
          placeholder='Username'
          value={username}
          textContentType='username'
          onChangeText={(text) => setUsername(text)}
        />
        <TextInput
          style={styles.textInput}
          autoComplete='never'
          placeholder='Email Address'
          value={email}
          textContentType='emailAddress'
          onChangeText={(text) => setEmail(text)}
        />
        <TextInput
          style={styles.textInput}
          autoComplete='never'
          placeholder='Password'
          onChangeText={(text) => setPassword(text)}
          secureTextEntry={hidden}
          value={password}
          
          right={<TextInput.Icon name="eye" onPress={() => setHidden(!hidden)} />}
        />


        <View style={{
           alignItems: 'center',
           justifyContent: 'center',
           flexDirection:'row',
          
        }}><IconButton icon='image-plus'  size={40} onPress={() => selectProfPic()}> </IconButton><Text style={{color:colors.text}}>Add Profile Photo</Text></View>



      </View>

      <Button
        onPress={() => createAccount()}
        mode="contained"
        style={{ marginBottom: 10 }}
      >Create</Button>
      <Button
        onPress={login}
        mode="outlined"
        style={{ margin: 10 }}
      >Back To Login</Button>
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  )
}
const styles = StyleSheet.create({
  image: {
    width: 200,
    height: 200,
    borderRadius: 100,
  },
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',

  },
  inputContainer: {
    padding: 10,
    width: Platform.OS === 'ios' ? "90%" : "60%",
  },
  loading: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  vertical: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  textInput: {
    marginTop: 10,
  },
  imgContainer: {
    width: '30%',
    justifyContent: 'center',
    alignItems: 'center'
  },


})
export default SignUp;


