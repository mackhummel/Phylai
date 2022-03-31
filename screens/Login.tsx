import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, View, ActivityIndicator, Image , Text, ScrollView} from 'react-native';
import React, {useEffect, useState } from "react";
import {Button, useTheme, TextInput} from 'react-native-paper'
import {  getAuth, onAuthStateChanged, signInWithEmailAndPassword } from '@firebase/auth';
const logo = require('../assets/Phylai.png');


const Login = (props: any) => {
  const { colors } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [hidden, setHidden] = useState(true);
  const auth = getAuth();

  useEffect(
    () =>
      onAuthStateChanged(auth, (user) => {
        if (user) {
          props.navigation.replace('Dashboard');
          
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
   
      <View style={{backgroundColor:colors.background,
        flex: 1,
        }}>
           <ScrollView contentContainerStyle={{width: '100%',
        alignItems: 'center',
        justifyContent: 'center', flexGrow:1}}>
        <Image source={logo} style={styles.image} />
        <Text  style={{marginBottom:25, fontSize:35, color:colors.text}}> Sign In </Text>
        <View style={styles.inputContainer}>
        <TextInput
          autoComplete='never'
          placeholder='Email'
          onChangeText={(text) => setEmail(text)}
          textContentType='emailAddress'
          value={email}
          
          style={{marginBottom:20}}
          mode='outlined'
          theme={{colors:{placeholder:'white'}}}
          ></TextInput>
      
          <TextInput
          autoComplete='never'
          placeholder='Password'
          mode='outlined'
          onChangeText={(text) => setPassword(text)}
          secureTextEntry={hidden}
          value={password}
          onSubmitEditing={signIn}
          theme={{colors:{placeholder:'white'}}}
          right={<TextInput.Icon name="eye" onPress={()=>setHidden(!hidden)} />}
          >
          </TextInput>
        </View>
        <Button
          onPress={signIn}
          mode="contained"
          style={{margin:10}}
        >Sign In</Button>
        <Button
          onPress={signUp}
          mode="outlined"
          
          style={{margin:10, borderColor:colors.primary}}
        >Create Account</Button>
      
        
        </ScrollView>
      </View>
    
  )
}
const styles = StyleSheet.create({
  image: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginBottom:60
  },
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',

  },
  inputContainer: {
    padding: 20,
    width: Platform.OS === 'ios' ? "80%":"50%",
  },
  
  loading: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  }


})
export default Login;
