import React from 'react';
import PostularForm from '../components/PostularForm';

const Postular = () => {
  const selectedBecaId = sessionStorage.getItem('selectedBecaId');
  const becaDocumentosString = sessionStorage.getItem('selectedBecaDocumentos');
  const becaDocumentosObj = becaDocumentosString.split(','); 
  const becaDocumentos = [...becaDocumentosObj];
  console.log(becaDocumentos);
  console.log(selectedBecaId);
  return <PostularForm selectedBecaId={selectedBecaId} becaDocumentos={becaDocumentos} />;
};

export default Postular;