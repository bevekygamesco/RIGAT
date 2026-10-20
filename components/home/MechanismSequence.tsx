export function MechanismSequence() {
  return (
    <>
      <div id="mechanicalLayer" className="mechanical-layer">
        <div className="focus-wash" aria-hidden="true"></div>
        <svg
          className="story-contours"
          viewBox="0 0 1600 850"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="storyLine">
              <stop stopColor="#d2e5ff" stopOpacity="0"></stop>
              <stop offset=".5" stopColor="#81b5ff" stopOpacity=".4"></stop>
              <stop offset="1" stopColor="#e1eeff" stopOpacity="0"></stop>
            </linearGradient>
          </defs>
          <path d="M-200 740C250 190 560 1080 1160 640S1770 400 1790 220"></path>
          <path d="M-200 760C250 210 560 1100 1160 660S1770 420 1790 240"></path>
        </svg>
        <div className="story-topline">
          <span>
            <i></i> À L’INTÉRIEUR DU SAVOIR-FAIRE
          </span>
          <span>RIGAT / MÉCANISME</span>
        </div>
        <div className="dark-panel" aria-hidden="true">
          <div className="panel-word">PRÉCISION</div>
          <span className="panel-mini">UNE AUTRE VISION DU MÉTAL</span>
        </div>

        <div className="scroll-hint" aria-hidden="true">
          FAITES DÉFILER POUR DÉCOUVRIR
        </div>
        <div className="night-scrim" aria-hidden="true"></div>
        <div className="ghost-word" aria-hidden="true">
          MÉCANIQUE
        </div>
        <div className="scene scene-intro" id="copy" data-scene="0">
          <p className="scene-kicker">
            <span></span> RIEN N’EST LAISSÉ AU HASARD
          </p>
          <h2>
            La force.<span className="line-break"> </span>De l’intérieur.
          </h2>
          <p className="scene-description">
            Tout commence là où le regard s’arrête.
            <br />
            Entrez dans le cœur d’un rideau métallique.
          </p>
          <button className="film-button" data-film="">
            <span className="play-circle">
              <svg className="icon">
                <use href="#play" />
              </svg>
            </span>{" "}
            VOIR LE FILM <span className="film-duration">22 SEC.</span>
          </button>
          <button className="scene-explore" data-explore="1">
            Ou explorez en faisant défiler <span>↓</span>
          </button>
          <div className="scene-spec">
            <span>01</span>
            <div>
              <strong>Acier galvanisé</strong>
              <small>Une base solide pour votre fermeture.</small>
            </div>
          </div>
        </div>
        <div
          className="scene scene-wide"
          data-scene="1"
          aria-hidden="true"
          inert
        >
          <p className="scene-kicker">LA PRÉCISION N’A RIEN D’UN HASARD</p>
          <h2>
            Chaque pièce.<span className="line-break"> </span>
            <em>Un rôle.</em>
          </h2>
          <p className="scene-description">
            Un axe. Des bobines. Un moteur.
            <br />
            La force vient de leur rencontre.
          </p>
          <div className="scene-spec">
            <span>02</span>
            <div>
              <strong>Axe &amp; bobines</strong>
              <small>La précision de chaque liaison.</small>
            </div>
          </div>
        </div>
        <div
          className="scene scene-motor"
          data-scene="2"
          aria-hidden="true"
          inert
        >
          <p className="scene-kicker">
            <span></span> AU CŒUR DU MOUVEMENT
          </p>
          <h2>
            La force<span className="line-break"> </span>vient
            <span className="line-break"> </span>
            <em>du cœur.</em>
          </h2>
          <p className="scene-description">
            Approchez. Le moteur central donne
            <br />
            une nouvelle dimension au mouvement.
          </p>
          <div className="scene-detail">
            01 <span>MOTORISATION CENTRALE</span>
          </div>
          <div className="scene-spec">
            <span>03</span>
            <div>
              <strong>Moteur central</strong>
              <small>La maîtrise du mouvement.</small>
            </div>
          </div>
        </div>
        <div
          className="scene scene-assembly"
          data-scene="3"
          aria-hidden="true"
          inert
        >
          <p className="scene-kicker">LA TECHNIQUE RENCONTRE LA FORME</p>
          <h2>
            Tout prend<span className="line-break"> </span>
            <em>sa place.</em>
          </h2>
          <p className="scene-description">
            Le mécanisme rejoint le coffre.
            <br />
            Chaque élément devient une partie de l’ensemble.
          </p>
          <div className="scene-spec">
            <span>04</span>
            <div>
              <strong>Coffre intégré</strong>
              <small>Un ensemble pensé dans le détail.</small>
            </div>
          </div>
        </div>
        <div
          className="scene scene-detail-shot"
          data-scene="4"
          aria-hidden="true"
          inert
        >
          <p className="scene-kicker">
            <span></span> LE SAVOIR-FAIRE SE VOIT DE PRÈS
          </p>
          <h2>
            La différence<span className="line-break"> </span>est dans
            <span className="line-break"> </span>
            <em>le détail.</em>
          </h2>
          <p className="scene-description">
            Un pli net. Une fixation discrète.
            <br />
            Des finitions qui donnent du caractère.
          </p>
          <div className="scene-spec">
            <span>05</span>
            <div>
              <strong>Finitions soignées</strong>
              <small>Le savoir-faire, jusque dans les plis.</small>
            </div>
          </div>
        </div>
        <div
          className="scene scene-final"
          data-scene="5"
          aria-hidden="true"
          inert
        >
          <p className="scene-kicker">
            <span></span> DE L’INTÉRIEUR À L’ESSENTIEL
          </p>
          <h2>
            La forme<span className="line-break"> </span>de votre
            <span className="line-break"> </span>
            <em>protection.</em>
          </h2>
          <p className="scene-description">
            La précision de chaque composant.
            <br />
            La présence d’un ensemble.
          </p>
          <button className="final-cta" data-contact="">
            DONNONS FORME À VOTRE PROJET <span>↗</span>
          </button>
          <button className="replay-link" data-film="">
            <svg className="icon">
              <use href="#play" />
            </svg>{" "}
            Revoir le film
          </button>
          <div className="scene-spec">
            <span>06</span>
            <div>
              <strong>Sur mesure</strong>
              <small>Votre projet prend sa forme finale.</small>
            </div>
          </div>
        </div>
        <div className="film-status" id="filmStatus" hidden>
          <span></span> LECTURE DU FILM <button id="stopFilm">ARRÊTER ×</button>
        </div>
        <div
          className="visual"
          id="visual"
          role="img"
          aria-label="Animation 3D du moteur central et du rideau métallique, contrôlée par le défilement"
        >
          <div className="orbit" aria-hidden="true"></div>
          <div
            className="product-shadow"
            id="productShadow"
            aria-hidden="true"
          ></div>
          <div className="canvas-wrap">
            <img
              id="poster"
              src="/assets/stills/opening.webp"
              alt="Le moteur et les bobines du rideau métallique pendant leur assemblage"
              fetchPriority="high"
            />
            <canvas id="sequence" aria-hidden="true"></canvas>
            <svg
              className="mechanism-labels"
              id="mechanismLabels"
              aria-hidden="true"
              viewBox="0 0 960 640"
            >
              <g id="mechanismLabelGeometry">
                <g className="part-label">
                  <path d="M150 309 L140 237 H92"></path>
                  <circle cx="150" cy="309" r="2"></circle>
                  <text x="92" y="218">
                    <tspan className="part-number">01 / </tspan>Bobines
                    d’enroulement
                  </text>
                  <text className="part-caption" x="92" y="230">
                    ACCOMPAGNER LE MOUVEMENT
                  </text>
                </g>
                <g className="part-label">
                  <path d="M386 321 L402 438 H300"></path>
                  <circle cx="386" cy="321" r="2"></circle>
                  <text x="300" y="457">
                    <tspan className="part-number">02 / </tspan>Axe de
                    transmission
                  </text>
                  <text className="part-caption" x="300" y="472">
                    RELIER LE MÉCANISME
                  </text>
                </g>
                <g className="part-label">
                  <path d="M567 383 L580 487 H696"></path>
                  <circle cx="567" cy="383" r="2"></circle>
                  <text x="580" y="507">
                    <tspan className="part-number">03 / </tspan>Moteur central
                  </text>
                  <text className="part-caption" x="580" y="522">
                    ENTRAÎNER LE RIDEAU
                  </text>
                </g>
                <g className="part-label">
                  <path d="M816 250 L804 180 H670"></path>
                  <circle cx="816" cy="250" r="2"></circle>
                  <text x="670" y="161">
                    <tspan className="part-number">04 / </tspan>Flasques de
                    fixation
                  </text>
                  <text className="part-caption" x="670" y="174">
                    MAINTENIR L’ENSEMBLE
                  </text>
                </g>
              </g>
            </svg>
          </div>
        </div>
        <div className="callout" id="callout" aria-hidden="true">
          UNE ÉNERGIE. UNE PRÉCISION.
        </div>
        <span className="axis-note" aria-hidden="true">
          VUE DU MÉCANISME — RIGAT
        </span>
        <span className="crosshair" aria-hidden="true"></span>
        <div className="side-progress" aria-hidden="true">
          <b id="sideChapter">01</b>
          <div></div>
          <small>06</small>
        </div>
        <span className="loading" id="loading" role="status">
          <span className="availability"></span>Préparation de l’expérience…
        </span>
        <footer className="footer">
          <div className="foot-label">
            <strong>LE MÉTAL, AUTREMENT.</strong>De la mécanique à la
            protection.
            <br />
            Chaque pièce a sa raison d’être.
          </div>
          <div id="chapters">
            <nav className="chapter-nav" aria-label="Chapitres de l’animation">
              <button
                className="chapter-button active"
                data-chapter="0"
                aria-label="Chapitre 1, révélation"
                aria-current="step"
              >
                01
              </button>
              <button
                className="chapter-button"
                data-chapter="1"
                aria-label="Chapitre 2, composants"
              >
                02
              </button>
              <button
                className="chapter-button"
                data-chapter="2"
                aria-label="Chapitre 3, moteur central"
              >
                03
              </button>
              <button
                className="chapter-button"
                data-chapter="3"
                aria-label="Chapitre 4, intégration"
              >
                04
              </button>
              <button
                className="chapter-button"
                data-chapter="4"
                aria-label="Chapitre 5, finitions"
              >
                05
              </button>
              <button
                className="chapter-button"
                id="resultat"
                data-chapter="5"
                aria-label="Chapitre 6, rideau complet"
              >
                06
              </button>
            </nav>
            <div className="timeline-label">
              <strong id="chapterLabel">01 — LA RÉVÉLATION</strong>
              <button className="pause" id="motionToggle" aria-pressed="false">
                <svg className="icon">
                  <use href="#pause" />
                </svg>
                <span>Vue statique</span>
              </button>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
