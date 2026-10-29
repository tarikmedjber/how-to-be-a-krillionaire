import type { QuestionDef } from "../../domain/types.ts";

export const scienceAndSpace: QuestionDef[] = [
  {
    category: "Science & Space",
    prompt: "Name a planet in our solar system",
    answers: [
      "Mercury", "Venus", "Earth", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune", "Pluto*",
    ],
  },
  {
    category: "Science & Space",
    prompt: "Name a Greek letter",
    answers: [
      "Alpha", "Beta", "Gamma", "Delta", "Epsilon", "Zeta", "Eta", "Theta", "Iota", "Kappa",
      "Lambda", "Mu", "Nu", "Xi", "Omicron", "Pi", "Rho", "Sigma", "Tau", "Upsilon", "Phi", "Chi",
      "Psi", "Omega",
    ],
  },
  {
    category: "Science & Space",
    prompt: "Name a moon in our solar system",
    open: true,
    answers: [
      "The Moon|Moon|Luna", "Phobos", "Deimos", "Io", "Europa", "Ganymede", "Callisto", "Amalthea",
      "Himalia", "Metis", "Thebe", "Adrastea", "Titan", "Enceladus", "Mimas", "Rhea", "Iapetus",
      "Dione", "Tethys", "Hyperion", "Phoebe", "Janus", "Epimetheus", "Pandora", "Prometheus",
      "Miranda", "Ariel", "Umbriel", "Titania", "Oberon", "Puck", "Triton", "Nereid", "Proteus",
      "Charon*", "Nix*", "Hydra*",
    ],
  },
  {
    category: "Science & Space",
    prompt: "Name an SI base unit",
    answers: [
      "Metre|Meter", "Kilogram", "Second", "Ampere|Amp", "Kelvin", "Mole", "Candela",
    ],
  },
  {
    category: "Science & Space",
    prompt: "Name an SI prefix (like kilo or milli)",
    answers: [
      "Quecto", "Ronto", "Yocto", "Zepto", "Atto", "Femto", "Pico", "Nano", "Micro", "Milli",
      "Centi", "Deci", "Deca|Deka", "Hecto", "Kilo", "Mega", "Giga", "Tera", "Peta", "Exa",
      "Zetta", "Yotta", "Ronna", "Quetta",
    ],
  },
  {
    category: "Science & Space",
    prompt: "Name a bone in the human body",
    open: true,
    answers: [
      "Skull|Cranium", "Mandible|Jaw", "Maxilla", "Clavicle|Collarbone", "Scapula|Shoulder Blade",
      "Sternum|Breastbone", "Rib", "Humerus", "Radius", "Ulna", "Carpal", "Metacarpal",
      "Phalanges|Phalanx", "Vertebra|Vertebrae", "Pelvis|Hip Bone", "Sacrum", "Coccyx|Tailbone",
      "Femur|Thigh Bone", "Patella|Kneecap", "Tibia|Shin Bone", "Fibula", "Tarsal", "Metatarsal",
      "Talus", "Calcaneus|Heel Bone", "Hyoid", "Stapes|Stirrup", "Incus|Anvil", "Malleus|Hammer",
      "Frontal", "Parietal", "Temporal", "Occipital", "Sphenoid", "Ethmoid", "Zygomatic|Cheekbone",
      "Nasal", "Lacrimal", "Vomer", "Atlas", "Axis", "Ilium", "Ischium", "Pubis", "Scaphoid",
      "Lunate", "Trapezium", "Hamate", "Navicular", "Cuboid", "Cuneiform",
    ],
  },
  {
    category: "Science & Space",
    prompt: "Name an organ of the human body",
    open: true,
    answers: [
      "Heart", "Brain", "Lungs|Lung", "Liver", "Kidneys|Kidney", "Stomach", "Skin", "Pancreas",
      "Spleen", "Gallbladder", "Bladder", "Small Intestine", "Large Intestine|Colon", "Appendix",
      "Oesophagus|Esophagus", "Thyroid", "Adrenal Glands", "Tongue", "Eyes|Eye", "Ears|Ear",
      "Uterus|Womb", "Ovaries", "Testes", "Prostate", "Thymus", "Larynx", "Trachea|Windpipe",
      "Diaphragm*", "Tonsils", "Pituitary Gland", "Spinal Cord", "Rectum", "Duodenum", "Nose",
    ],
  },
  {
    category: "Science & Space",
    prompt: "Name a blood type",
    answers: [
      "A+|A positive", "A-|A negative", "B+|B positive", "B-|B negative", "AB+|AB positive",
      "AB-|AB negative", "O+|O positive", "O-|O negative",
    ],
  },
  {
    category: "Science & Space",
    prompt: "Name a dinosaur",
    open: true,
    answers: [
      "Tyrannosaurus Rex|T-Rex|T Rex", "Triceratops", "Velociraptor|Raptor", "Stegosaurus",
      "Brachiosaurus", "Diplodocus", "Brontosaurus|Apatosaurus", "Spinosaurus", "Ankylosaurus",
      "Allosaurus", "Iguanodon", "Parasaurolophus", "Pachycephalosaurus", "Archaeopteryx*",
      "Pterodactyl*|Pteranodon*", "Gallimimus", "Dilophosaurus", "Carnotaurus", "Giganotosaurus",
      "Argentinosaurus", "Compsognathus", "Oviraptor", "Protoceratops", "Deinonychus",
      "Therizinosaurus", "Baryonyx", "Megalosaurus", "Maiasaura", "Utahraptor", "Microraptor",
      "Edmontosaurus", "Styracosaurus", "Plateosaurus", "Coelophysis", "Mosasaurus*",
      "Plesiosaurus*", "Corythosaurus", "Troodon", "Albertosaurus", "Indominus Rex*",
    ],
  },
  {
    category: "Science & Space",
    prompt: "Name a constellation",
    open: true,
    answers: [
      "Orion", "Ursa Major|Great Bear|Big Dipper*|Plough*", "Ursa Minor|Little Bear", "Cassiopeia",
      "Cygnus", "Leo", "Scorpius|Scorpio", "Taurus", "Gemini", "Cancer", "Virgo", "Libra",
      "Sagittarius", "Capricornus|Capricorn", "Aquarius", "Pisces", "Aries", "Andromeda",
      "Perseus", "Pegasus", "Draco", "Lyra", "Aquila", "Centaurus", "Crux|Southern Cross",
      "Canis Major", "Canis Minor", "Hercules", "Bootes", "Ophiuchus", "Hydra", "Cepheus",
      "Auriga", "Corona Borealis", "Delphinus", "Lepus", "Monoceros", "Phoenix", "Carina", "Vela",
      "Puppis", "Eridanus", "Columba", "Lupus", "Ara", "Pavo", "Tucana", "Grus", "Sculptor",
      "Fornax", "Cetus", "Triangulum", "Sagitta", "Vulpecula", "Lynx", "Camelopardalis",
    ],
  },
  {
    category: "Science & Space",
    prompt: "Name a bird of prey",
    open: true,
    answers: [
      "Eagle", "Golden Eagle", "Bald Eagle", "Harpy Eagle", "White-tailed Eagle|Sea Eagle", "Hawk",
      "Red-tailed Hawk", "Falcon", "Peregrine Falcon|Peregrine", "Kestrel", "Hobby", "Merlin",
      "Gyrfalcon", "Owl", "Barn Owl", "Tawny Owl", "Snowy Owl", "Eagle Owl", "Buzzard",
      "Red Kite|Kite", "Osprey", "Vulture", "Condor", "Harrier|Hen Harrier|Marsh Harrier",
      "Sparrowhawk", "Goshawk", "Secretary Bird", "Caracara", "Kookaburra*",
    ],
  },
];
