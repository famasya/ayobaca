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

export const supabase = createClient(
  'https://galfdawphfkpamsqclpi.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdhbGZkYXdwaGZrcGFtc3FjbHBpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTIxMjY1ODksImV4cCI6MjAyNzcwMjU4OX0.6WqeSP4v8AkD_ulk1SQep1Y8w4bYURS7ATPo_oSbDCA'
);
