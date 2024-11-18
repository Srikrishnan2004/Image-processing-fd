import React, { useState, useEffect } from "react";
import "./uploader.css";
import { MdDelete } from "react-icons/md";
import { AiFillFileImage } from "react-icons/ai";

function Uploader() {
  const [image, setImage] = useState(null);
  const [fileName, setFileName] = useState("No Selected Image");

  // States for the processed images and loading indicators
  const [histogramImage, setHistogramImage] = useState(null);
  const [fusionFrameworkImage, setFusionFrameworkImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null); // State to display selected processed image

  const [loadingHistogram, setLoadingHistogram] = useState(false);
  const [loadingFusionFramework, setLoadingFusionFramework] = useState(false);

  // Dynamically generate images array
  const images = Array.from({ length: 20 }, (_, index) => {
    const number = String(index + 1).padStart(2, "0"); // Ensures numbers like 01, 02, etc.
    return {
      id: index + 1,
      src: `sampleimages/${number}.jpg`,
      alt: `Image ${number}`,
    };
  });

  useEffect(() => {
    // Reset state on refresh
    setImage(null);
    setFileName("No Selected Image");
    setHistogramImage(null);
    setFusionFrameworkImage(null);
    setSelectedImage(null);
  }, []);

  // Function to handle API requests
  const callApi = async (url, file, setLoadingState) => {
    setLoadingState(true); // Start loading state

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
      setLoadingState(false); // End loading state
    }
    return null;
  };

  // Function to handle image upload and API calls
  const handleImageUpload = async ({ target: { files } }) => {
    const file = files[0];
    if (file) {
      // Clear previous results and set loading indicators
      setHistogramImage(null);
      setFusionFrameworkImage(null);
      setSelectedImage(null); // Clear displayed processed image
      setLoadingHistogram(true);
      setLoadingFusionFramework(true);

      setFileName(file.name);
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);

      // Call APIs and set the returned images
      const [histogramRes, fusionFrameworkRes] = await Promise.all([
        callApi(
          "https://image-processing-bd-822dd2356f3c.herokuapp.com/histogram-equalization/",
          file,
          setLoadingHistogram
        ),
        callApi(
          "https://image-processing-bd-822dd2356f3c.herokuapp.com/fusion-framework/",
          file,
          setLoadingFusionFramework
        ),
      ]);

      setHistogramImage(histogramRes);
      setFusionFrameworkImage(fusionFrameworkRes);
    }
  };

  // Handle drag events
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.target.classList.add("drag-over");
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.target.classList.remove("drag-over");
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.target.classList.remove("drag-over");

    const file = e.dataTransfer.files[0];
    if (file) {
      handleImageUpload({ target: { files: [file] } });
    }
  };

  return (
    <div className="main-component">
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
      <div className="processed-images">
        <div
          className="image"
          onClick={() => {
            if (!loadingHistogram && histogramImage) {
              setSelectedImage(histogramImage);
            }
          }}
        >
          <img
            style={{ cursor: "pointer" }}
            src={"Frame 3.svg"}
            alt="Histogram Equalization"
          />
        </div>
        <div
          className="image"
          onClick={() => {
            if (!loadingFusionFramework && fusionFrameworkImage) {
              setSelectedImage(fusionFrameworkImage);
            }
          }}
        >
          <img
            style={{ cursor: "pointer" }}
            src={"Group 1.svg"}
            alt="Fusion Framework"
          />
        </div>
      </div>
      <h1
        style={{
          fontFamily: "Poppins, sans-serif",
          fontWeight: "900",
          fontSize: "2rem",
          color: "#333",
        }}
      >
        Sample Images
      </h1>
      <div className="image-gallery">
        {images.map((image) => (
          <div key={image.id} className="image-item">
            <img src={image.src} alt={image.alt} className={"sample-image"} />
          </div>
        ))}
      </div>
      <main className="MainElement">
        {selectedImage ? (
          <div className="displayed-image">
            <img
              src={selectedImage}
              width={300}
              height={300}
              alt="Selected Result"
            />
          </div>
        ) : (
          <form
            onClick={() => document.querySelector(".input-field").click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
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
              <img src={image} width="150" height="150" alt={fileName} />
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
        )}
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
                setSelectedImage(null); // Clear displayed processed image
                setLoadingHistogram(false);
                setLoadingFusionFramework(false);
              }}
            />
          </span>
        </section>
      </main>
    </div>
  );
}

export default Uploader;
