import React, { useState, useEffect } from "react";
import { createPostulacion, getMyUser } from "../services/postulacion.service"; // Import the service functions

const PostularForm = ({ becaId }) => {
    
  const [comment, setComment] = useState("");
  const [userData, setUserData] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await getMyUser(); // Use the service function to get user data
        setUserData(user);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };
  const handleFileChange = (event) => {
    const files = event.target.files;
    const selected = Array.from(files).slice(0, 5); // Limit to 5 files
    setSelectedFiles(selected);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (userData) {
        const formData = new FormData();
  
        // Append files to FormData
        selectedFiles.forEach((file, index) => {
          formData.append(`archivoPDF${index + 1}`, file);
        });
        console.log(formData);
        console.log(becaId);
        console.log(comment);
        // Add other necessary form data to the FormData object
        
        // Call the frontend service to create the postulation
        const response = await createPostulacion(formData, becaId, comment);
        // Handle the response from the frontend service
        if (response) {
          console.log('Postulacion created:', response);
          // Handle success - maybe show a success message or redirect the user
        } else {
          console.error('Error creating postulacion');
          // Show an error message to the user
        }
      }
    } catch (error) {
      console.error('Error creating postulacion:', error);
      // Handle any unexpected errors
    }
  };
  return (
    <div>
      {userData ? (
        <form onSubmit={handleSubmit} style={{ display: "fex" }}>
          <div className="container flex-container">
          <div className="form-group">
            <div
              style={{ justifyContent: "space-between", marginBottom: "10px" }}
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
              style={{ justifyContent: "space-between", marginBottom: "10px" }}
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
              style={{ justifyContent: "space-between", marginBottom: "10px" }}
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
              style={{ justifyContent: "space-between", marginBottom: "10px" }}
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
              style={{ justifyContent: "space-between", marginBottom: "10px" }}
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
              style={{ justifyContent: "space-between", marginBottom: "10px" }}
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
              style={{ justifyContent: "space-between", marginBottom: "10px" }}
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
              style={{ justifyContent: "space-between", marginBottom: "10px" }}
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
              style={{ justifyContent: "space-between", marginBottom: "10px" }}
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
              style={{ justifyContent: "space-between", marginBottom: "10px" }}
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



          <div className="form-group">
            <label>Comentario</label>
            <textarea
              className="form-control"
              value={comment}
              onChange={handleCommentChange}
              placeholder="Si lo desea, puede agregar un comentario a su postulación."
            />
          </div><div className="form-group">
            <label>Subir archivos (máximo 5)</label>
            <input
              type="file"
              className="form-control-file"
              multiple  // Allow multiple file selection
              onChange={handleFileChange} // Handle file selection
              accept=".pdf,.doc,.docx" // Define accepted file types if necessary
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Enviar
          </button>
        </form>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  );
};

export default PostularForm;