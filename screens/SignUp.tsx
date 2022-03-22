import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, View, } from 'react-native';
import React, { useState } from "react";
import { Button, Input, Image, Divider, Text } from 'react-native-elements';
import { createUserWithEmailAndPassword, getAuth, updateProfile } from '@firebase/auth';
import { db } from '../config/firebase';
import { addDoc, collection, doc, setDoc } from 'firebase/firestore';
import * as ImagePicker from "expo-image-picker";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

const logo = require('../assets/Phylai.png');

const SignUp = (props: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
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
    <View style={styles.container}>
      <Image source={logo} style={styles.image} />
      <Text h2> Sign Up </Text>
      <View style={styles.inputContainer}>
        <View style={styles.vertical}>
          <Input
            placeholder='First Name'
            value={firstName}
            textContentType='name'
            onChangeText={(text) => setFirstName(text)}
            containerStyle={{
              width: '50%',
            }}
          />
          <Divider orientation="vertical" width={0} />
          <Input
            placeholder='Last Name'
            value={lastName}
            textContentType='name'
            onChangeText={(text) => setLastName(text)}
            containerStyle={{
              width: '50%',
            }}
          />
        </View>
        <Input
          placeholder='Username'
          value={username}
          textContentType='username'
          onChangeText={(text) => setUsername(text)}
        />
        <Input
          placeholder='Email Address'
          autoFocus
          value={email}
          textContentType='emailAddress'
          onChangeText={(text) => setEmail(text)}
        />
        <Input
          placeholder='Password'
          secureTextEntry
          value={password}
          textContentType='password'
          onChangeText={(text) => setPassword(text)}
          onSubmitEditing={() => createAccount()}
        />
        {profPic ? <Image source={{uri:profPic}} style={{ width: 100, height:100, resizeMode: "contain", }} /> : null}
        <View style={styles.vertical}>
        
            <Button
              onPress={() => selectProfPic()}
              title="Add Profile Picture"
              buttonStyle={{ backgroundColor: 'black' }}

            />
         
        </View>

      </View>

      <Button
        onPress={() => createAccount()}
        title='Create Account'
        buttonStyle={{ backgroundColor: 'green' }}
        containerStyle={{
          width: styles.inputContainer.width,
        }}
      />
      <Button
        onPress={login}
        title='Back to Login'
        containerStyle={{
          width: styles.inputContainer.width,
        }}
      />
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
    padding: 20,
    width: Platform.OS === 'ios' ? "80%" : "50%",
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
  

})
export default SignUp;


