import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type FavoritesStore = {
  favoriteSlugs: string[];
  addFavorite: (id: string) => void;
  removeFavorite: (id: string) => void;
  toggleFavorite: (id: string) => void;
  clearFavorites: () => void;
};

const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      favoriteSlugs: [],
      addFavorite: (id) =>
        set((state) => ({
          favoriteSlugs: [...state.favoriteSlugs, id],
        })),
      removeFavorite: (id) =>
        set((state) => ({
          favoriteSlugs: state.favoriteSlugs.filter((favId) => favId !== id),
        })),
      toggleFavorite: (id) => {
        const { favoriteSlugs } = get();
        if (favoriteSlugs.includes(id)) {
          get().removeFavorite(id);
        } else {
          get().addFavorite(id);
        }
      },
      clearFavorites: () => set({ favoriteSlugs: [] }),
    }),
    {
      name: "favorite-products", // key in localStorage
      storage: createJSONStorage(() => localStorage), // ✅ use 'storage' instead of 'getStorage'
    }
  )
);

export default useFavoritesStore;
