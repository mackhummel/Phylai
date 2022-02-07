import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, TextInput, Button, View, Text } from 'react-native';
import { auth, db } from '../config/firebase';
//import { View, Text } from '../components/Themed';
import React, {Component} from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, User } from '@firebase/auth';

class SignIn extends Component<any, any>{
    constructor(props: any){
        super(props);
        this.state = {
            email: '',
            password: '',
        }
    }
    onEmailChange = (val: any) =>{
        this.setState({email: val})
    }
    onPasswordChange = (val: any) =>{
        this.setState({password: val})
    }
    
    signIn = () =>{
        signInWithEmailAndPassword(auth, this.state.email, this.state.password)
            .then((res)=>{
            })
            .catch((error)=>{
                console.log("error")
            })
    }
    render(){
        return (
            <View style={styles.container}>
              <View  />
              <Text >Email:</Text><br/>
              <TextInput style={styles.input} value={this.state.email} onChangeText={this.onEmailChange}></TextInput><br/>
              <Text >Password:</Text><br/>
              <TextInput style={styles.input} value={this.state.password} onChangeText={this.onPasswordChange} secureTextEntry={true}></TextInput><br/>
              <Button title={"Sign In"} onPress={this.signIn}></Button><br/>
              <Button title="Sign Up" onPress={()=>this.props.navigation.navigate("SignUp")}></Button>
              <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
            </View>
          )
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  
})
export default SignIn;
