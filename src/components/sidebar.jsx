import * as React from "react";
import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Drawer from "@mui/material/Drawer";
import Grid from "@mui/material/Grid";
import simpleStore from "../store/simplestore.js";

export default function Sidebar() {
  const {
    open,
    setOpen,
    setFileName,
    setImage,
    setLoadingHistogram,
    setLoadingFusionFramework,
    setFusionFrameworkImage,
    setHistogramImage,
  } = simpleStore();

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
  }, []);

  const style = isMobile
    ? { width: "100px", height: "100px", borderRadius: 8 }
    : { width: "200px", height: "200px", borderRadius: 8 };

  const images = Array.from({ length: 20 }, (_, index) => {
    const number = String(index + 1).padStart(2, "0");
    return {
      id: index + 1,
      src: `sampleimages/${number}.jpg`,
      alt: `Image ${number}`,
    };
  });

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

  const handleImageClick = async (image) => {
    try {
      setFileName(image.src);

      // Fetch the image data
      const response = await fetch(image.src);
      const blob = await response.blob();

      // Create a File object from the Blob
      const file = new File([blob], image.src, { type: blob.type });

      // Create a local URL for the image
      const imageUrl = URL.createObjectURL(file);

      // Update the shared state
      setImage(imageUrl);

      // Optionally close the drawer
      setOpen(false);

      const [histogramRes, fusionFrameworkRes] = await Promise.all([
        callApi(
          "http://localhost:8000/histogram-equalization/",
          file,
          setLoadingHistogram
        ),
        callApi(
          "http://localhost:8000/fusion-framework/",
          file,
          setLoadingFusionFramework
        ),
      ]);

      setHistogramImage(histogramRes);
      setFusionFrameworkImage(fusionFrameworkRes);
    } catch (error) {
      console.error("Error fetching image:", error);
    }
  };

  const DrawerList = (
    <Box
      sx={{
        width: { xs: "65vw", sm: "35vw", md: "35vw", lg: "35vw", xl: "35vw" },
        padding: 2,
      }}
      role="presentation"
      onClick={() => setOpen(false)}
    >
      <Typography
        sx={{
          textAlign: "center",
          fontSize: {
            xs: "1.2rem",
            sm: "1.3rem",
            md: "1.5rem",
            lg: "1.5rem",
            xl: "1.5rem",
          },
        }}
      >
        Choose an image to test
      </Typography>
      <br />
      <Grid container spacing={2}>
        {images.map((image) => (
          <Grid item xs={6} key={image.id}>
            <img
              src={image.src}
              alt={image.alt}
              style={style}
              onClick={() => handleImageClick(image)}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  return (
    <div>
      <Drawer open={open} onClose={() => setOpen(false)}>
        {DrawerList}
      </Drawer>
    </div>
  );
}
