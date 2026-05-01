"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Mic,
  Gamepad2,
  FolderOpen,
  Home as HomeIcon,
  Globe,
  Terminal,
  Sparkles,
  Zap,
  Shield,
  Cpu,
  ChevronRight,
  ChevronLeft,
  Play,
  Settings,
  Search,
  FileText,
  Music,
  Mail,
  Image as ImageIcon,
  Film,
  Download,
} from "lucide-react";
import { useState, useEffect, useCallback, useRef } from "react";

function createSpeechRecognition(): SpeechRecognition | null {
  if (typeof window === "undefined") return null;
  const w = window as typeof window & {
    SpeechRecognition?: new () => SpeechRecognition;
    webkitSpeechRecognition?: new () => SpeechRecognition;
  };
  const Ctor = w.SpeechRecognition ?? w.webkitSpeechRecognition;
  if (!Ctor) return null;
  try {
    return new Ctor();
  } catch {
    return null;
  }
}

// Animated voice wave component
function VoiceWave({ isActive }: { isActive: boolean }) {
  return (
    <div className="flex items-center gap-1 h-12">
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="w-1 bg-gradient-to-t from-violet-500 to-cyan-400 rounded-full"
          animate={
            isActive
              ? {
                  height: ["20%", "100%", "20%"],
                }
              : { height: "30%" }
          }
          transition={
            isActive
              ? {
                  duration: 0.8,
                  repeat: Infinity,
                  delay: i * 0.1,
                  ease: "easeInOut",
                }
              : {}
          }
          style={{ height: isActive ? undefined : "30%" }}
        />
      ))}
    </div>
  );
}

type AppId = "game" | "finder" | "home" | "browser" | "terminal";

const APP_TITLES: Record<AppId, string> = {
  game: "Nebula Quest",
  finder: "File Finder",
  home: "Home",
  browser: "Star Browser",
  terminal: "Void Terminal",
};

const DOCK_APPS: {
  id: AppId;
  label: string;
  icon: React.ElementType;
  gradient: string;
}[] = [
  {
    id: "finder",
    label: APP_TITLES.finder,
    icon: FolderOpen,
    gradient: "bg-gradient-to-br from-amber-500 to-orange-600",
  },
  {
    id: "game",
    label: APP_TITLES.game,
    icon: Gamepad2,
    gradient: "bg-gradient-to-br from-pink-500 to-rose-600",
  },
  {
    id: "home",
    label: APP_TITLES.home,
    icon: HomeIcon,
    gradient: "bg-gradient-to-br from-violet-500 to-purple-600",
  },
  {
    id: "browser",
    label: APP_TITLES.browser,
    icon: Globe,
    gradient: "bg-gradient-to-br from-cyan-500 to-blue-600",
  },
  {
    id: "terminal",
    label: APP_TITLES.terminal,
    icon: Terminal,
    gradient: "bg-gradient-to-br from-emerald-500 to-green-700",
  },
];

function OsWindow({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/55 backdrop-blur-md p-4 sm:p-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby="os-window-title"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.94, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.94, opacity: 0 }}
        transition={{ type: "spring", damping: 28, stiffness: 320 }}
        className="relative flex max-h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl border border-white/15 bg-[#151520] shadow-[0_25px_80px_rgba(0,0,0,0.55)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex shrink-0 items-center gap-3 border-b border-white/10 bg-[#252532]/95 px-3 py-2.5">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="h-3 w-3 rounded-full border border-black/25 bg-[#ff5f57] hover:brightness-110"
              aria-label="Close"
            />
            <span
              className="h-3 w-3 rounded-full border border-black/25 bg-[#febc2e] opacity-90"
              aria-hidden
            />
            <span
              className="h-3 w-3 rounded-full border border-black/25 bg-[#28c840] opacity-90"
              aria-hidden
            />
          </div>
          <h2
            id="os-window-title"
            className="flex-1 truncate px-2 text-center text-xs font-medium text-zinc-400"
          >
            {title}
          </h2>
          <div className="w-14 shrink-0" aria-hidden />
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-5">{children}</div>
      </motion.div>
    </motion.div>
  );
}

function MacDock({
  openApp,
  onOpen,
}: {
  openApp: AppId | null;
  onOpen: (id: AppId) => void;
}) {
  return (
    <div className="pointer-events-auto fixed bottom-5 left-1/2 z-[90] flex -translate-x-1/2 items-end gap-1 rounded-[22px] border border-white/[0.18] bg-white/[0.12] px-2 py-2 shadow-[0_8px_32px_rgba(0,0,0,0.45)] backdrop-blur-2xl sm:gap-2 sm:px-3">
      {DOCK_APPS.map((app) => {
        const Icon = app.icon;
        const isOpen = openApp === app.id;
        return (
          <motion.button
            key={app.id}
            type="button"
            whileHover={{ y: -5, scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            onClick={() => onOpen(app.id)}
            className={`relative flex h-11 w-11 items-center justify-center rounded-2xl shadow-lg sm:h-14 sm:w-14 ${app.gradient}`}
            aria-label={`Open ${app.label}`}
          >
            <Icon className="h-6 w-6 text-white drop-shadow-md sm:h-8 sm:w-8" />
            {isOpen && (
              <span className="absolute -bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-white shadow-[0_0_6px_white]" />
            )}
          </motion.button>
        );
      })}
    </div>
  );
}

type NebulaStar = { id: number; x: number; y: number; created: number };

const STAR_LIFETIME_MS = 1400;
const SPAWN_INTERVAL_MS = 820;
const TICK_MS = 100;
const START_LIVES = 5;
const POINTS_PER_STAR = 10;

function GamePanel() {
  const [phase, setPhase] = useState<"idle" | "playing" | "gameover">("idle");
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(START_LIVES);
  const [stars, setStars] = useState<NebulaStar[]>([]);
  const nextId = useRef(0);
  const playingRef = useRef(false);

  useEffect(() => {
    playingRef.current = phase === "playing";
  }, [phase]);

  const endGame = useCallback(() => {
    playingRef.current = false;
    setPhase("gameover");
    setStars([]);
  }, []);

  const startGame = useCallback(() => {
    nextId.current = 0;
    setScore(0);
    setLives(START_LIVES);
    setStars([]);
    setPhase("playing");
  }, []);

  useEffect(() => {
    if (phase === "playing" && lives <= 0) {
      endGame();
    }
  }, [phase, lives, endGame]);

  useEffect(() => {
    if (phase !== "playing") return;

    const spawn = setInterval(() => {
      if (!playingRef.current) return;
      setStars((s) => {
        if (s.length >= 14) return s;
        const id = ++nextId.current;
        const x = 14 + Math.random() * 72;
        const y = 14 + Math.random() * 62;
        return [...s, { id, x, y, created: Date.now() }];
      });
    }, SPAWN_INTERVAL_MS);

    const tick = setInterval(() => {
      if (!playingRef.current) return;
      const now = Date.now();
      setStars((s) => {
        const alive = s.filter((st) => now - st.created < STAR_LIFETIME_MS);
        const missed = s.length - alive.length;
        if (missed > 0) {
          setLives((lv) => Math.max(0, lv - missed));
        }
        return alive;
      });
    }, TICK_MS);

    return () => {
      clearInterval(spawn);
      clearInterval(tick);
    };
  }, [phase]);

  const tapStar = useCallback((id: number) => {
    setStars((s) => {
      if (!s.some((st) => st.id === id)) return s;
      setScore((sc) => sc + POINTS_PER_STAR);
      return s.filter((st) => st.id !== id);
    });
  }, []);

  return (
    <div className="space-y-4">
      <p className="text-sm text-zinc-400">
        Tap each spark before it fades. Miss too many and the run ends. Voice later:
        &ldquo;Harvest!&rdquo;
      </p>

      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-4 font-mono text-sm">
          <span className="text-lg font-semibold text-white">Score: {score}</span>
          <span className="text-pink-300/90">
            Lives:{" "}
            <span className="inline-flex gap-0.5">
              {Array.from({ length: START_LIVES }).map((_, i) => (
                <span key={i} className={i < lives ? "text-pink-400" : "text-zinc-700"}>
                  ●
                </span>
              ))}
            </span>
          </span>
        </div>
        {phase === "playing" ? (
          <button
            type="button"
            onClick={endGame}
            className="shrink-0 rounded-lg bg-white/10 px-3 py-1.5 text-xs text-zinc-300 hover:bg-white/15"
          >
            End run
          </button>
        ) : null}
      </div>

      <div className="relative min-h-[300px] overflow-hidden rounded-xl border border-pink-500/30 bg-gradient-to-b from-violet-950/60 via-[#120818] to-black">
        {phase === "idle" && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-black/50 px-6 text-center backdrop-blur-[2px]">
            <Sparkles className="h-12 w-12 text-pink-400" />
            <div>
              <p className="text-lg font-semibold text-white">Nebula Harvest</p>
              <p className="mt-1 max-w-xs text-sm text-zinc-400">
                Stars appear at random. Tap each one before it disappears ({STAR_LIFETIME_MS / 1000}s).
              </p>
            </div>
            <button
              type="button"
              onClick={startGame}
              className="rounded-full bg-gradient-to-r from-pink-500 to-violet-600 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-pink-900/40 hover:opacity-95"
            >
              Start run
            </button>
          </div>
        )}

        {phase === "gameover" && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-black/60 px-6 text-center backdrop-blur-sm">
            <p className="text-xl font-bold text-white">Run complete</p>
            <p className="font-mono text-3xl text-pink-300">{score}</p>
            <p className="text-sm text-zinc-400">Final score</p>
            <button
              type="button"
              onClick={startGame}
              className="rounded-full bg-gradient-to-r from-pink-500 to-violet-600 px-8 py-3 text-sm font-semibold text-white hover:opacity-95"
            >
              Play again
            </button>
          </div>
        )}

        <div
          className="relative h-[300px] w-full"
          role="application"
          aria-label="Nebula Harvest playfield"
        >
          {stars.map((st) => {
            const age = Date.now() - st.created;
            const urgency = Math.min(1, age / STAR_LIFETIME_MS);
            const scale = 1 - urgency * 0.25;
            const opacity = 1 - urgency * 0.35;
            return (
              <motion.button
                key={st.id}
                type="button"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale, opacity }}
                transition={{ type: "spring", stiffness: 520, damping: 28 }}
                onClick={(e) => {
                  e.stopPropagation();
                  tapStar(st.id);
                }}
                className="absolute flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-pink-400/50 bg-gradient-to-br from-pink-500/90 to-purple-600/90 shadow-[0_0_24px_rgba(236,72,153,0.45)] outline-none ring-offset-2 ring-offset-[#120818] hover:border-pink-300 hover:shadow-[0_0_32px_rgba(236,72,153,0.65)] focus-visible:ring-2 focus-visible:ring-pink-400 active:scale-95"
                style={{ left: `${st.x}%`, top: `${st.y}%` }}
                aria-label="Harvest star"
              >
                <Sparkles className="h-7 w-7 text-white drop-shadow-md" />
              </motion.button>
            );
          })}
        </div>
      </div>

      {phase === "playing" ? (
        <p className="text-center text-xs text-zinc-500">
          Tip: stars shrink as they decay — tap earlier for easier hits.
        </p>
      ) : null}
    </div>
  );
}

