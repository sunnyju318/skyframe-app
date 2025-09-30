// Bluesky(AT Protocol) 서버와 통신하는 클라이언트
import { AtpAgent } from "@atproto/api";
import Constants from "expo-constants";

// 블루스카이 에이전트 인스턴스 생성
/* 
service: 접속할 서버(PDS:Personal Data Server) 주소.
보통 공식 PDS는 https://bsky.social을 씀.
읽기 전용 퍼블릭 엔드포인트는 public.api.bsky.app이지만 
로그인이 필요한 요청(타임라인 등)은 bsky.social 같은 PDS에 붙는다.
*/
const agent = new AtpAgent({
  service: "https://bsky.social",
});

// 인증 정보 (실제 사용 시 환경변수나 안전한 곳에 저장)
const BLUESKY_IDENTIFIER = Constants.expoConfig?.extra?.blueskyIdentifier;
const BLUESKY_PASSWORD = Constants.expoConfig?.extra?.blueskyPassword;

// 환경변수 체크
if (!BLUESKY_IDENTIFIER || !BLUESKY_PASSWORD) {
  console.error("Bluesky credentials not found in environment variables");
}

// 로그인 함수
export const loginToBluesky = async () => {
  // async: 비동기 함수 (API 호출은 시간이 걸리므로), 로그인하는동안 앱전체가 멈출일은 없음
  // 함수선언 앞에 async를 붙이면 그 함수는 항상 Promise를 반환하는 함수가 된다
  try {
    await agent.login({
      identifier: BLUESKY_IDENTIFIER,
      password: BLUESKY_PASSWORD,
    });
    // try: 시도해 보는것으로 성공, 실패 모두 가능하다.
    // 먼저 agent.login()을 실행한다.
    // 성공하면 성공결과 반환
    console.log("Bluesky login successful");
    return { success: true };
  } catch (error) {
    // catch: try에서 에러 발생시에만 실행
    console.error("Bluesky login failed:", error);
    return { success: false, error: error.message };
  }
};

// 타임라인 피드 가져오기 (첫 번째 API 요청)
export const getTimelineFeed = async () => {
  try {
    // 로그인이 안되어 있으면 먼저 로그인
    // agent.session이 없다는 것은 아직 로그인 상태가 아님을 의미
    if (!agent.session) {
      const loginResult = await loginToBluesky();
      if (!loginResult.success) {
        throw new Error("Login failed");
      }
    }

    const response = await agent.getTimeline({
      limit: 50,
      // 최신 포스트 50개 가져오기
      // await: 서버가 응답할때까지 기다림
      // 결과 JSON은 response에 저장
    });

    // 이미지 있는 포스트만 필터링
    // .filter(...) : array method 조건을 만족하는 요소만 모아서 새로운 배열을 반환
    // ?. : 옵셔널 체이닝, images가 없을수도 있음, 그럴때 에러를 내지않고 undefined.
    // item.post.embed.images.length > 0 : embed가 이미지가 아닐수 있으므로 에러방지
    const postsWithImages = response.data.feed.filter(
      (item) => item.post.embed?.images && item.post.embed.images.length > 0
    );

    console.log("Posts with images:", postsWithImages.length);
    return postsWithImages;
  } catch (error) {
    console.error("Error fetching timeline:", error);
    throw error;
  }
};

// 포스트 검색하기 (두 번째 API 요청 - 다른 엔드포인트)
export const searchPosts = async (query) => {
  // query: 검색어(키워드, 해시태그 등)
  try {
    // 로그인이 안되어 있으면 먼저 로그인
    if (!agent.session) {
      const loginResult = await loginToBluesky();
      if (!loginResult.success) {
        throw new Error("Login failed");
      }
    }

    const response = await agent.app.bsky.feed.searchPosts({
      q: query, // 검색어(사용자가 입력한 키워드)
      limit: 50, // 최대 50개 결과 가져오기
    });

    const postsWithImages = response.data.posts.filter(
      (item) => item.embed?.images && item.embed.images.length > 0
    );

    console.log("Search results:", response.data.posts.length, "posts");
    return postsWithImages;
  } catch (error) {
    console.error("Error searching posts:", error);
    throw error;
  }
};
