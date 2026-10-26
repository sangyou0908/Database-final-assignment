import express from "express";

const app = express();
app.use(express.json());

// 제공 데이터: SQL과 같은 가상 사용자 예시지만 자동으로 연결되지는 않습니다.
const favorites = [
  { id: 1, userId: "user-a", movieId: 101, memo: "주말에 볼 영화" },
  { id: 2, userId: "user-b", movieId: 101, memo: "친구가 추천한 영화" },
  { id: 3, userId: "user-a", movieId: 102, memo: "" },
  { id: 4, userId: "user-c", movieId: 103, memo: "다시 보고 싶은 영화" },
  { id: 5, userId: "user-a", movieId: 104, memo: "가족과 볼 영화" },
  { id: 6, userId: "user-b", movieId: 105, memo: "" },
  { id: 7, userId: "user-c", movieId: 101, memo: "OST가 좋은 영화" },
  { id: 8, userId: "user-a", movieId: 106, memo: "친구와 볼 영화" },
];

app.get("/", (req, res) => {
  res.json({ message: "MovieKeep 찜 API 서버입니다." });
});

// TODO 17 [과제 8]: app.get()으로 /api/favorites의 GET 요청을 등록하고
// res.json()으로 favorites 배열을 응답하세요.
app.get("/api/favorites", (req, res) => {
  res.json(favorites);
});

// TODO 18 [과제 8]: /api/favorite-count의 GET 요청을 등록하고
// favoriteCount 속성을 가진 객체를 응답하세요. 값은 favorites.length로 계산합니다.
app.get("/api/favorite-count", (req, res) => {
  const favoriteCount = favorites.length;
  res.json({ favoriteCount });
});

app.post("/api/favorites", (req, res) => {
  const { id, userId, movieId, memo } = req.body ?? {};

  // 필요한 데이터가 있는지 확인
  if (
    !Number.isInteger(id) ||
    typeof userId !== "string" ||
    !Number.isInteger(movieId)
  ) {
    return res.status(400).json({
      message: "정수 id, 문자열 userId, 정수 movieId가 필요합니다.",
    });
  }

  if (memo != null && typeof memo !== "string") {
    return res.status(400).json({
      message: "memo는 문자열이어야 합니다.",
    });
  }

  // 같은 ID가 있으면 추가하지 않음
  const existingFavorite = favorites.find((item) => item.id === id);

  if (existingFavorite) {
    return res.status(409).json({
      message: "이미 존재하는 ID입니다.",
    });
  }

  const newFavorite = {
    id,
    userId,
    movieId,
    memo: memo ?? "",
  };

  favorites.push(newFavorite);

  res.status(201).json({
    message: "찜 데이터를 추가했습니다.",
    added: newFavorite,
    favoriteCount: favorites.length,
  });
});

app.delete("/api/favorites/:id", (req, res) => {
  const id = Number(req.params.id);

  // 삭제할 데이터의 배열 위치 찾기
  const index = favorites.findIndex((item) => item.id === id);

  if (index === -1) {
    return res.status(404).json({
      message: "해당 ID의 데이터가 없습니다.",
    });
  }

  // 해당 위치에서 데이터 1개 제거
  const deleted = favorites.splice(index, 1)[0];

  res.json({
    message: "찜 데이터를 삭제했습니다.",
    deleted,
    favoriteCount: favorites.length,
  });
});

// TODO 전에는 /만 응답하며, 두 /api 경로의 Cannot GET(404)은 정상적인 미완성 상태입니다.
app.listen(4000, () => {
  console.log("서버 실행: http://localhost:4000");
});
