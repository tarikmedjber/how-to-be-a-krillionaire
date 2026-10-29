import { deriveQuestions } from "../domain/derive.ts";
import { withIds } from "../domain/questionBank.ts";
import type { Question, QuestionDef } from "../domain/types.ts";
import { capitalsAndCities } from "./questions/capitals-and-cities.ts";
import { countries } from "./questions/countries.ts";
import { culture } from "./questions/culture.ts";
import { devCs } from "./questions/dev-cs.ts";
import { devLanguages } from "./questions/dev-languages.ts";
import { devToolsAndInfra } from "./questions/dev-tools-and-infra.ts";
import { devWeb } from "./questions/dev-web.ts";
import { elements } from "./questions/elements.ts";
import { everyday } from "./questions/everyday.ts";
import { filmAndTv } from "./questions/film-and-tv.ts";
import { foodAndDrink } from "./questions/food-and-drink.ts";
import { games } from "./questions/games.ts";
import { maths } from "./questions/maths.ts";
import { music } from "./questions/music.ts";
import { scienceAndSpace } from "./questions/science-and-space.ts";
import { sport } from "./questions/sport.ts";
import { usStates } from "./questions/us-states.ts";

/** Hand-written questions. To add one, append it to the right category file. */
export const BASE_QUESTIONS: readonly QuestionDef[] = [
  ...devLanguages,
  ...devWeb,
  ...devToolsAndInfra,
  ...devCs,
  ...countries,
  ...capitalsAndCities,
  ...usStates,
  ...elements,
  ...scienceAndSpace,
  ...maths,
  ...sport,
  ...filmAndTv,
  ...music,
  ...games,
  ...culture,
  ...foodAndDrink,
  ...everyday,
];

export const BUILT_IN_QUESTIONS: readonly Question[] = withIds([...BASE_QUESTIONS, ...deriveQuestions(BASE_QUESTIONS)]);
