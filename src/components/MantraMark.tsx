export function MantraMark({ className = "mantra-logo" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" aria-hidden="true">
      <use href="#mantra-mark" />
    </svg>
  );
}

export function MantraMarkSprite() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
      <symbol id="mantra-mark" viewBox="0 0 16 16">
        <path fill="#f3a8e7" d="M3 1h3v1h2V1h3v1h2v3h1v3h-2v2h-2v2H8v2H6v-2H4v-2H2V8H1V5h1V2h1z" />
        <path fill="#c4b2ff" d="M3 3h2v2H3zm5 0h2v2H8zM5 7h2v2H5zm2 2h2v2H7z" />
        <path fill="#e9dfff" d="M1 9h3v2h2v2H4v-1H2v-1H1zm14 0h-3v2h-2v2h2v-1h2v-1h1z" />
        <path fill="#a995ff" d="M4 11h2v2H4zm6 0h2v2h-2z" />
      </symbol>
    </svg>
  );
}
