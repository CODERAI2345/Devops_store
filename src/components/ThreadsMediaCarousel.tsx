import React, { useState, useEffect, useCallback, useRef } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Layers,
  Film,
  Image as ImageIcon,
  Maximize2,
  ExternalLink,
  AlertCircle
} from "lucide-react";

export interface ThreadsMediaItem {
  url: string;
  type: "image" | "video";
  thumbnail?: string;
  alt?: string;
  width?: number;
  height?: number;
}

/**
 * Normalizes all possible media shapes for a Threads post into a clean array of media items.
 * Handles item.media, item.images, item.videos, item.videoUrl, and item.thumbnail.
 */
export function extractThreadsMedia(item: any): ThreadsMediaItem[] {
  if (!item) return [];

  const items: ThreadsMediaItem[] = [];
  const seenUrls = new Set<string>();

  const isVideo = (url: string, explicitType?: string) => {
    if (explicitType === "video") return true;
    if (!url) return false;
    const clean = url.toLowerCase().split("?")[0];
    return (
      clean.endsWith(".mp4") ||
      clean.endsWith(".webm") ||
      clean.endsWith(".mov") ||
      clean.endsWith(".m4v") ||
      clean.endsWith(".ogv") ||
      url.includes("/video/") ||
      url.includes("video.threads.net") ||
      url.includes("videoplayback")
    );
  };

  const addMedia = (url: string, type?: "image" | "video", thumb?: string, alt?: string) => {
    if (!url || typeof url !== "string") return;
    const trimmed = url.trim();
    if (!trimmed || trimmed === "https://placehold.co/600x400/1a1a1a/666666?text=Not+Found") return;
    if (seenUrls.has(trimmed)) return;
    seenUrls.add(trimmed);

    const detectedType = type || (isVideo(trimmed, type) ? "video" : "image");
    items.push({
      url: trimmed,
      type: detectedType,
      thumbnail: thumb || (detectedType === "video" ? item.thumbnail : undefined),
      alt: alt || item.title || "Threads media attachment"
    });
  };

  // 1. Check item.media array
  if (Array.isArray(item.media)) {
    for (const m of item.media) {
      if (typeof m === "string") {
        addMedia(m);
      } else if (m && typeof m === "object" && m.url) {
        addMedia(m.url, m.type, m.thumbnail, m.alt);
      }
    }
  }

  // 2. Check item.images array
  if (Array.isArray(item.images)) {
    for (const img of item.images) {
      if (typeof img === "string") {
        addMedia(img, "image");
      } else if (img && typeof img === "object" && (img as any).url) {
        addMedia((img as any).url, "image");
      }
    }
  }

  // 3. Check item.videoUrl or item.videos
  if (item.videoUrl && typeof item.videoUrl === "string") {
    addMedia(item.videoUrl, "video", item.thumbnail);
  }
  if (Array.isArray(item.videos)) {
    for (const vid of item.videos) {
      if (typeof vid === "string") {
        addMedia(vid, "video", item.thumbnail);
      } else if (vid && typeof vid === "object" && (vid as any).url) {
        addMedia((vid as any).url, "video", (vid as any).thumbnail || item.thumbnail);
      }
    }
  }

  // 4. Check item.thumbnail as image fallback (if not already added as video or image)
  if (item.thumbnail && typeof item.thumbnail === "string") {
    addMedia(item.thumbnail);
  }

  return items;
}

interface ThreadsMediaCarouselProps {
  item: any;
  variant?: "card" | "modal" | "compact";
  onMediaClick?: (media: ThreadsMediaItem, index: number) => void;
  className?: string;
  autoPlayVideo?: boolean;
}

