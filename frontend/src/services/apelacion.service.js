import axios from './root.service';

export async function getApelaciones() {
    try {
      const response = await axios.get('/users/apelaciones');
      const { status, data } = response;
      if (status === 200) {
        return data.data;
      }
    } catch (error) {
      console.log(error);
    }
}

export async function getApelacionById(id) {
    try {
      const response = await axios.get(`/users/apelacion/${id}`);
      const { status, data } = response;
      if (status === 200) {
        return data.data;
      }
    } catch (error) {
      console.log(error);
    }
}

export async function updateDocumentosFaltantes(id, body) {
    try {
      const response = await axios.post(`/users/postulacion/${id}/documentosfaltantes`, body);
      const { status, data } = response;
      if (status === 200) {
        return data.data;
      }
    } catch (error) {
      console.log(error);
    }
}

export async function apelar(file) {
  try {
    const formData = new FormData();
    formData.append('file', file);

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