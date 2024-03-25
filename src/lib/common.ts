import { persisted } from "svelte-persisted-store";

export const debounce = (fn: () => any, delay = 500) => {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: any) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}

type FavoritBook = {
  id: string;
  title: string;
  cover: string;
  language: string;
}
export const userPrefs = persisted('userPrefs', {
  favoriteBooks: [] as FavoritBook[]
})
