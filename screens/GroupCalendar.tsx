import React from "react";
import { View , Text} from "react-native";

const GroupCalendar = (props:any) => {
  const { gid, name, admin } = props.route.params;
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Calendar!! for {name}</Text>
      </View>
    );
  }
  
  
  export default GroupCalendar;