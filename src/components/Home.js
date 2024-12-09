  import React, { useState, useEffect, useRef } from 'react';
  import './home.css';
  import Tesseract from 'tesseract.js';
  import logo from './THIRUVALLUVAR.png';

  const isSpeechRecognitionAvailable = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;

  const Home = () => {
    const [text, setText] = useState('');
    const [searchResult, setSearchResult] = useState(''); // State to store search results
    const [scannedText, setScannedText] = useState('');
    const [voiceText, setVoiceText] = useState('');
    const [voiceError, setVoiceError] = useState('');
    const [image, setImage] = useState(null);
    const [recognition, setRecognition] = useState(null);
    const [cameraStream, setCameraStream] = useState(null);
    const [sliderValue, setSliderValue] = useState(16); // Default font size
    const [voiceLang, setVoiceLang] = useState('en-IN'); // Default to English
    const [dailyKural, setDailyKural] = useState(null); // State to store daily Kural data
    const videoRef = useRef(null);

    // Fetch the daily Kural data when the component loads
    useEffect(() => {
      const fetchDailyKural = async () => {
        try {
          const response = await fetch('http://localhost:5000/api/kural/daily-kural'); // Ensure this matches your backend
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          const data = await response.json();
          setDailyKural(data);
        } catch (error) {
          console.error('Error fetching daily Kural:', error);
        }
      };

      fetchDailyKural();
    }, []);
    const formatVerse = (verse) => {
      // Split the verse by tab character '\t'
      const words = verse.split('\t').filter(word => word.trim() !== '');
    
      // Get the first 4 words and the rest of the words
      const firstLineWords = words.slice(0, 4).join(' ');
      const secondLineWords = words.slice(4).join(' ');
    
      return (
        <>
          <p>{firstLineWords}</p>
          <p>{secondLineWords}</p>
        </>
      );
    };
    
  

    // Handle text input changes
    const handleTextChange = (e) => {
      setText(e.target.value);
    };

    // Handle text searching
    // Handle text searching
    const handleSearch = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/kural/search', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text }), // Send search text in request body
        });
    
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
    
        const data = await response.json();
        
        // If 'results' contains duplicates or is being set multiple times, we'll only set the first unique set of results.
        const uniqueResults = Array.from(new Set(data.results.map(a => a._id)))
          .map(id => data.results.find(a => a._id === id));
    
        setSearchResult(uniqueResults || 'No results found.');
      } catch (error) {
        console.error('Error searching text:', error);
        setSearchResult('Error occurred while searching.');
      }
    };
    

    const handleImageChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const imageUrl = URL.createObjectURL(file);
        setImage(imageUrl);
        scanTextFromImage(file);
      }
    };

    const openCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setCameraStream(stream);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      } catch (err) {
        alert('Error accessing camera: ' + err.message);
      }
    };

    const takePicture = () => {
      if (!cameraStream || !videoRef.current) return;

      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;

      context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

      const img = canvas.toDataURL('image/png');
      setImage(img);

      Tesseract.recognize(img, 'tam', { logger: (m) => console.log(m) })
        .then(({ data: { text } }) => {
          setScannedText(text);
          handleSearch1(text);
        })
        .catch((err) => {
          console.error('Error scanning image:', err);
        });
    };

    const stopCamera = () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
        setCameraStream(null);
      }
    };

    const scanTextFromImage = (file) => {
      Tesseract.recognize(file, 'eng+tam', { logger: (m) => console.log(m) })
        .then(({ data: { text } }) => {
          setScannedText(text); // Update the state with the extracted text
          console.log('Scanned text:', text);

          // Now, send the extracted text to the backend (database)
          handleSearch1(text);
        })
        .catch((err) => {
          console.error('Error scanning image:', err);
        });
    };

    // Function to send extracted text to the backend for searching or storing
    const handleSearch1 = async (text) => {
      try {
        const response = await fetch('http://localhost:5000/api/kural/search', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text }), // Send search text in request body
        });
    
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
    
        const data = await response.json();
        
        // If 'results' contains duplicates or is being set multiple times, we'll only set the first unique set of results.
        const uniqueResults = Array.from(new Set(data.results.map(a => a._id)))
          .map(id => data.results.find(a => a._id === id));
    
        setSearchResult(uniqueResults || 'No results found.');
      } catch (error) {
        console.error('Error searching text:', error);
        setSearchResult('Error occurred while searching.');
      }
    };


  const startVoiceRecognition = () => {
    if (!isSpeechRecognitionAvailable) {
      alert('Your browser does not support speech recognition.');
      return;
    }

    const recognitionInstance = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognitionInstance.lang = voiceLang;
    recognitionInstance.continuous = true;
    recognitionInstance.interimResults = true;

    setRecognition(recognitionInstance);

    recognitionInstance.start();

    recognitionInstance.onresult = async (event) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }

      setVoiceText(transcript);
      setVoiceError('');

      // After getting the voice recognition text, search it in the database
      try {
        const response = await fetch('http://localhost:5000/api/kural/search', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text: transcript }), // Sending the recognized text
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        // Set the search results based on the response
        const uniqueResults = Array.from(new Set(data.results.map(a => a._id)))
          .map(id => data.results.find(a => a._id === id));

        setSearchResult(uniqueResults || 'No results found.');
      } catch (error) {
        console.error('Error searching voice text:', error);
        setSearchResult('Error occurred while searching.');
      }
    };

    recognitionInstance.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setVoiceError(`Error occurred: ${event.error}`);
    };

    recognitionInstance.onend = () => {
      console.log('Speech recognition ended.');
    };
  };


    const stopVoiceRecognition = () => {
      if (recognition) {
        recognition.stop();
        setRecognition(null);
      }
    };

    const handleSliderChange = (e) => {
      setSliderValue(Number(e.target.value));
    };

    const handleLanguageChange = (e) => {
      setVoiceLang(e.target.value);
    };

    return (
      <>
        {/* Navbar with logo */}
        <nav className="navbar">
          <img src={logo} alt="Logo" className="logo" />
          <h1 className="navbar-title">THIRUKURAL</h1>
        </nav>
            {/* New card outside the home-container to show daily Kural */}
            <div className="outside-card">
          <h2 className="daily_title">தினம் ஒரு குறள்</h2>
          <h4 className="daily">
            {dailyKural ? (
              <>
                <p>{formatVerse(dailyKural.Verse)}</p>
                <p>{dailyKural.Explanation}</p>
                <p>{dailyKural.Translation}</p>
              </>
            ) : (
              <p>Loading the daily Kural...</p>
            )}
          </h4>
        </div>

        {/* Main Content */}
        <div className="home-container">
          <div className="left-side">
            {/* Text input */}
            {/* Text input and search result display */}
            <div className="card">
              <label htmlFor="text-box">Enter your text:</label>
              <textarea
                id="text-box"
                value={text}
                onChange={handleTextChange}
                placeholder="Type Here..."
                rows="4"
                cols="50"
                className="input-area"
              />
            
              <button className="primary-button" onClick={handleSearch}>Search</button>
            
            </div>


            {/* Camera section */}
            <div className="card camera-section">
              <button className="primary-button" onClick={openCamera}>Open Camera</button>
              {cameraStream && (
                <>
                  <button className="secondary-button" onClick={takePicture}>Take Picture</button>
                  <button className="danger-button" onClick={stopCamera}>Close Camera</button>
                </>
              )}
              <video ref={videoRef} className="video-preview" autoPlay muted></video>
            </div>

            {/* File upload and image preview */}
            <div className="card">
              <label htmlFor="image-upload">Upload an image with Tamil and English text:</label>
              <input
                type="file"
                id="image-upload"
                onChange={handleImageChange}
                accept="image/*"
                className="file-input"
              />
              {image && (
                <div className="image-preview-container">
                  <img src={image} alt="Selected" className="image-preview" />
                </div>
              )}
            </div>

            {/* Voice recognition */}
            <div className="card">
              <label htmlFor="language-select">Select Language:</label>
              <select id="language-select" value={voiceLang} onChange={handleLanguageChange}>
                <option value="en-IN">English</option>
                <option value="ta-IN">Tamil</option>
              </select>
              <button className="primary-button" onClick={startVoiceRecognition}>Start Voice Recognition</button>
              <button className="danger-button" onClick={stopVoiceRecognition}>Stop Voice Recognition</button>
              <p>{voiceText ? `Recognized Voice Text: ${voiceText}` : 'No voice input yet'}</p>
              {voiceError && <p className="error-text">{voiceError}</p>}
            </div>
          </div>

          <div className="right-side">
            {/* Entered text */}
            <div className="card">
              <h3>Entered Text:</h3>
              <p>{text}</p>
            </div>
            <div className="right-side">
              <div className="card">
              <h1>Search Results:</h1>
              
              {searchResult && (
                      <div>
                        {/* Displaying the search result object if it contains valid results */}
                        {Array.isArray(searchResult) ? (
                          searchResult.map((result) => (
                            <div key={result._id}>
                              <h4>Chapter: {result['Chapter Name']}</h4>
                              <h4>Section: {result['Section Name']}</h4>
                              
                              {/* Apply the formatVerse function to the Verse */}
                              <p><strong>Verse:</strong> {formatVerse(result.Verse)}</p>
                              
                              <p><strong>Translation:</strong> {result.Translation}</p>
                              <p><strong>Explanation:</strong> {result.Explanation}</p>
                            </div>
                          ))
                        ) : (
                          <p>{searchResult}</p>
                        )}
                      </div>
                    )}

              
            </div>
            </div>
          

            {/* Extracted text with slider */}
            <div className="card">
              <h3>Extracted Tamil Text from Image:</h3>
              <input
                type="range"
                min="12"
                max="36"
                value={sliderValue}
                onChange={handleSliderChange}
                className="slider"
              />
              <p style={{ fontSize: `${sliderValue}px` }}>
                {scannedText ? scannedText : 'No text extracted yet'}
              </p>
            </div>

            {/* Recognized voice text */}
            <div className="card">
              <h3>Recognized Voice Text:</h3>
              <p>{voiceText ? voiceText : 'No voice recognition yet'}</p>
            </div>
          </div>
        </div>
      

    
      </>
    );
  };

  export default Home;
