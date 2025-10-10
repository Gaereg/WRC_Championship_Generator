import {
  TStage,
  TLocation,
  TSeason,
  TWeatherType,
  TWeather,
  TWeatherTypeRaw,
} from "src/types";

export const isStageIsCorrect = (
  stage: TStage,
  tab: TStage[],
  nbKmLongStage: number,
  durationLeft: number,
  limitLongStage: number
) => {
  if (tab.length === 0) return true;

  const lastStage = tab[tab.length - 1];
  //not the same special twice in a row
  if (lastStage.id === stage.id) return false;
  //no reverse stage next after forward version
  if (lastStage.direction === "Forward" && stage.id === lastStage.id + 1) return false;
  //no forward stage next after reverse version
  if (lastStage.direction === "Reverse" && stage.id === lastStage.id - 1) return false;
  //long stage is limited to 30% of the rally distance
  if (stage.length >= limitLongStage && nbKmLongStage - stage.length < -10) return false;
  //no long stage twice in a row
  if (lastStage.length >= limitLongStage && stage.length >= limitLongStage) return false;
  //not long stage for the last stage
  if (stage.length > limitLongStage && durationLeft - stage.length < 0) return false;
  else return true;
};

export const isSeasonIsCorrect = (tab: string[], season: string, maxWinter: number) => {
  if (season === "Hiver" && tab.filter((s) => s === "Hiver").length > maxWinter)
    return false;
  return true;
};

export const isLocationIsCorrect = (
  location: TLocation,
  season: string,
  championship: TLocation[],
  maxAsphalt: number
) => {
  if (season !== "Hiver" && location.type === "Snow") return false;
  if (location.type === "Snow" && championship.at(-1)?.type === "Snow") return false;
  if (
    location.type === "Asphalt" &&
    championship.filter((rally) => rally.type === "Asphalt").length > maxAsphalt
  )
    return false;
  return true;
};

export const weatherTypeRaw = (type: TWeatherType): TWeatherTypeRaw =>
  type === "basicClear" || type === "basicCloud" ? "basic" : type;

export const isWeatherIsCorrect = (
  prevWeatherType: TWeatherType,
  nextWeatherType: TWeatherType,
  weathers: TWeather
) => {
  if (!weathers[weatherTypeRaw(nextWeatherType)]) return false;
  if (prevWeatherType === "extreme" && nextWeatherType === "extreme") return false;
  return true;
};

export const createWeatherWeight = (season: TSeason, weathers: TWeather) => {
  const percentPrecip = {
    Hiver: 0.35,
    Printemps: 0.2,
    Été: 0.15,
    Automne: 0.25,
  };

  const weathersPrecipWeight = {
    light_precip: Array(weathers["light_precip"]?.length).fill(1),
    heavy_precip: Array(weathers["light_precip"]?.length).fill(1),
    extreme: Array(weathers["light_precip"]?.length).fill(1),
  };

  return {
    basicClear: [0.5, 0.5, 0, 0, 0],
    basicCloud: [0.5, 0.5, 0.7 * percentPrecip[season], 0.3 * percentPrecip[season], 0],
    light_precip: [
      0,
      1,
      1 * percentPrecip[season],
      0.7 * percentPrecip[season],
      0.2 * percentPrecip[season],
    ],
    heavy_precip: [
      0,
      0.8,
      1.2 * percentPrecip[season],
      0.9 * percentPrecip[season],
      0.3 * percentPrecip[season],
    ],
    extreme: [
      0,
      0.2,
      0.8 * percentPrecip[season],
      0.4 * percentPrecip[season],
      0.1 * percentPrecip[season],
    ],
    weathersChoiceWeight: {
      basicClear: [1, 0, 0, 0],
      basicCloud: [0, 1, 1, 1],
      ...weathersPrecipWeight
    },
  };
};
