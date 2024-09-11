import React, { useState, useEffect } from "react";
import "./GeneratedModelForm.css";
import axios from "axios";
import Generated3DModel from "../generated3DModel/Generated3DModel";

const GenerateModelForm = ({ imageUrl }) => {
  const [description, setDescription] = useState("");
  const [resultUrl, setResultUrl] = useState("");
  const [upscaledUrl, setUpscaledUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Add loading state
  const [progress, setProgress] = useState(0);
  const [completed, setCompleted] = useState(false); // Track completion

  useEffect(() => {
    let interval;
    if (loading) {
      interval = setInterval(() => {
        setProgress((prev) => (prev < 100 ? prev + 10 : 100));
      }, 2500); // Increment progress every 100ms
    } else {
      setProgress(0); // Reset progress when not loading
    }
    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [loading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResultUrl("");
    setUpscaledUrl("");
    setLoading(true); // Set loading to true
    setCompleted(false); // Reset completion state

    try {
      if (!imageUrl) {
        setError("Image URL is required.");
        setLoading(false); // Set loading to false
        return;
      }

      const result = await axios.post(
        "https://aibackend.netlify.app/api/generate-model",
        {
          url: imageUrl,
          description,
        }
      );

      if (result.data && result.data.result_url) {
        setResultUrl(result.data.result_url);

        const upscaleResult = await axios.post(
          "https://aibackend.netlify.app/api/upscale-image",
          {
            imageUrl: result.data.result_url,
          }
        );

        if (upscaleResult.data && upscaleResult.data.result_url) {
          setUpscaledUrl(upscaleResult.data.result_url);
        } else {
          //   setError("No upscaled result URL returned.");
        }
      } else {
        // setError("No result URL returned from 3D model generation.");
      }
    } catch (err) {
      //   setError(err.message);
    } finally {
      setLoading(false); // Set loading to false
      setCompleted(true);
    }
  };

  return (
    <div>
      <div className="model-and-3d-model-container">
        <form onSubmit={handleSubmit} className="generate-model-form-container">
          {loading ? (
            <div className="progress-bar">
              <div
                className="progress-bar-fill"
                style={{ width: `${progress}%` }}
              >
                <div className="progress-bar-text">{progress}%</div>
              </div>
            </div>
          ) : completed && resultUrl ? (
            <div>
              <img
                src={resultUrl}
                alt="Generated Cartoon"
                className="generated-image"
              />
              <p className="generated-image-text">Cartoon</p>
            </div>
          ) : (
            <>
              <label>Description:</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
              <button type="submit">Transform to Cartoon</button>
            </>
          )}
        </form>

        {resultUrl && completed && <Generated3DModel imageUrl={imageUrl} />}
      </div>

      {/* {upscaledUrl && (
        <div>
          <p>
            Upscaled Image:
            <img
              src={upscaledUrl}
              alt="Upscaled Cartoon"
              style={{ maxWidth: "100%" }}
            />
          </p>
        </div>
      )} */}

      {error && (
        <div style={{ color: "red" }}>
          <p>Error: {error}</p>
        </div>
      )}
    </div>
  );
};

export default GenerateModelForm;
