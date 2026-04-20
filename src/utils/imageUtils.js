export const compressAndConvertToWebp = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;

      img.onload = () => {
        const canvas = document.createElement("canvas");

        // Scaling & Cropping Logic (1:1 Ratio)
        const MAX_SIZE = 500;
        canvas.width = MAX_SIZE;
        canvas.height = MAX_SIZE;

        const ctx = canvas.getContext("2d");

        // Calculate Crop (Center Crop)
        let sourceX = 0;
        let sourceY = 0;
        let sourceWidth = img.width;
        let sourceHeight = img.height;

        if (img.width > img.height) {
          // Landscape: Crop width to match height
          sourceWidth = img.height;
          sourceX = (img.width - img.height) / 2;
        } else {
          // Portrait: Crop height to match width
          sourceHeight = img.width;
          sourceY = (img.height - img.width) / 2;
        }

        // Draw cropped image onto 500x500 canvas
        ctx.drawImage(
          img,
          sourceX,
          sourceY,
          sourceWidth,
          sourceHeight, // Source Crop
          0,
          0,
          MAX_SIZE,
          MAX_SIZE // Destination (500x500)
        );

        // WEBP Formatting and 75% Ratio
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const newFile = new File([blob], "profile_avatar.webp", {
                type: "image/webp",
                lastModified: Date.now(),
              });
              resolve(newFile);
            } else {
              reject(new Error("Görsel sıkıştırma başarısız oldu."));
            }
          },
          "image/webp",
          0.75
        );
      };

      img.onerror = (error) => reject(error);
    };

    reader.onerror = (error) => reject(error);
  });
};
