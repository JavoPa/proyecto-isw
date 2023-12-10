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