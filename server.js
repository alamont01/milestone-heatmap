const express = require('express');
const multer = require('multer');
const cors = require('cors');
const Papa = require('papaparse');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

// Configure multer for file upload
const upload = multer({ dest: 'uploads/' });

// Ensure uploads directory exists
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

app.post('/api/upload', upload.single('file'), (req, res) => {
  try {
    const file = fs.readFileSync(req.file.path, 'utf8');
    const results = Papa.parse(file, { 
      header: true,
      skipEmptyLines: true
    });
    
    // Clean up the uploaded file
    fs.unlinkSync(req.file.path);
    
    // Validate the required columns
    const requiredColumns = [
      'Milestone_Name',
      'Business_Unit',
      'Overall_Impact_Score',
      'Roles_Responsibilities_Impact',
      'Workload_Impact',
      'Ways_of_Working_Impact',
      'Procedure_Impact',
      'Policy_Impact',
      'Knowledge_Impact',
      'Systems_Impact',
      'Skills_Impact',
      'Peak_Impact_Score',
      'Impact_Duration_Days'
    ];

    const missingColumns = requiredColumns.filter(col => 
      !results.meta.fields.includes(col)
    );

    if (missingColumns.length > 0) {
      return res.status(400).json({
        error: 'Invalid CSV format',
        missingColumns
      });
    }

    res.json(results.data);
  } catch (error) {
    console.error('Error processing file:', error);
    res.status(500).json({ error: 'Error processing file' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
