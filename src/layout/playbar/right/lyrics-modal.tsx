import { useEffect, useMemo, useState } from "react";

import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Spinner } from "@heroui/react";
import { RiFileMusicLine, RiSearchLine } from "@remixicon/react";

import { searchLyrics, type LyricsSearchItem } from "@/service/lyrics";
import { usePlayList } from "@/store/play-list";

interface LyricsModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const emptyResultText = "未找到匹配歌词";

const getLyricsText = (item: LyricsSearchItem) => {
  return item.syncedLyrics || item.plainLyrics || emptyResultText;
};

const LyricsModal = ({ isOpen, onOpenChange }: LyricsModalProps) => {
  const playItem = usePlayList(state => state.list.find(item => item.id === state.playId));
  const defaultKeyword = useMemo(() => playItem?.pageTitle || playItem?.title || "", [playItem?.pageTitle, playItem?.title]);

  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState<LyricsSearchItem[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [lyricsText, setLyricsText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setKeyword(current => (current.trim() ? current : defaultKeyword));
  }, [defaultKeyword, isOpen]);

  const handleSearch = async () => {
    const query = keyword.trim();
    if (!query) {
      setError("请输入歌曲名后再查询");
      setResults([]);
      setSelectedId(null);
      setLyricsText("");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResults([]);
    setSelectedId(null);
    setLyricsText("");

    try {
      const data = await searchLyrics(query);
      const normalized = data?.filter(Boolean) ?? [];
      setResults(normalized);
      if (normalized.length === 0) {
        setLyricsText(emptyResultText);
        return;
      }

      const first = normalized[0];
      setSelectedId(first.id);
      setLyricsText(getLyricsText(first));
    } catch (err) {
      console.error("Failed to fetch lyrics", err);
      setError("歌词查询失败，请稍后重试");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelect = (item: LyricsSearchItem) => {
    setSelectedId(item.id);
    setLyricsText(getLyricsText(item));
  };

  return (
    <Modal scrollBehavior="inside" isOpen={isOpen} onOpenChange={onOpenChange} size="3xl">
      <ModalContent>
        <ModalHeader className="flex items-center gap-2">
          <RiFileMusicLine size={18} />
          <span>歌词查询</span>
        </ModalHeader>
        <ModalBody className="gap-4">
          <div className="flex flex-col gap-3">
            <Input
              value={keyword}
              onValueChange={setKeyword}
              placeholder="请输入歌曲名，例如：起风了"
              startContent={<RiSearchLine size={16} />}
              onKeyDown={event => {
                if (event.key === "Enter") {
                  handleSearch();
                }
              }}
            />
            <div className="flex items-center gap-2">
              <Button color="primary" onPress={handleSearch} isLoading={isLoading}>
                查询歌词
              </Button>
              {defaultKeyword && <span className="text-foreground-500 text-sm">当前播放：{defaultKeyword}</span>}
            </div>
            {error && <span className="text-danger text-sm">{error}</span>}
          </div>
          <div className="grid gap-4 md:grid-cols-[minmax(0,220px)_minmax(0,1fr)]">
            <div className="space-y-2">
              <span className="text-foreground-500 text-sm">搜索结果</span>
              <div className="flex max-h-[280px] flex-col gap-2 overflow-auto pr-1">
                {isLoading && (
                  <div className="flex items-center justify-center py-8">
                    <Spinner size="sm" />
                  </div>
                )}
                {!isLoading && results.length === 0 && (
                  <span className="text-foreground-500 text-sm">暂无结果</span>
                )}
                {results.map(item => (
                  <Button
                    key={item.id}
                    variant={item.id === selectedId ? "solid" : "light"}
                    color={item.id === selectedId ? "primary" : "default"}
                    size="sm"
                    className="justify-start text-left"
                    onPress={() => handleSelect(item)}
                  >
                    <span className="truncate">
                      {item.trackName} - {item.artistName}
                      {item.instrumental ? " (纯音乐)" : ""}
                    </span>
                  </Button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <span className="text-foreground-500 text-sm">歌词预览</span>
              <div className="border-divider bg-content2 max-h-[280px] overflow-auto rounded-medium border p-3 text-sm">
                <pre className="whitespace-pre-wrap leading-relaxed">
                  {lyricsText || "请选择歌曲查看歌词"}
                </pre>
              </div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="light" onPress={() => onOpenChange(false)}>
            关闭
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default LyricsModal;
