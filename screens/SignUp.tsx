import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, View } from 'react-native';
import React, { useState } from "react";
import { Button, Input, Image, } from 'react-native-elements';
import { createUserWithEmailAndPassword, getAuth, updateProfile } from '@firebase/auth';
import { db } from '../config/firebase';
import { addDoc, collection } from 'firebase/firestore';

const logo = require('../assets/Phylai.png');

const SignUp = (props: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const auth = getAuth();

  const createAccount = async () => {
    await createUserWithEmailAndPassword(auth, email, password)
      .then(async (authUser) => {
        console.log("Created Account Successfully");
        await updateProfile(authUser.user, {
          displayName: username,
        }).then(async () => {
          console.log("Updated Account Successfully");
          await addDoc(collection(db, "user"), {
            uid: authUser.user.uid,
            firstName: firstName,
            lastName: lastName,
            username: username,
            email: email,
            siteAdmin: true,
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
      <View style={styles.inputContainer}>
        <Input
          placeholder='First Name'
          value={firstName}
          textContentType='name'
          onChangeText={(text) => setFirstName(text)}
        />
        <Input
          placeholder='Last Name'
          value={lastName}
          textContentType='name'
          onChangeText={(text) => setLastName(text)}
          
        />
        <Input
          placeholder='Username'
          value={username}
          textContentType='username'
          onChangeText={(text) => setUsername(text)}
        />
        <Input
          placeholder='Email'
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
        

      </View>
      <Button
        onPress={() => createAccount()}
        title='Create Account'
        buttonStyle={{ backgroundColor: 'green' }}
      />
      <Button
        onPress={login}
        title='Back to Login'

      />
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  )
}
const styles = StyleSheet.create({
  image: {
    width: 200,
    height: 200,
  },
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',

  },
  inputContainer: {
    padding: 20,
    width: Platform.OS === 'ios' ? "80%" : "40%",
  },
  loading: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  }


})
export default SignUp;
