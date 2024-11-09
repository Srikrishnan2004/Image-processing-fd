import React, { useState } from "react";
import "./uploader.css";
import { MdCloudUpload, MdDelete } from "react-icons/md";
import { AiFillFileImage } from "react-icons/ai";
import { Oval } from "react-loader-spinner";

function Uploader() {
  const [image, setImage] = useState(null);
  const [fileName, setFileName] = useState("No Selected Image");

  // States for the processed images and loading indicators
  const [histogramImage, setHistogramImage] = useState(null);
  // const [dynamicHistogramImage, setDynamicHistogramImage] = useState(null);
  const [fusionFrameworkImage, setFusionFrameworkImage] = useState(null);

  const [loadingHistogram, setLoadingHistogram] = useState(false);
  // const [loadingDynamicHistogram, setLoadingDynamicHistogram] = useState(false);
  const [loadingFusionFramework, setLoadingFusionFramework] = useState(false);

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
      // setDynamicHistogramImage(null);
      setFusionFrameworkImage(null);
      setLoadingHistogram(true);
      // setLoadingDynamicHistogram(true);
      setLoadingFusionFramework(true);

      setFileName(file.name);
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);

      // Call APIs and set the returned images
      const [histogramRes, dynamicHistogramRes, fusionFrameworkRes] =
        await Promise.all([
          callApi(
            "https://image-processing-bd.onrender.com/histogram-equalization/",
            file,
            setLoadingHistogram
          ),
          // callApi(
          //   "https://image-processing-bd.onrender.com/dynamic_histogram_equalization/",
          //   file,
          //   setLoadingDynamicHistogram
          // ),
          callApi(
            "https://image-processing-bd.onrender.com/fusion-framework/",
            file,
            setLoadingFusionFramework
          ),
        ]);

      setHistogramImage(histogramRes);
      // setDynamicHistogramImage(dynamicHistogramRes);
      setFusionFrameworkImage(fusionFrameworkRes);
    }
  };

  return (
    <div className="main-component">
      <div className="processed-images">
        <div className="image">
          {loadingHistogram ? (
            <Oval color="#00BFFF" height={40} width={40} />
          ) : (
            histogramImage && (
              <img
                src={histogramImage}
                alt="Histogram Equalization Result"
                width={300}
              />
            )
          )}
          <h4>Histogram Equalization</h4>
        </div>
        {/* <div className="image">
          {loadingDynamicHistogram ? (
            <Oval color="#00BFFF" height={40} width={40} />
          ) : (
            dynamicHistogramImage && (
              <img
                src={dynamicHistogramImage}
                alt="Dynamic Histogram Equalization Result"
                width={300}
              />
            )
          )}
          <h4>Dynamic Histogram Equalization</h4>
        </div> */}
        <div className="image">
          {loadingFusionFramework ? (
            <Oval color="#00BFFF" height={40} width={40} />
          ) : (
            fusionFrameworkImage && (
              <img
                src={fusionFrameworkImage}
                alt="Fusion Framework Result"
                width={300}
              />
            )
          )}
          <h4>Fusion Framework</h4>
        </div>
      </div>
      <main className="MainElement">
        <form onClick={() => document.querySelector(".input-field").click()}>
          <input
            type="file"
            accept="image/*"
            className="input-field"
            hidden
            onChange={handleImageUpload}
          />
          {image ? (
            <img src={image} width={300} height={300} alt={fileName} />
          ) : (
            <>
              <MdCloudUpload color="#1475ce" size={60} />
              <p>Browse Images to upload</p>
            </>
          )}
        </form>
        <section className="uploaded-row">
          <AiFillFileImage color="#1475cf" />
          <span className="upload-content">
            {fileName}
            <MdDelete
              onClick={() => {
                setFileName("No selected Image");
                setImage(null);
                setHistogramImage(null);
                // setDynamicHistogramImage(null);
                setFusionFrameworkImage(null);
                setLoadingHistogram(false);
                // setLoadingDynamicHistogram(false);
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
