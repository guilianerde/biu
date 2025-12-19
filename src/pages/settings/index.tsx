import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import {
  Form,
  Input,
  Slider,
  Switch,
  Button,
  RadioGroup,
  Radio,
  Divider,
  Select,
  SelectItem,
  Tabs,
  Tab,
} from "@heroui/react";
import { RiArrowRightLongLine } from "@remixicon/react";
import { useShallow } from "zustand/react/shallow";

import ColorPicker from "@/components/color-picker";
import FontSelect from "@/components/font-select";
import ScrollContainer from "@/components/scroll-container";
import UpdateCheckButton from "@/components/update-check-button";
import { useAppUpdateStore } from "@/store/app-update";
import { useSettings } from "@/store/settings";
import { defaultAppSettings } from "@shared/settings/app-settings";

import ImportExport from "./export-import";
import MenuSettings from "./menu-settings";

const SettingsPage = () => {
  const [appVersion, setAppVersion] = useState<string>("");
  const {
    fontFamily,
    backgroundColor,
    contentBackgroundColor,
    primaryColor,
    borderRadius,
    downloadPath,
    closeWindowOption,
    autoStart,
    audioQuality,
    hiddenMenuKeys,
    displayMode,
    ffmpegPath,
    lyricsOverlayEnabled,
    lyricsOverlayAutoShow,
    lyricsProvider,
    neteaseSearchUrlTemplate,
    neteaseLyricUrlTemplate,
    lyricsTitleResolverEnabled,
    lyricsTitleResolverProvider,
    lyricsTitleResolverUrlTemplate,
    lyricsApiUrlTemplate,
    lyricsOverlayFontSize,
    lyricsOverlayOpacity,
    lyricsOverlayContentMaxWidth,
    lyricsOverlayContentHeight,
  } = useSettings(
    useShallow(s => ({
      fontFamily: s.fontFamily,
      backgroundColor: s.backgroundColor,
      contentBackgroundColor: s.contentBackgroundColor,
      primaryColor: s.primaryColor,
      borderRadius: s.borderRadius,
      downloadPath: s.downloadPath,
      closeWindowOption: s.closeWindowOption,
      autoStart: s.autoStart,
      audioQuality: s.audioQuality,
      hiddenMenuKeys: s.hiddenMenuKeys,
      displayMode: s.displayMode,
      ffmpegPath: s.ffmpegPath,
      lyricsOverlayEnabled: s.lyricsOverlayEnabled,
      lyricsOverlayAutoShow: s.lyricsOverlayAutoShow,
      lyricsProvider: s.lyricsProvider,
      neteaseSearchUrlTemplate: s.neteaseSearchUrlTemplate,
      neteaseLyricUrlTemplate: s.neteaseLyricUrlTemplate,
      lyricsTitleResolverEnabled: s.lyricsTitleResolverEnabled,
      lyricsTitleResolverProvider: s.lyricsTitleResolverProvider,
      lyricsTitleResolverUrlTemplate: s.lyricsTitleResolverUrlTemplate,
      lyricsApiUrlTemplate: s.lyricsApiUrlTemplate,
      lyricsOverlayFontSize: s.lyricsOverlayFontSize,
      lyricsOverlayOpacity: s.lyricsOverlayOpacity,
      lyricsOverlayContentMaxWidth: s.lyricsOverlayContentMaxWidth,
      lyricsOverlayContentHeight: s.lyricsOverlayContentHeight,
    })),
  );
  const updateSettings = useSettings(s => s.update);
  const { isUpdateAvailable, latestVersion } = useAppUpdateStore(
    useShallow(s => ({
      isUpdateAvailable: s.isUpdateAvailable,
      latestVersion: s.latestVersion,
    })),
  );

  const { control, watch, setValue } = useForm<AppSettings>({
    defaultValues: {
      fontFamily,
      backgroundColor,
      contentBackgroundColor,
      primaryColor,
      borderRadius,
      downloadPath,
      closeWindowOption,
      autoStart,
      audioQuality,
      hiddenMenuKeys,
      displayMode,
      ffmpegPath,
      lyricsOverlayEnabled,
      lyricsOverlayAutoShow,
      lyricsProvider,
      neteaseSearchUrlTemplate,
      neteaseLyricUrlTemplate,
      lyricsTitleResolverEnabled,
      lyricsTitleResolverProvider,
      lyricsTitleResolverUrlTemplate,
      lyricsApiUrlTemplate,
      lyricsOverlayFontSize,
      lyricsOverlayOpacity,
      lyricsOverlayContentMaxWidth,
      lyricsOverlayContentHeight,
    },
  });

  // 表单项变化时自动保存到 store（即改即存）
  useEffect(() => {
    const subscription = watch(values => {
      // @ts-ignore hiddenMenuKeys类型错误，但是实际运行时没有问题
      updateSettings(values);
    });
    return () => subscription.unsubscribe();
  }, [watch, updateSettings]);

  useEffect(() => {
    window.electron.getAppVersion().then(v => setAppVersion(v));
  }, []);

  return (
    <ScrollContainer className="h-full w-full">
      <div className="m-auto max-w-[900px] px-8 py-4">
        <div className="space-y-6">
          <h1>设置</h1>
          <Tabs aria-label="设置选项" classNames={{ panel: "px-1 py-0" }}>
            <Tab key="system" title="系统设置">
              <Form className="space-y-6">
                <h2>外观</h2>
                {/* 显示模式 */}
                <div className="flex w-full items-center justify-between">
                  <div className="mr-6 space-y-1">
                    <div className="text-medium font-medium">显示模式</div>
                    <div className="text-sm text-zinc-500">选择媒体内容的显示样式</div>
                  </div>
                  <Controller
                    control={control}
                    name="displayMode"
                    render={({ field }) => (
                      <RadioGroup orientation="horizontal" value={field.value} onValueChange={field.onChange}>
                        <Radio value="card">卡片</Radio>
                        <Radio value="list">列表</Radio>
                      </RadioGroup>
                    )}
                  />
                </div>
                {/* 字体选择 */}
                <div className="flex w-full items-center justify-between">
                  <div className="mr-6 space-y-1">
                    <div className="text-medium font-medium">字体</div>
                    <div className="text-sm text-zinc-500">选择界面显示的字体</div>
                  </div>
                  <div className="w-[360px]">
                    <Controller
                      control={control}
                      name="fontFamily"
                      render={({ field }) => <FontSelect value={field.value} onChange={field.onChange} />}
                    />
                  </div>
                </div>

                <div className="flex w-full items-center justify-between">
                  <div className="mr-6 space-y-1">
                    <div className="text-medium font-medium">内容区域颜色</div>
                    <div className="text-sm text-zinc-500">更改应用内容区域的颜色</div>
                  </div>
                  <div className="flex w-[360px] justify-end">
                    <Controller
                      control={control}
                      name="contentBackgroundColor"
                      render={({ field }) => (
                        <ColorPicker
                          presets={[defaultAppSettings.contentBackgroundColor]}
                          value={field.value}
                          onChange={field.onChange}
                        />
                      )}
                    />
                  </div>
                </div>

                <div className="flex w-full items-center justify-between">
                  <div className="mr-6 space-y-1">
                    <div className="text-medium font-medium">布局颜色</div>
                    <div className="text-sm text-zinc-500">更改应用布局背景颜色</div>
                  </div>
                  <div className="flex w-[360px] justify-end">
                    <Controller
                      control={control}
                      name="backgroundColor"
                      render={({ field }) => (
                        <ColorPicker
                          presets={[defaultAppSettings.backgroundColor]}
                          value={field.value}
                          onChange={field.onChange}
                        />
                      )}
                    />
                  </div>
                </div>

                <div className="flex w-full items-center justify-between">
                  <div className="mr-6 space-y-1">
                    <div className="text-medium font-medium">主题颜色</div>
                    <div className="text-sm text-zinc-500">更改应用的主色调</div>
                  </div>
                  <div className="flex w-[360px] justify-end">
                    <Controller
                      control={control}
                      name="primaryColor"
                      render={({ field }) => (
                        <ColorPicker
                          presets={[defaultAppSettings.primaryColor, "#66cc8a", "#9353d3", "#ffffff", "#db924b"]}
                          value={field.value}
                          onChange={field.onChange}
                        />
                      )}
                    />
                  </div>
                </div>

                {/* 全局圆角设置 */}
                <div className="flex w-full items-center justify-between">
                  <div className="mr-6 space-y-1">
                    <div className="text-medium font-medium">圆角</div>
                    <div className="text-sm text-zinc-500">调整界面控件的圆角大小</div>
                  </div>
                  <div className="w-[360px]">
                    <Controller
                      control={control}
                      name="borderRadius"
                      render={({ field }) => (
                        <Slider
                          showTooltip={false}
                          size="sm"
                          endContent={<span>{field.value}px</span>}
                          aria-label="全局圆角"
                          value={field.value}
                          onChange={v => field.onChange(Number(v))}
                          minValue={0}
                          maxValue={24}
                          step={1}
                          classNames={{
                            thumb: "after:hidden",
                          }}
                        />
                      )}
                    />
                  </div>
                </div>
                <Divider />
                <h2>播放</h2>
                {/* 音质选择 */}
                <div className="flex w-full items-center justify-between">
                  <div className="mr-6 space-y-1">
                    <div className="text-medium font-medium">音质偏好</div>
                    <div className="text-sm text-zinc-500">
                      {audioQuality === "auto" && "自动选择最高音质"}
                      {audioQuality === "lossless" && "FLAC / Hi-Res"}
                      {audioQuality === "high" && "180-320 kbps"}
                      {audioQuality === "medium" && "100-140 kbps"}
                      {audioQuality === "low" && "60-80 kbps"}
                    </div>
                  </div>
                  <div className="w-[140px]">
                    <Controller
                      control={control}
                      name="audioQuality"
                      render={({ field }) => (
                        <Select
                          aria-label="音质偏好"
                          selectedKeys={[field.value]}
                          onSelectionChange={keys => {
                            const value = Array.from(keys)[0] as AudioQuality;
                            field.onChange(value);
                          }}
                        >
                          <SelectItem key="auto">自动</SelectItem>
                          <SelectItem key="lossless">无损</SelectItem>
                          <SelectItem key="high">高品质</SelectItem>
                          <SelectItem key="medium">中等</SelectItem>
                          <SelectItem key="low">低品质</SelectItem>
                        </Select>
                      )}
                    />
                  </div>
                </div>

                <Divider />
                <h2>桌面歌词</h2>
                <div className="flex w-full items-center justify-between">
                  <div className="mr-6 space-y-1">
                    <div className="text-medium font-medium">启用桌面歌词</div>
                    <div className="text-sm text-zinc-500">播放时在桌面置顶窗口显示滚动歌词</div>
                  </div>
                  <div className="flex w-[360px] justify-end">
                    <Controller
                      control={control}
                      name="lyricsOverlayEnabled"
                      render={({ field }) => <Switch isSelected={field.value} onValueChange={field.onChange} />}
                    />
                  </div>
                </div>

                <div className="flex w-full items-center justify-between">
                  <div className="mr-6 space-y-1">
                    <div className="text-medium font-medium">自动打开</div>
                    <div className="text-sm text-zinc-500">切歌/开始播放时自动打开桌面歌词窗口</div>
                  </div>
                  <div className="flex w-[360px] justify-end">
                    <Controller
                      control={control}
                      name="lyricsOverlayAutoShow"
                      render={({ field }) => <Switch isSelected={field.value} onValueChange={field.onChange} />}
                    />
                  </div>
                </div>

                <div className="flex w-full items-center justify-between">
                  <div className="mr-6 space-y-1">
                    <div className="text-medium font-medium">歌词来源</div>
                    <div className="text-sm text-zinc-500">默认使用网易云音乐搜索并获取带时间戳的 LRC</div>
                  </div>
                  <div className="flex w-[360px] justify-end">
                    <Controller
                      control={control}
                      name="lyricsProvider"
                      render={({ field }) => (
                        <RadioGroup orientation="horizontal" value={field.value} onValueChange={field.onChange}>
                          <Radio value="netease">网易云音乐</Radio>
                          <Radio value="custom">自定义</Radio>
                        </RadioGroup>
                      )}
                    />
                  </div>
                </div>

                {watch("lyricsProvider") === "netease" ? (
                  <div className="flex w-full items-center justify-between">
                    <div className="mr-6 space-y-1">
                      <div className="text-medium font-medium">网易云：搜索 URL 模板</div>
                      <div className="text-sm text-zinc-500">占位符：{`{query}`}（用于搜索 songId）</div>
                    </div>
                    <div className="w-[360px]">
                      <Controller
                        control={control}
                        name="neteaseSearchUrlTemplate"
                        render={({ field }) => (
                          <Input
                            placeholder="https://music.163.com/api/search/get?s={query}&type=1&limit=1&offset=0"
                            value={field.value}
                            onValueChange={field.onChange}
                          />
                        )}
                      />
                    </div>
                  </div>
                ) : null}

                {watch("lyricsProvider") === "netease" ? (
                  <div className="flex w-full items-center justify-between">
                    <div className="mr-6 space-y-1">
                      <div className="text-medium font-medium">网易云：歌词 URL 模板</div>
                      <div className="text-sm text-zinc-500">占位符：{`{id}`}（用于获取 LRC）</div>
                    </div>
                    <div className="w-[360px]">
                      <Controller
                        control={control}
                        name="neteaseLyricUrlTemplate"
                        render={({ field }) => (
                          <Input
                            placeholder="https://music.163.com/api/song/lyric?os=pc&id={id}&lv=-1&kv=-1&tv=-1"
                            value={field.value}
                            onValueChange={field.onChange}
                          />
                        )}
                      />
                    </div>
                  </div>
                ) : null}

                <div className="flex w-full items-center justify-between">
                  <div className="mr-6 space-y-1">
                    <div className="text-medium font-medium">歌名纠正（AI/服务）</div>
                    <div className="text-sm text-zinc-500">
                      播放前用外部服务把标题纠正为“真实歌名”，并缓存到本地（下次不再调用）
                    </div>
                  </div>
                  <div className="flex w-[360px] justify-end">
                    <Controller
                      control={control}
                      name="lyricsTitleResolverEnabled"
                      render={({ field }) => <Switch isSelected={field.value} onValueChange={field.onChange} />}
                    />
                  </div>
                </div>

                {watch("lyricsTitleResolverEnabled") ? (
                  <div className="flex w-full items-center justify-between">
                    <div className="mr-6 space-y-1">
                      <div className="text-medium font-medium">纠正方式</div>
                      <div className="text-sm text-zinc-500">Ark 通过环境变量配置（不写入本地设置文件）</div>
                    </div>
                    <div className="flex w-[360px] justify-end">
                      <Controller
                        control={control}
                        name="lyricsTitleResolverProvider"
                        render={({ field }) => (
                          <RadioGroup orientation="horizontal" value={field.value} onValueChange={field.onChange}>
                            <Radio value="ark">Ark / Doubao</Radio>
                            <Radio value="custom">自定义</Radio>
                          </RadioGroup>
                        )}
                      />
                    </div>
                  </div>
                ) : null}

                {watch("lyricsTitleResolverEnabled") && watch("lyricsTitleResolverProvider") === "ark" ? (
                  <div className="flex w-full items-center justify-between">
                    <div className="mr-6 space-y-1">
                      <div className="text-medium font-medium">Ark 环境变量</div>
                      <div className="text-sm text-zinc-500">
                        需要在启动前设置：ARK_API_KEY（必填），可选：ARK_MODEL/ARK_ENDPOINT/ARK_REASONING_EFFORT
                      </div>
                    </div>
                    <div className="w-[360px] text-right text-sm text-zinc-500">
                      例如：PowerShell `setx ARK_API_KEY "你的key"`
                    </div>
                  </div>
                ) : null}

                {watch("lyricsTitleResolverEnabled") && watch("lyricsTitleResolverProvider") === "custom" ? (
                  <div className="flex w-full items-center justify-between">
                    <div className="mr-6 space-y-1">
                      <div className="text-medium font-medium">纠正服务 URL 模板</div>
                      <div className="text-sm text-zinc-500">
                        支持占位符：{`{title}`}/{`{artist}`}/{`{query}`}；返回纯文本或 JSON（title/name/songName）
                      </div>
                    </div>
                    <div className="w-[360px]">
                      <Controller
                        control={control}
                        name="lyricsTitleResolverUrlTemplate"
                        render={({ field }) => (
                          <Input
                            placeholder="https://example.com/resolve-title?query={query}"
                            value={field.value}
                            onValueChange={field.onChange}
                          />
                        )}
                      />
                    </div>
                  </div>
                ) : null}

                <div className="flex w-full items-center justify-between">
                  <div className="mr-6 space-y-1">
                    <div className="text-medium font-medium">歌词缓存</div>
                    <div className="text-sm text-zinc-500">清空本地歌词/歌名映射/偏移缓存</div>
                  </div>
                  <div className="flex w-[360px] justify-end">
                    <Button variant="flat" onPress={() => window.electron.clearStore("lyrics-cache")}>
                      清空缓存
                    </Button>
                  </div>
                </div>

                {watch("lyricsProvider") === "custom" ? (
                  <div className="flex w-full items-center justify-between">
                    <div className="mr-6 space-y-1">
                      <div className="text-medium font-medium">歌词 API URL 模板</div>
                      <div className="text-sm text-zinc-500">
                        支持占位符：{`{title}`}/{`{artist}`}/{`{query}`}（返回 LRC 文本或 JSON 也可）
                      </div>
                    </div>
                    <div className="w-[360px]">
                      <Controller
                        control={control}
                        name="lyricsApiUrlTemplate"
                        render={({ field }) => (
                          <Input
                            placeholder="https://example.com/lyrics?title={title}&artist={artist}"
                            value={field.value}
                            onValueChange={field.onChange}
                          />
                        )}
                      />
                    </div>
                  </div>
                ) : null}

                <div className="flex w-full items-center justify-between">
                  <div className="mr-6 space-y-1">
                    <div className="text-medium font-medium">歌词字体大小</div>
                    <div className="text-sm text-zinc-500">{lyricsOverlayFontSize}px</div>
                  </div>
                  <div className="w-[360px]">
                    <Controller
                      control={control}
                      name="lyricsOverlayFontSize"
                      render={({ field }) => (
                        <Slider
                          showTooltip={false}
                          size="sm"
                          endContent={<span>{field.value}px</span>}
                          aria-label="歌词字体大小"
                          value={field.value}
                          onChange={v => field.onChange(Number(v))}
                          minValue={12}
                          maxValue={32}
                          step={1}
                          classNames={{ thumb: "after:hidden" }}
                        />
                      )}
                    />
                  </div>
                </div>

                <div className="flex w-full items-center justify-between">
                  <div className="mr-6 space-y-1">
                    <div className="text-medium font-medium">窗口透明度</div>
                    <div className="text-sm text-zinc-500">{Math.round(lyricsOverlayOpacity * 100)}%</div>
                  </div>
                  <div className="w-[360px]">
                    <Controller
                      control={control}
                      name="lyricsOverlayOpacity"
                      render={({ field }) => (
                        <Slider
                          showTooltip={false}
                          size="sm"
                          endContent={<span>{Math.round(field.value * 100)}%</span>}
                          aria-label="桌面歌词透明度"
                          value={field.value}
                          onChange={v => field.onChange(Number(v))}
                          minValue={0.2}
                          maxValue={1}
                          step={0.05}
                          classNames={{ thumb: "after:hidden" }}
                        />
                      )}
                    />
                  </div>
                </div>

                <div className="flex w-full items-center justify-between">
                  <div className="mr-6 space-y-1">
                    <div className="text-medium font-medium">歌词区域宽度</div>
                    <div className="text-sm text-zinc-500">{lyricsOverlayContentMaxWidth}px</div>
                  </div>
                  <div className="w-[360px]">
                    <Controller
                      control={control}
                      name="lyricsOverlayContentMaxWidth"
                      render={({ field }) => (
                        <Slider
                          showTooltip={false}
                          size="sm"
                          endContent={<span>{field.value}px</span>}
                          aria-label="歌词区域宽度"
                          value={field.value}
                          onChange={v => field.onChange(Number(v))}
                          minValue={320}
                          maxValue={1400}
                          step={20}
                          classNames={{ thumb: "after:hidden" }}
                        />
                      )}
                    />
                  </div>
                </div>

                <div className="flex w-full items-center justify-between">
                  <div className="mr-6 space-y-1">
                    <div className="text-medium font-medium">歌词区域高度</div>
                    <div className="text-sm text-zinc-500">{lyricsOverlayContentHeight}px</div>
                  </div>
                  <div className="w-[360px]">
                    <Controller
                      control={control}
                      name="lyricsOverlayContentHeight"
                      render={({ field }) => (
                        <Slider
                          showTooltip={false}
                          size="sm"
                          endContent={<span>{field.value}px</span>}
                          aria-label="歌词区域高度"
                          value={field.value}
                          onChange={v => field.onChange(Number(v))}
                          minValue={60}
                          maxValue={300}
                          step={5}
                          classNames={{ thumb: "after:hidden" }}
                        />
                      )}
                    />
                  </div>
                </div>

                <div className="flex w-full items-center justify-between">
                  <div className="mr-6 space-y-1">
                    <div className="text-medium font-medium">窗口控制</div>
                    <div className="text-sm text-zinc-500">手动打开/关闭桌面歌词窗口</div>
                  </div>
                  <div className="flex w-[360px] justify-end space-x-2">
                    <Button variant="flat" onPress={() => window.electron.openLyricsOverlay()}>
                      打开
                    </Button>
                    <Button variant="flat" onPress={() => window.electron.closeLyricsOverlay()}>
                      关闭
                    </Button>
                  </div>
                </div>
                <Divider />
                <h2>下载</h2>
                {/* 下载目录配置 */}
                <div className="flex w-full items-center justify-between">
                  <div className="mr-6 space-y-1">
                    <div className="text-medium font-medium">下载目录</div>
                    <div className="text-sm text-zinc-500">选择音视频保存的位置</div>
                  </div>
                  <div className="w-[360px]">
                    <Controller
                      control={control}
                      name="downloadPath"
                      render={({ field }) => (
                        <div className="flex items-center space-x-1">
                          <Input
                            isDisabled
                            placeholder="选择文件夹"
                            value={field.value}
                            onValueChange={field.onChange}
                          />
                          <Button
                            variant="flat"
                            onPress={async () => {
                              const path = await window.electron.selectDirectory();
                              if (path) setValue("downloadPath", path, { shouldDirty: true, shouldTouch: true });
                            }}
                          >
                            选择
                          </Button>
                        </div>
                      )}
                    />
                  </div>
                </div>

                {/* FFmpeg 路径配置 */}
                <div className="flex w-full items-center justify-between">
                  <div className="mr-6 space-y-1">
                    <div className="text-medium font-medium">FFmpeg 路径</div>
                    <div className="text-sm text-zinc-500">手动指定 FFmpeg 可执行文件路径</div>
                  </div>
                  <div className="w-[360px]">
                    <Controller
                      control={control}
                      name="ffmpegPath"
                      render={({ field }) => (
                        <div className="flex items-center space-x-1">
                          <Input isDisabled placeholder="自动检测" value={field.value} onValueChange={field.onChange} />
                          <Button
                            variant="flat"
                            onPress={async () => {
                              const path = await window.electron.selectFile();
                              if (path) setValue("ffmpegPath", path, { shouldDirty: true, shouldTouch: true });
                            }}
                          >
                            选择
                          </Button>
                        </div>
                      )}
                    />
                  </div>
                </div>
                <Divider />
                <h2>系统</h2>
                {/* 窗口关闭选项 */}
                <div className="flex w-full items-center justify-between">
                  <div className="mr-6 space-y-1">
                    <div className="text-medium font-medium">窗口关闭</div>
                    <div className="text-sm text-zinc-500">选择窗口关闭时的行为</div>
                  </div>
                  <Controller
                    control={control}
                    name="closeWindowOption"
                    render={({ field }) => (
                      <RadioGroup orientation="horizontal" value={field.value} onValueChange={field.onChange}>
                        <Radio value="hide">隐藏到托盘</Radio>
                        <Radio value="exit">直接退出</Radio>
                      </RadioGroup>
                    )}
                  />
                </div>

                {/* 开机自启动开关 */}
                <div className="flex w-full items-center justify-between">
                  <div className="mr-6 space-y-1">
                    <div className="text-medium font-medium">开机自启动</div>
                    <div className="text-sm text-zinc-500">系统登录后自动启动应用</div>
                  </div>
                  <div className="flex w-[360px] justify-end">
                    <Controller
                      control={control}
                      name="autoStart"
                      render={({ field }) => <Switch isSelected={field.value} onValueChange={field.onChange} />}
                    />
                  </div>
                </div>

                <Divider />
                <h2>关于应用</h2>
                <div className="flex w-full items-center justify-between">
                  <div className="mr-6 flex items-center space-x-1">
                    <span>当前版本 {appVersion}</span>
                    {isUpdateAvailable && Boolean(latestVersion) && (
                      <>
                        <RiArrowRightLongLine size={16} />
                        <span className="text-primary">{latestVersion}</span>
                      </>
                    )}
                  </div>
                  <UpdateCheckButton />
                </div>
                <ImportExport />
              </Form>
            </Tab>
            <Tab key="menu" title="菜单设置">
              <MenuSettings control={control} />
            </Tab>
          </Tabs>
        </div>
      </div>
    </ScrollContainer>
  );
};

export default SettingsPage;
