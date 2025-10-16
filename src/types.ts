export type TSeason = "Hiver" | "Printemps" | "Été" | "Automne";

export type TLocation = {
  name: TRallyName;
  type: string;
  isOnlyWinter?: boolean;
};

export type TLocationSeason = TLocation & {
  season: TSeason;
};

export type TStage = {
  name: string;
  id: number;
  length: number;
  type: string;
  direction: string;
};

export type TGeneratedStage = TStage & {
  assist?: string;
  weather: {
    type: TWeatherType;
    value: string;
    surfaceState: "neige" | "sec" | "humide";
    nextSurfaceState: string[];
  };
};

export type TRally = TLocationSeason & {
  distance: number;
  stages: TGeneratedStage[];
  id: string;
};

export type TRallyData = {
  type: string;
  weathers: TSeasonsWeather;
  stages: TStage[];
};

export type TSeasonsWeather = {
  [season in "Hiver" | "Printemps" | "Été" | "Automne"]?: TWeather;
};

export type TWeather = {
  basic: TWeatherData[];
  light_precip?: TWeatherData[];
  heavy_precip?: TWeatherData[];
  extreme?: TWeatherData[];
};

export type TWeatherData = { name: string; state: string[]; nextState: string[] };

export type TData = {
  [type in TRallyName]: TRallyData;
};

export type TSavedChampionship = {
  [key: string]: TLocationSeason[];
};

export type TWeatherWeight = {
  [type in TWeatherType]: number[];
} & {
  weathersChoiceWeight: {
    [type in TWeatherType]: number[];
  };
};

export type TWeatherType =
  | "basicClear"
  | "basicCloud"
  | "light_precip"
  | "heavy_precip"
  | "extreme";

export type TWeatherTypeRaw = "basic" | "light_precip" | "heavy_precip" | "extreme";

export type TTitleSavedChampionship = "WRC2 2024";

export type TRallyName =
  | "Monte Carlo"
  | "Sweden"
  | "Mexico"
  | "Croatia"
  | "Portugal"
  | "Italia Sardegna"
  | "Kenya"
  | "Estonia"
  | "Finland"
  | "Greece"
  | "Chile"
  | "Japan"
  | "Mediterraneo"
  | "Pacifico"
  | "Oceania"
  | "Scandia"
  | "Iberia"
  | "Central Europe"
  | "Poland"
  | "Latvia";
