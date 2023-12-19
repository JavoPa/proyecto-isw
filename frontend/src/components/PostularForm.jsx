import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { createPostulacion, getMyUser } from "../services/postulacion.service";
import { useState, useEffect } from "react";

function PostularForm({ selectedBecaId, becaDocumentos }) {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [errorPostulacion, setErrorPostulacion] = useState(null);
  const beca_id = selectedBecaId;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  console.log("aca");
  console.log(becaDocumentos);
  console.log("aci");
  console.log(beca_id);
  console.log("aco");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await getMyUser(); // Use the service function to get user data
        setUserData(user);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setErrorPostulacion(error.message);
      }
    };

    fetchUserData();
  }, []);

  const onSubmit = (data) => {
    const comentario = data.comentario;
    const files = Object.keys(data)
      .filter((key) => key.startsWith("archivoPDF"))
      .flatMap((key) => Array.from(data[key]));

    if (!files) {
      setErrorPostulacion("Debe subir al menos un archivo");
      return;
    }

    createPostulacion(comentario, beca_id, files).then((response) => {
      if (response.state === "Success") {
        navigate("/postulacion/becas", { state: { success: response.data } });
      } else {
        setErrorPostulacion(response.message);
      }
    });
  };

  const [postulacion, setPostulacion] = useState(null);
  const [fechaFin, setFechaFin] = useState(null);
  const [fechaInicio, setFechaInicio] = useState(null);

  return (
    <>
      <div>
        {userData ? (
          <div className="postulacionDatos" style={{ display: "flex" }}>
            <h1>Datos del postulante:</h1>
            <div className="container flex-container">
              <table className="postulacion-tabla">
              <tbody>
                <tr>
                  <td className="primera-celda">Nombres</td>
                  <td className="segunda-celda">{userData.data.nombres}</td>
                </tr>
                <tr>
                  <td className="primera-celda">Apellidos</td>
                  <td className="segunda-celda">{userData.data.apellidos}</td>
                </tr>
                <tr>
                  <td className="primera-celda">Rut</td>
                  <td className="segunda-celda">
                    {String(userData.data.rut).slice(0, -1)}-
                    {String(userData.data.rut).slice(-1)}
                  </td>
                </tr>
                <tr>
                  <td className="primera-celda">Sexo</td>
                  <td className="segunda-celda">{userData.data.sexo}</td>
                </tr>
                <tr>
                  <td className="primera-celda">Dirección</td>
                  <td className="segunda-celda">{userData.data.direccion}</td>
                </tr>
                <tr>
                  <td className="primera-celda">Teléfono</td>
                  <td className="segunda-celda">+56 {userData.data.telefono}</td>
                </tr>
                <tr>
                  <td className="primera-celda">Discapacidad</td>
                  <td className="segunda-celda">
                    {userData.data.discapacidad
                      ? "Presenta discapacidad"
                      : "No presenta "}
                  </td>
                </tr>
                <tr>
                  <td className="primera-celda">Correo eléctronico</td>
                  <td className="segunda-celda">{userData.data.email}</td>
                </tr>
                <tr>
                  <td className="primera-celda">Fecha de nacimiento</td>
                  <td className="segunda-celda">
                    {new Date(
                      userData.data.fecha_nacimiento
                    ).toLocaleDateString("es-ES")}
                  </td>
                </tr>
                <tr>
                  <td className="primera-celda">Cuenta bancaria</td>
                  <td className="segunda-celda">{userData.data.cuenta_bancaria}</td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <p>No se encontró información para este usuario.</p>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <h2>Formulario de Postulacion</h2>
        <label className="input-label" htmlFor="comentario">
          <strong>Comentario de la postulacion</strong>
        </label>
        <input
          id="comentario"
          name="comentario"
          type="text"
          placeholder="Si lo desea, puede agregar un comentario"
          {...register("comentario", { required: false })}
        />
        <label>
          <strong>Subir documentos</strong>
        </label>
        {becaDocumentos && becaDocumentos.length > 0 ? (
          becaDocumentos.map((documento, index) => (
            <div key={index}>
              <label className="label-file" htmlFor={`archivoPDF${index}`}>
                {documento}
                <input
                  id={`archivoPDF${index}`}
                  name={`archivoPDF${index}`}
                  type="file"
                  className="input-file"
                  accept=".pdf,.jpg,.jpeg,.png" 
                  {...register(`archivoPDF${index}`, { required: true })}
                />
              </label>
              {errors[`archivoPDF${index}`] && (
                <span className="campo-obligatorio">
                  *Por favor, sube tus documentos
                </span>
              )}
            </div>
          ))
        ) : (
          <p>No hay documentos para subir</p>
        )}
        {errorPostulacion && (
          <div className="error-banner">{errorPostulacion}</div>
        )}
        <button type="submit">Enviar Postulacion</button>
        <div className="vacio"></div>
      </form>
    </>
  );
}

export default PostularForm;
