<script setup>
import { onMounted, ref, computed } from 'vue';
import { useMovieStore } from '../stores/movieStore';

const store = useMovieStore();

const searchKeyword = ref('');
const sortOption = ref('none');
const currentPage = ref(1);
const moviesPerPage = 8;

onMounted(() => {
  store.fetchMovies();
  document.title = '🍿 국내 극장 화제작 (인기순)';
});

const searchedMovies = computed(() => {
  const keyword = searchKeyword.value.trim().toLowerCase();

  if (!keyword) {
    return store.movies;
  }

  return store.movies.filter((movie) => {
    return movie.title.toLowerCase().includes(keyword);
  });
});

const sortedMovies = computed(() => {
  const copiedMovies = [...searchedMovies.value];

  if (sortOption.value === 'title') {
    return copiedMovies.sort((a, b) => {
      return a.title.localeCompare(b.title, 'ko-KR');
    });
  }

  if (sortOption.value === 'releaseDate') {
    return copiedMovies.sort((a, b) => {
      return new Date(b.release_date || '1900-01-01') - new Date(a.release_date || '1900-01-01');
    });
  }

  if (sortOption.value === 'rating') {
    return copiedMovies.sort((a, b) => {
      return b.vote_average - a.vote_average;
    });
  }

  return copiedMovies;
});

const totalPages = computed(() => {
  return Math.ceil(sortedMovies.value.length / moviesPerPage);
});

const paginatedMovies = computed(() => {
  const startIndex = (currentPage.value - 1) * moviesPerPage;
  const endIndex = startIndex + moviesPerPage;

  return sortedMovies.value.slice(startIndex, endIndex);
});

const changeSortOption = (option) => {
  sortOption.value = option;
  currentPage.value = 1;
};

const resetPage = () => {
  currentPage.value = 1;
};

const changePage = (pageNumber) => {
  currentPage.value = pageNumber;
};
</script>

<template>
  <main class="page">
    <div class="header-section">
      <h1>🍿 국내 극장 화제작 (인기순)</h1>
      <p class="sub-title">2025년 이후 국내 정식 개봉한 실시간 인기 상영작</p>
    </div>

    <div v-if="store.isLoading" class="status-message loading">
      ⏳ 실시간 국내 개봉작 데이터를 싣고 오는 중입니다...
    </div>

    <div v-else-if="store.errorMessage" class="status-message error">
      🚨 {{ store.errorMessage }}
    </div>

    <div v-else>
      <section class="control-section">
        <div class="search-box">
          <input
            v-model="searchKeyword"
            @input="resetPage"
            type="text"
            placeholder="영화 제목을 검색하세요"
            class="search-input"
          />
        </div>

        <div class="sort-buttons">
          <button
            @click="changeSortOption('title')"
            :class="{ active: sortOption === 'title' }"
            class="sort-btn"
          >
            제목순
          </button>

          <button
            @click="changeSortOption('releaseDate')"
            :class="{ active: sortOption === 'releaseDate' }"
            class="sort-btn"
          >
            개봉일순
          </button>

          <button
            @click="changeSortOption('rating')"
            :class="{ active: sortOption === 'rating' }"
            class="sort-btn"
          >
            평점순
          </button>
        </div>

        <p class="result-count">
          검색 결과 {{ sortedMovies.length }}개
        </p>
      </section>

      <div v-if="sortedMovies.length === 0" class="status-message empty">
        검색 조건에 맞는 영화가 없습니다.
      </div>

      <div v-else>
        <div class="movie-list">
          <div v-for="movie in paginatedMovies" :key="movie.id" class="movie-card">
            <img
              v-if="movie.poster_path"
              :src="`https://image.tmdb.org/t/p/w500${movie.poster_path}`"
              :alt="movie.title"
              class="poster"
            />

            <div v-else class="poster-placeholder">이미지 준비 중</div>

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
                    ? movie.overview.substring(0, 60) + '...'
                    : '국내에 등록된 줄거리 요약 정보가 없습니다.'
                }}
              </p>

              <button
                @click.stop="store.toggleFavorite(movie.id)"
                :class="{ active: movie.isFavorite }"
                class="fav-btn"
              >
                {{ movie.isFavorite ? '❤️ 찜 해제' : '🤍 찜하기' }}
              </button>
            </div>

            <RouterLink
              :to="`/movies/${movie.id}`"
              class="stretched-link"
              :aria-label="`${movie.title} 상세 정보 보기`"
            />
          </div>
        </div>

        <div class="pagination">
          <button
            v-for="pageNumber in totalPages"
            :key="pageNumber"
            @click="changePage(pageNumber)"
            :class="{ active: currentPage === pageNumber }"
            class="page-btn"
          >
            {{ pageNumber }}
          </button>
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

.status-message {
  text-align: center;
  font-size: 20px;
  font-weight: bold;
  padding: 50px;
  border-radius: 12px;
}

.loading {
  color: #3498db;
  background-color: #e3f2fd;
}

.error {
  color: #e74c3c;
  background-color: #fdeaea;
}

.empty {
  color: #7f8c8d;
  background-color: #ffffff;
}

.control-section {
  background: white;
  padding: 24px;
  border-radius: 14px;
  margin-bottom: 30px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.04);
}

.search-box {
  margin-bottom: 18px;
}

.search-input {
  width: 100%;
  padding: 14px 16px;
  border: 1px solid #dcdde1;
  border-radius: 10px;
  font-size: 16px;
  box-sizing: border-box;
}

.search-input:focus {
  outline: none;
  border-color: #ff4757;
}

.sort-buttons {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.sort-btn {
  padding: 10px 18px;
  border: none;
  border-radius: 8px;
  background: #ecf0f1;
  color: #333;
  font-weight: bold;
  cursor: pointer;
}

.sort-btn.active {
  background: #ff4757;
  color: white;
}

.result-count {
  margin: 16px 0 0 0;
  font-size: 14px;
  color: #7f8c8d;
  font-weight: bold;
}

.movie-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 30px;
}

.movie-card {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  background: white;
  text-align: left;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease;
  display: flex;
  flex-direction: column;
}

.movie-card:hover {
  transform: translateY(-5px);
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
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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

.fav-btn {
  position: relative;
  z-index: 2;
  width: 100%;
  padding: 12px;
  cursor: pointer;
  border: none;
  background: #ecf0f1;
  color: #333;
  border-radius: 8px;
  font-weight: bold;
  font-size: 14px;
  transition: 0.3s;
  margin-top: auto;
}

.fav-btn.active {
  background: #ff4757;
  color: white;
}

.stretched-link {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
}

.pagination {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 40px;
}

.page-btn {
  min-width: 42px;
  height: 42px;
  border: none;
  border-radius: 8px;
  background: #ecf0f1;
  color: #333;
  font-weight: bold;
  cursor: pointer;
}

.page-btn.active {
  background: #1e272e;
  color: white;
}
</style>