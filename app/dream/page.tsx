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
import { makeStyles } from "@mui/styles";
import { Stepper, Step, StepLabel, Button } from "@mui/material";
import UploadContent from "./UploadContent";
import GenerateArt from "./GenerateArt";
import ReviewArt from "./ReviewArt";

const steps = ["Upload Photo", "Generate Art", "Review Art"];

const useStyles = makeStyles({
  stepLabel: {
    "& .MuiStepLabel-label": {
      color: "black", // Change to your desired color
      // "&.Mui-active": {
      //   color: "yellow", // Change to your desired active color
      // },
      // "&.Mui-completed": {
      //   color: "green", // Change to your desired completed color
      // },
    },
  },
});

// const options: UploadWidgetConfig = {
//   apiKey: !!process.env.NEXT_PUBLIC_UPLOAD_API_KEY
//     ? process.env.NEXT_PUBLIC_UPLOAD_API_KEY
//     : "free",
//   maxFileCount: 1,
//   mimeTypes: ["image/jpeg", "image/png", "image/jpg"],
//   editor: { images: { crop: false } },
//   styles: {
//     colors: {
//       primary: "#2563EB", // Primary buttons & links
//       error: "#d23f4d", // Error messages
//       shade100: "#fff", // Standard text
//       shade200: "#fffe", // Secondary button text
//       shade300: "#fffd", // Secondary button text (hover)
//       shade400: "#fffc", // Welcome text
//       shade500: "#fff9", // Modal close button
//       shade600: "#fff7", // Border
//       shade700: "#fff2", // Progress indicator background
//       shade800: "#fff1", // File item background
//       shade900: "#ffff", // Various (draggable crop buttons, etc.)
//     },
//   },
// };

