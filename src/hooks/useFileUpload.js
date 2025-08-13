import { useState } from 'react';
import axios from 'axios';

const useFileUpload = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const uploadFile = async (file) => {
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:5000/api/upload', formData);
      setData(response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Error uploading file');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    loading,
    error,
    uploadFile,
  };
};

export default useFileUpload;
