import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Drawer from "@mui/material/Drawer";
import Grid from "@mui/material/Grid";
import simpleStore from "../store/simplestore.js";

export default function Sidebar() {
  console.log("Sidebar component running");

  const { open, setOpen } = simpleStore();

  const images = Array.from({ length: 20 }, (_, index) => {
    const number = String(index + 1).padStart(2, "0");
    return {
      id: index + 1,
      src: `sampleimages/${number}.jpg`,
      alt: `Image ${number}`,
    };
  });

  const DrawerList = (
    <Box
      sx={{ width: "35vw", padding: 2 }}
      role="presentation"
      onClick={() => setOpen(false)}
    >
      <Typography sx={{ textAlign: "center", fontSize: "1.5rem" }}>
        Choose an image to test
      </Typography>
      <br />
      <Grid container spacing={2}>
        {images.map((image) => (
          <Grid item xs={6} key={image.id}>
            <img
              src={image.src}
              alt={image.alt}
              style={{ width: "200px", height: "200px", borderRadius: 8 }}
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
