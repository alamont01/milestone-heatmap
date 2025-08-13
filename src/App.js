import React, { useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { Container, CssBaseline, Box, Alert, Snackbar } from '@mui/material';
import { FileUpload } from './components/FileUpload';
import { Heatmap, HeatmapToolbar } from './components/Heatmap';
import { ImpactDetails } from './components/ImpactDetails';
import useFileUpload from './hooks/useFileUpload';
import theme from './theme/theme';
import { getImpactDetails } from './utils/dataProcessor';
import './App.css';

function App() {
  // State management
  const { data, loading, error, uploadFile } = useFileUpload();
  const [selectedCell, setSelectedCell] = useState(null);
  const [filters, setFilters] = useState({
    businessUnit: 'All',
    quarter: 'All',
    year: 'All',
    sortBy: 'date'
  });
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });

  // Filter and sort the data
  const filteredData = React.useMemo(() => {
    if (!data) return [];
    
    return data.filter(item => {
      if (filters.businessUnit !== 'All' && item.Business_Unit !== filters.businessUnit) return false;
      // Add more filters as needed
      return true;
    });
  }, [data, filters]);

  // Get unique business units for the toolbar
  const businessUnits = React.useMemo(() => {
    if (!data) return [];
    return [...new Set(data.map(item => item.Business_Unit))];
  }, [data]);

  // Event handlers
  const handleFileSelect = async (file) => {
    try {
      await uploadFile(file);
      setNotification({
        open: true,
        message: 'File uploaded successfully',
        severity: 'success'
      });
    } catch (err) {
      setNotification({
        open: true,
        message: err.response?.data?.error || 'Error uploading file',
        severity: 'error'
      });
    }
  };

  const handleCellClick = (milestone, businessUnit) => {
    const details = getImpactDetails(data, milestone, businessUnit);
    setSelectedCell({ milestone, businessUnit, details });
  };

  const handleFilterChange = (type, value) => {
    setFilters(prev => ({ ...prev, [type]: value }));
  };

  const handleExport = () => {
    // Implementation for export functionality
    try {
      const csvContent = convertToCSV(filteredData);
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'milestone_impact_data.csv';
      link.click();
      
      setNotification({
        open: true,
        message: 'Data exported successfully',
        severity: 'success'
      });
    } catch (err) {
      setNotification({
        open: true,
        message: 'Error exporting data',
        severity: 'error'
      });
    }
  };

  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="xl">
        <Box sx={{ py: 4 }}>
          {/* File Upload Component */}
          <FileUpload 
            onFileSelect={handleFileSelect}
            error={error}
          />

          {/* Main Content */}
          {data && (
            <>
              {/* Toolbar */}
              <HeatmapToolbar
                businessUnits={businessUnits}
                onBusinessUnitFilter={(value) => handleFilterChange('businessUnit', value)}
                onQuarterFilter={(value) => handleFilterChange('quarter', value)}
                onYearFilter={(value) => handleFilterChange('year', value)}
                onSortChange={(value) => handleFilterChange('sortBy', value)}
                onExport={handleExport}
                selectedBusinessUnit={filters.businessUnit}
                selectedQuarter={filters.quarter}
                selectedYear={filters.year}
                sortBy={filters.sortBy}
              />

              {/* Heatmap */}
              <Heatmap
                data={filteredData}
                onCellClick={handleCellClick}
              />

              {/* Impact Details */}
              {selectedCell && (
                <ImpactDetails details={selectedCell.details} />
              )}
            </>
          )}

          {/* Notifications */}
          <Snackbar
            open={notification.open}
            autoHideDuration={6000}
            onClose={handleCloseNotification}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          >
            <Alert
              onClose={handleCloseNotification}
              severity={notification.severity}
              sx={{ width: '100%' }}
            >
              {notification.message}
            </Alert>
          </Snackbar>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

// Helper function for CSV export
const convertToCSV = (data) => {
  if (!data || data.length === 0) return '';
  
  const headers = Object.keys(data[0]);
  const rows = [
    headers.join(','),
    ...data.map(item =>
      headers.map(header =>
        typeof item[header] === 'string' && item[header].includes(',')
          ? `"${item[header]}"`
          : item[header]
      ).join(',')
    )
  ];
  
  return rows.join('\n');
};

export default App;
