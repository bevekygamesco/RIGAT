import { MobileSectionImage } from "@/components/mobile/MobileSectionImage";

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
        <div className="m-process-products" aria-label="Exemples de fermetures sur mesure">
          <figure>
            <MobileSectionImage src="/assets/mobile-models/tubes.webp" alt="Grille roulante à tubes" square />
            <figcaption>Grille à tubes <span>Visibilité & protection</span></figcaption>
          </figure>
          <figure>
            <MobileSectionImage src="/assets/mobile-models/grille.webp" alt="Grille roulante à mailles métalliques" square />
            <figcaption>Grille à mailles <span>Une façade ouverte</span></figcaption>
          </figure>
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
