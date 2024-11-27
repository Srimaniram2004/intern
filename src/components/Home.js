/*import React, { useState } from 'react';
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
    </>
  );
};

export default Home;
*/

/*import React, { useState } from 'react';
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

          <div className="camera-section">
            <label htmlFor="camera-upload" className="camera-label">
              <button>Open Camera</button>
            </label>
            <input
              type="file"
              id="camera-upload"
              accept="image/*"
              capture="camera" // Opens the phone's camera app for photo capture
              onChange={handleImageChange}
              style={{ display: 'none' }}
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
    </>
  );
};

export default Home;
*/

/*import React, { useState } from 'react';
import './home.css';
import Tesseract from 'tesseract.js';

// Check if the browser supports the Web Speech API
const isSpeechRecognitionAvailable = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;

const Home = () => {
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const [scannedText, setScannedText] = useState('');
  const [voiceText, setVoiceText] = useState('');

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

  const startVoiceRecognition = () => {
    if (!isSpeechRecognitionAvailable) {
      alert("Your browser does not support speech recognition.");
      return;
    }

    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setVoiceText(transcript);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      alert("An error occurred during speech recognition.");
    };

    recognition.onend = () => {
      console.log("Speech recognition ended.");
    };

    recognition.start();
  };

  return (
    <>
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

          <div className="camera-section">
            <label htmlFor="camera-upload" className="camera-label">
              <button>Open Camera</button>
            </label>
            <input
              type="file"
              id="camera-upload"
              accept="image/*"
              capture="camera" // Opens the phone's camera app for photo capture
              onChange={handleImageChange}
              style={{ display: 'none' }}
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

          <div className="voice-section">
            <button onClick={startVoiceRecognition}>Start Voice Recognition</button>
            <p>{voiceText ? `Recognized Text: ${voiceText}` : 'No voice input yet'}</p>
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
    </>
  );
};

export default Home;
*/

import React, { useState } from 'react';
import './home.css';
import Tesseract from 'tesseract.js';

// Check if the browser supports the Web Speech API
const isSpeechRecognitionAvailable = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;

const Home = () => {
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const [scannedText, setScannedText] = useState('');
  const [voiceText, setVoiceText] = useState('');

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

  const startVoiceRecognition = () => {
    if (!isSpeechRecognitionAvailable) {
      alert("Your browser does not support speech recognition.");
      return;
    }

    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setVoiceText(transcript);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      alert("An error occurred during speech recognition.");
    };

    recognition.onend = () => {
      console.log("Speech recognition ended.");
    };

    recognition.start();
  };

  return (
    <>
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

          <div className="camera-section">
            <label htmlFor="camera-upload" className="camera-label">
              <button>Open Camera</button>
            </label>
            <input
              type="file"
              id="camera-upload"
              accept="image/*"
              capture="camera" // Opens the phone's camera app for photo capture
              onChange={handleImageChange}
              style={{ display: 'none' }}
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

          <div className="voice-section">
            <button onClick={startVoiceRecognition}>Start Voice Recognition</button>
            <p>{voiceText ? `Recognized Voice Text: ${voiceText}` : 'No voice input yet'}</p>
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

          <div className="recognized-text">
            <h3>Recognized Voice Text:</h3>
            <p>{voiceText ? voiceText : 'No voice recognition yet'}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