type FinderFolderId = "documents" | "downloads" | "media" | "zeros";

const FINDER_DIRS: {
  id: FinderFolderId;
  name: string;
  icon: React.ElementType;
  hint: string;
}[] = [
  {
    id: "documents",
    name: "Documents",
    icon: FileText,
    hint: "12 items",
  },
  {
    id: "downloads",
    name: "Downloads",
    icon: Download,
    hint: "Voice saves here",
  },
  {
    id: "media",
    name: "Media",
    icon: Film,
    hint: "Photos & video",
  },
  {
    id: "zeros",
    name: "Zeros Projects",
    icon: Sparkles,
    hint: "Space AI workspace",
  },
];

type FinderLeaf = {
  name: string;
  detail: string;
  kind: "doc" | "image" | "video" | "code";
  href?: string;
};

type FinderRow =
  | FinderLeaf
  | {
      name: string;
      detail: string;
      kind: "folder";
      children: FinderLeaf[];
    };

const FINDER_CONTENTS: Record<
  FinderFolderId,
  {
    path: string;
    entries: FinderRow[];
  }
> = {
  documents: {
    path: "~/Documents",
    entries: [
      { name: "Project Zeros Proposal.pdf", detail: "PDF · 2.4 MB", kind: "doc" },
      { name: "Mission Brief.md", detail: "Markdown · edited by voice", kind: "doc" },
      { name: "Launch Checklist.numbers", detail: "Spreadsheet · 8 rows", kind: "doc" },
    ],
  },
  downloads: {
    path: "~/Downloads",
    entries: [
      { name: "Invisible_OS_beta.dmg", detail: "Disk image · 412 MB", kind: "doc" },
      { name: "Zeros_voice_pack.zip", detail: "Archive · 24 MB", kind: "doc" },
      {
        name: "quick-start.txt",
        detail: "Plain text · 2 KB",
        kind: "doc",
        href: "#terminal",
      },
    ],
  },
  media: {
    path: "~/Media",
    entries: [
      {
        name: "Orbit Cam Roll",
        detail: "Folder · 48 items",
        kind: "folder",
        children: [
          { name: "solstice_2049.jpg", detail: "JPEG · 4.2 MB", kind: "image" },
          { name: "dock-preview.png", detail: "PNG · 820 KB", kind: "image" },
          { name: "voice-wave-loop.mp4", detail: "Video · 28 MB", kind: "video" },
        ],
      },
      { name: "Orion Nebula.png", detail: "PNG · 8.1 MB", kind: "image" },
      { name: "Earthrise 4K.mov", detail: "Video · 1.2 GB", kind: "video" },
      { name: "Ambient Void.wav", detail: "Audio · 44 MB", kind: "doc" },
    ],
  },
  zeros: {
    path: "~/Zeros Projects",
    entries: [
      {
        name: "space-ai-agent",
        detail: "Repo · main",
        kind: "folder",
        children: [
          { name: "README.md", detail: "Markdown · 8 KB", kind: "doc" },
          {
            name: "zeros-core.ts",
            detail: "TypeScript · 42 KB",
            kind: "code",
            href: "https://github.com",
          },
          { name: "agent.prompt.yaml", detail: "YAML · 6 KB", kind: "code" },
        ],
      },
      {
        name: "voice-kernel",
        detail: "Repo · feature/voice",
        kind: "folder",
        children: [
          { name: "kernel.rs", detail: "Rust · 120 KB", kind: "code" },
          { name: "voices.json", detail: "JSON · 4 KB", kind: "doc" },
        ],
      },
      {
        name: "zeros-roadmap.key",
        detail: "Presentation · 18 slides",
        kind: "doc",
      },
    ],
  },
};

function finderEntryIcon(kind: FinderLeaf["kind"]) {
  switch (kind) {
    case "image":
      return ImageIcon;
    case "video":
      return Film;
    case "code":
      return Cpu;
    default:
      return FileText;
  }
}

