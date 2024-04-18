import { createClient } from "@supabase/supabase-js";
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

type FavoriteBook = {
  id: string;
  title: string;
  cover: string;
  language: string;
}
export const userPrefs = persisted('userPrefs', {
  favoriteBooks: [] as FavoriteBook[]
})

export const primeNumbers = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199]

export const supabase = createClient(
  'https://galfdawphfkpamsqclpi.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdhbGZkYXdwaGZrcGFtc3FjbHBpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTIxMjY1ODksImV4cCI6MjAyNzcwMjU4OX0.6WqeSP4v8AkD_ulk1SQep1Y8w4bYURS7ATPo_oSbDCA'
);
