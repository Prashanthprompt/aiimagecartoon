import React, { useState } from "react";
import "./Generated3DModel.css";
import axios from "axios";

const Generated3DModel = ({ imageUrl }) => {
  const [response, setResponse] = useState("");
  const [error, setError] = useState("");

  console.log(imageUrl);

  const handle3DModelCreation = async () => {
    try {
      // Make a POST request to upload the image and request 3D model creation
      //   const formData = new FormData();
      //   formData.append("url", resultUrl);

      const response = await axios.post(
        "https://aibackend.netlify.app/upload",
        {
          url: imageUrl,
        }
      );

      // Handle the task ID from the response and track the status
      const taskId = response.data.taskId;
      setResponse(`Task ID: ${taskId}`);

      const statusInterval = setInterval(async () => {
        const statusResponse = await axios.get(`/status/${taskId}`);
        if (statusResponse.data.status === "success") {
          clearInterval(statusInterval);
          setResponse(
            `Model URL: <a href="${statusResponse.data.output.model}" target="_blank">${statusResponse.data.output.model}</a>`
          );
        } else if (
          statusResponse.data.status === "failed" ||
          statusResponse.data.status === "cancelled"
        ) {
          clearInterval(statusInterval);
          setResponse(`Task ${statusResponse.data.status}`);
        }
      }, 5000); // Poll every 5 seconds
    } catch (error) {
      console.log(error);
      setError("Error creating 3D model: " + error.message);
    }
  };

  return (
    <div>
      <button onClick={handle3DModelCreation} className="transform-to-3d-text">
        Transform to 3D
      </button>

      <div id="response">
        {response && <p dangerouslySetInnerHTML={{ __html: response }} />}
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    </div>
  );
};

export default Generated3DModel;
