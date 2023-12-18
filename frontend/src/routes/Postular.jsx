import React from 'react';
import PostularForm from '../components/PostularForm';

const Postular = () => {
  const selectedBecaId = sessionStorage.getItem('selectedBecaId');
  
  let becaDocumentos = 
  [
  "Fotocopia de cedula de identidad (ambos lados)",
  "Certificado de alumno regular",
  "Certificado de notas año anterior",
  ];
  console.log(becaDocumentos);
  console.log("ace");
  console.log(selectedBecaId);
  return <PostularForm selectedBecaId={selectedBecaId} becaDocumentos={becaDocumentos} />;
};

export default Postular;