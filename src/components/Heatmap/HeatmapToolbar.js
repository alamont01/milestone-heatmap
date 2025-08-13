import React from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
  Stack
} from '@mui/material';
import {
  FileDownload as FileDownloadIcon
} from '@mui/icons-material';

const HeatmapToolbar = ({
  businessUnits,
  onBusinessUnitFilter,
  onQuarterFilter,
  onYearFilter,
  onSortChange,
  onExport,
  selectedBusinessUnit,
  selectedQuarter,
  selectedYear,
  sortBy
}) => {
  const quarters = ['All', 'Q1', 'Q2', 'Q3', 'Q4'];
  const currentYear = new Date().getFullYear();
  const years = ['All', ...Array.from({ length: 5 }, (_, i) => currentYear + i)];
  const sortOptions = [
    { value: 'date', label: 'Start Date' },
    { value: 'impact', label: 'Impact Score' },
    { value: 'name', label: 'Milestone Name' }
  ];

  return (
    <Box sx={{ mb: 2, p: 2, backgroundColor: 'background.paper', borderRadius: 1 }}>
      <Stack direction="row" spacing={2} alignItems="center">
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Business Unit</InputLabel>
          <Select
            value={selectedBusinessUnit || 'All'}
            label="Business Unit"
            onChange={(e) => onBusinessUnitFilter(e.target.value)}
          >
            <MenuItem value="All">All Business Units</MenuItem>
            {businessUnits.map((unit) => (
              <MenuItem key={unit} value={unit}>{unit}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 100 }}>
          <InputLabel>Quarter</InputLabel>
          <Select
            value={selectedQuarter || 'All'}
            label="Quarter"
            onChange={(e) => onQuarterFilter(e.target.value)}
          >
            {quarters.map((quarter) => (
              <MenuItem key={quarter} value={quarter}>{quarter}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 100 }}>
          <InputLabel>Year</InputLabel>
          <Select
            value={selectedYear || 'All'}
            label="Year"
            onChange={(e) => onYearFilter(e.target.value)}
          >
            {years.map((year) => (
              <MenuItem key={year} value={year}>{year}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Sort By</InputLabel>
          <Select
            value={sortBy || 'date'}
            label="Sort By"
            onChange={(e) => onSortChange(e.target.value)}
          >
            {sortOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Tooltip title="Export Data">
          <IconButton onClick={onExport} size="small">
            <FileDownloadIcon />
          </IconButton>
        </Tooltip>
      </Stack>
    </Box>
  );
};

export default HeatmapToolbar;
