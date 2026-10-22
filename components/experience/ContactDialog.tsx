import type { CSSProperties } from "react";

export function ContactDialog() {
  return (
    <>
      <dialog id="contactDialog" aria-labelledby="dialogTitle">
        <button className="close" id="closeDialog" aria-label="Fermer">
          ×
        </button>
        <p className="eyebrow">VOTRE PROJET COMMENCE ICI</p>
        <h2 id="dialogTitle">DONNONS-LUI FORME.</h2>
        <p>
          Préparez un récapitulatif de votre besoin, puis copiez-le pour le
          transmettre à votre interlocuteur Rigat.
        </p>
        <form id="projectForm">
          <label htmlFor="name">Votre nom</label>
          <input
            id="name"
            name="name"
            autoComplete="name"
            required
            maxLength={90}
          />
          <label htmlFor="city">Ville du projet</label>
          <input
            id="city"
            name="city"
            autoComplete="address-level2"
            required
            maxLength={100}
          />
          <label htmlFor="need">Votre besoin</label>
          <textarea
            id="need"
            name="need"
            placeholder="Installation, motorisation, dimensions, contraintes…"
            required
            maxLength={1500}
          ></textarea>
          <button type="submit" className="primary">
            PRÉPARER MON RÉCAPITULATIF
            <span className="arrow">
              <svg className="icon">
                <use href="#arrow" />
              </svg>
            </span>
          </button>
        </form>
        <div className="success" id="summaryBox" role="status">
          <p
            id="summaryText"
            style={{ whiteSpace: "pre-wrap" } as CSSProperties}
          ></p>
          <button className="primary" id="copySummary">
            COPIER LE RÉCAPITULATIF
          </button>
        </div>
        <p className="dialog-note">
          Ce récapitulatif reste dans votre navigateur. Il n’est pas envoyé
          automatiquement.
        </p>
      </dialog>
    </>
  );
}
