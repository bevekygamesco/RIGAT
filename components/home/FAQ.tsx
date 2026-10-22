export function FAQ() {
  return (
    <>
      <section className="faq-section section-pad" id="questions">
        <div>
          <p className="kicker">LES RÉPONSES À VOS QUESTIONS</p>
          <h2>
            Parlons
            <br />
            <em>concrètement.</em>
          </h2>
          <p>Les premiers repères pour préparer votre projet de fermeture.</p>
          <button className="text-link" data-contact="">
            Échanger sur mon projet <span>↗</span>
          </button>
        </div>
        <div className="faq-list">
          <details>
            <summary>
              Quel type de fermeture choisir ?<span>+</span>
            </summary>
            <p>
              Rideau métallique, grille roulante ou porte de garage : le choix
              dépend de l’ouverture, de l’usage et du besoin de visibilité.
              Préparez les dimensions et quelques informations sur le lieu pour
              définir une solution adaptée.
            </p>
          </details>
          <details>
            <summary>
              Quelles informations préparer pour mon projet ?<span>+</span>
            </summary>
            <p>
              La largeur et la hauteur de l’ouverture, l’espace disponible pour
              le coffre et les coulisses, la ville du projet et la fréquence
              d’utilisation. Des photos du lieu facilitent aussi l’échange.
            </p>
          </details>
          <details>
            <summary>
              Peut-on motoriser un rideau métallique ?<span>+</span>
            </summary>
            <p>
              Une motorisation peut être envisagée selon les dimensions, le
              poids et la configuration du rideau. Sur une fermeture existante,
              l’état et la compatibilité du mécanisme doivent être vérifiés.
            </p>
          </details>
          <details>
            <summary>
              Les fermetures sont-elles réalisées sur mesure ?<span>+</span>
            </summary>
            <p>
              Le projet prend en compte les dimensions de votre ouverture et les
              contraintes du bâtiment. Le coffre, les coulisses, le tablier et
              le mécanisme se définissent ensemble.
            </p>
          </details>
        </div>
      </section>
    </>
  );
}
