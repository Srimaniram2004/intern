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
  const [scannedText, setScannedText] = useState('');
  const [voiceText, setVoiceText] = useState('');
  const [voiceError, setVoiceError] = useState(''); // To store speech recognition errors
  const [image, setImage] = useState(null);
  const [recognition, setRecognition] = useState(null);
  const [recognitionTimer, setRecognitionTimer] = useState(null); // Timer to track inactivity

  // Handle text area input
  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  // Function to handle image upload from file input
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      scanTextFromImage(file);
    }
  };

  // Function to handle capturing the image from the camera
  const openCamera = async () => {
    try {
      // Access the user's camera
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const video = document.createElement('video');
      video.srcObject = stream;
      video.play();

      // Create a canvas to capture the image
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');

      // Wait for the video to start playing
      video.onplaying = () => {
        // Set canvas size to match the video dimensions
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Draw the current frame onto the canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Stop the video stream after capturing the image
        stream.getTracks().forEach(track => track.stop());

        // Convert the canvas to an image
        const img = canvas.toDataURL('image/png');
        setImage(img);

        // Process the captured image with Tesseract
        Tesseract.recognize(
          img,
          'eng', // Specify English for OCR
          { logger: (m) => console.log(m) }
        ).then(({ data: { text } }) => {
          setScannedText(text);
        }).catch((err) => {
          console.error("Error scanning image:", err);
        });
      };
    } catch (err) {
      alert('Error accessing camera: ' + err.message);
    }
  };

  // Perform text recognition from the uploaded image
  const scanTextFromImage = (file) => {
    Tesseract.recognize(
      file,
      'eng', // Use English for OCR
      { logger: (m) => console.log(m) }
    ).then(({ data: { text } }) => {
      setScannedText(text);
    }).catch((err) => {
      console.error("Error scanning image:", err);
    });
  };

  // Start continuous voice recognition (English - India)
  const startVoiceRecognition = () => {
    if (!isSpeechRecognitionAvailable) {
      alert("Your browser does not support speech recognition.");
      return;
    }

    const recognitionInstance = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognitionInstance.lang = 'en-IN'; // Set language to English (India)
    recognitionInstance.continuous = true; // Keep the recognition running until manually stopped
    recognitionInstance.interimResults = true; // Show interim results (real-time recognition)

    // Store the recognition instance
    setRecognition(recognitionInstance);

    // Start listening for speech
    recognitionInstance.start();

    // Set a timeout to stop recognition if no speech is detected for a certain time
    setRecognitionTimer(setTimeout(() => {
      console.log("No speech detected. Stopping recognition...");
      recognitionInstance.stop(); // Stop the recognition after timeout
    }, 5000)); // 5 seconds timeout for inactivity (can be adjusted)

    // Store the final recognized result
    recognitionInstance.onresult = (event) => {
      let transcript = '';
      // Loop through all the results (since continuous is true, we might have multiple results)
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setVoiceText(transcript);
      setVoiceError(''); // Reset the error message after successful recognition

      // Clear the timeout if the user is speaking
      clearTimeout(recognitionTimer);
      // Set the timer again as the user is speaking
      setRecognitionTimer(setTimeout(() => {
        console.log("No speech detected. Stopping recognition...");
        recognitionInstance.stop(); // Stop the recognition after timeout
      }, 5000)); // Restart the timer after each speech event
    };

    // Handle errors during voice recognition
    recognitionInstance.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setVoiceError(`Error occurred: ${event.error}`); // Store the error message
    };

    recognitionInstance.onend = () => {
      console.log("Speech recognition ended.");
    };
  };

  return (
    <div className="home-container">
      <div className="left-side">
        {/* Text Box for manual text input */}
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

        {/* Camera Section: Capture image from the camera */}
        <div className="camera-section">
          <button onClick={openCamera}>Open Camera</button>
        </div>

        {/* Image File Upload */}
        <div className="image-upload">
          <label htmlFor="image-upload">Upload an image with Tamil And English text:</label>
          <input
            type="file"
            id="image-upload"
            onChange={handleImageChange}
            accept="image/*"
          />
        </div>

        {/* Voice Recognition Section */}
        <div className="voice-section">
          <button onClick={startVoiceRecognition}>Start Voice Recognition</button>
          <p>{voiceText ? `Recognized Voice Text: ${voiceText}` : 'No voice input yet'}</p>
          {/* Display voice recognition error message if exists */}
          {voiceError && <p style={{ color: 'red' }}>{voiceError}</p>}
        </div>
      </div>

      <div className="right-side">
        {/* Display Entered Text */}
        <div className="display-text">
          <h3>Entered Text:</h3>
          <p>{text}</p>
        </div>

        {/* Display Scanned Text from Image */}
        <div className="scanned-text">
          <h3>Extracted Tamil Text from Image:</h3>
          <p>{scannedText ? scannedText : 'No text extracted yet'}</p>
        </div>

        {/* Display Recognized Voice Text */}
        <div className="recognized-text">
          <h3>Recognized Voice Text:</h3>
          <p>{voiceText ? voiceText : 'No voice recognition yet'}</p>
        </div>

        {/* Display Image Preview */}
        {image && <img src={image} alt="Uploaded Preview" className="image-preview" />}
      </div>
    </div>
  );
};

export default Home;
