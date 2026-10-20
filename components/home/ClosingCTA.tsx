export function ClosingCTA() {
  return (
    <>
      <section className="closing-section">
        <svg
          viewBox="0 0 1500 400"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d="M930-120C630 45 1620 170 1130 490M960-120C660 45 1650 170 1160 490"></path>
        </svg>
        <p className="kicker">VOTRE PROJET COMMENCE ICI</p>
        <h2>
          Donnons forme
          <br />à votre <em>protection.</em>
        </h2>
        <button className="primary" data-contact="">
          Parlons de votre projet{" "}
          <span className="arrow">
            <svg className="icon">
              <use href="#arrow" />
            </svg>
          </span>
        </button>
        <img
          className="closing-product"
          src="/assets/rigat-banner-product.png"
          width="1254"
          height="1254"
          loading="lazy"
          decoding="async"
          alt="Rideau métallique argenté Rigat, avec son ombre et son reflet"
        />
        <span className="closing-caption">RIGAT · FABRICANT DEPUIS 1956</span>
      </section>
    </>
  );
}
