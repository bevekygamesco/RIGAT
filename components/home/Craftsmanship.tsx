import type { CSSProperties } from "react";

export function Craftsmanship() {
  return (
    <>
      <section className="lower" id="savoir-faire">
        <div>
          <p className="kicker">L’ESSENTIEL EST DANS LE DÉTAIL</p>
          <h2>
            Une mécanique.<span className="line-break"> </span>Un ensemble.
            <span className="line-break"> </span>
            <em>Votre protection.</em>
          </h2>
          <p>
            Un axe, un moteur central, des bobines, un coffre et des lames. Des
            éléments qui s’assemblent pour former votre rideau métallique.
          </p>
          <button className="primary" data-contact="">
            PARLONS DE VOTRE PROJET
            <span className="arrow">
              <svg className="icon">
                <use href="#arrow" />
              </svg>
            </span>
          </button>
        </div>
        <div className="lower-right">
          <div className="detail-row">
            <span>01</span>
            <strong>La précision de chaque composant</strong>
          </div>
          <div className="detail-row">
            <span>02</span>
            <strong>Un mécanisme intégré au coffre</strong>
          </div>
          <div className="detail-row">
            <span>03</span>
            <strong>Des finitions jusque dans les détails</strong>
          </div>
          <p className="legal-note">
            Une visualisation du mécanisme pour découvrir le produit, du cœur à
            la forme finale.
          </p>
        </div>
        <span className="copyright">© RIGAT — FABRICANT DEPUIS 1956.</span>
        <a className="back-top" href="#top" aria-label="Retour en haut">
          <svg
            className="icon"
            style={{ transform: "rotate(-90deg)" } as CSSProperties}
          >
            <use href="#arrow" />
          </svg>
        </a>
      </section>
    </>
  );
}
