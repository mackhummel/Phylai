import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createStackNavigator } from "@react-navigation/stack";

import GroupDashboard from "./GroupDashboard";
import Home from "./Home";

const Dashboard = createNativeStackNavigator();
function DashboardStack(props:any){
    return(
        <Dashboard.Navigator screenOptions={{
           
            headerBackTitleVisible:true,
          }}>
            <Dashboard.Screen name="Home" component={Home}/>
            <Dashboard.Screen name="GroupDashboard" component={GroupDashboard}  options={()=>({
                headerTitle:''
            })}/>
        </Dashboard.Navigator>
    )
}
export default DashboardStack;