function FinderPanel() {
  const [folder, setFolder] = useState<FinderFolderId | null>(null);
  const [innerFolder, setInnerFolder] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const currentDir = folder ? FINDER_DIRS.find((d) => d.id === folder) : null;

  const rowsShown: FinderRow[] | null =
    folder === null
      ? null
      : innerFolder === null
        ? FINDER_CONTENTS[folder].entries
        : (() => {
            const row = FINDER_CONTENTS[folder].entries.find(
              (e): e is Extract<FinderRow, { kind: "folder" }> =>
                e.kind === "folder" && e.name === innerFolder
            );
            return row ? row.children.map((c) => ({ ...c })) : [];
          })();

  const pathLabel =
    folder && innerFolder
      ? `${FINDER_CONTENTS[folder].path}/${innerFolder}`
      : folder
        ? FINDER_CONTENTS[folder].path
        : "";

  const goBack = () => {
    setSelectedFile(null);
    if (innerFolder) setInnerFolder(null);
    else setFolder(null);
  };

  const openHref = (href: string) => {
    if (href.startsWith("#")) {
      const target = href.slice(1);
      const apps: AppId[] = ["game", "finder", "home", "browser", "terminal"];
      if (apps.includes(target as AppId)) {
        window.location.hash = target;
        return;
      }
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    window.open(href, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="relative z-[1] space-y-3">
      <div className="flex gap-2 rounded-lg bg-black/25 p-2">
        <Search className="mt-0.5 h-4 w-4 shrink-0 text-zinc-500" />
        <input
          readOnly
          className="w-full bg-transparent text-sm text-zinc-300 outline-none placeholder:text-zinc-600"
          placeholder="Search files… (try voice)"
        />
      </div>

      <div className="flex min-h-[2rem] flex-wrap items-center gap-2 text-xs text-zinc-500">
        {folder ? (
          <>
            <button
              type="button"
              onClick={goBack}
              className="inline-flex cursor-pointer items-center gap-1 rounded-md px-2 py-1 text-cyan-400 transition-colors hover:bg-white/10 hover:text-cyan-300"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              {innerFolder ? "Back" : "All folders"}
            </button>
            <span className="text-zinc-600">/</span>
            <span className="truncate font-medium text-zinc-300">{currentDir?.name}</span>
            {innerFolder ? (
              <>
                <span className="text-zinc-600">/</span>
                <span className="truncate font-medium text-zinc-300">{innerFolder}</span>
              </>
            ) : null}
          </>
        ) : (
          <span className="text-zinc-500">Locations — tap a folder</span>
        )}
      </div>

      {folder ? (
        <p className="truncate font-mono text-[11px] text-zinc-600">{pathLabel}</p>
      ) : null}

      <motion.div
        key={`${folder ?? "root"}-${innerFolder ?? ""}`}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.18 }}
        className="overflow-hidden rounded-lg border border-white/10 bg-black/20"
      >
        <ul className="divide-y divide-white/10">
          {!folder
            ? FINDER_DIRS.map((row) => {
                const Icon = row.icon;
                return (
                  <li key={row.id}>
                    <button
                      type="button"
                      onClick={() => {
                        setFolder(row.id);
                        setInnerFolder(null);
                        setSelectedFile(null);
                      }}
                      className="flex w-full cursor-pointer items-center gap-3 px-3 py-3 text-left transition-colors hover:bg-white/10 active:bg-white/[0.12]"
                    >
                      <Icon className="h-5 w-5 shrink-0 text-amber-400" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-white">{row.name}</p>
                        <p className="truncate text-xs text-zinc-500">{row.hint}</p>
                      </div>
                      <ChevronRight className="h-4 w-4 shrink-0 text-zinc-600" />
                    </button>
                  </li>
                );
              })
            : rowsShown?.map((entry) => {
                if (entry.kind === "folder") {
                  return (
                    <li key={entry.name}>
                      <button
                        type="button"
                        onClick={() => {
                          setInnerFolder(entry.name);
                          setSelectedFile(null);
                        }}
                        className="flex w-full cursor-pointer items-center gap-3 px-3 py-3 text-left transition-colors hover:bg-white/10 active:bg-white/[0.12]"
                      >
                        <FolderOpen className="h-5 w-5 shrink-0 text-amber-400" />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-white">{entry.name}</p>
                          <p className="truncate text-xs text-zinc-500">{entry.detail}</p>
                        </div>
                        <ChevronRight className="h-4 w-4 shrink-0 text-zinc-600" />
                      </button>
                    </li>
                  );
                }

                const EntryIcon = finderEntryIcon(entry.kind);
                const isSelected = selectedFile === entry.name;
                return (
                  <li key={entry.name}>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedFile(entry.name);
                        if (entry.href) openHref(entry.href);
                      }}
                      className={`flex w-full cursor-pointer items-center gap-3 px-3 py-3 text-left transition-colors hover:bg-white/10 active:bg-white/[0.12] ${isSelected ? "bg-white/[0.07]" : ""}`}
                    >
                      <EntryIcon className="h-5 w-5 shrink-0 text-amber-300/90" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-white">{entry.name}</p>
                        <p className="truncate text-xs text-zinc-500">{entry.detail}</p>
                      </div>
                      {entry.href ? (
                        <span className="shrink-0 text-[10px] font-medium uppercase tracking-wide text-cyan-500/90">
                          Open
                        </span>
                      ) : (
                        <ChevronRight className="h-4 w-4 shrink-0 text-zinc-600 opacity-50" />
                      )}
                    </button>
                  </li>
                );
              })}
        </ul>
      </motion.div>

      {selectedFile && folder && rowsShown ? (
        <div className="rounded-lg border border-cyan-500/20 bg-cyan-950/25 px-3 py-3 text-sm">
          <p className="font-medium text-cyan-100">Preview</p>
          <p className="mt-1 text-cyan-50">{selectedFile}</p>
          <p className="mt-2 text-xs leading-relaxed text-zinc-400">
            {(() => {
              const flat = rowsShown.filter((r): r is FinderLeaf => r.kind !== "folder");
              const meta = flat.find((e) => e.name === selectedFile);
              if (!meta) return "Folder or item.";
              if (meta.href?.startsWith("#")) {
                const t = meta.href.slice(1);
                const apps: AppId[] = ["game", "finder", "home", "browser", "terminal"];
                if (apps.includes(t as AppId)) return "Opening that demo app for you.";
                return "Jumped to that section on the page.";
              }
              if (meta.href) return "Opened an external link in a new tab.";
              return "Voice: “Open this file” — demo preview only.";
            })()}
          </p>
        </div>
      ) : null}
    </div>
  );
}

type HomeLocationId = "desktop" | "pictures" | "music" | "mail";

type HomeItem = {
  name: string;
  meta: string;
  /** Opens in new tab / mail client */
  href?: string;
  /** Opens another demo app via URL hash */
  appHash?: AppId;
};

const HOME_LIBRARY: Record<
  HomeLocationId,
  { label: string; path: string; items: HomeItem[] }
> = {
  desktop: {
    label: "Desktop",
    path: "~/Desktop",
    items: [
      { name: "Nebula Quest.app", meta: "Application", appHash: "game" },
      {
        name: "Invisible OS.webloc",
        meta: "Web shortcut",
        href: "https://nextjs.org",
      },
      { name: "Voice Cheatsheet.txt", meta: "Plain text · 1 KB", appHash: "terminal" },
    ],
  },
  pictures: {
    label: "Pictures",
    path: "~/Pictures",
    items: [
      { name: "Orbit Cam Roll", meta: "Album · 48 photos", appHash: "finder" },
      { name: "dock-preview.png", meta: "PNG · 820 KB" },
      { name: "solstice_2049.jpg", meta: "JPEG · 4.2 MB" },
    ],
  },
  music: {
    label: "Music",
    path: "~/Music",
    items: [
      { name: "Ambient Void.wav", meta: "Audio · 44 MB" },
      { name: "Zeros Theme.mp3", meta: "Audio · 8 MB" },
      {
        name: "Apple Music",
        meta: "Streaming · opens in new tab",
        href: "https://music.apple.com",
      },
    ],
  },
  mail: {
    label: "Mail",
    path: "~/Mail",
    items: [
      {
        name: "Zeros onboarding",
        meta: "Unread",
        href: "mailto:support@example.com?subject=Invisible%20OS%20beta",
      },
      {
        name: "Voice digest",
        meta: "Newsletter",
        href: "mailto:news@example.com?subject=Subscribe",
      },
      { name: "Draft — mission brief", meta: "Local draft" },
    ],
  },
};

