import axios from './root.service';

export const getPostulantes = async () => {
    try {
      const response = await axios.get('/users/postulantes');
      const { status, data } = response;
      if (status === 200) {
        return data.data;
      }
    } catch (error) {
      return error.response.data
    }
  };

export async function getPostulanteById(id) {
    try {
        const response = await axios.get(`/users/postulantes/${id}`);
        const { status, data } = response;
        if (status === 200) {
            return data;
        }
    } catch (error) {
        return error.response.data
    }
}