export function ThreadsMediaCarousel({
  item,
  variant = "card",
  onMediaClick,
  className = "",
  autoPlayVideo = false,
}: ThreadsMediaCarouselProps) {
  const mediaList = React.useMemo(() => extractThreadsMedia(item), [item]);
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: false,
      align: "center",
      skipSnaps: false,
      dragFree: false,
    },
    [WheelGesturesPlugin()]
  );

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState<{ [key: number]: boolean }>({});
  const [mediaErrors, setMediaErrors] = useState<{ [key: number]: boolean }>({});
  const [fullscreenMedia, setFullscreenMedia] = useState<ThreadsMediaItem | null>(null);

  const videoRefs = useRef<{ [key: number]: HTMLVideoElement | null }>({});
  const isDraggingRef = useRef(false);

  // Sync embla events
  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    const idx = emblaApi.selectedScrollSnap();
    setSelectedIndex(idx);
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());

    // Auto-pause other videos when slide leaves
    Object.entries(videoRefs.current).forEach(([k, videoEl]) => {
      const numK = Number(k);
      if (numK !== idx && videoEl && !videoEl.paused) {
        videoEl.pause();
        setIsPlaying((prev) => ({ ...prev, [numK]: false }));
      }
    });

    // Auto-play active video if enabled
    if (autoPlayVideo && videoRefs.current[idx]) {
      const activeVideo = videoRefs.current[idx];
      activeVideo?.play().then(() => {
        setIsPlaying((prev) => ({ ...prev, [idx]: true }));
      }).catch(() => {
        // Autoplay may be blocked by browser policy
      });
    }
  }, [emblaApi, autoPlayVideo]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  // Track drag vs click
  useEffect(() => {
    if (!emblaApi) return;
    const onPointerDown = () => {
      isDraggingRef.current = false;
    };
    const onScroll = () => {
      isDraggingRef.current = true;
    };
    emblaApi.on("pointerDown", onPointerDown);
    emblaApi.on("scroll", onScroll);
    return () => {
      emblaApi.off("pointerDown", onPointerDown);
      emblaApi.off("scroll", onScroll);
    };
  }, [emblaApi]);

  const scrollPrev = useCallback(
    (e?: React.MouseEvent) => {
      if (e) e.stopPropagation();
      emblaApi?.scrollPrev();
    },
    [emblaApi]
  );

  const scrollNext = useCallback(
    (e?: React.MouseEvent) => {
      if (e) e.stopPropagation();
      emblaApi?.scrollNext();
    },
    [emblaApi]
  );

  const scrollTo = useCallback(
    (idx: number, e?: React.MouseEvent) => {
      if (e) e.stopPropagation();
      emblaApi?.scrollTo(idx);
    },
    [emblaApi]
  );

  // Toggle video playback
  const togglePlay = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const vid = videoRefs.current[index];
    if (!vid) return;

    if (vid.paused) {
      vid.play().then(() => {
        setIsPlaying((prev) => ({ ...prev, [index]: true }));
      }).catch(() => {});
    } else {
      vid.pause();
      setIsPlaying((prev) => ({ ...prev, [index]: false }));
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMuted((prev) => !prev);
  };

  // Keyboard navigation when in modal
  useEffect(() => {
    if (variant !== "modal") return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        emblaApi?.scrollPrev();
      } else if (e.key === "ArrowRight") {
        emblaApi?.scrollNext();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [variant, emblaApi]);

  // If no media, return fallback placeholder
  if (mediaList.length === 0) {
    return (
      <div className={`w-full h-full flex flex-col items-center justify-center bg-black/40 text-white/40 p-6 text-center ${className}`}>
        <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-3">
          <ImageIcon className="w-6 h-6 text-white/30" />
        </div>
        <span className="text-xs text-white/50">No media attachments</span>
      </div>
    );
  }

  const isMulti = mediaList.length > 1;
  const currentMedia = mediaList[selectedIndex] || mediaList[0];
  const hasVideo = mediaList.some((m) => m.type === "video");

  return (
    <div
      className={`relative w-full h-full select-none overflow-hidden group/carousel bg-[#0d0f17] flex flex-col justify-center ${className}`}
      onClick={(e) => {
        // If user was dragging, don't bubble click
        if (isDraggingRef.current) {
          e.stopPropagation();
        }
      }}
    >
      {/* Top Media Header Badges */}
      <div className="absolute top-3 left-3 right-3 z-30 flex items-center justify-between pointer-events-none">
        {/* Media type indicator */}
        <div className="flex items-center gap-1.5">
          {currentMedia.type === "video" ? (
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-fuchsia-500/30 text-[11px] font-semibold text-fuchsia-300 shadow-md">
              <Film className="w-3 h-3 text-fuchsia-400" />
              Video
            </span>
          ) : isMulti ? (
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-cyan-500/30 text-[11px] font-semibold text-cyan-300 shadow-md">
              <Layers className="w-3 h-3 text-cyan-400" />
              Carousel
            </span>
          ) : null}
        </div>

        {/* Counter Badge (e.g. 1/4) */}
        {isMulti && (
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/15 text-white text-[11px] font-mono font-medium shadow-lg pointer-events-auto">
            <span>{selectedIndex + 1}</span>
            <span className="text-white/40">/</span>
            <span>{mediaList.length}</span>
          </div>
        )}
      </div>

      {/* Embla Viewport */}
      <div className="overflow-hidden w-full h-full cursor-grab active:cursor-grabbing" ref={emblaRef}>
        <div className="flex h-full touch-pan-y">
          {mediaList.map((media, idx) => {
            const isError = mediaErrors[idx];

            return (
              <div
                key={`${media.url}-${idx}`}
                className="flex-[0_0_100%] min-w-0 relative h-full flex items-center justify-center bg-[#07090e] overflow-hidden"
                onClick={() => {
                  if (!isDraggingRef.current && onMediaClick) {
                    onMediaClick(media, idx);
                  }
                }}
              >
                {/* Ambient Blurred Background for flawless aesthetic fitting of any aspect ratio */}
                {media.type === "image" && !isError && (
                  <div
                    className="absolute inset-0 bg-cover bg-center blur-2xl opacity-20 scale-125 pointer-events-none transform transition-opacity duration-700"
                    style={{ backgroundImage: `url(${media.url})` }}
                  />
                )}

                {/* Media Content */}
                {isError ? (
                  <div className="relative z-10 flex flex-col items-center justify-center p-6 text-center max-w-[280px]">
                    <div className="w-10 h-10 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-2">
                      <AlertCircle className="w-5 h-5 text-red-400" />
                    </div>
                    <span className="text-xs text-white/70 font-medium">Attachment unavailable</span>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="mt-3 text-[11px] text-fuchsia-400 hover:text-fuchsia-300 flex items-center gap-1 underline"
                    >
                      View on Threads <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                ) : media.type === "video" ? (
                  <div className="relative w-full h-full flex items-center justify-center bg-black">
                    <video
                      ref={(el) => { videoRefs.current[idx] = el; }}
                      src={media.url}
                      poster={media.thumbnail}
                      playsInline
                      loop
                      muted={isMuted}
                      preload="metadata"
                      className="w-full h-full object-contain max-h-[600px]"
                      onError={() => setMediaErrors((prev) => ({ ...prev, [idx]: true }))}
                      onPlay={() => setIsPlaying((prev) => ({ ...prev, [idx]: true }))}
                      onPause={() => setIsPlaying((prev) => ({ ...prev, [idx]: false }))}
                    />

                    {/* Play/Pause Overlay Button */}
                    <button
                      type="button"
                      onClick={(e) => togglePlay(idx, e)}
                      className={`absolute inset-0 m-auto w-14 h-14 rounded-full bg-black/60 hover:bg-black/80 border border-white/20 flex items-center justify-center text-white backdrop-blur-md transition-all duration-300 hover:scale-110 active:scale-95 shadow-2xl z-20 ${
                        isPlaying[idx] ? "opacity-0 hover:opacity-100" : "opacity-100"
                      }`}
                      title={isPlaying[idx] ? "Pause Video" : "Play Video"}
                    >
                      {isPlaying[idx] ? (
                        <Pause className="w-6 h-6 fill-current" />
                      ) : (
                        <Play className="w-6 h-6 fill-current ml-1" />
                      )}
                    </button>

                    {/* Mute/Unmute Control */}
                    <button
                      type="button"
                      onClick={toggleMute}
                      className="absolute bottom-3 right-3 z-20 w-8 h-8 rounded-full bg-black/70 hover:bg-black/90 border border-white/20 flex items-center justify-center text-white backdrop-blur-md transition-transform hover:scale-110 active:scale-95 shadow-md"
                      title={isMuted ? "Unmute" : "Mute"}
                    >
                      {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                  </div>
                ) : (
                  <div className="relative w-full h-full flex items-center justify-center">
                    <img
                      src={media.url}
                      alt={media.alt || "Threads photo"}
                      loading="lazy"
                      onError={() => setMediaErrors((prev) => ({ ...prev, [idx]: true }))}
                      className={`w-full h-full transition-transform duration-500 ${
                        variant === "card"
                          ? "object-cover object-center group-hover/carousel:scale-[1.02]"
                          : "object-contain max-h-[580px]"
                      }`}
                    />
                    
                    {/* Expand High-Res Button in Modal */}
                    {variant === "modal" && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setFullscreenMedia(media);
                        }}
                        className="absolute bottom-3 right-3 z-20 w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 border border-white/20 flex items-center justify-center text-white backdrop-blur-md transition-transform hover:scale-110 active:scale-95 shadow-md"
                        title="View Fullscreen"
                      >
                        <Maximize2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Previous Slide Button */}
      {isMulti && canScrollPrev && (
        <button
          type="button"
          onClick={scrollPrev}
          aria-label="Previous photo"
          className="absolute left-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/70 hover:bg-black/90 border border-white/20 flex items-center justify-center text-white backdrop-blur-md transition-all shadow-xl hover:scale-110 active:scale-95"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}

      {/* Next Slide Button */}
      {isMulti && canScrollNext && (
        <button
          type="button"
          onClick={scrollNext}
          aria-label="Next photo"
          className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/70 hover:bg-black/90 border border-white/20 flex items-center justify-center text-white backdrop-blur-md transition-all shadow-xl hover:scale-110 active:scale-95"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      )}

      {/* Bottom Pagination Dots */}
      {isMulti && (
        <div className="absolute bottom-2.5 inset-x-0 z-20 flex justify-center items-center pointer-events-none">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15 shadow-xl pointer-events-auto">
            {mediaList.map((_, dotIdx) => {
              const isActive = dotIdx === selectedIndex;
              return (
                <button
                  key={dotIdx}
                  type="button"
                  onClick={(e) => scrollTo(dotIdx, e)}
                  aria-label={`Go to slide ${dotIdx + 1}`}
                  className={`transition-all duration-300 rounded-full ${
                    isActive
                      ? "w-4 h-1.5 bg-gradient-to-r from-violet-400 to-fuchsia-400 shadow-[0_0_8px_rgba(217,70,239,0.5)]"
                      : "w-1.5 h-1.5 bg-white/40 hover:bg-white/80"
                  }`}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      {fullscreenMedia && (
        <div
          className="fixed inset-0 z-[300] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4"
          onClick={() => setFullscreenMedia(null)}
        >
          <button
            onClick={() => setFullscreenMedia(null)}
            className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white flex items-center justify-center transition-transform hover:scale-110"
            title="Close Fullscreen"
          >
            ✕
          </button>
          <div className="relative max-w-5xl max-h-[90vh] flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
            {fullscreenMedia.type === "video" ? (
              <video
                src={fullscreenMedia.url}
                controls
                autoPlay
                playsInline
                className="max-w-full max-h-[85vh] rounded-lg shadow-2xl"
              />
            ) : (
              <img
                src={fullscreenMedia.url}
                alt="Full size media"
                className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
