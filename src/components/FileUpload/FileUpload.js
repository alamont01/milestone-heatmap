import React from 'react';
import { Box, Button, Paper, Typography } from '@mui/material';
import { UploadFile } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const UploadContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(2),
  marginBottom: theme.spacing(3)
}));

const HiddenInput = styled('input')({
  display: 'none'
});

const FileUpload = ({ onFileSelect, error }) => {
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      onFileSelect(file);
    }
  };

  return (
    <UploadContainer elevation={1}>
      <Typography variant="h6" component="h2">
        Upload Impact Data
      </Typography>
      <Box>
        <label htmlFor="csv-upload">
          <HiddenInput
            accept=".csv"
            id="csv-upload"
            type="file"
            onChange={handleFileChange}
          />
          <Button
            variant="contained"
            component="span"
            startIcon={<UploadFile />}
          >
            Select CSV File
          </Button>
        </label>
      </Box>
      {error && (
        <Typography color="error" variant="body2">
          {error}
        </Typography>
      )}
    </UploadContainer>
  );
};

export default FileUpload;
