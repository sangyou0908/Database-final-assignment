"use client";

import { useState } from "react";
import { useFavoritesStore } from "@/stores/favoritesStore";
import FavoriteMemo from "./FavoriteMemo";

export default function FavoriteList() {
  const favorites = useFavoritesStore((state) => state.favorites);

  const [filter, setFilter] = useState<"all" | "empty">("all");

  // 원본은 유지하고, 화면에 보여줄 목록만 만듭니다.
  const visibleFavorites =
    filter === "all"
      ? favorites
      : favorites.filter((favorite) => favorite.memo.trim() === "");

  return (
    <section>
      <h2>내 찜 목록</h2>

      <div>
        <button
          type="button"
          onClick={() => setFilter("all")}
          aria-pressed={filter === "all"}
        >
          전체 찜
        </button>

        <button
          type="button"
          onClick={() => setFilter("empty")}
          aria-pressed={filter === "empty"}
        >
          메모 없는 찜
        </button>
      </div>

      {visibleFavorites.length === 0 ? (
        <p>
          {filter === "all"
            ? "찜한 영화가 없습니다."
            : "메모가 없는 찜이 없습니다."}
        </p>
      ) : (
        visibleFavorites.map((favorite) => (
          <article key={`${favorite.userId}_${favorite.movieId}`}>
            <h3>영화 ID: {favorite.movieId}</h3>
            <FavoriteMemo favorite={favorite} />
          </article>
        ))
      )}
    </section>
  );
}
