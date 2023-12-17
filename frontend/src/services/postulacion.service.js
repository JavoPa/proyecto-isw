import axios from './root.service';

export async function getBecasPostulacion() {
    try {
      const response = await axios.get('/postulacion/becas');
      if (response.status === 200) {
        return response.data.data;
      }
      return [];
    } catch (error) {
      return error.response.data
    }
}

export async function getMyUser() {
  try {
    const response = await axios.get('/users/perfil');
    if (response.status === 200) {
      return response.data; 
    }
    return null;
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
}

export async function createPostulacion(data, idBeca, comentario) {
  try {
    console.log(data.archivos);
    const response = await axios.post('/postulacion/postular', data, idBeca, comentario);
    if (response.status === 201) {
      return response.data.data;
    }
    return [];
  } catch (error) {
    return error.response.data
  }
}