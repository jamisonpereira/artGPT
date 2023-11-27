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
import { fetchOpenAIAnalysis } from "../redux/slices/sessionsSlice";
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

const options: UploadWidgetConfig = {
  apiKey: !!process.env.NEXT_PUBLIC_UPLOAD_API_KEY
    ? process.env.NEXT_PUBLIC_UPLOAD_API_KEY
    : "free",
  maxFileCount: 1,
  mimeTypes: ["image/jpeg", "image/png", "image/jpg"],
  editor: { images: { crop: false } },
  styles: {
    colors: {
      primary: "#1976d2", // Primary buttons & links
      error: "#d23f4d", // Error messages
      shade100: "#000", // Standard text
      shade200: "#fff", // Secondary button text
      shade300: "#fff", // Secondary button text (hover)
      shade400: "#000", // Welcome text
      shade500: "#808080", // Modal close button
      shade600: "#808080", // Border
      shade700: "#d3d3d3", // Progress indicator background
      shade800: "#fff", // File item background
      shade900: "#ffff", // Various (draggable crop buttons, etc.)
    },
  },
};

export default function UploadContent() {
  const dispatch = useDispatch<AppDispatch>();

  // const [originalPhoto, setOriginalPhoto] = useState<string | null>(null);
  const originalPhoto = useSelector(
    (state: RootState) => state.sessions.originalImage
  );

  const [restoredImage, setRestoredImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [restoredLoaded, setRestoredLoaded] = useState<boolean>(false);
  const [sideBySide, setSideBySide] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [photoName, setPhotoName] = useState<string | null>(null);
  const [theme, setTheme] = useState<themeType>("Modern");
  const [room, setRoom] = useState<roomType>("Living Room");
  const [activeStep, setActiveStep] = useState(0);

  const handleRemoveImage = () => {
    dispatch(setOriginalImage(null)); // Assuming this will reset the state
  };

  const handleAnalyzeClick = async () => {
    console.log("Analyze button clicked");
    if (originalPhoto) {
      dispatch(fetchOpenAIAnalysis({ imageUrl: originalPhoto }));
    } else {
      // Handle the case where originalPhoto is null or undefined
      console.error("originalPhoto is null or undefined");
    }
  };

  const UploadDropZone = () => (
    <UploadDropzone
      options={options}
      onUpdate={({ uploadedFiles }) => {
        if (uploadedFiles.length !== 0) {
          const image = uploadedFiles[0];
          const imageName = image.originalFile.originalFileName;
          const imageUrl = UrlBuilder.url({
            accountId: image.accountId,
            filePath: image.filePath,
            options: {
              transformation: "preset",
              transformationPreset: "thumbnail",
            },
          });
          setPhotoName(imageName);
          // setOriginalPhoto(imageUrl);
          dispatch(setOriginalImage(imageUrl));
          // generatePhoto(imageUrl);
        }
      }}
      width="670px"
      height="250px"
    />
  );

  return (
    <div className="space-y-4 w-full max-w-md">
      <div className="flex mt-3 items-center space-x-3">
        {/* <Image src="/number-1-white.svg" width={30} height={30} alt="1 icon" /> */}
        <p className="text-left font-medium mt-4">
          Upload a picture of your room.
        </p>
      </div>
      {!originalPhoto && <UploadDropZone />}
      {originalPhoto && (
        <div style={{ position: "relative" }}>
          <Image
            alt="original photo"
            src={originalPhoto}
            className="rounded-2xl h-96"
            width={475}
            height={475}
          />
          <CloseButton onClick={handleRemoveImage} />
        </div>
      )}

      {/* Analyze Room Button */}
      <Button
        variant="contained"
        color="primary"
        onClick={handleAnalyzeClick}
        disabled={!originalPhoto} // Button is disabled if no image is uploaded
        style={{ marginTop: "20px" }}
        endIcon={<SendIcon />}>
        Analyze Room
      </Button>
    </div>
  );
}
