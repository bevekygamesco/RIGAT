export const models = [
  {
    id: "plein",
    name: "Lames pleines",
    tag: "Protection & intimité",
    detail:
      "Un tablier en acier à lames pleines pour une fermeture visuellement opaque.",
  },
  {
    id: "microperfore",
    name: "Microperforé",
    tag: "Lumière & visibilité",
    detail:
      "Des microperforations qui laissent entrevoir votre vitrine, même fermée.",
  },
  {
    id: "tubes",
    name: "Grille à tubes",
    tag: "Une vitrine ouverte",
    detail:
      "Une structure tubulaire ajourée pour conserver la visibilité de votre espace.",
  },
  {
    id: "grille",
    name: "Grille à mailles",
    tag: "Élégance & transparence",
    detail:
      "Un maillage métallique arrondi, inspiré du modèle de la collection.",
  },
  {
    id: "sectionnelle",
    name: "Porte sectionnelle",
    tag: "Confort & discrétion",
    detail:
      "Des panneaux horizontaux et un refoulement au plafond pour votre garage.",
  },
] as const;
export type ModelId = (typeof models)[number]["id"];
export const finishes = [
  { id: "acier", name: "Acier", code: "Métallique", hex: "#abb3bc" },
  { id: "blanc", name: "Blanc", code: "RAL 9010", hex: "#f0ede3" },
  { id: "noir", name: "Noir", code: "RAL 9005", hex: "#15191e" },
] as const;
export type FinishId = (typeof finishes)[number]["id"];
export type Part = "curtain" | "bottom" | "guides" | "housing";
export const parts: { id: Part; name: string }[] = [
  { id: "curtain", name: "Tablier" },
  { id: "bottom", name: "Lame finale" },
  { id: "guides", name: "Coulisses" },
  { id: "housing", name: "Coffre" },
];
export type Configuration = {
  model: ModelId;
  width: number;
  height: number;
  housing: "facette" | "arrondi";
  colors: Record<Part, FinishId>;
};
export const defaults: Configuration = {
  model: "plein",
  width: 3000,
  height: 2800,
  housing: "facette",
  colors: {
    curtain: "acier",
    bottom: "acier",
    guides: "acier",
    housing: "acier",
  },
};
export const steps = ["Modèle", "Dimensions", "Finitions", "Récapitulatif"];
export function summary(c: Configuration) {
  return [
    "RIGAT — MON PROJET SUR MESURE",
    models.find((m) => m.id === c.model)!.name,
    `Largeur : ${c.width} mm`,
    `Hauteur : ${c.height} mm`,
    c.model === "sectionnelle"
      ? "Porte sectionnelle · refoulement au plafond"
      : `Coffre : ${c.housing === "facette" ? "Facetté" : "Arrondi"}`,
    ...parts
      .filter((p) => c.model !== "sectionnelle" || p.id !== "housing")
      .map((p) => {
        const f = finishes.find((f) => f.id === c.colors[p.id])!;
        return `${p.name} : ${f.name} · ${f.code}`;
      }),
    "Dimensions et faisabilité à confirmer par RIGAT.",
  ].join("\n");
}
