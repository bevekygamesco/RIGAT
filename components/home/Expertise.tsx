export function Expertise() {
  return (
    <>
      <section className="expertise-section section-pad" id="expertise">
        <div className="section-heading">
          <div>
            <p className="kicker">LE SAVOIR-FAIRE RIGAT</p>
            <h2>
              La technique se voit.
              <br />
              <em>La confiance se construit.</em>
            </h2>
          </div>
          <p>
            Un projet de fermeture, c’est un usage, un lieu et des contraintes.
            Chaque détail mérite sa solution.
          </p>
        </div>
        <div className="expertise-grid">
          <a
            className="expertise-card"
            href="#resultat"
            data-jump="5"
            aria-label="Voir le rideau métallique complet"
          >
            <span className="card-number">01 / CONCEPTION</span>
            <svg className="icon">
              <use href="#shield" />
            </svg>
            <h3>Pensé pour protéger.</h3>
            <p>
              Une fermeture adaptée à votre ouverture, à votre activité et au
              niveau de protection recherché.
            </p>
            <div className="card-foot">
              RIDEAUX MÉTALLIQUES <span>↗</span>
            </div>
          </a>
          <a
            className="expertise-card blue-card"
            href="#mechanisme"
            data-jump="2"
            aria-label="Découvrir la motorisation centrale"
          >
            <span className="card-number">02 / MOUVEMENT</span>
            <svg className="icon">
              <use href="#gear" />
            </svg>
            <h3>Le confort au quotidien.</h3>
            <p>
              Le choix du mécanisme et de la motorisation s’appuie sur les
              dimensions et la fréquence d’utilisation.
            </p>
            <div className="card-foot">
              MOTORISATION <span>↗</span>
            </div>
          </a>
          <a
            className="expertise-card"
            href="#mechanisme"
            data-jump="4"
            aria-label="Voir les finitions du coffre"
          >
            <span className="card-number">03 / FINITIONS</span>
            <svg className="icon">
              <use href="#tool" />
            </svg>
            <h3>Le détail fait l’ensemble.</h3>
            <p>
              Coffre, coulisses et finitions : une intégration cohérente avec
              votre façade et vos besoins.
            </p>
            <div className="card-foot">
              FABRICATION SUR-MESURE <span>↗</span>
            </div>
          </a>
        </div>
      </section>
    </>
  );
}
