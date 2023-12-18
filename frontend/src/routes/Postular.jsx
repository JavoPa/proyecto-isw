import React from 'react';
import PostularForm from '../components/PostularForm';

const Postular = () => {
  const selectedBecaId = sessionStorage.getItem('selectedBecaId');
  const becaDocumentosString = sessionStorage.getItem('selectedBecaDocumentos');
  const becaDocumentos = becaDocumentosString.split(','); 
  console.log(becaDocumentos[0]);
  console.log(selectedBecaId);
  return <PostularForm selectedBecaId={selectedBecaId} becaDocumentos={becaDocumentos} />;
};

export default Postular;