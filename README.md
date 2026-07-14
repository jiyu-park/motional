# MOTIONAL

감정을 기록하고 Calendar에서 감정 흐름을 확인하는 React Native/Expo 앱입니다.

## 26.07.14 작업 내용 요약

- 공통 디자인 토큰과 버튼·카드·태그 UI 컴포넌트를 구성했습니다.
- 감정·활동 도메인 타입과 옵션 데이터를 공통 파일에서 관리합니다.
- Zustand와 AsyncStorage를 연결해 감정 기록의 저장·조회·수정·삭제 및 앱 재실행 후 복원을 구현했습니다.
- 날짜별 신규 기록과 기존 기록 편집 흐름을 Mood 화면에 연결했습니다.
- 월간 Calendar에서 기록 날짜의 감정 아이콘과 상세 내용을 확인하고 기록을 추가·수정·삭제할 수 있습니다.

## 개발 환경

- Node.js 및 npm
- Expo SDK 57
- Android 실행 시 Android Studio 또는 Expo Go
- iOS 시뮬레이터 실행 시 macOS와 Xcode

## 처음 실행하기

저장소 루트로 이동합니다.

```powershell
cd D:\new_workspace\motional
```

의존성을 설치합니다.

```powershell
npm.cmd install
```

Expo 개발 서버를 실행합니다.

```powershell
npm.cmd start
```

터미널에 QR 코드와 실행 옵션이 표시됩니다.

- `w`: 웹 브라우저에서 실행
- `a`: Android 에뮬레이터에서 실행
- Expo Go: 휴대폰으로 QR 코드 스캔

서버를 종료하려면 실행 중인 터미널에서 `Ctrl + C`를 누릅니다.

## 플랫폼별 실행

### 웹

```powershell
npm.cmd run web
```

기본 주소는 다음과 같습니다.

```text
http://localhost:8081
```

### Android

Android 에뮬레이터를 먼저 실행하거나 USB 디버깅이 활성화된 기기를 연결합니다.

```powershell
npm.cmd run android
```

### iOS

iOS 시뮬레이터는 macOS에서 실행할 수 있습니다.

```bash
npm run ios
```

## 주요 화면

- `/`: Home
- `/mood`: 감정 기록
- `/calendar`: 감정 Calendar
- `/music`: 음악 준비 화면
- `/stats`: 통계 준비 화면
- `/settings`: 설정 준비 화면

Home 또는 Calendar의 기록 버튼을 누르면 감정 기록 화면으로 이동합니다. 감정과 선택적 활동·메모를 저장하면 Calendar에서 바로 확인할 수 있습니다.

## HTML 프로토타입 미리보기

`home.html`과 `ref/`의 정적 HTML을 별도로 확인하려면 다음 명령을 실행합니다.

```powershell
python -m http.server 4173 --bind 127.0.0.1
```

브라우저에서 다음 주소로 접속합니다.

```text
http://127.0.0.1:4173/home.html
```

HTML 미리보기 서버도 `Ctrl + C`로 종료합니다.

## 코드 검사

```powershell
npm.cmd run lint
npx.cmd tsc --noEmit
npx.cmd expo-doctor
```

웹 배포 번들 생성 여부는 다음 명령으로 확인할 수 있습니다.

```powershell
npx.cmd expo export --platform web
```

## 문제 해결

### PowerShell에서 npm 실행이 차단될 때

다음과 같은 오류가 나오면 `npm` 대신 `npm.cmd`, `npx` 대신 `npx.cmd`를 사용합니다.

```text
이 시스템에서 스크립트를 실행할 수 없으므로 npm.ps1 파일을 로드할 수 없습니다.
```

### 포트가 이미 사용 중일 때

다른 포트로 Expo를 실행합니다.

```powershell
npx.cmd expo start --web --port 8082
```

### 화면 변경이 반영되지 않을 때

Expo 터미널에서 `r`을 눌러 다시 로드합니다. 캐시를 초기화해야 한다면 서버를 종료한 뒤 다음 명령을 실행합니다.

```powershell
npx.cmd expo start --clear
```
