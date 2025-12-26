import axios from "axios";

const lyricsRequest = axios.create({
  baseURL: "https://lrclib.net",
  timeout: 10000,
});

lyricsRequest.interceptors.response.use(res => res.data);

export interface LyricsSearchItem {
  id: number;
  trackName: string;
  artistName: string;
  albumName?: string;
  duration?: number;
  instrumental?: boolean;
  syncedLyrics?: string | null;
  plainLyrics?: string | null;
}

export const searchLyrics = (query: string) => {
  return lyricsRequest.get<LyricsSearchItem[]>("/api/search", {
    params: {
      q: query,
    },
  });
};
