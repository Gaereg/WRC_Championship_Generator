import { generateStages, generateSeasons, generateLocations } from './generator/generateRally';
import { TData, TLocation, TRally, TSavedChampionship, TTitleSavedChampionship } from 'src/types';
import _data from './data/data.json';
import _savedChampionship from './data/savedChampionship.json';
import Rally from '@components/rally/rally';
import { useState } from 'react';
import Container from '@mui/material/Container';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionDetails, AccordionSummary, AppBar, Box, Button, Divider, InputAdornment, Stack, TextField, Typography, } from '@mui/material';
import { NumberField } from '@base-ui-components/react/number-field';

import CardButtonGroup from '@components/CardButtonGroup/CardButtonGroup';


const data = _data as TData;
const savedChampionship = _savedChampionship as TSavedChampionship;

const kmAssist = 35;
const percentageLongStage = 0.4;
const percentageAsphalt = 0.3;
const percentageWinter = 0.2;

const rallyLocations: TLocation[] = Object.keys(data).map((rally) => (
  {
    name: rally,
    type: data[rally].type,
  }
));

function App() {
  const [championship, setChampionship] = useState<TRally[]>([])
  const [nbRally, setNbRally] = useState<number>(13)
  const [rallyDistance, setRallyDistance] = useState<number>(100);

  const generate = () => {
    if (nbRally > rallyLocations.length) throw ('Nombre de rally demandé dépasse le nombre de rally dispo')
    const seasons = generateSeasons(nbRally, percentageWinter);
    const locations = generateLocations(seasons, rallyLocations, percentageAsphalt);
    const generatedChampionship: TRally[] = locations.map((location) => ({
      ...location,
      ...generateStages(data[location.name], rallyDistance, percentageLongStage, kmAssist, location.season)
    }))
    setChampionship(generatedChampionship)
  }

  const generateSavedChampionship = (title: TTitleSavedChampionship) => {
    const generatedChampionship: TRally[] = savedChampionship[title].map((location) => ({
      ...location,
      ...generateStages(data[location.name], rallyDistance, percentageLongStage, kmAssist, location.season)
    }))
    setChampionship(generatedChampionship)
  }

  const onChangeNbRally = (e: React.ChangeEvent<HTMLInputElement>) => setNbRally(parseInt(e.target.value))
  const onChangeRallyDistance = (e: React.ChangeEvent<HTMLInputElement>) => setRallyDistance(parseInt(e.target.value))


  return (
    <>
      <AppBar sx={{ padding: '15px', mb: '30px' }} position='static'>
        <Typography variant="h6"
          noWrap
          component="div"
          sx={{ display: { xs: 'none', sm: 'block' } }}>WRC Championship Generator</Typography>
      </AppBar>
      <Container maxWidth="xl" sx={{ paddingTop: '15px' }}>
        <Box sx={{ mb: "60px" }}>
          <Accordion defaultExpanded variant='outlined' sx={{ border: 'none' }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1-content"
              id="panel1-header"
            >
              <Typography>Options</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Stack direction='row' spacing={2} sx={{ flexWrap: 'wrap' }} useFlexGap>
                <TextField
                  sx={{ width: '125px' }}
                  label="Nombre de Rallye"
                  type='number'
                  onChange={onChangeNbRally}
                  value={nbRally}
                />
                <TextField
                  sx={{ width: '140px' }}
                  label="Longueur des Rallye"
                  type='number'
                  onChange={onChangeRallyDistance}
                  value={rallyDistance}
                  slotProps={{
                    input: {
                      endAdornment: <InputAdornment position="end">km</InputAdornment>,
                    },
                  }} />
              </Stack>
            </AccordionDetails>
          </Accordion>
          <Divider sx={{ width: '80%', margin: 'auto', mt: "20px" }} />
        </Box>
        <Box sx={{ mb: "30px" }}>
          <Stack direction='row' spacing={2} sx={{ flexWrap: 'wrap' }} useFlexGap>
            <Button sx={{ marginRight: '10px' }} onClick={generate} disabled={!nbRally || !rallyDistance}>Aléatoire</Button>
            <CardButtonGroup title='InGame Saison' disabled={!rallyDistance}>
              <Button onClick={() => generateSavedChampionship('WRC2 2024')}>WRC2 2024</Button>
              <Button disabled>WRC 2024</Button>
            </CardButtonGroup>
            <CardButtonGroup title='Sur les Traces de Loeb' disabled={!rallyDistance}>
              <Button disabled>Xsara 2004</Button>
              <Button disabled>C4 2007</Button>
              <Button disabled>DS3 2011</Button>
            </CardButtonGroup>
          </Stack>
        </Box>
        {championship.map((rally: TRally, idx) => <Rally rally={rally} key={`rally-${idx}`} />)}
      </Container>
    </>
  )
}

export default App
