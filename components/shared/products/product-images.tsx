"use client";
import React, { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

const ProductImages = ({ images }: { images: string[] }) => {
  const [current, setCurrent] = useState(0);

  return (
    <div className="space-y-4">
      <Image
        className=" object-cover object-center min-h-[300px] border-green-600 border-2"
        src={images[current]}
        alt="product image"
        width={1000}
        height={1000}
      />

      <div className="flex flex-row gap-2 mt-4">
        {images.map((imageSrc, index) => (
          <Image
            key={imageSrc}
            src={imageSrc}
            width={1000}
            height={1000}
            alt="image"
            className={cn(
              "w-20 h-20 object-contain border-gray-300 hover:border-green-600 cursor-pointer border-2",
              {
                "border-green-600": current === index,
              }
            )}
            onClick={() => {
              setCurrent(index);
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductImages;
