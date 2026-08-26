import { ImageResponse } from "next/og";

export const alt = "PEANUTZIN — news, gossips and good reads";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 70, background: "#fffaf2", color: "#17243b", fontFamily: "Arial", borderTop: "34px solid #ee5c4b" }}>
      <div style={{ display: "flex", fontSize: 34, fontWeight: 800, letterSpacing: "-1px" }}>PEANUTZIN <span style={{ color: "#18a8a0", marginLeft: 18 }}>BOOK &amp; MEDIA</span></div>
      <div style={{ display: "flex", maxWidth: 900, fontSize: 90, lineHeight: .9, fontWeight: 900, letterSpacing: "-6px" }}>News, gossips and good reads.</div>
      <div style={{ display: "flex", fontSize: 24, fontWeight: 700 }}>Independent publishing and cultural media from Malaysia.</div>
    </div>, size,
  );
}
