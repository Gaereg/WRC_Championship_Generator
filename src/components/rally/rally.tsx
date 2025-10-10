import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Typography from '@mui/material/Typography';

import { TRally } from 'src/types';
import Stage from '@components/stage/stage';
import { Box } from '@mui/material';
import { cyan, yellow } from '@mui/material/colors';


const Rally = ({ rally }: { rally: TRally }) => {
  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1-content"
        id="panel1-header"
      >
        <Typography component="span" sx={{ width: '33%', flexShrink: 0 }}>
          {rally.name}
        </Typography>
        <Typography component="span" sx={{ width: '33%', flexShrink: 0, color: 'text.secondary' }}>
          {rally.season}
        </Typography>
        <Typography component="span" sx={{ width: '15%', flexShrink: 0, color: 'text.secondary' }}>
          <span style={{color: cyan[100]}}>{rally.stages.length}</span> Speciales
        </Typography>
        <Typography component="span" sx={{ color: 'text.secondary' }}>
          Distance: <span style={{color: yellow[400]}}>{Math.round(rally.distance)}km</span>
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Box sx={{
          display: "grid", width: "100%", gridTemplateColumns: 'repeat(auto-fill, minmax(min(300px, 100%), 1fr))',
          gap: 2,
        }}>
          {rally.stages.map((stage, idx) => <Stage stage={stage} idx={idx} />)}
        </Box>
      </AccordionDetails>
    </Accordion>
  )
}

export default Rally