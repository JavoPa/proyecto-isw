import React from 'react';
import PostularForm from '../components/PostularForm';

const Postular = () => {
  const selectedBecaId = sessionStorage.getItem('selectedBecaId');


  return <PostularForm becaId={selectedBecaId} />;
};

export default Postular;