# SQL 실행 결과

실행 순서: 완성한 00-setup → 01-queries → 00-setup → 02-crud → 00-setup → 03-constraints.
각 항목에 실제 실행한 SQL과 실제 결과(텍스트 또는 캡처)를 첨부하세요.
예상 결과를 그대로 복사한 것만으로 실행을 확인할 수 없습니다.

## 준비: 외래 키 1 / 영화 6건 / 찜 8건

╭──────────────╮
│ foreign_keys │
╞══════════════╡
│ 1 │
╰──────────────╯
╭─────┬────────────────────╮
│ id │ title │
╞═════╪════════════════════╡
│ 101 │ 인셉션 │
│ 102 │ 인터스텔라 │
│ 103 │ 다크 나이트 │
│ 104 │ 테넷 │
│ 105 │ 어벤져스 │
│ 106 │ 어벤져스: 엔드게임 │
╰─────┴────────────────────╯
╭────┬────────┬─────────┬─────────────────────╮
│ id │ userId │ movieId │ memo │
╞════╪════════╪═════════╪═════════════════════╡
│ 1 │ user-a │ 101 │ 주말에 볼 영화 │
│ 2 │ user-b │ 101 │ 친구가 추천한 영화 │
│ 3 │ user-a │ 102 │ │
│ 4 │ user-c │ 103 │ 다시 보고 싶은 영화 │
│ 5 │ user-a │ 104 │ 가족과 볼 영화 │
│ 6 │ user-b │ 105 │ │
│ 7 │ user-c │ 101 │ OST가 좋은 영화 │
│ 8 │ user-a │ 106 │ 친구와 볼 영화 │
╰────┴────────┴─────────┴─────────────────────╯

## 조건 조회 05·06·07·08

SQLite-3.54 fiddle.sqlite3-> SELECT userId, memo
FROM favorites
WHERE movieId = '101';
╭────────┬────────────────────╮
│ userId │ memo │
╞════════╪════════════════════╡
│ user-a │ 주말에 볼 영화 │
│ user-b │ 친구가 추천한 영화 │
│ user-c │ OST가 좋은 영화 │
╰────────┴────────────────────╯
SQLite-3.54 fiddle.sqlite3-> SELECT memo
FROM favorites
WHERE udrtId = 'user-a' AND movieId = '104';
Parse error near line 1: no such column: udrtId
SELECT memo FROM favorites WHERE udrtId = 'user-a' AND movieId = '104';
error here ---^
SQLite-3.54 fiddle.sqlite3-> SELECT memo
FROM favorites
WHERE userId = 'user-a' AND movieId = '104';
╭────────────────╮
│ memo │
╞════════════════╡
│ 가족과 볼 영화 │
╰────────────────╯
SQLite-3.54 fiddle.sqlite3-> SELECT movieId, memo
FROM favorites
WHERE userId = 'user-c'
ORDER BY movieId DESC;
╭─────────┬─────────────────────╮
│ movieId │ memo │
╞═════════╪═════════════════════╡
│ 103 │ 다시 보고 싶은 영화 │
│ 101 │ OST가 좋은 영화 │
╰─────────┴─────────────────────╯
SQLite-3.54 fiddle.sqlite3-> SELECT movieId, memo
FROM favorites
WHERE userId = 'user-c'
ORDER BY movieId DESC
LIMIT 1;
╭─────────┬─────────────────────╮
│ movieId │ memo │
╞═════════╪═════════════════════╡
│ 103 │ 다시 보고 싶은 영화 │
╰─────────┴─────────────────────╯

## 빈 메모 JOIN·전체 집계·사용자별 집계 14·15·16

