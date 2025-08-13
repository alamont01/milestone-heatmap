import { uniqBy, uniq } from 'lodash';

export const processHeatmapData = (rawData, sortBy = 'date') => {
  // Get unique milestones and sort them
  let milestones = uniqBy(rawData, 'Milestone_Name')
    .map(m => ({
      name: m.Milestone_Name,
      endDate: new Date(m.Milestone_End),
      impact: parseFloat(m.Overall_Impact_Score) || 0
    }))
    .filter(m => m.name);

  // Sort milestones based on the sortBy parameter
  if (sortBy === 'date') {
    milestones.sort((a, b) => a.endDate - b.endDate);
  } else if (sortBy === 'impact') {
    milestones.sort((a, b) => b.impact - a.impact);
  } else if (sortBy === 'name') {
    milestones.sort((a, b) => a.name.localeCompare(b.name));
  }

  // Extract just the names after sorting
  milestones = milestones.map(m => m.name);
  
  const businessUnits = uniq(rawData.map(row => row.Business_Unit))
    .filter(Boolean);
  
  // Create matrix for heatmap
  const matrix = [];
  const annotations = [];
  
  milestones.forEach((milestone, mIndex) => {
    const row = [];
    businessUnits.forEach((unit, uIndex) => {
      const record = rawData.find(r => 
        r.Milestone_Name === milestone && r.Business_Unit === unit
      );
      
      const value = record ? parseFloat(record.Overall_Impact_Score) || 0 : 0;
      row.push(value);
      
      if (record) {
        annotations.push({
          x: uIndex,
          y: mIndex,
          text: value.toFixed(2),
          showarrow: false,
          font: {
            color: value >= 4 ? '#ffffff' : '#000000' // White text for dark backgrounds
          }
        });
      }
    });
    matrix.push(row);
  });
  
  return {
    z: matrix,
    x: businessUnits,
    y: milestones,
    annotations
  };
};

export const getImpactDetails = (rawData, milestone, businessUnit) => {
  const record = rawData.find(r => 
    r.Milestone_Name === milestone && r.Business_Unit === businessUnit
  );
  
  if (!record) return null;
  
  return {
    milestoneEnd: record.Milestone_End,
    peopleImpacts: {
      rolesResponsibilities: parseFloat(record.Roles_Responsibilities_Impact) || 0,
      workload: parseFloat(record.Workload_Impact) || 0,
      waysOfWorking: parseFloat(record.Ways_of_Working_Impact) || 0,
      average: parseFloat(record.People_Average_Impact) || 0
    },
    processImpacts: {
      procedure: parseFloat(record.Procedure_Impact) || 0,
      policy: parseFloat(record.Policy_Impact) || 0,
      knowledge: parseFloat(record.Knowledge_Impact) || 0,
      average: parseFloat(record.Process_Average_Impact) || 0
    },
    technologyImpacts: {
      systems: parseFloat(record.Systems_Impact) || 0,
      skills: parseFloat(record.Skills_Impact) || 0,
      average: parseFloat(record.Technology_Average_Impact) || 0
    },
    overall: parseFloat(record.Overall_Impact_Score) || 0,
    peak: parseFloat(record.Peak_Impact_Score) || 0,
    duration: parseInt(record.Impact_Duration_Days) || 0,
    isHighImpact: parseFloat(record.Peak_Impact_Score) >= 4,
    isLongDuration: parseInt(record.Impact_Duration_Days) > 30
  };
};
