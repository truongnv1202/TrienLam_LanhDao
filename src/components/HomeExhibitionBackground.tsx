export default function HomeExhibitionBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="exhibition-bg-base absolute inset-0" />
      <div className="exhibition-bg-texture absolute inset-0" />
      <div className="exhibition-bg-rays absolute inset-0" />
      <div className="exhibition-bg-vignette absolute inset-0" />
    </div>
  );
}
