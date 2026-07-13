# MOTIONAL 개발 지침

## 프로젝트 개요

MOTIONAL은 사용자가 감정을 기록하고, 캘린더에서 감정 흐름을 확인하며, 감정에 맞는 플레이리스트를 추천받는 모바일 앱이다.

현재 구조:

```text
MOTIONAL/
└─ ref/
   ├─ dashboard.html
   ├─ mood_calendar.html
   ├─ mood_playlist.html
   └─ mood.html
```

`ref/`의 HTML 파일은 Google Stitch 디자인 참고용이다.

---

## 기본 규칙

- `ref/` 폴더와 내부 파일은 수정, 이동, 삭제하지 않는다.
- `MOTIONAL` 안에 중첩된 새 `MOTIONAL` 폴더를 만들지 않는다.
- `package.json`, `app/`, `components/` 등 실제 앱 파일은 현재 루트에 둔다.
- HTML을 WebView로 띄우지 않는다.
- 웹 태그나 DOM API를 사용하지 않는다.
- React Native 컴포넌트로 다시 구현한다.
- Android와 iOS를 모두 지원한다.
- 요청받은 작업만 수행하고 다음 단계로 임의 진행하지 않는다.
- 삭제, 대규모 덮어쓰기, 외부 폴더 접근이 필요하면 먼저 확인한다.
- 서버, 로그인, AI API, 실제 음악 스트리밍은 요청 전까지 추가하지 않는다.

---

## 기술 스택

- React Native
- Expo
- TypeScript
- Expo Router
- Zustand
- AsyncStorage
- React Native StyleSheet

Expo 패키지는 가능하면 다음 명령으로 설치한다.

```bash
npx expo install <package>
```

---

## 화면 구성

### 홈 화면

- 오늘의 감정 체크인
- 최근 감정 요약
- 오늘의 mock 음악 추천
- 이번 주 요약과 최근 기록
- 우측 상단 Profile 아이콘

### `dashboard.html`

- 통계 화면
- 최근 감정 흐름과 분포
- 활동 요약
- 주간 인사이트

### `mood_calendar.html`

- 월간 감정 캘린더
- 날짜별 감정 표시
- 날짜 선택
- 감정 기록 화면 이동

### `mood.html`

- 감정 선택
- 활동 태그 선택
- 메모 입력
- 감정 저장

### `mood_playlist.html`

- 현재 감정
- 오늘의 추천 음악
- 추천 플레이리스트
- 활동 태그

---

## 권장 구조

```text
app/
├─ _layout.tsx
├─ mood.tsx
├─ settings.tsx
└─ (tabs)/
   ├─ _layout.tsx
   ├─ index.tsx
   ├─ calendar.tsx
   ├─ music.tsx
   ├─ stats.tsx

components/
constants/
data/
store/
types/
```

하단 탭:

- Home
- Calendar
- Music
- Stats

Profile은 각 탭 화면 우측 상단 아이콘을 통해 `settings.tsx`로 이동한다.

---

## 핵심 흐름

```text
대시보드 또는 캘린더
→ 감정 기록
→ 감정 선택
→ 활동 태그 선택
→ 메모 입력
→ 저장
→ 캘린더에 반영
→ 감정별 mock 플레이리스트 표시
```

---

## 데이터 모델

```ts
export type MoodEntry = {
  id: string;
  date: string;
  mood: string;
  activities: string[];
  note?: string;
  createdAt: string;
  updatedAt: string;
};
```

날짜 형식:

- `date`: `YYYY-MM-DD`
- `createdAt`, `updatedAt`: ISO 문자열

---

## 상태 관리

- Zustand로 감정 기록 상태를 관리한다.
- AsyncStorage로 데이터를 저장한다.
- 저장 로직은 화면 컴포넌트에 직접 흩어놓지 않는다.
- 앱 재실행 후에도 기록이 유지되어야 한다.
- 저장 데이터 오류가 있어도 앱이 종료되지 않게 처리한다.
- 플레이리스트는 감정별 mock 데이터로 구현한다.

---

## UI 구현 규칙

- `View`, `Text`, `Pressable`, `Image`, `TextInput`, `ScrollView`, `FlatList` 등을 사용한다.
- 공통 색상, 간격, 글자 크기, radius는 `constants/theme.ts`에서 관리한다.
- 감정 아이콘, 카드, 활동 태그, 버튼은 재사용 컴포넌트로 분리한다.
- Stitch의 파스텔 색상과 둥근 카드 디자인을 최대한 유지한다.
- 작은 화면에서도 사용할 수 있도록 Safe Area와 ScrollView를 적용한다.
- 키보드가 입력창과 저장 버튼을 가리지 않게 처리한다.
- 아이콘만 있는 버튼에는 접근성 레이블을 넣는다.
- 외부 이미지 URL에 의존하지 않는다.
- 필요한 이미지가 없으면 Expo 아이콘, emoji, placeholder를 사용한다.

---

## 작업 순서

### 1. Expo 초기화

- 현재 루트에 Expo + TypeScript + Expo Router 프로젝트 생성
- 필요하면 임시 폴더에서 생성 후 루트로 이동
- `ref/` 유지 확인
- 기본 실행 확인

### 2. 화면 구현

- HTML 4개 분석
- 공통 theme와 컴포넌트 생성
- React Native 화면 구현
- 화면 이동 연결

### 3. 기능 구현

- 감정 선택
- 활동 태그 선택
- 메모 입력
- Zustand와 AsyncStorage 연결
- 캘린더와 플레이리스트 반영

### 4. 검증

```bash
npm run lint
npx tsc --noEmit
npx expo-doctor
npx expo start
```

실행하지 못한 검증은 성공했다고 말하지 말고 이유를 남긴다.

---

## Git 규칙

- 작업 전후 `git status`를 확인한다.
- 요청 없이 commit, push, branch 변경을 하지 않는다.
- 다음 명령은 실행하지 않는다.

```bash
git reset --hard
git clean -fd
git push --force
```

- `node_modules/`, `.expo/`, 빌드 결과물, `.env`는 Git에 포함하지 않는다.
- 기존 사용자 변경 사항을 임의로 되돌리지 않는다.

---

## 완료 보고

작업 완료 후 아래만 간단히 정리한다.

- 구현한 내용
- 변경한 주요 파일
- 실행한 검증
- 남은 문제 또는 다음 작업
