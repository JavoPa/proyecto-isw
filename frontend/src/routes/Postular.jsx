import React from 'react';
import PostularForm from '../components/PostularForm';
import { useParams } from 'react-router-dom';

const Postular = () => {
  const { becaId } = useParams();

  return <PostularForm becaId={becaId} />;
};

export default Postular;