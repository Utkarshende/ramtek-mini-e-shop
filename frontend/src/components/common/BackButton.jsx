import React from 'react';
import { useNavigate } from 'react-router-dom';

function BackButton({label="Back"}) 
{
    const navigate = useNavigate();
  return (
      <button
        onClick={() => navigate(-1)}
        className="text-slate-500 hover:text-blue-500 text-sm  mb-8 flex items-center gap-2 transrition-colors"
      >
        ← {label}
      </button>
  )
}

export default BackButton
