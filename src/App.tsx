import {
  generateStages,
  generateSeasons,
  generateLocations,
} from "./generator/generateRally";
import {
  TData,
  TLocation,
  TRally,
  TRallyName,
  TSavedChampionship,
  TSeason,
  TTitleSavedChampionship,
} from "src/types";
import _data from "./data/data.json";
import _savedChampionship from "./data/savedChampionship.json";
import Rally from "@components/rally/rally";
import { useState } from "react";
import Container from "@mui/material/Container";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  AppBar,
  Box,
  Button,
  Stack,
  Typography,
} from "@mui/material";
import uniqid from "uniqid";
import CardButtonGroup from "@components/CardButtonGroup/CardButtonGroup";
import GeneratorOptions from "@components/generatorOptions/GeneratorOptions";

const data = _data as TData;
const savedChampionship = _savedChampionship as TSavedChampionship;

const typedKeysData = Object.keys(data) as TRallyName[];
const rallyLocations: TLocation[] = typedKeysData
  .map((rally) => ({
    name: rally,
    type: data[rally].type,
    isOnlyWinter: !data[rally].weathers.Printemps
  }))
  .sort((a, b) => {
    if (a.name.toUpperCase() < b.name.toUpperCase()) return -1;
    if (a.name.toUpperCase() > b.name.toUpperCase()) return 1;
    return 0
  });

console.log(rallyLocations);

function App() {
  const [championship, setChampionship] = useState<TRally[]>([]);
  const [nbRally, setNbRally] = useState<number>(13);
  const [rallyDistance, setRallyDistance] = useState<number>(100);
  const [kmAssist, setKmAssist] = useState<number>(35);
  const [percentageWinter, setPercentageWinter] = useState<number>(0.2);
  const [percentageAsphalt, setPercentageAsphalt] = useState<number>(0.3);
  const [percentageLongStage, setPercentageLongStage] = useState<number>(0.4);
  const [precipSeasons, setPrecipSeasons] = useState({
    Hiver: 1,
    Printemps: 1,
    Été: 1,
    Automne: 1,
  });

  const generate = () => {
    if (nbRally > rallyLocations.length)
      throw "Nombre de rally demandé dépasse le nombre de rally dispo";
    const seasons = generateSeasons(nbRally, percentageWinter);
    const locations = generateLocations(seasons, rallyLocations, percentageAsphalt);
    const generatedChampionship: TRally[] = locations.map((location) => ({
      id: uniqid(),
      ...location,
      ...generateStages(
        data[location.name],
        rallyDistance,
        percentageLongStage,
        kmAssist,
        location.season,
        precipSeasons
      ),
    }));
    setChampionship(generatedChampionship);
  };

  const generateSavedChampionship = (title: TTitleSavedChampionship) => {
    const generatedChampionship: TRally[] = savedChampionship[title].map((location) => ({
      id: uniqid(),
      ...location,
      ...generateStages(
        data[location.name],
        rallyDistance,
        percentageLongStage,
        kmAssist,
        location.season,
        precipSeasons
      ),
    }));
    setChampionship(generatedChampionship);
  };

  const checkPercentage = (value: number) => {
    if (value > 100) return 100;
    if (value < 0) return 0;
    return value;
  };

  const changeRally = (idx: number, season: TSeason, name: TRallyName) => {
    const newRally: TRally = {
      name,
      season,
      type: data[name].type,
      id: championship[idx].id,
      ...generateStages(
        data[name],
        rallyDistance,
        percentageLongStage,
        kmAssist,
        season,
        precipSeasons
      ),
    };

    setChampionship([
      ...championship.slice(0, idx),
      newRally,
      ...championship.slice(idx + 1),
    ]);
  };

  const onChangeNbRally = (e: React.ChangeEvent<HTMLInputElement>) =>
    setNbRally(parseInt(e.target.value));
  const onChangeRallyDistance = (e: React.ChangeEvent<HTMLInputElement>) =>
    setRallyDistance(parseInt(e.target.value));
  const onChangeKmAssist = (e: React.ChangeEvent<HTMLInputElement>) =>
    setKmAssist(parseInt(e.target.value));
  const onChangePercentageWinter = (e: React.ChangeEvent<HTMLInputElement>) =>
    setPercentageWinter(checkPercentage(parseInt(e.target.value)) / 100);
  const onChangePercentageAsphalt = (e: React.ChangeEvent<HTMLInputElement>) =>
    setPercentageAsphalt(checkPercentage(parseInt(e.target.value)) / 100);
  const onChangePercentageLongStage = (e: React.ChangeEvent<HTMLInputElement>) =>
    setPercentageLongStage(checkPercentage(parseInt(e.target.value)) / 100);
  const onChangePrecipSeasons = (
    e: React.ChangeEvent<HTMLInputElement>,
    season: TSeason
  ) => {
    setPrecipSeasons({
      ...precipSeasons,
      [season]: parseFloat(e.target.value),
    });
  };

  return (
    <>
      <AppBar sx={{ padding: "15px", mb: "30px" }} position="static">
        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{ display: { xs: "none", sm: "block" } }}
        >
          WRC Championship Generator
        </Typography>
      </AppBar>
      <Container maxWidth="xl" sx={{ paddingTop: "15px" }}>
        <Box sx={{ mb: "60px" }}>
          <Accordion defaultExpanded variant="outlined">
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1-content"
              id="panel1-header"
            >
              <Typography>Options</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <GeneratorOptions
                nbRally={nbRally}
                rallyDistance={rallyDistance}
                kmAssist={kmAssist}
                percentageWinter={percentageWinter}
                percentageAsphalt={percentageAsphalt}
                percentageLongStage={percentageLongStage}
                precipSeasons={precipSeasons}
                onChangeNbRally={onChangeNbRally}
                onChangeRallyDistance={onChangeRallyDistance}
                onChangeKmAssist={onChangeKmAssist}
                onChangePercentageWinter={onChangePercentageWinter}
                onChangePercentageAsphalt={onChangePercentageAsphalt}
                onChangePercentageLongStage={onChangePercentageLongStage}
                onChangePrecipSeasons={onChangePrecipSeasons}
              />
            </AccordionDetails>
          </Accordion>
        </Box>
        <Box sx={{ mb: "30px" }}>
          <Stack direction="row" spacing={2} sx={{ flexWrap: "wrap" }} useFlexGap>
            <Button
              sx={{ marginRight: "10px" }}
              onClick={generate}
              disabled={!nbRally || !rallyDistance}
            >
              Aléatoire
            </Button>
            <CardButtonGroup title="InGame Saison 2023" disabled={!rallyDistance}>
              <Button disabled>JWRC</Button>
              <Button disabled>WRC2</Button>
              <Button disabled>WRC</Button>
            </CardButtonGroup>
            <CardButtonGroup title="InGame Saison 2024" disabled={!rallyDistance}>
              <Button disabled>JWRC</Button>
              <Button onClick={() => generateSavedChampionship("WRC2 2024")}>WRC2</Button>
              <Button disabled>WRC</Button>
            </CardButtonGroup>
          </Stack>
        </Box>
        {championship.map((rally: TRally, idx) => (
          <Rally
            locationChoices={rallyLocations}
            rally={rally}
            idx={idx}
            key={rally.id}
            changeRally={changeRally}
          />
        ))}
      </Container>
    </>
  );
}

export default App;
