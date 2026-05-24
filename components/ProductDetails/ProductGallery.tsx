"use client";
import { Product } from "@/types";
import { parseVideoUrl, ParsedVideo } from "@/lib/utils/video";
import Image from "next/image";
import { Play } from "lucide-react";
import React from "react";

interface ProductGalleryProps {
  product: Product;
}

type MediaItem =
  | { type: "image"; url: string }
  | { type: "video"; video: ParsedVideo };

export default function ProductGallery({ product }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = React.useState(0);

  // Get the main product card image FIRST (this is what shows on the card)
  const mainImage = product.image || null;

  // Extract image URLs from images array - handle both object format {id, image, ...} and string format
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const extractedImages = (product.images || []).map((img: any) =>
    typeof img === 'string' ? img : img.image
  ).filter(Boolean);

  // Build final images array: main image first, then other images (excluding duplicates)
  let images: string[] = [];

  if (mainImage) {
    images.push(mainImage);
    // Add other images from the images array, skip duplicates
    extractedImages.forEach((img: string) => {
      if (img !== mainImage && !images.includes(img)) {
        images.push(img);
      }
    });
  } else if (extractedImages.length > 0) {
    images = extractedImages;
  } else if (product.primary_media) {
    // Fallback to primary_media
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const media = product.primary_media as any;
    const url = typeof media === 'string' ? media : media.url;
    if (url) images.push(url);
  }

  // Combine images + videos into one ordered media list (images first, then videos).
  // Each video URL is parsed into YouTube/Vimeo embed or a direct file.
  const media: MediaItem[] = [
    ...images.map((url): MediaItem => ({ type: "image", url })),
    ...(product.videos || [])
      .map((url) => parseVideoUrl(url))
      .filter((v): v is ParsedVideo => v !== null)
      .map((video): MediaItem => ({ type: "video", video })),
  ];

  const activeMedia = media[activeIndex] || null;

  return (
    <div className="flex gap-4 w-full lg:w-[35%]">
      {/* Thumbnails Column - Left Side */}
      {media.length > 1 && (
        <div className="flex flex-col gap-3 w-[80px] shrink-0">
          {media.map((item, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`
                aspect-square
                w-full
                relative
                overflow-hidden
                cursor-pointer
                transition-all
                bg-gray-100
                ${idx === activeIndex
                  ? "ring-2 ring-black"
                  : "ring-1 ring-gray-200 hover:ring-gray-400"
                }
              `}
            >
              {item.type === "image" ? (
                <Image
                  src={item.url}
                  alt={`Product thumbnail ${idx + 1}`}
                  fill
                  className="object-cover"
                />
              ) : (
                <VideoThumbnail video={item.video} />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Main Media */}
      <div className="flex-1 relative aspect-[3/4] bg-gray-100">
        {activeMedia?.type === "image" && (
          <Image
            src={activeMedia.url}
            alt={product.name}
            fill
            className="object-cover"
            priority
          />
        )}
        {activeMedia?.type === "video" &&
          (activeMedia.video.kind === "file" ? (
            <video
              src={activeMedia.video.src}
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-contain bg-black"
            />
          ) : (
            <iframe
              src={activeMedia.video.embedUrl}
              title="Product video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          ))}
      </div>
    </div>
  );
}

function VideoThumbnail({ video }: { video: ParsedVideo }) {
  return (
    <>
      {video.kind === "youtube" ? (
        <Image
          src={video.thumbnail}
          alt="Video thumbnail"
          fill
          className="object-cover"
        />
      ) : video.kind === "file" ? (
        <video
          src={video.src}
          muted
          playsInline
          preload="metadata"
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <span className="absolute inset-0 bg-gray-800" />
      )}
      <span className="absolute inset-0 flex items-center justify-center bg-black/20">
        <Play size={20} className="text-white" fill="white" />
      </span>
    </>
  );
}
