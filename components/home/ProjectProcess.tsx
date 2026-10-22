export function ProjectProcess() {
  return (
    <>
      <section className="process-section section-pad" id="votre-projet">
        <div className="section-heading">
          <div>
            <p className="kicker">DE L’IDÉE À VOTRE FERMETURE</p>
            <h2>
              Un projet clair.
              <br />
              <em>À chaque étape.</em>
            </h2>
          </div>
          <button className="primary" data-contact="">
            Parlons de votre projet{" "}
            <span className="arrow">
              <svg className="icon">
                <use href="#arrow" />
              </svg>
            </span>
          </button>
        </div>
        <div className="process-grid">
          <article>
            <span>01</span>
            <h3>Comprendre</h3>
            <p>
              Votre lieu, vos dimensions, vos usages. Le point de départ d’une
              solution adaptée.
            </p>
          </article>
          <article>
            <span>02</span>
            <h3>Définir</h3>
            <p>
              Le type de fermeture, le mécanisme et les finitions qui
              correspondent à votre projet.
            </p>
          </article>
          <article>
            <span>03</span>
            <h3>Donner forme</h3>
            <p>
              Une fabrication sur mesure et un ensemble cohérent, du coffre aux
              coulisses.
            </p>
          </article>
        </div>
      </section>
    </>
  );
}
