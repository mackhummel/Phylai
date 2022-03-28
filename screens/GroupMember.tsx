import { getAuth } from "firebase/auth";
import { arrayUnion, collection, collectionGroup, doc, getDocs, onSnapshot, orderBy, query, updateDoc, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Platform, SectionList, Image } from "react-native";
import { Button, Input } from "react-native-elements";
import { Appbar } from "react-native-paper";
import { db } from '../config/firebase';
const anon = require('../assets/anon.png');

const GroupMember = (props: any) => {
    //const { admin, gid, adminArray } = props.route.params
    
    const group = props.group;
    console.log(group);
    const [members, setMembers] = useState<any>([]);
    const [admins, setAdmins] = useState<any>([]);
    const [newMember, setNewMember] = useState("");
    const admin = props.admin;

    useEffect(() => {

        props.navigation.setOptions({
            header: () => (
                <Appbar.Header>
                    <Appbar.BackAction onPress={() => props.navBack()} />
                    <Appbar.Content title={group.data.name + ' Members'}/>
                </Appbar.Header>
            )
        });

        const qAdmin = query(collection(db, 'user'), where('uid', "in", group.data.admin));
        const unsubscribeAdmins = onSnapshot(qAdmin, (snapshot) => setAdmins(snapshot.docs.map((doc) => ({ ...doc.data() }))));
        const qMember = query(collection(db, 'user'), where('uid', "in", group.data.member));
        const unsubscribeMembers = onSnapshot(qMember, (snapshot) => setMembers(snapshot.docs.map((doc) => ({ ...doc.data() }))));

        return () => {
            unsubscribeAdmins();
            unsubscribeMembers();
        }

    }, []);
    const addMember = async (username: any, gid: any) => {
        //Bad practice, update to only grab single user from firebase
        const document = doc(db, 'group', gid);
        const user = (await getDocs(query(collection(db, 'user'), where('username', "==", username)))).docs.map((doc) => doc.data());
        const uid = user[0].uid;
        await updateDoc(document, {
            member: arrayUnion(uid)
        }).then(() => {
            console.log("Added Member successfully ");
            setNewMember("");
        }).catch((error) => console.log("Error in adding member: " + error.message));
    }
   
    return (

        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            {admin ? <View style={styles.inputContainer}>
                <Input
                    placeholder='Username'
                    value={newMember}
                    onChangeText={(text: string) => setNewMember(text)}
                />
                <Button
                    onPress={() => addMember(newMember, group.id)}
                    title="Add Member"
                    buttonStyle={{ backgroundColor: 'rgba(111, 202, 186, 1)' }}
                />

            </View> : null}
            <View style={styles.container}>
                <SectionList
                    sections={[
                        { title: 'Admins', data: admins },
                        { title: 'Members', data: members.filter((doc:any)=>!group.data.admin.includes(doc.uid)) },
                    ]}
                    renderItem={({ item }) => <View style={styles.row}>
                        <View style={styles.imgContainer}>{item?.photoURL? <Image
                            source={{ uri: item?.photoURL }} 
                            style={{ width: 60, height:60, borderRadius:60/2, marginBottom:20 }}
                        />:<Image
                        source={anon} 
                        style={{ width: 60, height:60, borderRadius:60/2, marginBottom:20 }}
                    />}</View>
                        <Text style={styles.item}>{item?.username}</Text>
                    </View>}
                    renderSectionHeader={({ section }) => <Text style={styles.sectionHeader}>{section.title}</Text>}
                    keyExtractor={(item, index) => index.toString()}
                />
            </View>
            {/* <Text>Admin {"\n"}</Text>
            {admins ? admins.map((admin: any) => <Text>{admin?.username}</Text>) : null}
            <Text>{"\n\n"}Members{"\n"}</Text>
            {members ? members.map((member: any) => <Text>{member?.username}</Text>) : null} */}

        </View>
    );
}

const styles = StyleSheet.create({
    inputContainer: {
        marginTop: 10,
        width: Platform.OS === 'ios' ? "80%" : "40%",
    },
    container: {
        flex: 1,
        paddingTop: 10,
        width: '100%',
        
    },
    imgContainer:{
        width:'30%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    sectionHeader: {
        paddingTop: 2,
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 2,
        fontSize: 20,
        fontWeight: 'bold',
        backgroundColor: 'rgba(247,247,247,1.0)',
    },
    row: {
        flex: 1,
        flexWrap: 'wrap',
        flexDirection:'row',
        paddingTop:10,
    },
    item: {
        width:'100%',
        justifyContent: 'space-between',
        fontSize: 30,
        height: 44,
        flexBasis: '70%',
        textAlign: 'center',
    },
});
export default GroupMember;