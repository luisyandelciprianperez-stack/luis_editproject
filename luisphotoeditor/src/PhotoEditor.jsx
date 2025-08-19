// src/PhotoEditor.js
import React, { useRef, useState, useEffect } from 'react';

function PhotoEditor() {
  const canvasRef = useRef(null);
  const [img, setImg] = useState(null);
  const [filters, setFilters] = useState({
    exposure: 0,
    contrast: 0,
    saturation: 0,
    brightness: 0,
    hue: 0,
  });
  const [transform, setTransform] = useState({
    rotation: 0,
    scaleX: 1,
    scaleY: 1,
  });
  const [texts, setTexts] = useState([]);
  const [selected, setSelected] = useState(null);
  const [drag, setDrag] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (img) {
      ctx.save(); // Save the current state
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((transform.rotation * Math.PI) / 180);
      ctx.scale(transform.scaleX, transform.scaleY);
      ctx.translate(-canvas.width / 2, -canvas.height / 2);

      ctx.filter = `
        brightness(${100 + filters.brightness}%) 
        contrast(${100 + filters.contrast}%) 
        saturate(${100 + filters.saturation}%) 
        hue-rotate(${filters.hue}deg)
      `;
      // Exposure is not a standard filter, we can simulate it with brightness
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      ctx.restore(); // Restore the original state
    }
  }, [img, filters, texts, selected, transform]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const image = new Image();
        image.src = reader.result;
        image.onload = () => setImg(image);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: parseInt(value, 10) }));
  };

  const handleRotate = () => {
    setTransform((prev) => ({ ...prev, rotation: (prev.rotation + 90) % 360 }));
  };

  const handleFlipHorizontal = () => {
    setTransform((prev) => ({ ...prev, scaleX: prev.scaleX * -1 }));
  };

  const handleFlipVertical = () => {
    setTransform((prev) => ({ ...prev, scaleY: prev.scaleY * -1 }));
  };

  return (
    <div>
      <input type="file" onChange={handleImageUpload} accept="image/*" />
      <div>
        <h3>Filters</h3>
        <label>Exposure: {filters.exposure}</label>
        <input type="range" name="exposure" min="-100" max="100" value={filters.exposure} onChange={handleFilterChange} />
        <label>Brightness: {filters.brightness}</label>
        <input type="range" name="brightness" min="-100" max="100" value={filters.brightness} onChange={handleFilterChange} />
        <label>Contrast: {filters.contrast}</label>
        <input type="range" name="contrast" min="-100" max="100" value={filters.contrast} onChange={handleFilterChange} />
        <label>Saturation: {filters.saturation}</label>
        <input type="range" name="saturation" min="-100" max="100" value={filters.saturation} onChange={handleFilterChange} />
        <label>Hue: {filters.hue}</label>
        <input type="range" name="hue" min="0" max="360" value={filters.hue} onChange={handleFilterChange} />
      </div>
      <div>
        <h3>Transform</h3>
        <button onClick={handleRotate}>Rotate 90°</button>
        <button onClick={handleFlipHorizontal}>Flip Horizontal</button>
        <button onClick={handleFlipVertical}>Flip Vertical</button>
      </div>
      <canvas ref={canvasRef} width={800} height={600} />
    </div>
  );
}

export default PhotoEditor;