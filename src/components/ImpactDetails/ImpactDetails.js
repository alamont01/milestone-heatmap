import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Grid, 
  Divider,
  Box,
  Chip
} from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  marginTop: theme.spacing(2),
  width: '100%'
}));

const Section = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(2)
}));

const ImpactChip = styled(Chip)(({ theme, severity }) => ({
  backgroundColor: severity >= 4 ? theme.palette.error.main : 
                  severity >= 3 ? theme.palette.warning.main :
                  theme.palette.success.main,
  color: '#fff',
  marginLeft: theme.spacing(1)
}));

const DurationChip = styled(Chip)(({ theme, duration }) => ({
  backgroundColor: duration > 30 ? theme.palette.warning.main : theme.palette.info.main,
  color: '#fff',
  marginLeft: theme.spacing(1)
}));

const ImpactDetails = ({ details }) => {
  if (!details) return null;

  const {
    peopleImpacts,
    processImpacts,
    technologyImpacts,
    overall,
    peak,
    duration
  } = details;

  return (
    <StyledCard>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Impact Details
          <ImpactChip 
            label={`Peak Impact: ${peak.toFixed(1)}`}
            severity={peak}
            size="small"
          />
          <DurationChip 
            label={`Duration: ${duration} days`}
            duration={duration}
            size="small"
          />
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Section>
              <Typography variant="subtitle1" gutterBottom>People Impact</Typography>
              <Typography variant="body2">Roles & Responsibilities: {peopleImpacts.rolesResponsibilities}</Typography>
              <Typography variant="body2">Workload: {peopleImpacts.workload}</Typography>
              <Typography variant="body2">Ways of Working: {peopleImpacts.waysOfWorking}</Typography>
              <Typography variant="body2" fontWeight="bold">
                Average: {peopleImpacts.average.toFixed(2)}
              </Typography>
            </Section>
          </Grid>

          <Grid item xs={12} md={4}>
            <Section>
              <Typography variant="subtitle1" gutterBottom>Process Impact</Typography>
              <Typography variant="body2">Procedure: {processImpacts.procedure}</Typography>
              <Typography variant="body2">Policy: {processImpacts.policy}</Typography>
              <Typography variant="body2">Knowledge: {processImpacts.knowledge}</Typography>
              <Typography variant="body2" fontWeight="bold">
                Average: {processImpacts.average.toFixed(2)}
              </Typography>
            </Section>
          </Grid>

          <Grid item xs={12} md={4}>
            <Section>
              <Typography variant="subtitle1" gutterBottom>Technology Impact</Typography>
              <Typography variant="body2">Systems: {technologyImpacts.systems}</Typography>
              <Typography variant="body2">Skills: {technologyImpacts.skills}</Typography>
              <Typography variant="body2" fontWeight="bold">
                Average: {technologyImpacts.average.toFixed(2)}
              </Typography>
            </Section>
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" color="primary">
          Overall Impact Score: {overall.toFixed(2)}
        </Typography>
      </CardContent>
    </StyledCard>
  );
};

export default ImpactDetails;
