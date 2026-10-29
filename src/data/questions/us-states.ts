import type { QuestionDef } from "../../domain/types.ts";

export const usStates: QuestionDef[] = [
  {
    category: "US States",
    prompt: "Name a US state",
    listKey: "states",
    answers: [
      "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut",
      "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas",
      "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota",
      "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey",
      "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon",
      "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas",
      "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming",
    ],
  },
  {
    category: "US States",
    prompt: "Name a US state beginning with M or N",
    answers: [
      "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri",
      "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York",
      "North Carolina", "North Dakota",
    ],
  },
  {
    category: "US States",
    prompt: "Name one of the original 13 colonies / states",
    answers: [
      "Delaware", "Pennsylvania", "New Jersey", "Georgia", "Connecticut", "Massachusetts",
      "Maryland", "South Carolina", "New Hampshire", "Virginia", "New York", "North Carolina",
      "Rhode Island",
    ],
  },
  {
    category: "US States",
    prompt: "Name a US state that borders Canada",
    answers: [
      "Alaska", "Washington", "Idaho", "Montana", "North Dakota", "Minnesota", "Michigan",
      "New York", "Vermont", "New Hampshire", "Maine", "Ohio*", "Pennsylvania*",
    ],
  },
  {
    category: "US States",
    prompt: "Name a US state that borders Mexico",
    answers: [
      "California", "Arizona", "New Mexico", "Texas",
    ],
  },
  {
    category: "US States",
    prompt: "Name a US state with a Great Lakes shoreline",
    answers: [
      "Minnesota", "Wisconsin", "Illinois", "Indiana", "Michigan", "Ohio", "Pennsylvania",
      "New York",
    ],
  },
  {
    category: "US States",
    prompt: "Name a US state with a Pacific coastline",
    answers: [
      "California", "Oregon", "Washington", "Alaska", "Hawaii",
    ],
  },
  {
    category: "US States",
    prompt: "Name a US state on the Gulf of Mexico",
    answers: [
      "Texas", "Louisiana", "Mississippi", "Alabama", "Florida",
    ],
  },
];
