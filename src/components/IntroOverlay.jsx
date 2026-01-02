export default function IntroOverlay({ show }) {
  if (!show) return null; // 🔥 THIS IS THE FIX

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(255,255,255,0.9)",
        backdropFilter: "blur(8px)",
        zIndex: 9998
      }}
    />
  );
}
