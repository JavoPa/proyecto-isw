import axios from './root.service';

export async function getApelaciones() {
    try {
      const response = await axios.get('/users/apelaciones');
      const { status, data } = response;
      if (status === 200) {
        return data;
      }
    } catch (error) {
      return error.response.data
    }
}

export async function getApelacionById(id) {
    try {
      const response = await axios.get(`/users/apelacion/${id}`);
      const { status, data } = response;
      if (status === 200) {
        return data;
      }
    } catch (error) {
      return error.response.data
    }
}

export async function apelar(motivo, files) {
  try {
    const formData = new FormData();
    formData.append('motivo', motivo);
    const filesArray = Array.from(files);
    filesArray.forEach((file, index) => {
      formData.append(`file${index}`, file);
    });
    const response = await axios.post(`/postulacion/apelar`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    const { status, data } = response;
    if (status === 201) {
      return data;
    }
  } catch (error) {
    // Devuelve el mensaje de error
    return error.response.data;
  }
}