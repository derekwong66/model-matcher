import "./Header.css";

export function Header() {
  return (
    <header className="header">
      <div className="header__content">
        <h1 className="header__title">LLM Device Matcher</h1>
        <p className="header__subtitle">
          Discover the best AI models for your local hardware
        </p>
      </div>
    </header>
  );
}
