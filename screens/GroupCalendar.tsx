import React from "react";
import { View , Text} from "react-native";
import GroupCalendarComponent from '../components/GroupCalendarComponent';

const GroupCalendar = (props:any) => {
  const { gid, name, admin } = props.route.params;
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <GroupCalendarComponent gid={gid} admin={admin}/>
      </View>
    );
  }
  
  
  export default GroupCalendar;