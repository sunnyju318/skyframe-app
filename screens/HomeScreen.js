import { useState, useEffect } from "react";
import { View, FlatList, ActivityIndicator, StyleSheet } from "react-native";
// FlatList: 긴 데이터 목록을 스크롤 가능하게 보여주는 컴포넌트 (리스트 최적화)
// ActivityIndicator: 로딩 스피너
import { Text, Image } from "@rneui/themed";
import { getTimelineFeed } from "../services/blueskyApi";

export default function HomeScreen({ navigation }) {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  // API 호출 완료 여부 (true: 로딩 끝, false: 로딩 중)
  const [feedData, setFeedData] = useState([]);
  // 실제 피드 데이터 배열

  // API 호출하기
  useEffect(() => {
    getTimelineFeed()
      .then((result) => {
        // 여기서 result는 매개변수
        // console.log("Bluesky feed data sample:", result[0]);
        // console.log("First item:", JSON.stringify(result[1], null, 2));
        /* console.log(
          "Images in first item:",
         JSON.stringify(result[1]?.post?.embed?.images, null, 2)); */

        setIsLoaded(true);
        setFeedData(result);
      })
      .catch((error) => {
        setIsLoaded(true);
        setError(error);
      });
  }, []);

  const renderItem = ({ item }) => {
    // 이미지 비율 계산
    const image = item.post.embed?.images?.[0];
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
            {item.post.author.displayName || item.post.author.handle}
          </Text>
          {item.post.record.text && (
            <Text numberOfLines={2} style={styles.textPreview}>
              {item.post.record.text}
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
    } else {
      return (
        <FlatList
          data={feedData}
          keyExtractor={(item) => item.post.uri}
          renderItem={renderItem}
        />
      );
    }
  };

  return <View style={styles.container}>{displayDataContainer()}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    padding: 0,
    margin: 10,
    borderRadius: 10,
    overflow: "hidden",
  },
  mainImage: {
    width: "100%",
    maxHeight: 400,
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
});
