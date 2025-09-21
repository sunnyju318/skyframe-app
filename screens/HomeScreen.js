import { View, Text, Button } from "react-native";

export default function HomeScreen({ navigation }) {
  return (
    <View>
      <Text>HomeScreen</Text>
      <Button
        title="Go to Search Screen"
        onPress={() => navigation.navigate("Search")}
      />
    </View>
  );
}
