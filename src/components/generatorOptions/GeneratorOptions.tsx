import React from "react";
import {
  InputAdornment,
  Stack,
  TextField,
  Card,
  Typography,
  useTheme,
  MenuItem,
  Tooltip
} from "@mui/material";
import InfoIcon from '@mui/icons-material/Info';
import { TSeason } from "src/types";

type Props = {
  nbRally: number;
  rallyDistance: number;
  kmAssist: number;
  percentageWinter: number;
  percentageAsphalt: number;
  percentageLongStage: number;
  precipSeasons: {[type in TSeason]: number};
  onChangeNbRally: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeRallyDistance: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeKmAssist: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onChangePercentageWinter: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onChangePercentageAsphalt: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onChangePercentageLongStage: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onChangePrecipSeasons: (e: React.ChangeEvent<HTMLInputElement>, season: TSeason) => void;
};

const TextFieldPercentage = ({
  label,
  value,
  callback,
  helper,
  width = 115,
}: {
  label: React.ReactNode;
  callback: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value: number;
  helper?: string;
  width?: number;
}) => (
  <TextField
    sx={{ width: `${width}px` }}
    label={label}
    type="number"
    {...(helper && { helperText: helper })}
    onChange={callback}
    value={Math.round(value * 100)}
    slotProps={{
      htmlInput: {
        min: 0,
        max: 100,
      },
      input: {
        endAdornment: <InputAdornment position="end">%</InputAdornment>,
      },
    }}
  />
);

const optionWeather = [
  { value: "0.5", label: "faible" },
  { value: "1", label: "par défaut" },
  { value: "2", label: "forte" },
  { value: "2.5", label: "très forte" },
];

const Select = ({
  txt,
  value,
  callback,
}: {
  txt: string;
  callback: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value: number;
}) => (
  <TextField select label={txt} value={value} onChange={callback} sx={{ mr: '10px', minWidth: '100px' }}>
    {optionWeather.map((option) => (
      <MenuItem key={option.value} value={option.value}>
        {option.label}
      </MenuItem>
    ))}
  </TextField>
);

const GeneratorOptions = ({
  nbRally,
  rallyDistance,
  kmAssist,
  percentageWinter,
  percentageAsphalt,
  percentageLongStage,
  precipSeasons,
  onChangeNbRally,
  onChangeRallyDistance,
  onChangeKmAssist,
  onChangePercentageWinter,
  onChangePercentageAsphalt,
  onChangePercentageLongStage,
  onChangePrecipSeasons
}: Props) => {
  const theme = useTheme();

  return (
    <>
      <Stack direction="row" spacing={2} sx={{ flexWrap: "wrap", mb: "35px" }} useFlexGap>
        <TextField
          sx={{ width: "125px" }}
          label="Nombre de Rallye"
          type="number"
          onChange={onChangeNbRally}
          value={nbRally}
        />
        <TextField
          sx={{ width: "140px" }}
          label="Longueur des Rallye"
          type="number"
          onChange={onChangeRallyDistance}
          value={rallyDistance}
          slotProps={{
            input: {
              endAdornment: <InputAdornment position="end">km</InputAdornment>,
            },
          }}
        />
        <TextField
          sx={{ width: "165px" }}
          label="distance entre assistance"
          type="number"
          onChange={onChangeKmAssist}
          value={kmAssist}
          slotProps={{
            input: {
              endAdornment: <InputAdornment position="end">km</InputAdornment>,
            },
          }}
        />

        <TextFieldPercentage
          label="Rally Asphalt"
          value={percentageAsphalt}
          callback={onChangePercentageAsphalt}
        />
        <TextFieldPercentage
          label={
            <Stack direction="row">
              % de spécial longue
            <Tooltip sx={{ ml:'5px' }} title="pourcentage max de la longueur du rallye composé par des spécials d'une longeur supérieur à 17km">
              <InfoIcon />
            </Tooltip>
            </Stack>
          }
          value={percentageLongStage}
          callback={onChangePercentageLongStage}
          width={165}
        />
        <TextFieldPercentage
          label="Rally Hivernaux"
          value={percentageWinter}
          callback={onChangePercentageWinter}
        />
      </Stack>

      <Card variant="outlined" sx={{ padding: "0 10px 10px 10px", overflow: "visible", width: "fit-content" }}>
        <Stack direction="row" sx={{
          color: "text.secondary",
          bgcolor: theme.palette.background.default,
          width: "fit-content",
          fontSize: 14,
          mt: "-12px",
          mb: "20px",
          padding: "0 5px",
        }}>

          <Typography
            sx={{
              mr: '10px',
              fontSize: 14,

            }}
          >
            Chance de précipitation
          </Typography>
          <Tooltip sx={{ fontSize: '20px' }} title="Les chances de précipitations sont par defaut adapté en fonction de la saison hiver>automne>printemps>été, vous pouvez tout de même augmenter ou réduire les risques de pluie par saison">
            <InfoIcon />
          </Tooltip>
        </Stack>
        <Stack direction="row" spacing={2}>
          <Select callback={(e) => onChangePrecipSeasons(e, 'Hiver')} txt='Hiver' value={precipSeasons["Hiver"]} />
          <Select callback={(e) => onChangePrecipSeasons(e, 'Printemps')} txt='Printemps' value={precipSeasons["Printemps"]} />
          <Select callback={(e) => onChangePrecipSeasons(e, 'Été')} txt='Été' value={precipSeasons["Été"]} />
          <Select callback={(e) => onChangePrecipSeasons(e, 'Automne')} txt='Automne' value={precipSeasons["Automne"]} />
        </Stack>
      </Card>
    </>
  );
};

export default GeneratorOptions;
