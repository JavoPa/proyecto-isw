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


import axios from 'axios';

export async function createPostulacion(comentario, beca_id, files) {
  try {
    const formData = new FormData();
    formData.append('comentario', comentario);
    formData.append('beca_id', beca_id);

    files.forEach((file, index) => {
      formData.append(`archivoPDF[${index}]`, file);
    });

    const response = await axios.post(`/postulacion/postular`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data; // Simply return the entire response data

  } catch (error) {
    // Return the error message
    if (error.response && error.response.data) {
      return error.response.data;
    } else {
      return { error: 'An error occurred during the request.' };
    }
  }
}
