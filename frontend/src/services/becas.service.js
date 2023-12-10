import axios from './root.service';

export const getBecas = async () => {
  try {
    const response = await axios.get('/becas');
    const { status, data } = response;
    if (status === 200) {
      return data.data;
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getBecaById = async (becaId) => {
    try {
      const response = await axios.get(`/becas/${becaId}`);
      return response.data;
    } catch (error) {
      console.error('Error en getBecaById:', error);
      throw error;
    }
};


export const deleteBeca = async (becaId) => {
    try {
      const response = await axios.delete(`/becas/${becaId}`);
      const { status, data } = response;
      if (status === 204) {
        return data.data;
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  };