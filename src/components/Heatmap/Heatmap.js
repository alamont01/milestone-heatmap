import React, { useState, useMemo } from 'react';
import Plot from 'react-plotly.js';
import { Box, Paper, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { processHeatmapData } from '../../utils/dataProcessor';

const HeatmapContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
  width: '100%',
  height: '100%',
  minHeight: '600px'
}));

const colorscale = [
  [0, '#f7fbff'],    // Very Low Impact
  [0.2, '#deebf7'],  // Low Impact
  [0.4, '#c6dbef'],  // Medium-Low Impact
  [0.6, '#9ecae1'],  // Medium Impact
  [0.8, '#6baed6'],  // Medium-High Impact
  [1, '#2171b5']     // High Impact
];

const Heatmap = ({ data, onCellClick, sortBy = 'date' }) => {
  const [hoveredCell, setHoveredCell] = useState(null);
  
  const heatmapData = useMemo(() => {
    if (!data || data.length === 0) return null;
    return processHeatmapData(data, sortBy);
  }, [data, sortBy]);

  if (!heatmapData) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Typography variant="h6" color="textSecondary">
          No data available to display
        </Typography>
      </Box>
    );
  }

  const layout = {
    title: 'Milestone Impact Heatmap',
    xaxis: {
      title: 'Business Units',
      tickangle: -45,
      automargin: true
    },
    yaxis: {
      title: 'Milestones',
      automargin: true
    },
    annotations: heatmapData.annotations,
    margin: {
      l: 150,
      r: 50,
      t: 100,
      b: 150
    },
    height: 600,
    // Ensure the heatmap is responsive
    autosize: true
  };

  const plotData = [{
    type: 'heatmap',
    z: heatmapData.z,
    x: heatmapData.x,
    y: heatmapData.y,
    colorscale: colorscale,
    colorbar: {
      title: 'Impact Score',
      titleside: 'right',
      ticktext: ['Very Low', 'Low', 'Medium-Low', 'Medium', 'Medium-High', 'High'],
      tickvals: [0, 1, 2, 3, 4, 5]
    },
    hoverongaps: false,
    showscale: true,
    hovertemplate: 
      'Milestone: %{y}<br>' +
      'Business Unit: %{x}<br>' +
      'Impact Score: %{z:.2f}<br>' +
      '<extra></extra>'
  }];

  const handleClick = (event) => {
    if (event.points && event.points.length > 0) {
      const point = event.points[0];
      onCellClick(point.y, point.x);
    }
  };

  const handleHover = (event) => {
    if (event.points && event.points.length > 0) {
      const point = event.points[0];
      setHoveredCell({ y: point.y, x: point.x, value: point.z });
    }
  };

  return (
    <HeatmapContainer elevation={2}>
      <Plot
        data={plotData}
        layout={layout}
        onClick={handleClick}
        onHover={handleHover}
        config={{
          responsive: true,
          displayModeBar: true,
          modeBarButtonsToRemove: [
            'lasso2d',
            'select2d',
            'toggleSpikelines'
          ],
          toImageButtonOptions: {
            format: 'png',
            filename: 'milestone-impact-heatmap',
            height: 800,
            width: 1200,
            scale: 2
          }
        }}
        style={{ width: '100%', height: '100%' }}
      />
    </HeatmapContainer>
  );
};

export default Heatmap;
