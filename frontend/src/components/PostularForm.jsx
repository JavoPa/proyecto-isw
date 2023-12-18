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
    // Aquí puedes manejar la subida del archivo
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
  
  //Obtencion de documentosFaltantes
  const [postulacion, setPostulacion] = useState(null);
  const [apelacion, setApelacion] = useState(null);
  const [errorEstado, setErrorEstado] = useState(null);
  const [fechaFin, setFechaFin] = useState(null);
  const [fechaInicio, setFechaInicio] = useState(null);

  return (
    <>
    
      <div>
        {userData ? (
        <div className="postulacionDatos" style={{ display: "flex" }}>
          <div className="container flex-container">
            <div className="form-group">
              <div
                style={{
                  justifyContent: "space-between",
                  marginBottom: "10px",
                }}
              >
                <label>Nombres</label>
                <input
                  type="text"
                  style={{
                    display: "flex",
                    marginBottom: "10px",
                    backgroundColor: "#9E9E9E",
                  }}
                  className="form-control"
                  value={userData.data.nombres}
                  disabled
                />
              </div>
              <div
                style={{
                  justifyContent: "space-between",
                  marginBottom: "10px",
                }}
              >
                <label>Rut</label>
                <input
                  type="text"
                  style={{
                    display: "flex",
                    marginBottom: "10px",
                    backgroundColor: "#9E9E9E",
                  }}
                  className="form-control"
                  value={userData.data.rut}
                  disabled
                />
              </div>
              <div
                style={{
                  justifyContent: "space-between",
                  marginBottom: "10px",
                }}
              >
                <label>Direccion</label>
                <input
                  type="text"
                  style={{
                    display: "flex",
                    marginBottom: "10px",
                    backgroundColor: "#9E9E9E",
                  }}
                  className="form-control"
                  value={userData.data.direccion}
                  disabled
                />
              </div>
              <div
                style={{
                  justifyContent: "space-between",
                  marginBottom: "10px",
                }}
              >
                <label>Discapacidad</label>
                <input
                  type="text"
                  style={{
                    display: "flex",
                    marginBottom: "10px",
                    backgroundColor: "#9E9E9E",
                  }}
                  className="form-control"
                  value={
                    userData.data.discapacidad
                      ? "Presenta discapacidad"
                      : "No presenta "
                  }
                  disabled
                />
              </div>
              <div
                style={{
                  justifyContent: "space-between",
                  marginBottom: "10px",
                }}
              >
                <label>Fecha de nacimiento</label>
                {userData.data.fecha_nacimiento && (
                  <input
                    type="text"
                    style={{
                      display: "flex",
                      marginBottom: "10px",
                      backgroundColor: "#9E9E9E",
                    }}
                    className="form-control"
                    value={new Date(
                      userData.data.fecha_nacimiento
                    ).toLocaleDateString("es-ES")}
                    disabled
                  />
                )}
              </div>
            </div>

            <div className="form-group">
              <div
                style={{
                  justifyContent: "space-between",
                  marginBottom: "10px",
                }}
              >
                <label>Apellidos</label>
                <input
                  type="text"
                  style={{
                    display: "flex",
                    marginBottom: "10px",
                    backgroundColor: "#9E9E9E",
                  }}
                  className="form-control"
                  value={userData.data.apellidos}
                  disabled
                />
              </div>
              <div
                style={{
                  justifyContent: "space-between",
                  marginBottom: "10px",
                }}
              >
                <label>Sexo</label>
                <input
                  type="text"
                  style={{
                    display: "flex",
                    marginBottom: "10px",
                    backgroundColor: "#9E9E9E",
                  }}
                  className="form-control"
                  value={userData.data.sexo}
                  disabled
                />
              </div>
              <div
                style={{
                  justifyContent: "space-between",
                  marginBottom: "10px",
                }}
              >
                                                <label>Telefono</label>
                                                <input
                                                    type="text"
                                                    style={{
                                                        display: "flex",
                                                        marginBottom: "10px",
                                                        backgroundColor: "#9E9E9E",
                                                    }}
                                                    className="form-control"
                                                    value={userData.data.telefono}
                                                    disabled
                                                />
                                            </div>
                                            <div
                                                style={{
                                                    justifyContent: "space-between",
                                                    marginBottom: "10px",
                                                }}
                                            >
                                                <label>Correo electronico</label>
                                                <input
                                                    type="text"
                                                    style={{
                                                        display: "flex",
                                                        marginBottom: "10px",
                                                        backgroundColor: "#9E9E9E",
                                                    }}
                                                    className="form-control"
                                                    value={userData.data.email}
                                                    disabled
                                                />
                                            </div>
                                            <div
                                                style={{
                                                    justifyContent: "space-between",
                                                    marginBottom: "10px",
                                                }}
                                            >
                                                <label>Cuenta bancaria</label>
                                                <input
                                                    type="text"
                                                    style={{
                                                        display: "flex",
                                                        marginBottom: "10px",
                                                        backgroundColor: "#9E9E9E",
                                                    }}
                                                    className="form-control"
                                                    value={userData.data.cuenta_bancaria}
                                                    disabled
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    </div>
                                ) : (
                                    <p></p>
                                    
                                )}
                                
                            </div>

                            <form onSubmit={handleSubmit(onSubmit)}>
                                <h2>Formulario de Postulacion</h2>
                                <label className="input-label" htmlFor="comentario">
                                    <strong>comentario de la postulacion</strong>
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
                                                    accept=".pdf,.jpg,.jpeg,.png" // Define accepted file types if necessary

                                                    {...register(`archivoPDF${index}`, { required: true })}
                                                />
                                            </label>
                                            {errors[`archivoPDF${index}`] && <span className='campo-obligatorio'>*Por favor, sube tus documentos</span>}

                                        
                                        </div>
                                    ))
                                ) : (
                                    <p>No hay documentos para subir</p>
                                )}
                                {errorPostulacion && <div className="error-banner">{errorPostulacion}</div>}
                                <button type="submit">Enviar Postulacion</button>
                                <div className="vacio"></div>
                            </form>
                        </>
                    );
                }

export default PostularForm;
