export function Header() {
  return (
    <>
      <a className="skip" href="#savoir-faire">
        Aller au contenu
      </a>
      <div id="top"></div>
      <header className="site-nav" id="siteNav">
        <a className="rigat-brand" href="#top" aria-label="Rigat, accueil">
          <img
            src="/assets/rigat-logo.svg?v=16"
            width="139"
            height="45"
            alt="RIGAT — Fermetures Distribution"
          />
        </a>
        <nav aria-label="Navigation principale">
          <a href="#accueil" className="nav-active" data-home="">
            Accueil
          </a>
          <a href="#mechanisme" data-mechanism="">
            Le mécanisme
          </a>
          <a href="#resultat" data-jump="5">
            Le résultat
          </a>
          <a href="#savoir-faire">Notre savoir-faire</a>
        </nav>
        <div className="site-nav-actions">
          <button className="nav-contact" data-contact="">
            Parlons de votre projet{" "}
            <span>
              <svg className="icon">
                <use href="#arrow" />
              </svg>
            </span>
          </button>
        </div>
        <button
          className="mobile-menu-toggle"
          id="mobileMenuToggle"
          aria-label="Ouvrir la navigation"
          aria-expanded="false"
          aria-controls="mobileNav"
        >
          <span></span>
          <span></span>
        </button>
      </header>
      <nav
        className="mobile-nav"
        id="mobileNav"
        aria-label="Navigation mobile"
        hidden
      >
        <a href="#accueil" data-home="">
          Accueil <span>01</span>
        </a>
        <a href="#mechanisme" data-mechanism="">
          Le mécanisme <span>02</span>
        </a>
        <a href="#resultat" data-jump="5">
          Le résultat <span>03</span>
        </a>
        <a href="#savoir-faire">
          Notre savoir-faire <span>04</span>
        </a>
        <a href="#questions">
          Questions fréquentes <span>05</span>
        </a>
      </nav>
    </>
  );
}
