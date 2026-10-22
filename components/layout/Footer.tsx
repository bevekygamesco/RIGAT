import { site } from "@/lib/site";

export function Footer() {
  return (
    <>
      <footer className="site-footer" id="contact">
        <div className="footer-company">
          <a href="#top" aria-label="Rigat, retour à l’accueil">
            <img
              src="/assets/rigat-logo.svg?v=16"
              width="170"
              height="62"
              alt="RIGAT — Fabricant depuis 1956"
            />
          </a>
          <p>
            Fabricant de rideaux métalliques à Marseille depuis 1956. Solutions
            sur mesure pour l’habitat, les commerces et les industries.
          </p>
          <div className="france-mark">
            <i aria-hidden="true"></i>
            <span>
              FABRIQUÉ EN<strong>FRANCE</strong>
            </span>
          </div>
        </div>
        <div className="footer-column">
          <h3>Nos solutions</h3>
          <nav aria-label="Nos solutions">
            <button type="button" data-contact="">
              Rideaux métalliques
            </button>
            <button type="button" data-contact="">
              Grilles roulantes
            </button>
            <button type="button" data-contact="">
              Grilles extensibles
            </button>
            <button type="button" data-contact="">
              Portes de garage
            </button>
            <button type="button" data-contact="">
              Portes industrielles
            </button>
            <button type="button" data-contact="">
              Volets roulants
            </button>
          </nav>
        </div>
        <div className="footer-column">
          <h3>Navigation</h3>
          <nav aria-label="Navigation de pied de page">
            <a href="#top" data-home="">
              Accueil
            </a>
            <a href="#mechanisme" data-jump="5">
              Réalisations
            </a>
            <button type="button" data-contact="">
              Demande de devis
            </button>
            <a href="#contact">Contact</a>
          </nav>
          <a className="footer-up" href="#top" aria-label="Retour en haut">
            ↑
          </a>
        </div>
        <div className="footer-column footer-contact">
          <h3>Contact</h3>
          <address>
            <a
              href="https://www.google.com/maps/search/?api=1&query=76+avenue+Alexandre+Ansaldi+13013+Marseille"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span aria-hidden="true">⌖</span>76 avenue Alexandre Ansaldi
              <br />
              13013 Marseille
            </a>
            <a href={site.phoneHref}>
              <span aria-hidden="true">↗</span>
              {site.phone}
            </a>
            <a href="mailto:contact@fabricant-rideaux-metalliques.com">
              <span aria-hidden="true">@</span>
              contact@fabricant-rideaux-metalliques.com
            </a>
            <p>
              <span aria-hidden="true">◷</span>Lun – Ven : 8h00 – 18h00
            </p>
          </address>
          <button
            className="primary footer-quote"
            type="button"
            data-contact=""
          >
            Demander un devis <span aria-hidden="true">↗</span>
          </button>
        </div>
        <div className="footer-bottom">
          <span>
            © 2026 Rigat — Fabricant de rideaux métalliques à Marseille depuis
            1956
          </span>
          <div className="footer-notices">
            <details>
              <summary>Mentions légales</summary>
              <p>
                RIGAT — 76 avenue Alexandre Ansaldi, 13013 Marseille.
                <br />
                Téléphone : 04 91 98 32 80.
                <br />
                Contact : contact@fabricant-rideaux-metalliques.com.
              </p>
            </details>
            <details>
              <summary>Confidentialité</summary>
              <p>
                Le formulaire prépare un récapitulatif dans votre navigateur. Il
                n’envoie pas automatiquement vos informations. Pour transmettre
                votre demande, contactez RIGAT par téléphone ou par e-mail.
              </p>
            </details>
          </div>
        </div>
      </footer>
    </>
  );
}
