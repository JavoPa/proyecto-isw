import axios from './root.service';

export const getPostulantes = async () => {
    try {
      const response = await axios.get('/users/postulantes');
      const { status, data } = response;
      if (status === 200) {
        return data.data;
      }
    } catch (error) {
      console.log(error);
      throw error;
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

export const getMyUser = async () => {
    try {
      const response = await axios.get('/users/perfil');
      const { status, data } = response;
      if (status === 200) {
        return data; 
      }
      return null;
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  }

export async function updateMyUser(data) {
    try {
        const response = await axios.put(`/users/perfil`, data);
        const { status, data } = response;
        if (status === 200) {
            return data;
        }
    } catch (error) {
        return error.response.data
    }
}