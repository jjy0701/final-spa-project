import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';

export const useFavoritesStore = defineStore('favorites', () => {
  // 1. State: 브라우저 스토리지 데이터 파싱 또는 빈 배열 초기화 [cite: 49, 50]
  const savedFavorites = JSON.parse(localStorage.getItem('favorite_movies')) || [];
  const favoriteMovies = ref(savedFavorites);

  // 2. Getters: 데이터 계산 안내원 [cite: 51]
  const totalFavorites = computed(() => favoriteMovies.value.length); // [cite: 52]
  const averageRating = computed(() => {
    if (favoriteMovies.value.length === 0) return 0; // [cite: 55]
    const sum = favoriteMovies.value.reduce((acc, movie) => acc + movie.rating, 0); // [cite: 56, 57]
    return (sum / favoriteMovies.value.length).toFixed(1); // [cite: 58]
  });

  // 3. Actions: 데이터 수정 유일한 함수들 [cite: 64]
  const toggleFavorite = (movie) => {
    const index = favoriteMovies.value.findIndex((m) => m.id === movie.id); // [cite: 66]
    if (index === -1) {
      favoriteMovies.value.push(movie); // [cite: 67]
    } else {
      favoriteMovies.value.splice(index, 1); // [cite: 70]
    }
  };

  const clearAllFavorites = () => {
    favoriteMovies.value = []; // [cite: 71, 73]
  };

  // 4. Watch: 영구 저장 로직 [cite: 74]
  watch(
    favoriteMovies,
    (newVal) => {
      localStorage.setItem('favorite_movies', JSON.stringify(newVal)); // [cite: 79]
    },
    { deep: true } // 필수 옵션 [cite: 80]
  );

  return { favoriteMovies, totalFavorites, averageRating, toggleFavorite, clearAllFavorites }; // [cite: 84]
});