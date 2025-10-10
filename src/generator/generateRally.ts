import weightedRandom, { updateChoiceWeight } from "./weightedRandom";
import {
  isStageIsCorrect,
  isLocationIsCorrect,
  isSeasonIsCorrect,
  createWeatherWeight,
  isWeatherIsCorrect,
  weatherTypeRaw,
} from "./utils";
import {
  TStage,
  TLocation,
  TSeason,
  TLocationSeason,
  TWeather,
  TRallyData,
  TWeatherWeight,
  TWeatherType,
  TWeatherData,
  TGeneratedStage,
} from "src/types";

const limitLongStage = 16;
const seasons: TSeason[] = ["Hiver", "Printemps", "Été", "Automne"];
const seasonWeigh = [0.15, 1, 1, 1];
const weathersType: TWeatherType[] = [
  "basicClear",
  "basicCloud",
  "light_precip",
  "heavy_precip",
  "extreme",
];

const generateAssistPark = (
  stage: TGeneratedStage,
  rally: TGeneratedStage[],
  nbKmSinceLastAssist: number,
  kmAssist: number
): [TGeneratedStage, number] => {
  //add long assist every X km
  if (rally.length === 0 || nbKmSinceLastAssist > kmAssist) {
    stage = { ...stage, assist: "Longue" };
    nbKmSinceLastAssist = 0;
    //add short assist before long stage if no assist at the last stage
  } else if (
    stage.length > 18 &&
    nbKmSinceLastAssist > kmAssist / 2 &&
    !rally.at(-1)?.assist
  ) {
    stage = { ...stage, assist: "Courte" };
  }
  return [stage, nbKmSinceLastAssist];
};

const generateSurfaceState = (weatherData: TWeatherData, prevStage?: TGeneratedStage) => {
  if (!prevStage) return weatherData.state[0];
  return prevStage.weather.nextSurfaceState.find((state: string) =>
    weatherData.state.some((val: string) => val === state)
  );
};

const generateWeather = (
  stage: TStage,
  weatherWeight: TWeatherWeight,
  weathers: TWeather,
  prevStage?: TGeneratedStage
) => {
  const prevType =
    prevStage?.weather?.type || weathersType[Math.floor(Math.random() * 2)];
  let weatherType: TWeatherType = weightedRandom(weathersType, weatherWeight[prevType]);
  
  while (!isWeatherIsCorrect(prevType, weatherType, weathers)) {
    weatherType = weightedRandom(weathersType, weatherWeight[prevType]);
  };

  const weatherChoices: TWeatherData[] = weathers[weatherTypeRaw(weatherType)]!;
  const weatherData = weightedRandom(
    weatherChoices,
    weatherWeight.weathersChoiceWeight[weatherType]
  );
  const surfaceState = generateSurfaceState(weatherData, prevStage);

  return {
    ...stage,
    weather: {
      value: `${weatherData.name} (${surfaceState})`,
      surfaceState: surfaceState,
      type: weatherType,
      nextSurfaceState: weatherData.nextState,
    },
  };
};

export const generateStages = (
  rallyData: TRallyData,
  duration: number,
  percentageLongStage: number,
  kmAssist: number,
  season: TSeason
): { stages: TGeneratedStage[]; distance: number } => {
  const { stages, weathers } = rallyData;
  let rallyDistance = 0;
  let nbKmLongStage = duration * percentageLongStage;
  let nbKmSinceLastAssist = 0;
  let rally: TGeneratedStage[] = [];
  let weights = Array(stages.length).fill(1);

  if (!weathers[season]) throw `Data error no weather for ${season}`
  const weatherWeight = createWeatherWeight(season, weathers[season]);

  while (rallyDistance < duration - 2) {
    let stage = weightedRandom(stages, weights);    
    if (
      isStageIsCorrect(
        stage,
        rally,
        nbKmLongStage,
        duration - rallyDistance,
        limitLongStage
      )
    ) {
      [stage, nbKmSinceLastAssist] = generateAssistPark(
        stage,
        rally,
        nbKmSinceLastAssist,
        kmAssist
      );
      stage = generateWeather(stage, weatherWeight, weathers[season], rally.at(-1));

      rally = [...rally, stage];
      weights = Object.assign(weights.slice(), {
        [stage.id - 1]: weights[stage.id - 1] / 10,
      });
      rallyDistance += stage.length;
      nbKmSinceLastAssist += stage.length;
      if (stage.length >= limitLongStage) {
        nbKmLongStage -= stage.length;
        //limit forward-reverse of the long stage
        if (stage.length >= limitLongStage) {
          const weightId = stage.direction === "Forward" ? stage.id : stage.id - 1;
          weights = Object.assign(weights.slice(), {
            [weightId]: weights[weightId] / 5,
          });
        }
      }
    }
  }

  //add Assist Park for last stage
  if (rally.at(-2)?.assist !== "Longue" && rally.at(-1)?.assist !== "Longue") {
    rally = Object.assign(rally.slice(), {
      [rally.length - 1]: { ...rally.at(-1), assist: "Intermédiaire" },
    });
  }
  return { stages: rally, distance: rallyDistance };
};

export const generateSeasons = (nbRally: number, percentageWinter: number): TSeason[] => {
  const maxWinter = Math.floor(nbRally * percentageWinter);
  const firstSeasonIdx = Math.floor(Math.random() * 4);
  const seasonsOrder = [
    ...seasons.slice(firstSeasonIdx, seasons.length),
    ...seasons.slice(0, firstSeasonIdx),
  ];
  let weights = [
    ...seasonWeigh.slice(firstSeasonIdx, seasonWeigh.length),
    ...seasonWeigh.slice(0, firstSeasonIdx),
  ];
  let result = nbRally > 6 ? seasonsOrder : [];

  while (result.length < nbRally) {
    const season = weightedRandom(seasonsOrder, weights);
    const seasonIdx = seasonsOrder.indexOf(season);
    weights = updateChoiceWeight(weights, seasonIdx, weights[seasonIdx] / 3);

    if (isSeasonIsCorrect(result, season, maxWinter)) {
      result = [...result, season];
    }
  }

  return result.toSorted((a, b) => seasonsOrder.indexOf(a) - seasonsOrder.indexOf(b));
};

export const generateLocations = (
  rallySeasons: TSeason[],
  locationsChoices: TLocation[],
  percentageAsphalt: number
) => {
  let locationWeight: number[] = locationsChoices.map(() => 1);
  let locationWeightWinter: number[] = locationsChoices.map((location) =>
    location.type === "Snow" ? 1 : 0.15
  );
  const maxAsphalt = Math.floor(rallySeasons.length * percentageAsphalt);

  return rallySeasons.reduce((acc: TLocationSeason[], season: TSeason) => {
    let rallyLocation: TLocation;
    do {
      rallyLocation = weightedRandom(
        locationsChoices,
        season === "Hiver" ? locationWeightWinter : locationWeight
      );
    } while (!isLocationIsCorrect(rallyLocation, season, acc, maxAsphalt));

    //update weight tab
    const locationId = locationsChoices.indexOf(rallyLocation);
    locationWeight = updateChoiceWeight(locationWeight, locationId, 0);
    locationWeightWinter = updateChoiceWeight(locationWeightWinter, locationId, 0);

    return [...acc, { ...rallyLocation, season }];
  }, []);
};
