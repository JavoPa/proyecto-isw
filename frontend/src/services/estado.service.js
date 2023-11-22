import axios from './root.service';

export const getEstado = async () => {
  try {
    const response = await axios.get('/postulacion/estado');
    const { status, data } = response;
    if (status === 200) {
      return data.data;
    }
  } catch (error) {
    console.log("Error de estado.service "+error);
  }
};