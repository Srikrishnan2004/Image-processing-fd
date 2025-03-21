import React, { useEffect, useState } from "react";
import "./uploader.css";
import { MdDelete } from "react-icons/md";
import { AiFillFileImage } from "react-icons/ai";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import simpleStore from "../store/simplestore.js";

function Uploader() {
  const {
    image,
    fileName,
    histogramImage,
    fusionFrameworkImage,
    setOpen,
    setFileName,
    setImage,
    setHistogramImage,
    setFusionFrameworkImage,
    setLoadingHistogram,
    setLoadingFusionFramework,
  } = simpleStore();

  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    setImage(null);
    setFileName("No Selected Image");
    setHistogramImage(null);
    setFusionFrameworkImage(null);
  }, [setFileName, setFusionFrameworkImage, setHistogramImage, setImage]);

  // Function to handle API requests
  const callApi = async (url, file, setLoadingState) => {
    setLoadingState(true);
    setShowToast(true); // Show processing toast

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch(url, {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        const blob = await response.blob();
        return URL.createObjectURL(blob);
      }
    } catch (error) {
      console.error(`Error in calling ${url}:`, error);
    } finally {
      setLoadingState(false);
      setShowToast(false); // Hide processing toast
    }
    return null;
  };

  // Handle image upload
  const handleImageUpload = async ({ target: { files } }) => {
    const file = files[0];
    if (file) {
      setHistogramImage(null);
      setFusionFrameworkImage(null);

      setFileName(file.name);
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);

      // Call APIs in parallel
      const [histogramRes, fusionFrameworkRes] = await Promise.all([
        callApi(
          "https://image-processing-bd.onrender.com/histogram-equalization/",
          file,
          setLoadingHistogram
        ),
        callApi(
          "https://image-processing-bd.onrender.com/fusion-framework/",
          file,
          setLoadingFusionFramework
        ),
      ]);

      setHistogramImage(histogramRes);
      setFusionFrameworkImage(fusionFrameworkRes);
    }
  };

  return (
    <div className="main-component">
      {/* Toast Notification */}
      <Snackbar open={showToast} autoHideDuration={3000}>
        <Alert severity="warning">Processing Image...</Alert>
      </Snackbar>

      {/* Title & Button */}
      <h1
        style={{
          fontFamily: "Poppins, sans-serif",
          fontWeight: "900",
          fontSize: "2rem",
          color: "#333",
        }}
      >
        Fusion Framework
      </h1>
      <Button
        variant="outlined"
        onClick={() => setOpen(true)}
        className="sample-image-shower"
      >
        Choose an image
      </Button>

      {/* Image Processing Container */}
      <div className="image-processing-container">
        {/* Left Column: Uploaded Image */}
        <div className="input-image-container">
          <form
            onClick={() => document.querySelector(".input-field").click()}
            className="drop-area"
          >
            <input
              type="file"
              accept="image/*"
              className="input-field"
              hidden
              onChange={handleImageUpload}
            />
            {image ? (
              <img src={image} width="100%" height="100%" alt={fileName} />
            ) : (
              <>
                <img
                  src={"cloud.svg"}
                  alt="cloud"
                  style={{ height: "7vh", width: "7vw" }}
                />
                <p className="subhead1" style={{ fontWeight: "700" }}>
                  Drag & drop files or Browse
                </p>
                <p className="subhead2" style={{ fontWeight: "700" }}>
                  Supported formats: jpg, jpeg, png
                </p>
              </>
            )}
          </form>
        </div>

        {/* Right Column: Processed Images */}
        <div className="processed-images-container">
          <div className="processed-image" id="histogram">
            {histogramImage ? (
              <img
                width="100%"
                height="100%"
                src={histogramImage}
                alt="Histogram Equalization"
              />
            ) : (
              <p className="loading-text">Processing Histogram...</p>
            )}
          </div>
          <p style={{ fontSize: "12px" }}>Histogram Equalization Output</p>

          <div className="processed-image" id="fusion">
            {fusionFrameworkImage ? (
              <img
                width="100%"
                height="100%"
                src={fusionFrameworkImage}
                alt="Fusion Framework"
              />
            ) : (
              <p className="loading-text">Processing Fusion...</p>
            )}
          </div>
          <p style={{ fontSize: "12px" }}>Fusion Framework Output</p>
        </div>
      </div>

      {/* File Name & Delete Icon */}
      <section className="uploaded-row">
        <AiFillFileImage color="#1475cf" />
        <span className="upload-content">
          {fileName}
          <MdDelete
            onClick={() => {
              setFileName("No selected Image");
              setImage(null);
              setHistogramImage(null);
              setFusionFrameworkImage(null);
            }}
          />
        </span>
      </section>
    </div>
  );
}

export default Uploader;
