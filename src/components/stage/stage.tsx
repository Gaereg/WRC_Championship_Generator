import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { TGeneratedStage } from 'src/types';
import { orange, green, blue } from '@mui/material/colors';
import { Box, Stack } from '@mui/material';
import { weatherTypeRaw } from '../../generator/utils';

const Stage = ({ stage, idx }: { stage: TGeneratedStage, idx: number }) => {
  const weatherColor = () => weatherTypeRaw(stage.weather.type) === 'basic' ? green[300] : blue[200]

  const surfaceColor = () => {
    switch (stage.weather.surfaceState) {
      case 'humide':
        return blue[200];
      case 'neige':
        return blue[300];
      default:
        return green[300];
    }
  }

  const assistColor = () => {
    switch (stage.assist) {
      case 'Longue':
        return orange[500];
      case 'Intermédiaire':
        return orange[300];
      default:
        return orange[200];
    }
  }

  return (
    <Card sx={{ minWidth: 275 }} variant='outlined'>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ marginTop: "-10px", mb: "10px" }}>
          <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14, }}>
            spécial n°{idx + 1}
          </Typography>
          <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
            {stage.length}km
          </Typography>
        </Stack>
        <Typography sx={{ fontSize: 18, height: "55px" }}>
          {stage.name}
        </Typography>

        <Typography sx={{ fontSize: 16, height: "30px", color: assistColor }}>
          {stage.assist && `Assistance ${stage.assist}`}
        </Typography>
        <Box sx={{ display: "flex", justifyContent: 'space-between', backgroundColor: weatherColor(), overflow: 'hidden' }}>
          <Typography sx={{ fontSize: 16, color: 'black', paddingLeft: "5px" }}>
            {stage.weather.value}
          </Typography>
          <Box sx={{
            width: "30%", backgroundColor: surfaceColor(), transformOrigin: 'bottom right',
            transform: 'skewX(-45deg)'
          }} />
        </Box>
      </CardContent>
    </Card>
  )
}

export default Stage