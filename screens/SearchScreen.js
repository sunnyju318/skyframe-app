// Home은 화면이 마운트 되자마자 자동으로 데이터를 가져와야 하므로 useEffect 사용
// Search는 사용자가 검색버튼을 눌러야 실행되므로 (사용자 액션 -> 이벤트 핸들러)

import { useState } from "react";
import {
  View,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Image,
} from "react-native";
import { Text, SearchBar } from "@rneui/themed";
import { searchPosts } from "../services/blueskyApi";

export default function SearchScreen({ navigation }) {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(true);
  // 처음엔 검색 전이니까 true
  // API 호출 완료 여부 (true: 로딩 끝, false: 로딩 중)
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // 빈 문자열은 false

  // trim() : 문자열 앞뒤 공백 제거하기, 공백만 입력했을 경우에도 검색을 시작하지 않도록 방지하는 역할
  // if () 안이 true이면 return 종료하라.
  // searchQuery.trim() 이 ""(초기값) -> falsy -> !fase = true : 종료하라
  // searchQuery.trim() 이 "apple" -> truthy -> !true = false : 진행하라
  const handleSearch = () => {
    if (!searchQuery.trim()) {
      return;
    }

    setIsLoaded(false); // API 로딩중
    setError(null); // 지난번 에러가 남아있지 않게 초기화

    searchPosts(searchQuery)
      // 실제로 API를 호출해서 검색 결과를 가져오기
      .then((result) => {
        setIsLoaded(true);
        setSearchResults(result);
      })
      .catch((error) => {
        setIsLoaded(true);
        setError(error);
      });
  };

  // bluesky api 응답구조
  /* 
getTimelineFeed():
response.data.feed = [
  { post: {...} },    
  { post: {...} },
]
searchPosts():
response.data.posts = [
  {...},              
  {...},
]
*/

  const renderItem = ({ item }) => {
    const image = item.embed?.images?.[0];
    const aspectRatio = image?.aspectRatio
      ? image.aspectRatio.width / image.aspectRatio.height
      : 1;

    return (
      <View style={styles.card}>
        {image && (
          <Image
            source={{ uri: image.thumb }}
            style={[styles.mainImage, { aspectRatio }]}
            resizeMode="cover"
          />
        )}
        <View style={styles.textContainer}>
          <Text style={styles.username}>
            {item.author.displayName || item.author.handle}
          </Text>
          {item.record.text && (
            <Text numberOfLines={2} style={styles.textPreview}>
              {item.record.text}
            </Text>
          )}
        </View>
      </View>
    );
  };

  const displayDataContainer = () => {
    if (error) {
      return <Text style={styles.errorText}>Error: {error.message}</Text>;
    } else if (!isLoaded) {
      return <ActivityIndicator size="large" color="#0000ff" />;
    } else if (searchResults.length === 0) {
      return <Text style={styles.infoText}>Search for posts on Bluesky</Text>;
    } else {
      return (
        <FlatList
          data={searchResults}
          keyExtractor={(item) => item.uri}
          renderItem={renderItem}
        />
      );
    }
  };

  return (
    <View style={styles.container}>
      <SearchBar
        placeholder="Search Bluesky..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        onSubmitEditing={handleSearch}
        platform="default"
        containerStyle={styles.searchContainer}
        inputContainerStyle={styles.searchInputContainer}
      />
      {displayDataContainer()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  searchContainer: {
    backgroundColor: "white",
    borderBottomColor: "#E1E8ED",
    borderTopColor: "#E1E8ED",
    padding: 10,
  },
  searchInputContainer: {
    backgroundColor: "#f5f5f5",
  },
  card: {
    backgroundColor: "white",
    marginHorizontal: 10,
    marginVertical: 5,
    borderRadius: 10,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  mainImage: {
    width: "100%",
  },
  textContainer: {
    padding: 15,
  },
  username: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 5,
  },
  textPreview: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
  infoText: {
    textAlign: "center",
    marginTop: 40,
    color: "#666",
    fontSize: 16,
  },
});