function HomePanel() {
  const [location, setLocation] = useState<HomeLocationId | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    setPreview(null);
  }, [location]);

  const openItem = (item: HomeItem) => {
    if (item.href) return;
    if (item.appHash) {
      window.location.hash = item.appHash;
      return;
    }
    setPreview(`Opened “${item.name}” — say “Open this” with voice (demo).`);
  };

  const dirs: { id: HomeLocationId; name: string; icon: typeof Sparkles }[] = [
    { id: "desktop", name: "Desktop", icon: Sparkles },
    { id: "pictures", name: "Pictures", icon: ImageIcon },
    { id: "music", name: "Music", icon: Music },
    { id: "mail", name: "Mail", icon: Mail },
  ];

  const rowIcon = (item: HomeItem) => {
    if (item.href?.startsWith("mailto")) return Mail;
    if (item.href) return Globe;
    if (item.name.endsWith(".jpg") || item.name.endsWith(".png")) return ImageIcon;
    if (item.name.endsWith(".mp3") || item.name.endsWith(".wav")) return Music;
    return FileText;
  };

  if (location) {
    const lib = HOME_LIBRARY[location];
    return (
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setLocation(null)}
            className="inline-flex items-center gap-1 rounded-lg bg-white/10 px-2.5 py-1.5 text-xs font-medium text-cyan-400 transition-colors hover:bg-white/15"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            Home folders
          </button>
        </div>
        <p className="text-sm text-zinc-400">
          {lib.path} — opened by Zeros when you say &ldquo;Take me home.&rdquo;
        </p>
        <p className="font-mono text-[11px] text-zinc-600">{lib.path}</p>

        {preview ? (
          <div className="rounded-lg border border-violet-500/25 bg-violet-950/30 px-3 py-2 text-sm text-violet-100">
            <p className="text-xs text-violet-200/90">{preview}</p>
            <button
              type="button"
              onClick={() => setPreview(null)}
              className="mt-2 text-xs text-violet-400 hover:text-violet-300"
            >
              Dismiss
            </button>
          </div>
        ) : null}

        <ul className="divide-y divide-white/10 rounded-lg border border-white/10 bg-black/25">
          {lib.items.map((item) => {
            const Icon = rowIcon(item);
            return (
              <li key={item.name}>
                {item.href ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex cursor-pointer items-center gap-3 px-3 py-3 transition-colors hover:bg-white/10"
                  >
                    <Icon className="h-5 w-5 shrink-0 text-violet-300" />
                    <div className="min-w-0 flex-1 text-left">
                      <p className="truncate text-sm font-medium text-white">{item.name}</p>
                      <p className="truncate text-xs text-zinc-500">{item.meta}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 shrink-0 text-zinc-600" />
                  </a>
                ) : (
                  <button
                    type="button"
                    onClick={() => openItem(item)}
                    className="flex w-full cursor-pointer items-center gap-3 px-3 py-3 text-left transition-colors hover:bg-white/10"
                  >
                    <Icon className="h-5 w-5 shrink-0 text-violet-300" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-white">{item.name}</p>
                      <p className="truncate text-xs text-zinc-500">{item.meta}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 shrink-0 text-zinc-600 opacity-70" />
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    );
  }

  return (
    <div>
      <p className="mb-4 text-sm text-zinc-400">
        /Users/you — opened by Zeros when you say &ldquo;Take me home.&rdquo;
      </p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {dirs.map((d) => (
          <button
            key={d.id}
            type="button"
            onClick={() => setLocation(d.id)}
            className="flex flex-col items-center gap-2 rounded-xl border border-white/10 bg-white/5 p-4 text-center transition-colors hover:border-white/20 hover:bg-white/10 active:scale-[0.98]"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600/40 to-cyan-600/40">
              <d.icon className="h-6 w-6 text-white" />
            </div>
            <span className="text-xs font-medium text-zinc-200">{d.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function BrowserPanel() {
  return (
    <div className="space-y-3">
      <div className="flex gap-2 rounded-lg bg-black/35 p-2">
        <Globe className="mt-1 h-4 w-4 shrink-0 text-cyan-400" />
        <div className="min-w-0 flex-1 rounded-md bg-black/40 px-3 py-1.5 font-mono text-xs text-zinc-300">
          https://invisible.local/cosmos
        </div>
      </div>
      <div className="rounded-lg border border-white/10 bg-gradient-to-b from-cyan-950/30 to-[#0d1117] p-6">
        <h3 className="text-lg font-semibold text-white">Star Browser</h3>
        <p className="mt-2 text-sm leading-relaxed text-zinc-400">
          Browse hands-free. Say &ldquo;Search for…&rdquo; and Zeros routes the query 
          through Space AI — same familiar web, zero friction.
        </p>
        <p className="mt-4 text-xs font-medium uppercase tracking-wide text-zinc-500">
          Open another demo app
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          <a
            href="#finder"
            className="rounded-lg bg-white/10 px-3 py-1.5 text-xs font-medium text-cyan-300 transition-colors hover:bg-white/15"
          >
            Finder
          </a>
          <a
            href="#terminal"
            className="rounded-lg bg-white/10 px-3 py-1.5 text-xs font-medium text-cyan-300 transition-colors hover:bg-white/15"
          >
            Terminal
          </a>
          <a
            href="#game"
            className="rounded-lg bg-white/10 px-3 py-1.5 text-xs font-medium text-cyan-300 transition-colors hover:bg-white/15"
          >
            Game
          </a>
          <a
            href="#home"
            className="rounded-lg bg-white/10 px-3 py-1.5 text-xs font-medium text-cyan-300 transition-colors hover:bg-white/15"
          >
            Home
          </a>
        </div>
        <a
          href="https://nextjs.org"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex text-sm font-medium text-cyan-400 hover:text-cyan-300"
        >
          Open example link →
        </a>
      </div>
    </div>
  );
}

type VfsNode =
  | { kind: "dir"; entries: Record<string, VfsNode> }
  | { kind: "file"; content: string };

const TERMINAL_FS: VfsNode = {
  kind: "dir",
  entries: {
    users: {
      kind: "dir",
      entries: {
        you: {
          kind: "dir",
          entries: {
            Documents: {
              kind: "dir",
              entries: {
                "readme.txt": {
                  kind: "file",
                  content:
                    "Invisible OS — Void Terminal demo.\nCommands: help, ls, list, dir, cd, pwd, cat, echo, clear, open.",
                },
                "zeros.md": {
                  kind: "file",
                  content: "# Zeros\nSpace AI agent · voice-aware routing.",
                },
              },
            },
            Downloads: {
              kind: "dir",
              entries: {
                "Invisible_OS_beta.dmg": {
                  kind: "file",
                  content: "(disk image placeholder)",
                },
              },
            },
            Desktop: {
              kind: "dir",
              entries: {
                "Voice Cheatsheet.txt": {
                  kind: "file",
                  content: "Say: open finder | open game | open terminal",
                },
              },
            },
          },
        },
      },
    },
  },
};

const HOME_SEGMENTS = ["users", "you"];

function vfsGet(node: VfsNode, segments: string[]): VfsNode | null {
  let cur: VfsNode = node;
  for (const seg of segments) {
    if (cur.kind !== "dir") return null;
    const next = cur.entries[seg];
    if (!next) return null;
    cur = next;
  }
  return cur;
}

function formatPwd(segments: string[]): string {
  if (segments.length === 0) return "/";
  if (segments.join("/") === HOME_SEGMENTS.join("/")) return "~";
  return `/${segments.join("/")}`;
}

function parseShellLine(raw: string): { cmd: string; args: string[] } {
  const parts = raw.trim().split(/\s+/).filter(Boolean);
  const cmd = (parts[0] ?? "").toLowerCase();
  return { cmd, args: parts.slice(1) };
}

const TERMINAL_HELP = [
  "Commands:",
  "  help              Show this list",
  "  ls | list | dir   List files in the current folder",
  "  cd [path]         Change directory (~ home, .. parent, / absolute)",
  "  pwd               Print working directory",
  "  cat <file>        Print file contents",
  "  echo <text>       Print text",
  "  clear | cls       Clear the screen",
  "  whoami            Current user",
  "  date              Current date/time",
  "  open <app>        Open demo app: game | finder | browser | terminal | home",
];

function TerminalPanel() {
  const [cwd, setCwd] = useState<string[]>([...HOME_SEGMENTS]);
  const [lines, setLines] = useState<{ kind: "in" | "out" | "err"; text: string }[]>([
    {
      kind: "out",
      text: "Void Terminal — voice-aware shell. Type help for commands.",
    },
  ]);
  const [draft, setDraft] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [lines]);

  const appendLines = useCallback((chunks: { kind: "out" | "err"; text: string }[]) => {
    if (chunks.length === 0) return;
    setLines((prev) => [...prev, ...chunks]);
  }, []);

  const runCommand = useCallback(
    (raw: string) => {
      const trimmed = raw.trim();
      if (!trimmed) return;

      setLines((prev) => [...prev, { kind: "in", text: trimmed }]);

      const { cmd, args } = parseShellLine(trimmed);

      const outs: { kind: "out" | "err"; text: string }[] = [];

      switch (cmd) {
        case "help":
        case "?":
          TERMINAL_HELP.forEach((line) => outs.push({ kind: "out", text: line }));
          break;

        case "clear":
        case "cls":
          setLines([]);
          return;

        case "pwd":
          outs.push({ kind: "out", text: formatPwd(cwd) });
          break;

        case "ls":
        case "dir":
        case "list": {
          const node = vfsGet(TERMINAL_FS, cwd);
          if (!node || node.kind !== "dir") {
            outs.push({ kind: "err", text: "ls: not a directory" });
            break;
          }
          const names = Object.keys(node.entries).sort();
          if (names.length === 0) {
            outs.push({ kind: "out", text: "(empty)" });
          } else {
            const rows = names.map((name) => {
              const child = node.entries[name];
              return child.kind === "dir" ? `${name}/` : name;
            });
            outs.push({ kind: "out", text: rows.join("  ") });
          }
          break;
        }

        case "cd": {
          const arg = args.join(" ").trim();
          let target: string[];

          if (!arg || arg === "~") {
            target = [...HOME_SEGMENTS];
          } else if (arg === "/") {
            target = [];
          } else if (arg === "..") {
            target = cwd.length ? cwd.slice(0, -1) : [];
          } else if (arg.startsWith("/")) {
            target = arg.split("/").filter(Boolean);
          } else {
            const stack = [...cwd];
            for (const part of arg.split("/").filter(Boolean)) {
              if (part === "..") stack.pop();
              else if (part !== ".") stack.push(part);
            }
            target = stack;
          }

          const dest = vfsGet(TERMINAL_FS, target);
          if (!dest) {
            outs.push({ kind: "err", text: `cd: no such directory: ${arg || "~"}` });
            break;
          }
          if (dest.kind !== "dir") {
            outs.push({ kind: "err", text: `cd: not a directory: ${arg}` });
            break;
          }
          setCwd(target);
          break;
        }

        case "cat": {
          const name = args[0];
          if (!name) {
            outs.push({ kind: "err", text: "usage: cat <file>" });
            break;
          }
          const node = vfsGet(TERMINAL_FS, [...cwd, name]);
          if (!node) {
            outs.push({ kind: "err", text: `cat: ${name}: No such file` });
            break;
          }
          if (node.kind !== "file") {
            outs.push({ kind: "err", text: `cat: ${name}: Is a directory` });
            break;
          }
          outs.push({ kind: "out", text: node.content });
          break;
        }

        case "echo":
          outs.push({ kind: "out", text: args.join(" ") });
          break;

        case "whoami":
          outs.push({ kind: "out", text: "you" });
          break;

        case "date":
          outs.push({ kind: "out", text: new Date().toString() });
          break;

        case "open": {
          const app = (args[0] ?? "").toLowerCase();
          const allowed = ["game", "finder", "browser", "terminal", "home"] as const;
          if (!allowed.includes(app as (typeof allowed)[number])) {
            outs.push({
              kind: "err",
              text: `open: usage: open (${allowed.join("|")})`,
            });
            break;
          }
          window.location.hash = app;
          outs.push({ kind: "out", text: `Opening ${app}…` });
          break;
        }

        default:
          outs.push({
            kind: "err",
            text: `${cmd}: command not found. Try help.`,
          });
      }

      appendLines(outs);
    },
    [cwd, appendLines]
  );

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    runCommand(draft);
    setDraft("");
  };

  return (
    <div className="flex flex-col rounded-lg border border-emerald-900/40 bg-[#0d1117] font-mono text-sm">
      <div className="border-b border-white/10 px-3 py-2 text-xs text-zinc-500">
        Void Terminal · {formatPwd(cwd)}
      </div>
      <div
        ref={scrollRef}
        className="max-h-[min(320px,45vh)] min-h-[220px] overflow-y-auto p-3 text-zinc-300"
      >
        {lines.map((row, i) => (
          <div key={i} className="mb-2 whitespace-pre-wrap break-words">
            {row.kind === "in" ? (
              <>
                <span className="text-emerald-400">$ </span>
                <span>{row.text}</span>
              </>
            ) : row.kind === "err" ? (
              <span className="text-red-400">{row.text}</span>
            ) : (
              <span className="text-zinc-300">{row.text}</span>
            )}
          </div>
        ))}
      </div>
      <form onSubmit={onSubmit} className="flex items-center gap-2 border-t border-white/10 p-3">
        <span className="shrink-0 text-emerald-400">$</span>
        <input
          ref={inputRef}
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          placeholder="try: ls — cd Documents — cat readme.txt — open game"
          className="min-w-0 flex-1 bg-transparent text-zinc-100 outline-none placeholder:text-zinc-600"
          aria-label="Terminal command"
        />
      </form>
    </div>
  );
}

function renderAppContent(app: AppId) {
  switch (app) {
    case "game":
      return <GamePanel />;
    case "finder":
      return <FinderPanel />;
    case "home":
      return <HomePanel />;
    case "browser":
      return <BrowserPanel />;
    case "terminal":
      return <TerminalPanel />;
    default:
      return null;
  }
}

// Desktop Icon Component
function DesktopIcon({
  icon: Icon,
  label,
  color,
  delay,
  appId,
  onOpen,
}: {
  icon: React.ElementType;
  label: string;
  color: string;
  delay: number;
  appId: AppId;
  onOpen: (id: AppId) => void;
}) {
  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      onClick={() => onOpen(appId)}
      className="desktop-icon group flex flex-col items-center gap-3 cursor-pointer text-left"
    >
      <div
        className={`w-20 h-20 rounded-2xl glass flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-active:scale-95 ${color}`}
      >
        <Icon className="w-10 h-10 text-white" />
      </div>
      <span className="text-sm text-zinc-400 group-hover:text-white transition-colors">
        {label}
      </span>
    </motion.button>
  );
}

// Feature Card Component
function FeatureCard({
  icon: Icon,
  title,
  description,
  delay,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      className="glass rounded-2xl p-6 hover:bg-white/5 transition-colors"
    >
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500/20 to-cyan-500/20 flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-violet-400" />
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-zinc-400 text-sm">{description}</p>
    </motion.div>
  );
}

// Voice Command Example Component
function VoiceCommand({
  command,
  result,
  delay,
  onActivate,
}: {
  command: string;
  result: string;
  delay: number;
  onActivate?: () => void;
}) {
  const content = (
    <>
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
        <Mic className="w-5 h-5 text-white" />
      </div>
      <div className="flex-1 text-left">
        <p className="text-white font-medium">&ldquo;{command}&rdquo;</p>
        <p className="text-zinc-400 text-sm">{result}</p>
      </div>
      <ChevronRight className="w-5 h-5 text-zinc-500 flex-shrink-0" />
    </>
  );

  if (onActivate) {
    return (
      <motion.button
        type="button"
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay, duration: 0.5 }}
        onClick={onActivate}
        className="flex w-full cursor-pointer items-center gap-4 rounded-xl bg-white/5 p-4 text-left transition-colors hover:bg-white/10"
      >
        {content}
      </motion.button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
    >
      {content}
    </motion.div>
  );
}

type StarFieldItem = {
  id: number;
  left: string;
  top: string;
  delay: number;
  size: number;
};

export default function Home() {
  const [isListening, setIsListening] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState("");
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const voiceSessionActiveRef = useRef(false);
  const [stars, setStars] = useState<StarFieldItem[]>([]);
  const [openApp, setOpenApp] = useState<AppId | null>(null);

  const scrollToSection = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const openAppWindow = useCallback((id: AppId) => {
    setOpenApp(id);
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", `#${id}`);
    }
  }, []);

  const closeAppWindow = useCallback(() => {
    setOpenApp(null);
    if (typeof window !== "undefined") {
      const path = window.location.pathname || "/";
      window.history.replaceState(null, "", path);
    }
  }, []);

  /** Scroll to a section (when you close the window you land there) and open the demo app */
  const goToApp = useCallback(
    (app: AppId, sectionId?: string) => {
      if (sectionId) scrollToSection(sectionId);
      openAppWindow(app);
    },
    [scrollToSection, openAppWindow]
  );

  /** Demo intent routing from voice (best-effort; depends on browser captions). */
  const routeVoiceCommand = useCallback(
    (phrase: string) => {
      const t = phrase.toLowerCase().trim();
      if (!t) return;
      if (/\b(game|nebula|quest|play)\b/.test(t)) goToApp("game", "desktop");
      else if (/\b(finder|files?|find)\b/.test(t)) goToApp("finder", "desktop");
      else if (/\bhome\b/.test(t)) goToApp("home", "about");
      else if (/\b(browser|web|search|internet)\b/.test(t)) goToApp("browser", "features");
      else if (/\b(terminal|shell|command)\b/.test(t)) goToApp("terminal", "commands");
      else if (/\bdownload\b/.test(t)) goToApp("finder", "download");
    },
    [goToApp]
  );

  const toggleVoiceListening = useCallback(async () => {
    if (recognitionRef.current) {
      voiceSessionActiveRef.current = false;
      try {
        recognitionRef.current.stop();
      } catch {
        recognitionRef.current.abort();
      }
      recognitionRef.current = null;
      setIsListening(false);
      return;
    }

    const rec = createSpeechRecognition();
    if (!rec) {
      setVoiceError(
        "Speech recognition is not available in this browser. Try Chrome or Edge on desktop."
      );
      return;
    }

    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      setVoiceError("Microphone blocked — allow mic access for this site, then tap again.");
      return;
    }

    setVoiceError(null);
    setVoiceTranscript("");

    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = "en-US";

    rec.onresult = (event: SpeechRecognitionEvent) => {
      let combined = "";
      for (let i = 0; i < event.results.length; i++) {
        combined += event.results[i][0].transcript;
        const segment = event.results[i];
        if (segment.isFinal) routeVoiceCommand(segment[0].transcript);
      }
      setVoiceTranscript(combined.trim());
    };

    rec.onerror = (event: SpeechRecognitionErrorEvent) => {
      if (event.error === "aborted" || event.error === "no-speech") return;
      const human =
        event.error === "not-allowed"
          ? "Microphone blocked by the browser."
          : event.error === "audio-capture"
            ? "No microphone detected."
            : `Speech error: ${event.error}`;
      setVoiceError(human);
      voiceSessionActiveRef.current = false;
      recognitionRef.current = null;
      setIsListening(false);
    };

    rec.onend = () => {
      if (!voiceSessionActiveRef.current) {
        recognitionRef.current = null;
        setIsListening(false);
        return;
      }
      const session = recognitionRef.current;
      if (!session) return;
      try {
        session.start();
      } catch {
        voiceSessionActiveRef.current = false;
        recognitionRef.current = null;
        setIsListening(false);
      }
    };

    try {
      voiceSessionActiveRef.current = true;
      recognitionRef.current = rec;
      rec.start();
      setIsListening(true);
    } catch {
      setVoiceError("Could not start listening — try again.");
      voiceSessionActiveRef.current = false;
      recognitionRef.current = null;
      setIsListening(false);
    }
  }, [routeVoiceCommand]);

  useEffect(() => {
    return () => {
      voiceSessionActiveRef.current = false;
      try {
        recognitionRef.current?.abort();
      } catch {
        /* ignore */
      }
      recognitionRef.current = null;
    };
  }, []);

  useEffect(() => {
    const apps: AppId[] = ["game", "finder", "home", "browser", "terminal"];
    const syncFromHash = () => {
      const raw = window.location.hash.slice(1);
      if (apps.includes(raw as AppId)) setOpenApp(raw as AppId);
    };
    syncFromHash();
    window.addEventListener("hashchange", syncFromHash);
    return () => window.removeEventListener("hashchange", syncFromHash);
  }, []);

  useEffect(() => {
    // Reproducible random jitter fix: force stable SSR/CSR layout
    // Also avoid repeated setStars due to React strict mode in dev
    setStars((prevStars) => {
      if (prevStars.length) return prevStars;
      return [...Array(50)].map((_, i) => {
        // Use a seeded random for stable initial render (for hydration match, if needed)
        // But in most cases this is only client-side background, so fallback to Math.random.
        const rng = typeof window !== "undefined" && window.crypto?.getRandomValues
          ? (() => {
              // Slightly more stable random based on a typed array, not cryptographically strong
              const buf = new Uint32Array(4);
              window.crypto.getRandomValues(buf);
              return () => buf.reduce((a, b) => a + b, 0) / (4 * 0xffffffff);
            })()
          : Math.random;
        return {
          id: i,
          left: `${rng() * 100}%`,
          top: `${rng() * 100}%`,
          delay: rng() * 3,
          size: rng() * 2 + 1,
        };
      });
    });
  }, []);

  useEffect(() => {
    if (!openApp) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeAppWindow();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openApp, closeAppWindow]);

  useEffect(() => {
    if (!openApp) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [openApp]);

  return (
    <div className="relative min-h-screen space-bg overflow-hidden pb-28">
      {/* Animated Stars Background */}
      <div className="fixed inset-0 pointer-events-none">
        {stars.map((star) => (
          <div
            key={star.id}
            className="star"
            style={{
              left: star.left,
              top: star.top,
              animationDelay: `${star.delay}s`,
              width: `${star.size}px`,
              height: `${star.size}px`,
            }}
          />
        ))}
      </div>

      {/* Navigation */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10"
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <button
            type="button"
            onClick={() => {
              closeAppWindow();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="flex items-center gap-2 rounded-lg text-left outline-offset-4 transition-opacity hover:opacity-90"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-cyan-500">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-semibold">Invisible OS</span>
          </button>
          <div className="hidden items-center gap-8 text-sm text-zinc-400 md:flex">
            <button
              type="button"
              onClick={() => goToApp("browser", "features")}
              className="transition-colors hover:text-white"
            >
              Features
            </button>
            <button
              type="button"
              onClick={() => goToApp("finder", "desktop")}
              className="transition-colors hover:text-white"
            >
              Desktop
            </button>
            <button
              type="button"
              onClick={() => goToApp("terminal", "commands")}
              className="transition-colors hover:text-white"
            >
              Voice Commands
            </button>
            <button
              type="button"
              onClick={() => goToApp("home", "about")}
              className="transition-colors hover:text-white"
            >
              About
            </button>
          </div>
          <button
            type="button"
            onClick={() => goToApp("finder", "download")}
            className="rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            Download Beta
          </button>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-sm text-zinc-400">Powered by Zeros Space AI</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
                Your Computer,
                <br />
                <span className="gradient-text">Just Talk.</span>
              </h1>
              <p className="text-xl text-zinc-400 mb-8 max-w-lg">
                Invisible OS is the first operating system controlled entirely by voice. 
                No clicks. No typing. Just speak and get things done.
              </p>
              <div className="flex flex-wrap gap-4">
                <button
                  type="button"
                  onClick={() => {
                    scrollToSection("desktop");
                    openAppWindow("game");
                  }}
                  className="flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 px-8 py-4 font-semibold text-white transition-opacity hover:opacity-90"
                >
                  <Play className="h-5 w-5" />
                  Try It Now
                </button>
                <button
                  type="button"
                  onClick={() => goToApp("terminal", "commands")}
                  className="flex items-center gap-2 rounded-full glass px-8 py-4 font-semibold text-white transition-colors hover:bg-white/10"
                >
                  <Sparkles className="h-5 w-5" />
                  Watch Demo
                </button>
              </div>
            </motion.div>

            {/* Voice Interface Demo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative w-full aspect-square max-w-md mx-auto">
                {/* Animated rings */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-full h-full rounded-full border border-violet-500/20 pulse-ring" />
                </div>
                <div className="absolute inset-4 flex items-center justify-center">
                  <div className="w-full h-full rounded-full border border-cyan-500/20 pulse-ring" style={{ animationDelay: "0.5s" }} />
                </div>
                <div className="absolute inset-8 flex items-center justify-center">
                  <div className="w-full h-full rounded-full border border-violet-500/10 pulse-ring" style={{ animationDelay: "1s" }} />
                </div>

                {/* Center orb */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.button
                    type="button"
                    onClick={() => void toggleVoiceListening()}
                    className={`flex h-32 w-32 flex-col items-center justify-center rounded-full transition-all duration-500 ${
                      isListening
                        ? "bg-gradient-to-br from-violet-500 to-cyan-500 glow-purple"
                        : "glass hover:bg-white/10"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    aria-pressed={isListening}
                    aria-label={isListening ? "Stop listening" : "Start voice input"}
                  >
                    {isListening ? (
                      <>
                        <VoiceWave isActive={true} />
                        <span className="mt-2 text-xs text-white/80">Listening…</span>
                      </>
                    ) : (
                      <>
                        <Mic className="mb-2 h-12 w-12 text-white" />
                        <span className="text-xs text-zinc-400">Tap to speak</span>
                      </>
                    )}
                  </motion.button>
                </div>

                {(voiceError || voiceTranscript || isListening) && (
                  <div className="absolute bottom-0 left-0 right-0 z-[5] px-1 pb-1">
                    {voiceError ? (
                      <p className="rounded-lg border border-red-500/30 bg-red-950/40 px-3 py-2 text-center text-xs text-red-200">
                        {voiceError}
                      </p>
                    ) : (
                      <p className="max-h-14 overflow-y-auto rounded-lg border border-white/10 bg-black/50 px-3 py-2 text-center text-xs text-zinc-300 backdrop-blur-sm">
                        {voiceTranscript || "Speak now — try “open finder” or “open game”."}
                      </p>
                    )}
                  </div>
                )}

                {/* Floating command bubbles */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute top-10 right-0 glass rounded-full px-4 py-2 text-sm text-cyan-400"
                >
                  &ldquo;Open my game&rdquo;
                </motion.div>
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                  className="absolute bottom-20 left-0 glass rounded-full px-4 py-2 text-sm text-violet-400"
                >
                  &ldquo;Find my files&rdquo;
                </motion.div>
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, delay: 2 }}
                  className="absolute bottom-10 right-10 glass rounded-full px-4 py-2 text-sm text-pink-400"
                >
                  &ldquo;Go home&rdquo;
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Desktop Items Section */}
      <section id="desktop" className="scroll-mt-28 py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Your Desktop, Reimagined</h2>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
              Everything you need, accessible instantly through voice. 
              Just say what you want.
            </p>
          </motion.div>

          {/* Desktop Grid */}
          <div className="glass rounded-3xl p-8 md:p-12 relative overflow-hidden">
            {/* Desktop Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-cyan-500/5" />
            
            <div className="relative grid grid-cols-2 gap-8 md:grid-cols-5 md:gap-12">
              <DesktopIcon
                icon={Gamepad2}
                label="Nebula Quest"
                color="bg-gradient-to-br from-pink-500 to-rose-500"
                delay={0}
                appId="game"
                onOpen={openAppWindow}
              />
              <DesktopIcon
                icon={FolderOpen}
                label="File Finder"
                color="bg-gradient-to-br from-amber-500 to-orange-500"
                delay={0.1}
                appId="finder"
                onOpen={openAppWindow}
              />
              <DesktopIcon
                icon={HomeIcon}
                label="Home"
                color="bg-gradient-to-br from-violet-500 to-purple-500"
                delay={0.2}
                appId="home"
                onOpen={openAppWindow}
              />
              <DesktopIcon
                icon={Globe}
                label="Star Browser"
                color="bg-gradient-to-br from-cyan-500 to-blue-500"
                delay={0.3}
                appId="browser"
                onOpen={openAppWindow}
              />
              <DesktopIcon
                icon={Terminal}
                label="Void Terminal"
                color="bg-gradient-to-br from-emerald-500 to-green-500"
                delay={0.4}
                appId="terminal"
                onOpen={openAppWindow}
              />
            </div>

            {/* Voice hint */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="mt-12 text-center"
            >
              <p className="text-zinc-500 text-sm">Try saying: &ldquo;Open Nebula Quest&rdquo; or &ldquo;Find my documents&rdquo;</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Space AI / Zeros Section */}
      <section id="about" className="scroll-mt-28 py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 mb-6">
                <Cpu className="w-4 h-4 text-violet-400" />
                <span className="text-sm text-violet-400">Zeros Space AI</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Powered by Intelligence from the Void
              </h2>
              <p className="text-lg text-zinc-400 mb-6">
                Invisible OS is built on Zeros, our proprietary Space AI agent project. 
                Zeros understands context, intent, and natural language to manage your 
                entire computing experience.
              </p>
              <p className="text-lg text-zinc-400 mb-8">
                Unlike traditional OS interfaces, Zeros doesn&apos;t just execute commands—
                it understands what you&apos;re trying to accomplish and finds the best way 
                to help you achieve it.
              </p>
              <div className="flex gap-4">
                <div className="flex items-center gap-2 text-zinc-300">
                  <div className="w-2 h-2 rounded-full bg-cyan-400" />
                  <span className="text-sm">Neural Processing</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-300">
                  <div className="w-2 h-2 rounded-full bg-violet-400" />
                  <span className="text-sm">Context Aware</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-300">
                  <div className="w-2 h-2 rounded-full bg-pink-400" />
                  <span className="text-sm">Always Learning</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="glass rounded-3xl p-8 glow-purple">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Zeros Core</h3>
                      <p className="text-xs text-zinc-500">Space AI Agent v2.4</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-xs text-green-400">Online</span>
                  </div>
                </div>

                {/* AI Processing Visualization */}
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-white/5">
                    <div className="flex items-center gap-3 mb-3">
                      <Mic className="w-4 h-4 text-cyan-400" />
                      <span className="text-sm text-zinc-400">Input Processing</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-cyan-400 to-violet-500"
                        animate={{ width: ["0%", "100%", "0%"] }}
                        transition={{ duration: 3, repeat: Infinity }}
                      />
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-white/5">
                    <div className="flex items-center gap-3 mb-3">
                      <Cpu className="w-4 h-4 text-violet-400" />
                      <span className="text-sm text-zinc-400">Neural Analysis</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-violet-400 to-pink-500"
                        animate={{ width: ["0%", "100%", "0%"] }}
                        transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                      />
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-white/5">
                    <div className="flex items-center gap-3 mb-3">
                      <Zap className="w-4 h-4 text-pink-400" />
                      <span className="text-sm text-zinc-400">Action Execution</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-pink-400 to-cyan-500"
                        animate={{ width: ["0%", "100%", "0%"] }}
                        transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-between text-xs text-zinc-500">
                  <span>Latency: 42ms</span>
                  <span>Accuracy: 99.7%</span>
                  <span>Context: Active</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="scroll-mt-28 py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Beyond Traditional Computing</h2>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
              Everything that makes Invisible OS different from anything you&apos;ve used before.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={Mic}
              title="Voice First"
              description="No keyboards, no mice. Just speak naturally and Zeros understands your intent."
              delay={0}
            />
            <FeatureCard
              icon={Zap}
              title="Instant Response"
              description="Sub-50ms response time. It feels like thinking, because it practically is."
              delay={0.1}
            />
            <FeatureCard
              icon={Shield}
              title="Private by Design"
              description="Your voice data never leaves your device. Local processing keeps you secure."
              delay={0.2}
            />
            <FeatureCard
              icon={Cpu}
              title="Space AI Core"
              description="Powered by Zeros, our advanced AI that learns your habits and preferences."
              delay={0.3}
            />
            <FeatureCard
              icon={Settings}
              title="Adaptive Interface"
              description="The OS evolves with you. No manual configuration needed—it just works."
              delay={0.4}
            />
            <FeatureCard
              icon={Sparkles}
              title="Zero Friction"
              description="Open apps, find files, send messages—all without lifting a finger."
              delay={0.5}
            />
          </div>
        </div>
      </section>

      {/* Voice Commands Section */}
      <section id="commands" className="scroll-mt-28 py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Speak Naturally.
                <br />
                <span className="gradient-text">Zeros Understands.</span>
              </h2>
              <p className="text-lg text-zinc-400 mb-8">
                No need to memorize commands. Just talk to your computer like you&apos;d 
                talk to a friend. Zeros understands context, follow-ups, and even ambiguity.
              </p>

              <div className="space-y-4">
                <VoiceCommand
                  command="Open my game"
                  result="Launching Nebula Quest..."
                  delay={0}
                  onActivate={() => openAppWindow("game")}
                />
                <VoiceCommand
                  command="Find the document I was working on yesterday"
                  result="Opening 'Project Zeros Proposal.pdf'..."
                  delay={0.1}
                  onActivate={() => openAppWindow("finder")}
                />
                <VoiceCommand
                  command="Take me home"
                  result="Navigating to Home directory..."
                  delay={0.2}
                  onActivate={() => openAppWindow("home")}
                />
                <VoiceCommand
                  command="Search for space documentaries"
                  result="Opening Star Browser with results..."
                  delay={0.3}
                  onActivate={() => openAppWindow("browser")}
                />
                <VoiceCommand
                  command="Open a terminal and check disk space"
                  result="Launching Void Terminal..."
                  delay={0.4}
                  onActivate={() => openAppWindow("terminal")}
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="lg:sticky lg:top-32"
            >
              <div className="glass rounded-3xl p-8 glow-cyan">
                <h3 className="text-xl font-semibold mb-6">What You Can Do</h3>
                <div className="space-y-3">
                  {(
                    [
                      { icon: Gamepad2, text: "Launch any application", app: "game" as const },
                      { icon: Search, text: "Find files instantly", app: "finder" as const },
                      { icon: FileText, text: "Create and edit documents", app: "finder" as const },
                      { icon: Globe, text: "Browse the web hands-free", app: "browser" as const },
                      { icon: Music, text: "Control media playback", app: "browser" as const },
                      { icon: Mail, text: "Send messages and email", app: "home" as const },
                      { icon: Settings, text: "Configure system settings", app: "terminal" as const },
                      { icon: Terminal, text: "Run commands and scripts", app: "terminal" as const },
                    ] as const
                  ).map((item, i) => (
                    <motion.button
                      key={item.text}
                      type="button"
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05 }}
                      onClick={() => openAppWindow(item.app)}
                      className="flex w-full items-center gap-3 rounded-xl bg-white/5 p-3 text-left transition-colors hover:bg-white/10"
                    >
                      <item.icon className="h-5 w-5 shrink-0 text-cyan-400" />
                      <span className="text-sm">{item.text}</span>
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="download" className="scroll-mt-28 py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass rounded-3xl p-12 glow-purple"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Ready to Go Invisible?
            </h2>
            <p className="text-xl text-zinc-400 mb-8 max-w-xl mx-auto">
              Join the beta and experience computing without barriers. 
              Your voice is the only tool you need.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                type="button"
                onClick={() => goToApp("finder", "download")}
                className="rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 px-8 py-4 font-semibold text-white transition-opacity hover:opacity-90"
              >
                Download Beta
              </button>
              <button
                type="button"
                onClick={() => goToApp("browser", "features")}
                className="rounded-full glass px-8 py-4 font-semibold text-white transition-colors hover:bg-white/10"
              >
                Learn More
              </button>
            </div>
            <p className="mt-6 text-sm text-zinc-500">
              Compatible with most modern hardware. Requires microphone.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="font-semibold">Invisible OS</span>
              </div>
              <p className="text-sm text-zinc-500">
                The voice-first operating system powered by Zeros Space AI.
              </p>
            </div>
            <div>
              <h4 className="mb-4 font-semibold">Product</h4>
              <ul className="space-y-2 text-sm text-zinc-400">
                <li>
                  <button
                    type="button"
                    onClick={() => goToApp("browser", "features")}
                    className="transition-colors hover:text-white"
                  >
                    Features
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => goToApp("finder", "download")}
                    className="transition-colors hover:text-white"
                  >
                    Download
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => goToApp("terminal", "commands")}
                    className="transition-colors hover:text-white"
                  >
                    Changelog
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => goToApp("browser", "about")}
                    className="transition-colors hover:text-white"
                  >
                    Roadmap
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-semibold">Company</h4>
              <ul className="space-y-2 text-sm text-zinc-400">
                <li>
                  <button
                    type="button"
                    onClick={() => goToApp("home", "about")}
                    className="transition-colors hover:text-white"
                  >
                    About
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => goToApp("browser", "features")}
                    className="transition-colors hover:text-white"
                  >
                    Blog
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => goToApp("finder", "download")}
                    className="transition-colors hover:text-white"
                  >
                    Careers
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => goToApp("terminal", "commands")}
                    className="transition-colors hover:text-white"
                  >
                    Contact
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-semibold">Connect</h4>
              <ul className="space-y-2 text-sm text-zinc-400">
                <li>
                  <a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-white"
                  >
                    Twitter
                  </a>
                </li>
                <li>
                  <a
                    href="https://discord.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-white"
                  >
                    Discord
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-white"
                  >
                    GitHub
                  </a>
                </li>
                <li>
                  <a
                    href="https://youtube.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-white"
                  >
                    YouTube
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-zinc-500">
              © 2026 Invisible OS. Powered by Zeros Space AI.
            </p>
            <div className="flex gap-6 text-sm text-zinc-500">
              <button
                type="button"
                onClick={() => goToApp("browser", "download")}
                className="transition-colors hover:text-white"
              >
                Privacy
              </button>
              <button
                type="button"
                onClick={() => goToApp("browser", "download")}
                className="transition-colors hover:text-white"
              >
                Terms
              </button>
              <button
                type="button"
                onClick={() => goToApp("browser", "features")}
                className="transition-colors hover:text-white"
              >
                Cookies
              </button>
            </div>
          </div>
        </div>
      </footer>

      <MacDock openApp={openApp} onOpen={openAppWindow} />

      <AnimatePresence>
        {openApp ? (
          <OsWindow
            key={openApp}
            title={APP_TITLES[openApp]}
            onClose={closeAppWindow}
          >
            {renderAppContent(openApp)}
          </OsWindow>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
