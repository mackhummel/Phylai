import { StyleSheet, Button, Text, View } from 'react-native';
import { collection, addDoc } from 'firebase/firestore';
import { RootTabScreenProps } from '../types';
import {db, auth} from '../config/firebase';
import { getAuth, onAuthStateChanged, signOut , User, reload} from "firebase/auth";
import React from 'react';

export default function TabOneScreen({ navigation }: RootTabScreenProps<'TabOne'>) {
  const [loading, setLoadingChange] = React.useState(true);
  const [user, setUser] = React.useState<any>();
  onAuthStateChanged(auth, (user:any) => {
    setUser(user);
    if(loading) setLoadingChange(false);
  });
  if(loading){
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <Text>Hello {user.displayName}</Text><br/>
      <Button
        title="Add to DB"
        onPress={() => dbCall()}
      /> <br/>
      <Button title = "Logout" onPress={()=>SignOut()}/>
      
    </View>
  );
}

async function dbCall() {
  try {
    const docRef = await addDoc(collection(db, "messages"), {
      From: "Jane",
      To: "John",
      Message: "Hello John!"
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
  
}
async function SignOut(){
  signOut(auth).then(()=>{
    console.log("Logout Successful")
  }).catch((error)=>{
    console.log("Logout error: ", error);
  })
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
  button:{
    color:"red",
  }
});
