<script setup>
import { useMovieStore } from '../stores/movieStore';

const store = useMovieStore();
</script>

<template>
  <main class="page">
    <div class="header-section">
      <h1>❤️ 찜 목록</h1>
      <p class="sub-title">내가 선택한 영화만 모아보는 페이지입니다.</p>
    </div>

    <div v-if="store.favorites.length === 0" class="empty-message">
      아직 찜한 영화가 없습니다.
    </div>

    <div v-else class="favorite-list">
      <div
        v-for="movie in store.favorites"
        :key="movie.id"
        class="favorite-card"
      >
        <img
          v-if="movie.poster_path"
          :src="`https://image.tmdb.org/t/p/w500${movie.poster_path}`"
          :alt="movie.title"
          class="poster"
        />

        <div v-else class="poster-placeholder">
          이미지 준비 중
        </div>

        <div class="card-content">
          <h3 class="title">{{ movie.title }}</h3>

          <p class="release-date" v-if="movie.release_date">
            📅 개봉일: {{ movie.release_date }}
          </p>

          <p class="rating">
            ⭐ {{ movie.vote_average.toFixed(1) }} / 10
          </p>

          <p class="overview">
            {{
              movie.overview
                ? movie.overview.substring(0, 80) + '...'
                : '국내에 등록된 줄거리 요약 정보가 없습니다.'
            }}
          </p>

          <div class="button-row">
            <RouterLink
              :to="`/movies/${movie.id}`"
              class="detail-btn"
            >
              상세 보기
            </RouterLink>

            <button
              @click="store.removeFavorite(movie.id)"
              class="remove-btn"
            >
              찜 해제
            </button>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.page {
  padding: 40px;
  background-color: #f8f9fa;
  min-height: 100vh;
}

.header-section {
  margin-bottom: 30px;
  text-align: center;
  color: #2c3e50;
}

.sub-title {
  font-size: 14px;
  color: #7f8c8d;
  margin-top: 5px;
}

.empty-message {
  text-align: center;
  padding: 60px;
  background: white;
  border-radius: 12px;
  font-size: 18px;
  font-weight: bold;
  color: #7f8c8d;
}

.favorite-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 30px;
}

.favorite-card {
  border-radius: 12px;
  overflow: hidden;
  background: white;
  text-align: left;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
}

.poster {
  width: 100%;
  height: 380px;
  object-fit: cover;
}

.poster-placeholder {
  width: 100%;
  height: 380px;
  background-color: #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #7f8c8d;
  font-weight: bold;
}

.card-content {
  padding: 20px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.title {
  font-size: 18px;
  color: #333;
  margin: 0 0 6px 0;
  font-weight: bold;
}

.release-date {
  font-size: 13px;
  color: #7f8c8d;
  margin-bottom: 10px;
  font-weight: 500;
}

.rating {
  font-weight: bold;
  color: #f39c12;
  margin-bottom: 10px;
  font-size: 16px;
}

.overview {
  font-size: 13px;
  color: #555;
  line-height: 1.4;
  margin-bottom: 20px;
  flex-grow: 1;
}

.button-row {
  display: flex;
  gap: 10px;
  margin-top: auto;
}

.detail-btn,
.remove-btn {
  flex: 1;
  padding: 12px;
  border-radius: 8px;
  font-weight: bold;
  font-size: 14px;
  text-align: center;
  text-decoration: none;
  cursor: pointer;
}

.detail-btn {
  background: #1e272e;
  color: white;
}

.remove-btn {
  border: none;
  background: #ff4757;
  color: white;
}
</style>