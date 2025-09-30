import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";

import HomeScreen from "./screens/HomeScreen";
import SearchScreen from "./screens/SearchScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// home 탭의 스택 네비게이터
function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HomeFeed"
        component={HomeScreen}
        options={{ title: "Home" }}
      />
    </Stack.Navigator>
  );
}

// search 탭의 스택 네비게이터
function SearchStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SearchMain"
        component={SearchScreen}
        options={{ title: "Search" }}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            tabBarActiveTintColor: "#1DA1F2",
            tabBarInactiveTintColor: "gray",
            headerShown: false, // Stack Navigator가 헤더 보여주니까
          }}
        >
          <Tab.Screen
            name="Home"
            component={HomeStack}
            options={{
              tabBarLabel: "Home",
              tabBarIcon: ({ color, size }) => (
                <Feather name="home" color={color} size={size} />
              ),
            }}
          />

          <Tab.Screen
            name="Search"
            component={SearchStack}
            options={{
              tabBarLabel: "Search",
              tabBarIcon: ({ color, size }) => (
                <Feather name="search" color={color} size={size} />
              ),
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