SQLite-3.54 fiddle.sqlite3-> SELECT favorites.userId, movies.title, favorites.memo
FROM favorites
JOIN movies ON favorites.movieId = movies.id
WHERE favorites.memo = ''
ORDER BY favorites.id ASC;
╭────────┬────────────┬──────╮
│ userId │ title │ memo │
╞════════╪════════════╪══════╡
│ user-a │ 인터스텔라 │ │
│ user-b │ 어벤져스 │ │
╰────────┴────────────┴──────╯
SQLite-3.54 fiddle.sqlite3-> SELECT favorites.memo, COUNT(_) AS emptyMemoCount
FROM favorites;
╭────────────────┬────────────────╮
│ memo │ emptyMemoCount │
╞════════════════╪════════════════╡
│ 주말에 볼 영화 │ 8 │
╰────────────────┴────────────────╯
SQLite-3.54 fiddle.sqlite3-> SELECT COUNT(_) AS emptyMemoCount
FROM favorites
WHERE favorites.memo = '';
╭────────────────╮
│ emptyMemoCount │
╞════════════════╡
│ 2 │
╰────────────────╯
SQLite-3.54 fiddle.sqlite3-> SELECT userId COUNT(_) AS emptyMemoCount
FROM favorites
WHERE memo = ''
GROUP BY userId
ORDER BY userId ASC;
Parse error near line 1: near "(": syntax error
SELECT userId COUNT(_) AS emptyMemoCount FROM favorites WHERE memo = '' GROUP
^--- error here
SQLite-3.54 fiddle.sqlite3-> SELECT userId, COUNT(\_) AS emptyMemoCount
FROM favorites
WHERE memo = ''
GROUP BY userId
ORDER BY userId ASC;
╭────────┬────────────────╮
│ userId │ emptyMemoCount │
╞════════╪════════════════╡
│ user-a │ 1 │
│ user-b │ 1 │
╰────────┴────────────────╯

## CRUD 09·10·11

추가: 9건 / 수정: id 30의 memo만 변경 / 삭제: 초기 8건 복원
SQLite-3.54 fiddle.sqlite3-> SELECT _ FROM favorites ORDER BY id ASC;
SELECT COUNT(_) AS favoriteCount FROM favorites;
SELECT _ FROM movies WHERE id = 106;
╭────┬────────┬─────────┬─────────────────────╮
│ id │ userId │ movieId │ memo │
╞════╪════════╪═════════╪═════════════════════╡
│ 1 │ user-a │ 101 │ 주말에 볼 영화 │
│ 2 │ user-b │ 101 │ 친구가 추천한 영화 │
│ 3 │ user-a │ 102 │ │
│ 4 │ user-c │ 103 │ 다시 보고 싶은 영화 │
│ 5 │ user-a │ 104 │ 가족과 볼 영화 │
│ 6 │ user-b │ 105 │ │
│ 7 │ user-c │ 101 │ OST가 좋은 영화 │
│ 8 │ user-a │ 106 │ 친구와 볼 영화 │
│ 41 │ user-b │ 106 │ │
╰────┴────────┴─────────┴─────────────────────╯
╭───────────────╮
│ favoriteCount │
╞═══════════════╡
│ 9 │
╰───────────────╯
╭─────┬────────────────────╮
│ id │ title │
╞═════╪════════════════════╡
│ 106 │ 어벤져스: 엔드게임 │
╰─────┴────────────────────╯
SQLite-3.54 fiddle.sqlite3-> INSERT INTO favorites (id, userId, movieId)
VALUES (30, 'user-b', 106);
SQLite-3.54 fiddle.sqlite3-> SELECT * FROM favorites WHERE id = 30;
╭────┬────────┬─────────┬──────╮
│ id │ userId │ movieId │ memo │
╞════╪════════╪═════════╪══════╡
│ 30 │ user-b │ 106 │ │
╰────┴────────┴─────────┴──────╯
SQLite-3.54 fiddle.sqlite3-> UPDATE favorites
SET memo = '주말에 다시 보기'
WHERE id = 30;
SQLite-3.54 fiddle.sqlite3-> SELECT * FROM favorites WHERE id = 30;
╭────┬────────┬─────────┬──────────────────╮
│ id │ userId │ movieId │ memo │
╞════╪════════╪═════════╪══════════════════╡
│ 30 │ user-b │ 106 │ 주말에 다시 보기 │
╰────┴────────┴─────────┴──────────────────╯
SQLite-3.54 fiddle.sqlite3-> DELETE FROM favorites
WHERE id = 41;
SQLite-3.54 fiddle.sqlite3-> SELECT _ FROM favorites ORDER BY id ASC;
╭────┬────────┬─────────┬─────────────────────╮
│ id │ userId │ movieId │ memo │
╞════╪════════╪═════════╪═════════════════════╡
│ 1 │ user-a │ 101 │ 주말에 볼 영화 │
│ 2 │ user-b │ 101 │ 친구가 추천한 영화 │
│ 3 │ user-a │ 102 │ │
│ 4 │ user-c │ 103 │ 다시 보고 싶은 영화 │
│ 5 │ user-a │ 104 │ 가족과 볼 영화 │
│ 6 │ user-b │ 105 │ │
│ 7 │ user-c │ 101 │ OST가 좋은 영화 │
│ 8 │ user-a │ 106 │ 친구와 볼 영화 │
╰────┴────────┴─────────┴─────────────────────╯

