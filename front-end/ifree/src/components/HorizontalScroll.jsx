"use client";
import { useRef } from "react";

export default function HorizontalScroll({ title, items, renderItem }) {
  const ref = useRef(null);

  function scroll(dir) {
    ref.current?.scrollBy({
      left: dir * 240,
      behavior: "smooth",
    });
  }

  return (
    <div className="mb-10">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-xs font-semibold tracking-widest uppercase text-gray-400">
          {title}
        </h3>

        <div className="flex gap-2">
          <button onClick={() => scroll(-1)}>‹</button>
          <button onClick={() => scroll(1)}>›</button>
        </div>
      </div>

      <div
        ref={ref}
        className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide"
      >
        {items.map(renderItem)}
      </div>
    </div>
  );
}