// src/PhotoEditor.js
import React, { useRef, useState, useEffect } from 'react';

function PhotoEditor() {
  const canvasRef = useRef(null);
  const [img, setImg] = useState(null);
  const [filters, setFilters] = useState({ exposure: 0, contrast: 0, saturation: 0 });
  const [texts, setTexts] = useState([]);
  const [selected, setSelected] = useState(null);
  const [drag, setDrag] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    // we'll render image, filters, and text here
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, [img, filters, texts, selected]);

  return (
    <div>
      <canvas ref={canvasRef} width={800} height={600} />
    </div>
  );
}

export default PhotoEditor;