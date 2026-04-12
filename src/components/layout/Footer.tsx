import "./Footer.css";

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer__note">
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
        <p>
          Client-side estimation. Actual performance may vary based on OS,
          background processes, and drivers.
        </p>
      </div>
    </footer>
  );
}
