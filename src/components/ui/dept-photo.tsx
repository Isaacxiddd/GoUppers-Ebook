"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const PHOTOS = [
  "/images/deptos/dept-2.jpg",
  "/images/deptos/dept-3.jpg",
  "/images/deptos/dept-4.jpg",
  "/images/deptos/dept-5.jpg",
];

let pool: string[] = [];

function takePhoto(): string {
  if (pool.length === 0) {
    pool = [...PHOTOS];
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
  }
  return pool.pop() as string;
}

export function DeptPhoto({
  alt,
  sizes,
  className = "",
}: {
  alt: string;
  sizes: string;
  className?: string;
}) {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    setSrc(takePhoto());
  }, []);

  return (
    <div className={className}>
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          className="object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-paper-2" />
      )}
    </div>
  );
}
