import { HeroBanner } from "./HeroBanner";
import { MechanismSequence } from "./MechanismSequence";

export function ScrollStory() {
  return (
    <>
      <section
        className="story"
        id="mechanisme"
        aria-label="Histoire du mécanisme"
      >
        <div className="stage" id="stage" data-theme="light">
          <div className="experience-surface" id="experienceSurface">
            <HeroBanner />

            <MechanismSequence />
          </div>
          <div className="hero-bottom">
            <span>RIGAT — FABRICANT DEPUIS 1956.</span>
            <a href="#mechanisme" data-mechanism="">
              <span className="mouse-indicator"></span>
              <span>Le savoir-faire se révèle au fil du scroll</span>
              <i></i>
            </a>
            <button
              id="heroMotion"
              aria-pressed="false"
              aria-label="Mettre le mouvement du produit en pause"
            >
              Ⅱ
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
