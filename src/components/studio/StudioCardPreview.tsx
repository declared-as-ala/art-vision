import React from "react";
import type { StudioSide } from "./studioTypes";
import { MM_TO_PX } from "./studioUtils";

interface StudioCardPreviewProps {
  side: StudioSide;
  widthMm: number;
  heightMm: number;
  className?: string;
  /** Adds the paper-thickness shadow used in the editor. */
  paper?: boolean;
}

/**
 * Vector, resolution-independent rendering of one card face.
 * Everything is expressed in container-query units so it stays crisp at any size
 * (hub gallery, editor preview, order recap…).
 */
export default function StudioCardPreview({
  side,
  widthMm,
  heightMm,
  className = "",
  paper = false,
}: StudioCardPreviewProps) {
  const cardPx = widthMm * MM_TO_PX;
  // 1 mm expressed in container width units (cqw)
  const mm = (value: number) => `${(value / widthMm) * 100}cqw`;
  const px = (value: number) => `${(value / cardPx) * 100}cqw`;

  return (
    <div
      className={`relative overflow-hidden ${paper ? "studio-paper rounded-[3px]" : ""} ${className}`}
      style={{
        aspectRatio: `${widthMm} / ${heightMm}`,
        backgroundColor: side.backgroundColor,
        containerType: "inline-size",
      }}
    >
      {side.elements.map((el) => {
        const box: React.CSSProperties = {
          position: "absolute",
          left: `${(el.x / widthMm) * 100}%`,
          top: `${(el.y / heightMm) * 100}%`,
          width: `${(el.width / widthMm) * 100}%`,
          height: `${(el.height / heightMm) * 100}%`,
          opacity: el.opacity ?? 1,
          transform: el.rotation ? `rotate(${el.rotation}deg)` : undefined,
        };

        if (el.type === "rect") {
          return (
            <div
              key={el.id}
              style={{
                ...box,
                backgroundColor: el.fill || "transparent",
                borderColor: el.stroke,
                borderWidth: el.strokeWidth ? mm(el.strokeWidth) : 0,
                borderStyle: el.stroke ? "solid" : "none",
                borderRadius: el.borderRadius ? mm(el.borderRadius) : 0,
              }}
            />
          );
        }
        if (el.type === "circle") {
          return (
            <div
              key={el.id}
              style={{
                ...box,
                borderRadius: "9999px",
                backgroundColor: el.fill || "transparent",
                borderColor: el.stroke,
                borderWidth: el.strokeWidth ? mm(el.strokeWidth) : 0,
                borderStyle: el.stroke ? "solid" : "none",
              }}
            />
          );
        }
        if (el.type === "line") {
          return (
            <div key={el.id} style={box}>
              <div
                style={{
                  width: "100%",
                  height: `max(1px, ${mm(el.strokeWidth || 1)})`,
                  backgroundColor: el.stroke || "#000000",
                }}
              />
            </div>
          );
        }
        if (el.type === "image") {
          return (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={el.id}
              src={el.src}
              alt={el.alt || ""}
              draggable={false}
              style={{ ...box, objectFit: "contain" }}
            />
          );
        }
        // text
        return (
          <div
            key={el.id}
            style={{
              ...box,
              display: "flex",
              alignItems: "flex-start",
              justifyContent:
                el.textAlign === "center" ? "center" : el.textAlign === "right" ? "flex-end" : "flex-start",
              whiteSpace: "pre-wrap",
              fontFamily: `"${el.fontFamily || "Montserrat"}", sans-serif`,
              fontSize: px((el.fontSize || 12) * (MM_TO_PX / 3.78)),
              fontWeight: el.fontWeight || "normal",
              fontStyle: el.fontStyle || "normal",
              color: el.color || "#000000",
              textAlign: el.textAlign || "left",
              letterSpacing: el.letterSpacing ? px(el.letterSpacing * 0.5) : undefined,
              lineHeight: el.lineHeight || 1.3,
            }}
          >
            {el.text}
          </div>
        );
      })}
    </div>
  );
}
