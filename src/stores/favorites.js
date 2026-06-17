// 10주차 Pinia 실습 때 작성한 찜 목록 전용 스토어 파일입니다.
// 현재 최종 프로젝트에서는 movieStore.js의 favorites를 사용하므로 이 파일은 보존용입니다.

import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';

export const useFavoritesStore = defineStore('favorites', () => {
  const savedFavorites = JSON.parse(localStorage.getItem('favorite_movies')) || [];
  const favoriteMovies = ref(savedFavorites);

  const totalFavorites = computed(() => favoriteMovies.value.length);
  const averageRating = computed(() => {
    if (favoriteMovies.value.length === 0) return 0; 
    const sum = favoriteMovies.value.reduce((acc, movie) => acc + movie.rating, 0); 
    return (sum / favoriteMovies.value.length).toFixed(1); 
  });

  const toggleFavorite = (movie) => {
    const index = favoriteMovies.value.findIndex((m) => m.id === movie.id); 
    if (index === -1) {
      favoriteMovies.value.push(movie); 
    } else {
      favoriteMovies.value.splice(index, 1); 
    }
  };

  const clearAllFavorites = () => {
    favoriteMovies.value = []; 
  };


  watch(
    favoriteMovies,
    (newVal) => {
      localStorage.setItem('favorite_movies', JSON.stringify(newVal)); 
    },
    { deep: true }
  );

  return { favoriteMovies, totalFavorites, averageRating, toggleFavorite, clearAllFavorites }; 
});