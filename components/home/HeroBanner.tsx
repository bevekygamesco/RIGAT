import { site } from "@/lib/site";

export function HeroBanner() {
  return (
    <>
      <div className="hero-runway" id="accueil" aria-labelledby="heroTitle">
        <div className="banner" id="heroBanner">
          <div className="hero-surface" aria-hidden="true">
            <svg
              className="banner-forms"
              viewBox="0 0 1774 800"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="softWave" x1="0" y1="0" x2="1" y2="1">
                  <stop stopColor="#f3f7fc"></stop>
                  <stop offset=".44" stopColor="#fcfdff"></stop>
                  <stop offset="1" stopColor="#edf3fc"></stop>
                </linearGradient>
                <linearGradient id="azureWing" x1=".2" y1="0" x2=".9" y2="1">
                  <stop stopColor="#dcecff"></stop>
                  <stop offset=".5" stopColor="#a1caff"></stop>
                  <stop offset="1" stopColor="#589fff"></stop>
                </linearGradient>
                <linearGradient id="iceWing" x1="0" y1=".6" x2="1" y2="0">
                  <stop stopColor="#f9fcff"></stop>
                  <stop offset=".6" stopColor="#dceaff"></stop>
                  <stop offset="1" stopColor="#e5eeff"></stop>
                </linearGradient>
                <linearGradient id="lineBlue" x1="0" y1="0" x2="1" y2="1">
                  <stop stopColor="#7096ff"></stop>
                  <stop offset="1" stopColor="#c9e0ff" stopOpacity="0"></stop>
                </linearGradient>
              </defs>
              <path
                fill="url(#softWave)"
                d="M0 153C0 14 212 1 404 38S703 143 927 133 1367 52 1586 44 1774 109 1774 264V643Q1774 793 1609 774L1448 755C1290 774 1150 827 931 815S440 736 218 728 0 713 0 594Z"
              ></path>
              <path
                fill="url(#iceWing)"
                d="M1237 140 1671 64Q1739 54 1738 113L1738 633Q1738 703 1676 666L1233 374Q1164 328 1163 239T1237 140Z"
              ></path>
              <path
                fill="url(#azureWing)"
                d="M840 251Q819 181 891 208C1122 249 1387 413 1545 596Q1621 679 1524 656L952 600Q917 594 905 557Z"
              ></path>
              <path
                fill="none"
                stroke="url(#lineBlue)"
                strokeWidth="1.3"
                d="M855 466 766 190Q733 72 829 107C1070 184 1443 407 1639 676"
              ></path>
              <path
                fill="none"
                stroke="#fff"
                strokeOpacity=".7"
                d="M982 260C1211 275 1424 414 1579 561"
              ></path>
            </svg>
          </div>
          <div className="banner-copy" data-hero-fade=".72">
            <p className="banner-eyebrow">
              <span></span> Fabricant depuis 1956
            </p>
            <h1
              id="heroTitle"
              aria-label="Fabricant de rideaux métalliques à Marseille."
            >
              <span>Fabricant de</span>
              <span className="headline-blue">rideaux métalliques</span>
              <span className="hero-accent">
                à Mars<span className="marseille-gradient">eille</span>
                <span className="blue-dot" aria-hidden="true"></span>
              </span>
            </h1>
            <p>
              Rideaux métalliques, grilles roulantes, portes de garage et
              fermetures industrielles sur-mesure.
            </p>
            <div className="hero-actions">
              <a className="banner-cta" href="#mechanisme" data-mechanism="">
                Découvrir le mécanisme{" "}
                <span>
                  <svg className="icon">
                    <use href="#arrow" />
                  </svg>
                </span>
              </a>
              <a
                className="hero-film"
                href={site.phoneHref}
                aria-label="Appeler RIGAT au 04 91 98 32 80"
              >
                <span>
                  <svg
                    className="icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    aria-hidden="true"
                  >
                    <path d="M7 3H4a1 1 0 0 0-1 1c0 9.4 7.6 17 17 17a1 1 0 0 0 1-1v-3l-5-2-2 2a14 14 0 0 1-7-7l2-2-2-5Z"></path>
                  </svg>
                </span>
                {site.phone}
              </a>
            </div>
            <div className="hero-spec">
              <span>Concevoir</span>
              <i></i>
              <span>Fabriquer</span>
              <i></i>
              <span>Protéger</span>
            </div>
          </div>
          <div className="banner-visual" id="heroVisual">
            <img
              id="heroProduct"
              src="/assets/rigat-banner-product.png"
              width="1254"
              height="1254"
              fetchPriority="high"
              alt="Rideau métallique argenté sur mesure, avec son ombre et son reflet"
            />
            <div className="hero-object-label" hidden>
              <span id="heroViewLabel">RIDEAU MÉTALLIQUE</span>
              <small id="heroViewCounter">ACIER GALVANISÉ</small>
            </div>
          </div>
          <aside className="bespoke-note">
            <span></span>
            <div>
              <strong>Sur-mesure</strong>
              <p>
                Pour les professionnels
                <br />
                et les particuliers
              </p>
            </div>
          </aside>
          <div
            className="benefit-badges"
            aria-label="Les qualités de nos fermetures"
          >
            <div>
              <svg className="icon">
                <use href="#shield" />
              </svg>
              <span>Robuste</span>
            </div>
            <div>
              <svg className="icon">
                <use href="#gear" />
              </svg>
              <span>Fiable</span>
            </div>
            <div>
              <svg className="icon">
                <use href="#tool" />
              </svg>
              <span>Personnalisable</span>
            </div>
          </div>
          <div className="hero-transition-label" aria-hidden="true">
            <span>DU PRODUIT À SON MÉCANISME</span>
            <strong>La précision se révèle.</strong>
            <i></i>
          </div>
        </div>
      </div>
    </>
  );
}
