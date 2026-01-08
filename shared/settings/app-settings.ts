export const defaultAppSettings: AppSettings = {
  autoStart: false,
  closeWindowOption: "hide",
  fontFamily: "system-ui",
  borderRadius: 8,
  downloadPath: "",
  primaryColor: "#17c964",
  audioQuality: "auto",
  hiddenMenuKeys: [],
  displayMode: "list",
  ffmpegPath: "",
  themeMode: "system",
  pageTransition: "none",
  showSearchHistory: true,
  proxySettings: {
    type: "none",
    host: "",
    port: undefined,
    username: "",
    password: "",
  },
  sideMenuCollapsed: false,
  lyricsOverlayEnabled: false,
  lyricsOverlayAutoShow: true,
  lyricsProvider: "netease",
  // `.../api/search/get/web` 在部分网络环境会返回加密的 result；优先用更稳定的 `.../api/search/get`
  neteaseSearchUrlTemplate: "https://music.163.com/api/search/get?s={query}&type=1&limit=1&offset=0",
  neteaseLyricUrlTemplate: "https://music.163.com/api/song/lyric?os=pc&id={id}&lv=-1&kv=-1&tv=-1",
  lyricsTitleResolverEnabled: false,
  lyricsTitleResolverProvider: "ark",
  lyricsArkApiKey: "",
  lyricsArkModel: "doubao-seed-1-6-251015",
  lyricsArkEndpoint: "https://ark.cn-beijing.volces.com/api/v3/chat/completions",
  lyricsArkReasoningEffort: "medium",
  lyricsTitleResolverUrlTemplate: "",
  lyricsApiUrlTemplate: "",
  lyricsOverlayFontSize: 18,
  lyricsOverlayOpacity: 0.85,
  lyricsOverlayContentMaxWidth: 560,
  lyricsOverlayContentHeight: 120,
  lyricsOverlayWindowWidth: 640,
  lyricsOverlayWindowHeight: 160,
  lyricsOverlayBackgroundColor: "#000000",
  lyricsOverlayBackgroundOpacity: 0.45,
  lyricsOverlayFontColor: "#ffffff",
  lyricsOverlayFontOpacity: 1,
  lyricsOverlayVisibleLines: 3,
  lyricsOverlayPanelX: 16,
  lyricsOverlayPanelY: 56,
};

export const lightThemeColors = {
  backgroundColor: "#f5f5f5",
  contentBackgroundColor: "#ffffff",
  foregroundColor: "#000000",
};

export const darkThemeColors = {
  backgroundColor: "#18181b",
  contentBackgroundColor: "#1f1f1f",
  foregroundColor: "#ffffff",
};

/**
 * 根据主题模式获取对应的颜色配置
 */
export function getThemeColors(themeMode: ThemeMode) {
  return themeMode === "light" ? lightThemeColors : darkThemeColors;
}

/**
 * 主题模式选项
 */
export const THEME_MODE_OPTIONS = [
  { key: "light" as const, label: "浅色" },
  { key: "dark" as const, label: "深色" },
] as const;
