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

  export async function createBeca(becaData) {
    try {
        const response = await axios.post('/becas', becaData);
        return response.data;
      } catch (error) {
        throw error;
      }
  }

  export const getRequisitos = async () => {
    try {
      const response = await axios.get('/requisitos');
      return response.data;
    } catch (error) {
      console.error('Error al obtener requisitos:', error);
      throw error;
    }
  };

  export const updateBeca = async (becaId, becaData) => {
    try {
      const response = await axios.put(`/becas/${becaId}`, becaData);
      const { status, data } = response;
      if (status === 200) {
        return data.data;
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  };