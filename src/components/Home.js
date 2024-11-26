import React, { useState } from 'react';
import './home.css';
import Tesseract from 'tesseract.js';

const Home = () => {
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const [scannedText, setScannedText] = useState('');

  const handleTextChange = (e) => {
    setText(e.target.value); 
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      scanTextFromImage(file);
    }
  };

  const scanTextFromImage = (file) => {
    Tesseract.recognize(
      file,
      'eng+tam',
      
      {
        logger: (m) => console.log(m), 
      }
    ).then(({ data: { text } }) => {
      setScannedText(text); 
    }).catch((err) => {
      console.error("Error scanning image:", err);
    });
  };

  return (
    <>
    <h1>Welcome To EveryOne  </h1>
    <div className="home-container">
      <div className="left-side">
        <div className="text-box">
          <label htmlFor="text-box">Enter your text:</label>
          <textarea
            id="text-box"
            value={text}
            onChange={handleTextChange}
            placeholder="Type Here..."
            rows="4"
            cols="50"
          />
        </div>

        <div className="image-upload">
          <label htmlFor="image-upload">Upload an image with Tamil And English text:</label>
          <input
            type="file"
            id="image-upload"
            onChange={handleImageChange}
            accept="image/*"
          />
          {image && <img src={image} alt="Uploaded Preview" className="image-preview" />}
        </div>
      </div>

      <div className="right-side">
        <div className="display-text">
          <h3>Entered Text:</h3>
          <p>{text}</p> 
        </div>

        <div className="scanned-text">
          <h3>Extracted Tamil Text from Image:</h3>
          <p>{scannedText ? scannedText : 'No text extracted yet'}</p> 
        </div>
      </div>
    </div>
    <footer>
            <h4>Developed by team</h4>
    </footer>
    </>
  );
};

export default Home;
