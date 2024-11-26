import React, { useState } from 'react';
import './home.css';
import Tesseract from 'tesseract.js';

const Home = () => {
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const [scannedText, setScannedText] = useState('');

  const handleTextChange = (e) => {
    setText(e.target.value);  // Update text as user types
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));  // Set image URL for preview
      scanTextFromImage(file);  // Extract text from image
    }
  };

  const scanTextFromImage = (file) => {
    Tesseract.recognize(
      file,
      'tam',  // Use Tamil language for OCR
      {
        logger: (m) => console.log(m),  // Log OCR progress
      }
    ).then(({ data: { text } }) => {
      setScannedText(text);  // Set the extracted Tamil text into the state
    }).catch((err) => {
      console.error("Error scanning image:", err);
    });
  };

  return (
    <div className="home-container">
      <div className="left-side">
        <div className="text-box">
          <label htmlFor="text-box">Enter your text:</label>
          <textarea
            id="text-box"
            value={text}
            onChange={handleTextChange}
            placeholder="Type something..."
            rows="4"
            cols="50"
          />
        </div>

        <div className="image-upload">
          <label htmlFor="image-upload">Upload an image with Tamil text:</label>
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
          <p>{text}</p>  {/* Display the entered text */}
        </div>

        <div className="scanned-text">
          <h3>Extracted Tamil Text from Image:</h3>
          <p>{scannedText ? scannedText : 'No text extracted yet'}</p>  {/* Display extracted Tamil text */}
        </div>
      </div>
    </div>
  );
};

export default Home;
