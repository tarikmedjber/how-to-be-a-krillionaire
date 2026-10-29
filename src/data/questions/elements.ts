import type { QuestionDef } from "../../domain/types.ts";

export const elements: QuestionDef[] = [
  {
    category: "Elements",
    prompt: "Name a chemical element",
    listKey: "elements",
    answers: [
      "Hydrogen", "Helium", "Lithium", "Beryllium", "Boron", "Carbon", "Nitrogen", "Oxygen",
      "Fluorine", "Neon", "Sodium", "Magnesium", "Aluminium|Aluminum", "Silicon", "Phosphorus",
      "Sulfur|Sulphur", "Chlorine", "Argon", "Potassium", "Calcium", "Scandium", "Titanium",
      "Vanadium", "Chromium", "Manganese", "Iron", "Cobalt", "Nickel", "Copper", "Zinc", "Gallium",
      "Germanium", "Arsenic", "Selenium", "Bromine", "Krypton", "Rubidium", "Strontium", "Yttrium",
      "Zirconium", "Niobium", "Molybdenum", "Technetium", "Ruthenium", "Rhodium", "Palladium",
      "Silver", "Cadmium", "Indium", "Tin", "Antimony", "Tellurium", "Iodine", "Xenon",
      "Caesium|Cesium", "Barium", "Lanthanum", "Cerium", "Praseodymium", "Neodymium", "Promethium",
      "Samarium", "Europium", "Gadolinium", "Terbium", "Dysprosium", "Holmium", "Erbium",
      "Thulium", "Ytterbium", "Lutetium", "Hafnium", "Tantalum", "Tungsten", "Rhenium", "Osmium",
      "Iridium", "Platinum", "Gold", "Mercury", "Thallium", "Lead", "Bismuth", "Polonium",
      "Astatine", "Radon", "Francium", "Radium", "Actinium", "Thorium", "Protactinium", "Uranium",
      "Neptunium", "Plutonium", "Americium", "Curium", "Berkelium", "Californium", "Einsteinium",
      "Fermium", "Mendelevium", "Nobelium", "Lawrencium", "Rutherfordium", "Dubnium", "Seaborgium",
      "Bohrium", "Hassium", "Meitnerium", "Darmstadtium", "Roentgenium", "Copernicium", "Nihonium",
      "Flerovium", "Moscovium", "Livermorium", "Tennessine", "Oganesson",
    ],
  },
  {
    category: "Elements",
    prompt: "Name an element whose symbol is a single letter",
    answers: [
      "Hydrogen", "Boron", "Carbon", "Nitrogen", "Oxygen", "Fluorine", "Phosphorus",
      "Sulfur|Sulphur", "Potassium", "Vanadium", "Yttrium", "Iodine", "Tungsten", "Uranium",
    ],
  },
  {
    category: "Elements",
    prompt: "Name an element whose symbol doesn't start with the same letter as its name",
    answers: [
      "Sodium", "Potassium", "Iron", "Copper", "Silver", "Tin", "Antimony", "Tungsten", "Gold",
      "Mercury", "Lead",
    ],
  },
  {
    category: "Elements",
    prompt: "Name an element named after a place",
    answers: [
      "Americium", "Berkelium", "Californium", "Darmstadtium", "Dubnium", "Europium", "Francium",
      "Gallium", "Germanium", "Hafnium", "Hassium", "Holmium", "Livermorium", "Lutetium",
      "Magnesium", "Moscovium", "Nihonium", "Polonium", "Rhenium", "Ruthenium", "Scandium",
      "Strontium", "Tennessine", "Thulium", "Ytterbium", "Yttrium", "Erbium", "Terbium", "Copper*",
      "Manganese*",
    ],
  },
  {
    category: "Elements",
    prompt: "Name an element named after a person",
    answers: [
      "Curium", "Einsteinium", "Fermium", "Mendelevium", "Nobelium", "Lawrencium", "Rutherfordium",
      "Seaborgium", "Bohrium", "Meitnerium", "Roentgenium", "Copernicium", "Flerovium",
      "Oganesson", "Gadolinium", "Samarium*",
    ],
  },
  {
    category: "Elements",
    prompt: "Name an element that's a gas at room temperature",
    answers: [
      "Hydrogen", "Helium", "Nitrogen", "Oxygen", "Fluorine", "Neon", "Chlorine", "Argon",
      "Krypton", "Xenon", "Radon",
    ],
  },
  {
    category: "Elements",
    prompt: "Name a noble gas",
    answers: [
      "Helium", "Neon", "Argon", "Krypton", "Xenon", "Radon", "Oganesson*",
    ],
  },
];
