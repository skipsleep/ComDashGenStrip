import React, { useState} from "react";
import { Link } from "react-router-dom";
import "./App.css";


const App = () => {
  const comicTextInitialValue = Array(10).fill("");
  const [comicText, setComicText] = useState(comicTextInitialValue);

  const comicImagesInitialValue = Array(10).fill(null);
  const [comicImages, setComicImages] = useState(comicImagesInitialValue);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  const handleTextChange = (index, text) => {
    const newTextArray = [...comicText];
    newTextArray[index] = text;
    setComicText(newTextArray);
  };


  const query = async (data) => {
    try {
      const response = await fetch(
        "https://xdwvg9no7pefghrn.us-east-1.aws.endpoints.huggingface.cloud",
        {
          headers: {
            Accept: "image/png",
            Authorization:
              "Bearer VknySbLLTUjbxXAXCjyfaFIPwUTCeRXbFSOjwRiCxsxFyhbnGjSFalPKrpvvDAaPVzWEevPljilLVDBiTzfIbWFdxOkYJxnOPoHhkkVGzAknaOulWggusSFewzpqsNWM",
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify(data),
        }
      );
      const result = await response.blob();
      console.log(URL.createObjectURL(result));
      return URL.createObjectURL(result);
    } catch (err) {
      throw new Error("Error querying the API. Please try again.");
    }
  };

  const generateComic = async () => {
    try {
      setError(null);
      setLoading(true);
      const newComicImages = await Promise.all(
        comicText.map(async (text) => {
          const data = { inputs: text };
          const imageUrl = await query(data);
          return imageUrl;
        })
      );

      setComicImages(newComicImages);
    } catch (err) {
      setError(err.message || "Error generating comic. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
                <div className="flex flex-col justify-center">
                <div className="grid grid-flow-row lg:grid-flow-col lg:grid-rows-5">
                  {comicText.map((text, index) => (
                    <div className="border-8 rounded border-emerald-100 p-4 content-center" key={index}>
                      <label className="">{`Panel ${index + 1}: `}</label><br/>
                      <input
                        type="text"
                        value={text}
                        onChange={(e) =>
                          handleTextChange(index, e.target.value)
                        }
                        className="text-input m-w-max bg-gray-100 min-w-fit"
                        placeholder={`High on Life?`}
                      />
                      
                      {comicImages[index] && (
                        <div className="img_box ">
                           {<img className="max-w-lg m-auto "src={comicImages[index]} alt={`  `} /> }                       
                        </div>
                      )}
                      
                    </div>
                  ))}
                </div>
                <button
                  onClick={generateComic}
                  className="max-w-xs m-auto border-2 rounded border-black"
                >
                  <Link style={{ textDecoration: "none", color: "inherit"}}>
                    Create Comic
                  </Link>
                </button>
                {error && (
                  <p style={{ color: "red" }} className="error-message">
                    {error}
                  </p>
                )}
         </div>
    </>
  );
};
export default App;
