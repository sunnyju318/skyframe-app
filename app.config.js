// dotenv 라이브러리 불러오기
// .env 파일에 적어둔 환경변수를 process.env에 자동으로 올려준다.
require("dotenv").config();

export default {
  expo: {
    // 기기 홈 화면에 뜨는 앱이름
    name: "SkyFrame",
    // Expo에서 프로젝트 고유경로
    slug: "skyframe",
    // 앱 버전관리용
    version: "1.0.0",
    // 앱이 실행될 플랫폼
    platforms: ["ios", "android"],
    // extra: Expo에서 제공하는 커스텀 환경변수 저장소
    // 여기 들어간 값은 앱 안에서 expo-constants 같은 API로 접근할수 있다.
    extra: {
      blueskyIdentifier: process.env.BLUESKY_IDENTIFIER,
      blueskyPassword: process.env.BLUESKY_PASSWORD,
    },
  },
};
