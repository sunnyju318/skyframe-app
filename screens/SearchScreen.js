import { View, Text, Button } from "react-native";

export default function SearchScreen({ navigation }) {
  return (
    <View>
      <Text>SearchScreen</Text>
      <Button title="Go to Home" onPress={() => navigation.navigate("Home")} />
    </View>
  );
}
