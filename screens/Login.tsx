import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, TextInput, View, Text, Dimensions, ActivityIndicator } from 'react-native';
//import { View, Text } from '../components/Themed';
import React, { Component, useEffect, useState } from "react";
import { Button, Input, Image, } from 'react-native-elements';

import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, updateProfile, User } from '@firebase/auth';
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
  if(loading){
    return(<View style={styles.loading}>
      <ActivityIndicator color={"#2044E0"} size="large"/>
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
    padding:"20px",
    width: "40%",
  },
  loading:{
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  }


})
export default Login;
// class Login extends Component<any, any>{
//     constructor(props: any){
//         super(props);
//         this.state = {
//             email: '',
//             password: '',
//         }
//     }
//     onEmailChange = (val: any) =>{
//         this.setState({email: val})
//     }
//     onPasswordChange = (val: any) =>{
//         this.setState({password: val})
//     }

//     signIn = () =>{
//         signInWithEmailAndPassword(auth, this.state.email, this.state.password)
//             .then((res)=>{
//             })
//             .catch((error)=>{
//                 console.log("error")
//             })
//     }
//     render(){
//         return (
//             <View style={styles.container}>
//               <View  />
//               <Text >Email:</Text>
//               <TextInput style={styles.input} value={this.state.email} onChangeText={this.onEmailChange}></TextInput>
//               <Text >Password:</Text>
//               <TextInput style={styles.input} value={this.state.password} onChangeText={this.onPasswordChange} secureTextEntry={true}></TextInput>
//               <Button title={"Sign In"} onPress={this.signIn}></Button>
//               <Text>{"\n"}</Text>
//               <Button title="Sign Up" onPress={()=>this.props.navigation.navigate("SignUp")}></Button>
//               <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
//             </View>
//           )
//     }
// }



