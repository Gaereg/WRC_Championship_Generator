import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Typography from "@mui/material/Typography";
import RefreshIcon from "@mui/icons-material/Refresh";

import { TRally, TRallyName, TSeason } from "src/types";
import Stage from "@components/stage/stage";
import { Box, IconButton, Stack } from "@mui/material";
import { cyan, yellow } from "@mui/material/colors";

const Rally = ({
  rally,
  idx,
  changeRally,
}: {
  rally: TRally;
  idx: number;
  changeRally: (idx: number, seasons: TSeason, name: TRallyName) => void;
}) => {
  const onClickReFresh = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    changeRally(idx, rally.season, rally.name);
  };
  return (
    <Accordion>
      <Stack direction='row' alignItems="center" spacing={2} sx={{pr:"5px"}}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1-content"
        id="panel1-header"
      >
        <Typography component="span" sx={{ width: "33%", flexShrink: 0 }}>
          {rally.name}
        </Typography>
        <Typography
          component="span"
          sx={{ width: "33%", flexShrink: 0, color: "text.secondary" }}
        >
          {rally.season}
        </Typography>
        <Typography
          component="span"
          sx={{ width: "15%", flexShrink: 0, color: "text.secondary" }}
        >
          <span style={{ color: cyan[100] }}>{rally.stages.length}</span> Speciales
        </Typography>
        <Typography component="span" sx={{ width: "15%", color: "text.secondary" }}>
          Distance:{" "}
          <span style={{ color: yellow[400] }}>{Math.round(rally.distance)}km</span>
        </Typography>

      </AccordionSummary>
      <Box>
        <IconButton  onClick={onClickReFresh}>
          <RefreshIcon />
        </IconButton>
      </Box>
        </Stack>
      <AccordionDetails>
        <Box
          sx={{
            display: "grid",
            width: "100%",
            gridTemplateColumns: "repeat(auto-fill, minmax(min(300px, 100%), 1fr))",
            gap: 2,
          }}
        >
          {rally.stages.map((stage, idx) => (
            <Stage stage={stage} idx={idx} key={`raly-stage-${idx}`} />
          ))}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export default Rally;
