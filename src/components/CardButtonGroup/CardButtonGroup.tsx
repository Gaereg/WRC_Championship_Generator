import { ReactElement } from 'react';
import { ButtonGroup, Card, Typography, useTheme } from '@mui/material';


const CardButtonGroup = ({ title, children, disabled = false }: { title: string, children: ReactElement[] | ReactElement, disabled?: boolean }) => {
  const theme = useTheme();

  return (
    <Card variant='outlined' sx={{ padding: '0 10px 10px 10px', overflow: 'visible' }}>
      <Typography gutterBottom sx={{ color: 'text.secondary', bgcolor: theme.palette.background.default, width: 'fit-content', fontSize: 14, marginTop: "-12px", padding: '0 5px' }}>{title}</Typography>
      <ButtonGroup disabled={disabled}>
        {children}
      </ButtonGroup>
    </Card>
  )
}

export default CardButtonGroup