## 제약조건 A·B·C·D

### 각 SQL, 성공/실패, 실제 오류 메시지, 이유를 기록하세요.

INSERT INTO favorites (id, userId, movieId)
VALUES (40, 'user-a', 101);
Error near line 1: UNIQUE constraint failed: favorites.userId, favorites.movieId
---> 실패한 이유: 이미 존재하는 user-a의 영화 101을 중복으로 등록 시도를 했기 때문. (UNIQUE 제약 조건)

SQLite-3.54 fiddle.sqlite3-> INSERT INTO favorites (id, userId, movieId)
VALUES (41, 'user-b', 106);
---> 성공적으로 처리됨

SQLite-3.54 fiddle.sqlite3-> INSERT INTO favorites (id, userId, movieId)
VALUES (42, 'user-b', 999);
Error near line 1: FOREIGN KEY constraint failed
---> movies table에 존재하지 않는 영화 id를 참조했기 때문. (FK 제약조건)

SQLite-3.54 fiddle.sqlite3-> DELETE FROM movies
WHERE id = 106;
Error near line 1: FOREIGN KEY constraint failed
---> 영화 106을 이미 찜한 데이터가 존재하기 때문에, 외래키 제약조건에 의해 삭제 불가 (FK 제약조건)

### D 직후 찜 9건과 영화 106 유지, 정리 후 초기 8건을 확인하세요.

SQLite-3.54 fiddle.sqlite3-> SELECT _ FROM favorites ORDER BY id ASC;
SELECT COUNT(_) AS favoriteCount FROM favorites;
SELECT _ FROM movies WHERE id = 106;
╭────┬────────┬─────────┬─────────────────────╮
│ id │ userId │ movieId │ memo │
╞════╪════════╪═════════╪═════════════════════╡
│ 1 │ user-a │ 101 │ 주말에 볼 영화 │
│ 2 │ user-b │ 101 │ 친구가 추천한 영화 │
│ 3 │ user-a │ 102 │ │
│ 4 │ user-c │ 103 │ 다시 보고 싶은 영화 │
│ 5 │ user-a │ 104 │ 가족과 볼 영화 │
│ 6 │ user-b │ 105 │ │
│ 7 │ user-c │ 101 │ OST가 좋은 영화 │
│ 8 │ user-a │ 106 │ 친구와 볼 영화 │
│ 41 │ user-b │ 106 │ │
╰────┴────────┴─────────┴─────────────────────╯
╭───────────────╮
│ favoriteCount │
╞═══════════════╡
│ 9 │
╰───────────────╯
╭─────┬────────────────────╮
│ id │ title │
╞═════╪════════════════════╡
│ 106 │ 어벤져스: 엔드게임 │
╰─────┴────────────────────╯
SQLite-3.54 fiddle.sqlite3-> DELETE FROM favorites
WHERE id = 41;
SQLite-3.54 fiddle.sqlite3-> SELECT _ FROM favorites ORDER BY id ASC;
╭────┬────────┬─────────┬─────────────────────╮
│ id │ userId │ movieId │ memo │
╞════╪════════╪═════════╪═════════════════════╡
│ 1 │ user-a │ 101 │ 주말에 볼 영화 │
│ 2 │ user-b │ 101 │ 친구가 추천한 영화 │
│ 3 │ user-a │ 102 │ │
│ 4 │ user-c │ 103 │ 다시 보고 싶은 영화 │
│ 5 │ user-a │ 104 │ 가족과 볼 영화 │
│ 6 │ user-b │ 105 │ │
│ 7 │ user-c │ 101 │ OST가 좋은 영화 │
│ 8 │ user-a │ 106 │ 친구와 볼 영화 │
╰────┴────────┴─────────┴─────────────────────╯