export default function DreamPage() {
  const [originalPhoto, setOriginalPhoto] = useState<string | null>(null);
  const [restoredImage, setRestoredImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [restoredLoaded, setRestoredLoaded] = useState<boolean>(false);
  const [sideBySide, setSideBySide] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [photoName, setPhotoName] = useState<string | null>(null);
  const [theme, setTheme] = useState<themeType>("Modern");
  const [room, setRoom] = useState<roomType>("Living Room");
  const [activeStep, setActiveStep] = useState(0);

  const classes = useStyles();

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
    // Reset other states if needed
  };

  const getStepContent = (stepIndex: any) => {
    switch (stepIndex) {
      case 0:
        return <UploadContent />;
      // return <UploadContent setUploadedPhoto={setUploadedPhoto} />;
      case 1:
        return <GenerateArt />;
      case 2:
        return <ReviewArt />;
      default:
        return "Unknown step";
    }
  };

  // const UploadDropZone = () => (
  //   <UploadDropzone
  //     options={options}
  //     onUpdate={({ uploadedFiles }) => {
  //       if (uploadedFiles.length !== 0) {
  //         const image = uploadedFiles[0];
  //         const imageName = image.originalFile.originalFileName;
  //         const imageUrl = UrlBuilder.url({
  //           accountId: image.accountId,
  //           filePath: image.filePath,
  //           options: {
  //             transformation: "preset",
  //             transformationPreset: "thumbnail",
  //           },
  //         });
  //         setPhotoName(imageName);
  //         setOriginalPhoto(imageUrl);
  //         // generatePhoto(imageUrl);
  //       }
  //     }}
  //     width="670px"
  //     height="250px"
  //   />
  // );

  async function generatePhoto(fileUrl: string) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    setLoading(true);
    const res = await fetch("/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ imageUrl: fileUrl, theme, room }),
    });

    let newPhoto = await res.json();
    if (res.status !== 200) {
      setError(newPhoto);
    } else {
      setRestoredImage(newPhoto[1]);
    }
    setTimeout(() => {
      setLoading(false);
    }, 1300);
  }

  return (
    <div className="flex max-w-6xl mx-auto flex-col items-center justify-center py-2 min-h-screen">
      <Header />
      <main className="flex flex-1 w-full flex-col items-center justify-top text-center px-4 mt-10 sm:mb-0 mb-8">
        <h1 className="mx-auto max-w-4xl font-display text-4xl font-bold tracking-normal text-black sm:text-6xl mb-5">
          Generate <span className="text-blue-600">unique art</span> for your
          home
        </h1>
        <Stepper activeStep={activeStep}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel className={classes.stepLabel}>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <div className="w-full flex flex-col items-center justify-center">
          {activeStep === steps.length ? (
            <div>
              <Button onClick={handleReset}>Reset</Button>
            </div>
          ) : (
            <>
              {getStepContent(activeStep)}
              <div className="flex justify-center space-x-2 mt-2">
                <Button disabled={activeStep === 0} onClick={handleBack}>
                  Back
                </Button>
                <Button variant="contained" onClick={handleNext}>
                  {activeStep === steps.length - 1 ? "Finish" : "Next"}
                </Button>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

// <ResizablePanel>
// <AnimatePresence mode="wait">
//   <motion.div className="flex justify-between items-center w-full flex-col mt-4">
//     {!restoredImage && (
//       <>
//         <div className="space-y-4 w-full max-w-sm">
//           <div className="flex mt-3 items-center space-x-3">
//             <Image
//               src="/number-1-white.svg"
//               width={30}
//               height={30}
//               alt="1 icon"
//             />
//             <p className="text-left font-medium">
//               Upload a picture of your room.
//             </p>
//           </div>
//           {!originalPhoto && <UploadDropZone />}
//           {originalPhoto && !restoredImage && (
//             <Image
//               alt="original photo"
//               src={originalPhoto}
//               className="rounded-2xl h-96"
//               width={475}
//               height={475}
//             />
//           )}
//           {/* <div className="flex mt-3 items-center space-x-3">
//             <Image
//               src="/number-1-white.svg"
//               width={30}
//               height={30}
//               alt="1 icon"
//             />
//             <p className="text-left font-medium">
//               Choose your room theme.
//             </p>
//           </div>
//           <DropDown
//             theme={theme}
//             setTheme={(newTheme) =>
//               setTheme(newTheme as typeof theme)
//             }
//             themes={themes}
//           />
//         </div>
//         <div className="space-y-4 w-full max-w-sm">
//           <div className="flex mt-10 items-center space-x-3">
//             <Image
//               src="/number-2-white.svg"
//               width={30}
//               height={30}
//               alt="1 icon"
//             />
//             <p className="text-left font-medium">
//               Choose your room type.
//             </p>
//           </div>
//           <DropDown
//             theme={room}
//             setTheme={(newRoom) => setRoom(newRoom as typeof room)}
//             themes={rooms}
//           /> */}
//         </div>
//       </>
//     )}

//     {/* {restoredImage && (
//       <div>
//         Here's your remodeled <b>{room.toLowerCase()}</b> in the{" "}
//         <b>{theme.toLowerCase()}</b> theme!{" "}
//       </div>
//     )} */}

//     {/* <div
//       className={`${
//         restoredLoaded ? "visible mt-6 -ml-8" : "invisible"
//       }`}>
//       <Toggle
//         className={`${restoredLoaded ? "visible mb-6" : "invisible"}`}
//         sideBySide={sideBySide}
//         setSideBySide={(newVal) => setSideBySide(newVal)}
//       />
//     </div> */}

//     {/* {restoredLoaded && sideBySide && (
//       <CompareSlider
//         original={originalPhoto!}
//         restored={restoredImage!}
//       />
//     )} */}

//     {/* {restoredImage && originalPhoto && !sideBySide && (
//       <div className="flex sm:space-x-4 sm:flex-row flex-col">
//         <div>
//           <h2 className="mb-1 font-medium text-lg">Original Room</h2>
//           <Image
//             alt="original photo"
//             src={originalPhoto}
//             className="rounded-2xl relative w-full h-96"
//             width={475}
//             height={475}
//           />
//         </div>
//         <div className="sm:mt-0 mt-8">
//           <h2 className="mb-1 font-medium text-lg">Generated Room</h2>
//           <a href={restoredImage} target="_blank" rel="noreferrer">
//             <Image
//               alt="restored photo"
//               src={restoredImage}
//               className="rounded-2xl relative sm:mt-0 mt-2 cursor-zoom-in w-full h-96"
//               width={475}
//               height={475}
//               onLoadingComplete={() => setRestoredLoaded(true)}
//             />
//           </a>
//         </div>
//       </div>
//     )} */}

//     {/* {loading && (
//       <button
//         disabled
//         className="bg-blue-500 rounded-full text-white font-medium px-4 pt-2 pb-3 mt-8 w-40">
//         <span className="pt-4">
//           <LoadingDots color="white" style="large" />
//         </span>
//       </button>
//     )} */}
//     {/* {error && (
//       <div
//         className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mt-8"
//         role="alert">
//         <span className="block sm:inline">{error}</span>
//       </div>
//     )} */}

//     {/* <div className="flex space-x-2 justify-center"> */}
//     {/* {originalPhoto && !loading && (
//         <button
//           onClick={() => {
//             setOriginalPhoto(null);
//             setRestoredImage(null);
//             setRestoredLoaded(false);
//             setError(null);
//           }}
//           className="bg-blue-500 rounded-full text-white font-medium px-4 py-2 mt-8 hover:bg-blue-500/80 transition">
//           Generate New Room
//         </button>
//       )} */}

//     {/* {restoredLoaded && (
//         <button
//           onClick={() => {
//             downloadPhoto(
//               restoredImage!,
//               appendNewToName(photoName!)
//             );
//           }}
//           className="bg-white rounded-full text-black border font-medium px-4 py-2 mt-8 hover:bg-gray-100 transition">
//           Download Generated Room
//         </button>
//       )} */}
//     {/* </div> */}
//   </motion.div>
// </AnimatePresence>
// </ResizablePanel>
