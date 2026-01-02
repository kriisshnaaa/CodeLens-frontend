export default function CodeLensLogo({ size = 32 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
    >
      <circle cx="50" cy="50" r="46" stroke="#2563eb" strokeWidth="8" />
      <circle cx="50" cy="50" r="20" fill="#2563eb" />
    </svg>
  );
}
