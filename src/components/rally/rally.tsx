import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Typography from "@mui/material/Typography";
import RefreshIcon from "@mui/icons-material/Refresh";

import { TRally, TRallyName, TSeason, TLocation } from "src/types";
import Stage from "@components/stage/stage";
import { Box, IconButton, MenuItem, Stack, TextField } from "@mui/material";
import { cyan, yellow } from "@mui/material/colors";
import { seasons } from "../../generator/generateRally";

const Rally = ({
  rally,
  idx,
  changeRally,
  locationChoices,
}: {
  rally: TRally;
  idx: number;
  changeRally: (idx: number, seasons: TSeason, name: TRallyName) => void;
  locationChoices: TLocation[];
}) => {
  const onClickReFresh = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    changeRally(idx, rally.season, rally.name);
  };

  const onChangeLocation = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    changeRally(idx, rally.season, e.target.value as TRallyName);
  };

  const onChangeSeason = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    changeRally(idx, e.target.value as TSeason, rally.name);
  };

  return (
    <Accordion>
      <Stack direction="row" alignItems="center" spacing={2} sx={{ padding: "5px" }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <Box sx={{ width: "30%" }}>
            <TextField
              select
              value={rally.name}
              onChange={onChangeLocation}
              onClick={(e) => e.stopPropagation()}
              variant="standard"
              sx={{ mr: "10px", minWidth: "160px" }}
            >
              {locationChoices.map((option) => (
                <MenuItem
                  disabled={rally.season !== "Hiver" && option.isOnlyWinter}
                  key={option.name}
                  value={option.name}
                >
                  {option.name}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          <Box sx={{ width: "30%" }}>
            <TextField
              select
              value={rally.season}
              onChange={onChangeSeason}
              onClick={(e) => e.stopPropagation()}
              variant="standard"
              sx={{ mr: "10px", minWidth: "130px" }}
            >
              {seasons.map((option) => (
                <MenuItem
                  disabled={rally.isOnlyWinter && option !== "Hiver"}
                  key={option}
                  value={option}
                >
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Box>
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
          <IconButton onClick={onClickReFresh}>
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
