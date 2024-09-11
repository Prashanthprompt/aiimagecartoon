const express = require("express");
const cors = require("cors");
const multer = require("multer");
const cloudinary = require("./cloudinaryConfig");
const path = require("path");
const fs = require("fs");
const axios = require("axios");
const WebSocket = require("ws");

const app = express();
const PORT = 3000;

// Configure CORS
const corsOptions = {
  origin: "https://aicartoon3d.netlify.app/", // Allow this origin
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};

// Middleware
app.use(express.json());
app.use(cors(corsOptions));

// Configure multer for file uploads (but not used in this case)
const storage = multer.memoryStorage(); // Use memory storage for direct upload to Cloudinary
const upload = multer({ storage: storage });

// Image upload endpoint
app.post(
  "https://aicartoon3d.netlify.app/upload",
  upload.single("image"),
  async (req, res) => {
    if (req.file) {
      try {
        const result = await cloudinary.uploader
          .upload_stream({ folder: "uploads" }, (error, result) => {
            if (error) {
              return res.status(500).json({ error: error.message });
            }
            res.json({ imageUrl: result.secure_url });
          })
          .end(req.file.buffer);
      } catch (error) {
        res.status(500).json({ error: "Error uploading image" });
      }
    } else {
      res.status(400).json({ error: "No file uploaded" });
    }
  }
);

// API call to generate the 3D model
app.post(
  "https://aicartoon3d.netlify.app/api/generate-model",
  async (req, res) => {
    try {
      const body = {
        url: req.body.url,
        width: 1024,
        height: 1024,
        background: {
          generate: {
            description: req.body.description,
            adapter_type: "face",
            face_id: true,
          },
        },
      };

      const response = await axios.post(
        "https://deep-image.ai/rest_api/process_result",
        body,
        {
          headers: {
            "x-api-key": "8e8bd040-65dd-11ef-904f-7382d6a676af",
            "Content-Type": "application/json",
          },
        }
      );

      res.json(response.data);
    } catch (error) {
      console.error("Error generating model:", error);
      res.status(500).json({ error: "Error generating model" });
    }
  }
);

// API call to upscale the image
app.post(
  "https://aicartoon3d.netlify.app/api/upscale-image",
  async (req, res) => {
    try {
      const response = await axios.post(
        "https://deep-image.ai/rest_api/process_result",
        {
          url: req.body.imageUrl,
          width: 3000,
          generative_upscale: true,
        },
        {
          headers: {
            "x-api-key": "8e8bd040-65dd-11ef-904f-7382d6a676af",
            "Content-Type": "application/json",
          },
        }
      );

      res.json(response.data);
    } catch (error) {
      console.error("Error Upscaling:", error);
      res.status(500).json({ error: "Error upscaling image" });
    }
  }
);

const apiKey = "tsk_-si8bUSP0mwg9tIWsZ-GBcXHsGk6WJAIoyNLZgS69BK";
// Endpoint to handle image upload and request 3D model creation
app.post("/upload", async (req, res) => {
  const url = req.body.url;

  console.log(url);

  // Step 1: Upload the image
  //   const formData = new FormData();
  //   formData.append("file", fs.createReadStream(filePath));

  try {
    const uploadResponse = await fetch(
      "https://api.tripo3d.ai/v2/openapi/upload",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
        body: url,
      }
    );

    const uploadResult = await uploadResponse.json();
    if (uploadResponse.ok) {
      const imageToken = uploadResult.data.image_token;

      // Step 2: Request 3D model creation
      const modelRequest = {
        type: "image_to_model",
        file: {
          type: "type/jpeg",
          file_token: imageToken,
        },
      };

      const modelResponse = await fetch(
        "https://api.tripo3d.ai/v2/openapi/task",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify(modelRequest),
        }
      );

      const modelResult = await modelResponse.json();
      if (modelResponse.ok) {
        const taskId = modelResult.data.task_id;

        // Start WebSocket connection for task updates
        startWebSocket(taskId);

        res.json({ taskId });
      } else {
        res.status(500).json({ error: modelResult.message });
      }
    } else {
      res.status(500).json({ error: uploadResult.message });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  } finally {
    // Delete the uploaded file after processing
    fs.unlinkSync(filePath);
  }
});

// Start WebSocket connection for task updates
function startWebSocket(taskId) {
  const url = `wss://api.tripo3d.ai/v2/openapi/watch/task/${taskId}`;
  const ws = new WebSocket(url, {
    headers: { Authorization: `Bearer ${apiKey}` },
  });

  ws.on("message", (message) => {
    try {
      const data = JSON.parse(message);
      const status = data.data.status;
      if (status === "finalized") {
        console.log(
          `Task ${taskId} completed. Model URL: ${data.data.model_url}`
        );
        ws.close();
      }
    } catch (err) {
      console.log("Received non-JSON message:", message);
      ws.close();
    }
  });

  ws.on("error", (err) => {
    console.error("WebSocket Error:", err);
  });
}

// Endpoint to check the status of the 3D model creation
app.get("https://aicartoon3d.netlify.app/status/:taskId", async (req, res) => {
  const { taskId } = req.params;

  try {
    const statusResponse = await fetch(
      `https://api.tripo3d.ai/v2/openapi/task/${taskId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    const statusResult = await statusResponse.json();
    if (statusResponse.ok) {
      res.json(statusResult);
    } else {
      res.status(500).json({ error: statusResult.message });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Endpoint to stylize the model
app.post(
  "https://aicartoon3d.netlify.app/stylize/:taskId",
  async (req, res) => {
    const { taskId } = req.params;
    const { style } = req.body;

    const stylizeRequest = {
      type: "stylize_model",
      style,
      original_model_task_id: taskId,
    };

    try {
      const stylizeResponse = await fetch(
        "https://api.tripo3d.ai/v2/openapi/task",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify(stylizeRequest),
        }
      );

      const stylizeResult = await stylizeResponse.json();
      if (stylizeResponse.ok) {
        res.json({ taskId: stylizeResult.data.task_id });
      } else {
        res.status(500).json({ error: stylizeResult.message });
      }
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: error.message });
    }
  }
);

// Endpoint to convert the model
app.post(
  "https://aicartoon3d.netlify.app/convert/:taskId",
  async (req, res) => {
    const { taskId } = req.params;
    const { format, quad, face_limit } = req.body;

    const convertRequest = {
      type: "convert_model",
      format,
      original_model_task_id: taskId,
      quad,
      face_limit,
    };

    try {
      const convertResponse = await fetch(
        "https://api.tripo3d.ai/v2/openapi/task",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify(convertRequest),
        }
      );

      const convertResult = await convertResponse.json();
      if (convertResponse.ok) {
        res.json({ taskId: convertResult.data.task_id });
      } else {
        res.status(500).json({ error: convertResult.message });
      }
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: error.message });
    }
  }
);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
