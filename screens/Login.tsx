import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, View, ActivityIndicator } from 'react-native';
import React, {useEffect, useState } from "react";
import { Button, Input, Image, } from 'react-native-elements';

import {  getAuth, onAuthStateChanged, signInWithEmailAndPassword } from '@firebase/auth';
const logo = require('../assets/Phylai.png');


const Login = (props: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const auth = getAuth();

  useEffect(
    () =>
      onAuthStateChanged(auth, (user) => {
        if (user) {
          props.navigation.replace('Home');
        }
        setLoading(false);
      }),
    []
  )
  const signIn = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        console.log("Login Successful");
      }).catch((error) => {
        console.log("Login Error: " + error.message);
      })
  }
  const signUp = () =>{
    props.navigation.replace('SignUp');
  }

  if (loading) {
    return (<View style={styles.loading}>
      <ActivityIndicator color={"#2044E0"} size="large" />
    </View>)
  }
  return (
    <View style={styles.container}>
      <Image source={logo} style={styles.image} />
      <View style={styles.inputContainer}>
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
          onSubmitEditing={signIn}
        />
      </View>
      <Button
        onPress={signIn}
        title='Sign In'
      />
      <Button
        onPress={signUp}
        title='Create Account'
        buttonStyle={{ backgroundColor: 'green' }}
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
    width: Platform.OS === 'ios' ? "80%":"40%",
  },
  loading: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  }


})
export default Login;
