"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { UrlBuilder } from "@bytescale/sdk";
import { UploadWidgetConfig } from "@bytescale/upload-widget";
import { UploadDropzone } from "@bytescale/upload-widget-react";
import { CompareSlider } from "../../components/CompareSlider";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import LoadingDots from "../../components/LoadingDots";
import ResizablePanel from "../../components/ResizablePanel";
import Toggle from "../../components/Toggle";
import appendNewToName from "../../utils/appendNewToName";
import downloadPhoto from "../../utils/downloadPhoto";
import DropDown from "../../components/DropDown";
import { roomType, rooms, themeType, themes } from "../../utils/dropdownTypes";
import { Stepper, Step, StepLabel, Button } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";

import { useDispatch, useSelector } from "react-redux";
import { setOriginalImage } from "../redux/slices/sessionsSlice";
import { fetchGeneratedImage } from "../redux/slices/sessionsSlice";
import { AppDispatch, RootState } from "../redux/store";

const CloseButton = ({ onClick }) => (
  <IconButton
    onClick={onClick}
    style={{
      position: "absolute",
      right: 0,
      top: 0,
      color: "black", // You can change the color as needed
      backgroundColor: "white", // Optional: for background
      borderRadius: "50%",
      margin: "10px", // Adjust as needed for positioning
      zIndex: 1000, // To ensure it's above other elements
    }}>
    <CloseIcon />
  </IconButton>
);

export default function GenerateArt() {
  const dispatch = useDispatch<AppDispatch>();

  // const [originalPhoto, setOriginalPhoto] = useState<string | null>(null);
  const [restoredImage, setRestoredImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [restoredLoaded, setRestoredLoaded] = useState<boolean>(false);
  const [sideBySide, setSideBySide] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [photoName, setPhotoName] = useState<string | null>(null);
  const [theme, setTheme] = useState<themeType>("Modern");
  const [room, setRoom] = useState<roomType>("Living Room");
  const [activeStep, setActiveStep] = useState(0);

  const analysis = useSelector((state: RootState) => state.sessions.analysis);

  const brief = useSelector((state: RootState) => state.sessions.brief);
  let combinedBrief = "";
  if (brief) {
    combinedBrief =
      "Artwork Style: " +
      brief.artworkStyle +
      "\n" +
      "Color Palette: " +
      brief.colorPalette +
      "\n" +
      "Imagery Motifs: " +
      brief.imageryMotifs +
      "\n" +
      "Composition: " +
      brief.composition +
      "\n" +
      "Medium: " +
      brief.medium +
      "\n" +
      "Finish: " +
      brief.finish +
      "\n" +
      "Additional Notes: " +
      brief.additionalNotes;
  }

  const handleGenerateClick = async () => {
    console.log("Generate button clicked");
    if (combinedBrief) {
      dispatch(fetchGeneratedImage({ brief: combinedBrief }));
    } else {
      // Handle the case where combinedBrief is null or undefined
      console.error("combinedBrief is null or undefined");
    }
  };

  return (
    <div className="space-y-4 w-full max-w-md">
      <div className="flex mt-3 items-center space-x-3">
        <div className="flex-1">
          <p className="text-left font-medium mt-4">Analysis</p>
          <p className="text-left font-small mt-4">{analysis}</p>
        </div>
        <div className="flex-1">
          <p className="text-left font-medium mt-4">Brief</p>
          <p className="text-left font-small mt-4">{combinedBrief}</p>
        </div>
      </div>
      <Button
        variant="contained"
        color="primary"
        onClick={handleGenerateClick}
        disabled={!combinedBrief} // Button is disabled if no image is uploaded
        style={{ marginTop: "20px" }}
        endIcon={<SendIcon />}>
        Generate Image
      </Button>
    </div>
  );
}
