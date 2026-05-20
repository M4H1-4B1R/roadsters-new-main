"use client";
import { Product } from "@/types";
import Image from "next/image";
import React from "react";

interface ProductGalleryProps {
  product: Product;
}

export default function ProductGallery({ product }: ProductGalleryProps) {
  const [activeImageIndex, setActiveImageIndex] = React.useState(0);

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

  const activeImage = images[activeImageIndex] || null;

  return (
    <div className="flex gap-4 w-full lg:w-[35%]">
      {/* Thumbnails Column - Left Side */}
      {images.length > 1 && (
        <div className="flex flex-col gap-3 w-[80px] shrink-0">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveImageIndex(idx)}
              className={`
                aspect-square
                w-full
                relative
                overflow-hidden
                cursor-pointer
                transition-all
                ${idx === activeImageIndex
                  ? "ring-2 ring-black"
                  : "ring-1 ring-gray-200 hover:ring-gray-400"
                }
              `}
            >
              <Image
                src={img}
                alt={`Product thumbnail ${idx + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Main Image */}
      <div className="flex-1 relative aspect-[3/4] bg-gray-100">
        {activeImage && (
          <Image
            src={activeImage}
            alt={product.name}
            fill
            className="object-cover"
            priority
          />
        )}
      </div>
    </div>
  );
}
