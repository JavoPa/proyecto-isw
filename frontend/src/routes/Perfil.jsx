import { getMyUser, updateMyUser} from '../services/postulantes.service';
import React, { useState, useEffect } from 'react';

const Perfil = () => {
 const [user, setUser] = useState(null);
 const [isEditing, setIsEditing] = useState(false);
 const [editableUser, setEditableUser] = useState({});

 useEffect(() => {
  const fetchData = async () => {
    const response = await getMyUser();
    console.log(response); // Verifica los datos devueltos
    if (response.state === 'Success') {
      setUser(response.data);
      setEditableUser(response.data);
    } else {
      console.error('Error fetching user data:', response);
    }
  };

  fetchData();
}, []);

 const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditableUser({ ...editableUser, [name]: value });
 };

 const toggleEditing = () => {
    setIsEditing(!isEditing);
 };

 const handleUpdateUser = async () => {
    const response = await updateMyUser(editableUser, user._id);
    if (response) {
      setUser(response.data);
      toggleEditing();
    }
 };

 if (!user) {
    return <div>Loading...</div>;
 }

 return (
    <div className='modal'>
      <h1>Perfil</h1>
      <table>
        <tbody>
          <tr>
            <td>Nombres: </td>
            <td>{isEditing ? <input name="nombres" value={editableUser.nombres} onChange={handleInputChange} /> : user.nombres}</td>
          </tr>
          <tr>
            <td>Apellidos:</td>
            <td>{isEditing ? <input name="apellidos" value={editableUser.apellidos} onChange={handleInputChange} /> : user.apellidos}</td>
          </tr>
          <tr>
            <td>Rut:</td>
            <td>{isEditing ? <input name="rut" value={editableUser.rut} onChange={handleInputChange} /> : user.rut}</td>
          </tr>
          <tr>
            <td>Email:</td>
            <td>{isEditing ? <input name="email" value={editableUser.email} onChange={handleInputChange} /> : user.email}</td>
          </tr>
          <tr>
            <td>Dirección:</td>
            <td>{isEditing ? <input name="direccion" value={editableUser.direccion} onChange={handleInputChange} /> : user.direccion}</td>
          </tr>
          <tr>
            <td>Teléfono:</td>
            <td>{isEditing ? <input name="telefono" value={editableUser.telefono} onChange={handleInputChange} /> : user.telefono}</td>
          </tr>
          <tr>
            <td>Fecha de nacimiento:</td>
            <td>{isEditing ? <input name="fecha_nacimiento" value={editableUser.fecha_nacimiento} onChange={handleInputChange} /> : user.fecha_nacimiento}</td>
          </tr>
          <tr>
            <td>Sexo:</td>
            <td>{isEditing ? <input name="sexo" value={editableUser.sexo} onChange={handleInputChange} /> : user.sexo}</td>
          </tr>
          <tr>
            <td>Discapacidad:</td>
            <td>{isEditing ? <input name="discapacidad" value={editableUser.discapacidad} onChange={handleInputChange} /> : user.discapacidad}</td>
          </tr>
          <tr>
            <td>Cuenta bancaria:</td>
            <td>{isEditing ? <input name="cuenta_bancaria" value={editableUser.cuenta_bancaria} onChange={handleInputChange} /> : user.cuenta_bancaria}</td>
          </tr>
        </tbody>
      </table>
      {isEditing ? (
        <div>
          <button onClick={handleUpdateUser}>Guardar</button>
          <button onClick={toggleEditing}>Cancelar</button>
        </div>
      ) : (
        <button onClick={toggleEditing}>Editar</button>
      )}
    </div>
 );
}

export default Perfil;