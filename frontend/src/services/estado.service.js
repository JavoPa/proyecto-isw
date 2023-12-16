import axios from './root.service';

export const getEstado = async () => {
  try {
    const response = await axios.get('/postulacion/estado');
    const { status, data } = response;
    if (status === 200) {
      return data;
    }
  } catch (error) {
    return error.response.data
  }
};

export async function getPostulacionById(id) {
  try {
    const response = await axios.get(`/users/postulaciones/${id}`);
    const { status, data } = response;
    if (status === 200) {
      return data;
    }
  } catch (error) {
    return error.response.data
  }
}

export async function getDocumentsById(id, docnum) {
  try {
    const response = await axios.get(`/users/postulaciones/${id}/documentos/${docnum}`, {
      responseType: 'blob'
    });
    const { status, data } = response;
    if (status === 200) {
      return data;
    }
  } catch (error) {
    return error.response.data
  }
}

export const getPostulaciones = async () => {
  try {
    const response = await axios.get(`/users/postulaciones/`);
    const { status, data } = response;
    if (status === 200) {
      return data;
    }
  } catch (error) {
    return error.response.data
  }
}

export async function actualizarMotivos(id, body) {
  try {
    const response = await axios.post(`/users/postulacion/${id}/actualizarmotivos`, body);
    const { status, data } = response;
    if (status === 200) {
      return data;
    }
  } catch (error) {
    return error.response.data
  }
}

export async function actualizarPuntaje(id, body) {
  try {
    const response = await axios.put(`/users/postulaciones/${id}/puntaje`, body);
    const { status, data } = response;
    if (status === 200) {
      return data;
    }
  } catch (error) {
    return error.response.data
  }
}

export async function actualizarEstado(id, body) {
  try {
    const response = await axios.put(`/users/postulaciones/${id}/estado`, body);
    const { status, data } = response;
    if (status === 200) {
      return data;
    }
  } catch (error) {
    return error.response.data
  }
}