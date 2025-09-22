const uploadInput = document.getElementById("upload");
const scaleInput = document.getElementById("scale");
const methodSelect = document.getElementById("method");
const actionBtn = document.getElementById("actionBtn");
const fileName = document.getElementById("fileName");


let currentImage = null;
let upscaledBlob = null;

// Setelah animasi selesai, hapus elemen splash
window.addEventListener('load', () => {
  const splash = document.querySelector('.splash');

 

  // Hapus splash setelah 3 detik
  setTimeout(() => {
    splash.remove();
    
  }, 3000);
});


 //Reset tombol saat upload gambar baru
uploadInput.addEventListener("change", () => {
 if (uploadInput.files.length > 0) {
   currentImage = uploadInput.files[0];
 actionBtn.textContent = "Upload";
    actionBtn.className = "";
  upscaledBlob = null;
  }
});

uploadInput.addEventListener("change", () => {
  if (uploadInput.files.length > 0) {
    fileName.textContent = uploadInput.files[0].name;
  } else {
    fileName.textContent = "Belum dipilih";
  }
});

actionBtn.addEventListener("click", async () => {
  if (!currentImage) {
    alert("Gambarnya belum kamu upload nih!");
    return;
  }

  
  // Mulai proses upscale
  actionBtn.textContent = "Loading...";
  actionBtn.className = "loading";

  const scale = parseFloat(scaleInput.value);
  const method = methodSelect.value;

  const img = new Image();
  img.onload = () => {
    const src = cv.imread(img);
    const dst = new cv.Mat();

    let dsize = new cv.Size(src.cols * scale, src.rows * scale);
    let interpolation;

    switch (method) {
      case "nearest": interpolation = cv.INTER_NEAREST; break;
      case "bilinear": interpolation = cv.INTER_LINEAR; break;
      case "bicubic": interpolation = cv.INTER_CUBIC; break;
      case "lanczos": interpolation = cv.INTER_LANCZOS4; break;
      default: interpolation = cv.INTER_LINEAR;
    }

    cv.resize(src, dst, dsize, 0, 0, interpolation);

    // Konversi hasil ke blob untuk download
    cv.imshow("hiddenCanvas", dst); // hidden canvas untuk export
    const hiddenCanvas = document.getElementById("hiddenCanvas");
    hiddenCanvas.toBlob((blob) => {
      upscaledBlob = blob;

      actionBtn.textContent = "Download";
      actionBtn.className = "download";
    });

    src.delete();
    dst.delete();
  };
  img.src = URL.createObjectURL(currentImage);



 // Jika sudah ada hasil, maka tombol jadi Download
 if (upscaledBlob) {
  const url = URL.createObjectURL(upscaledBlob);
  const a = document.createElement("a");
  
    let originalName = currentImage.name;
    let dotIndex = originalName.lastIndexOf(".");
    let baseName = originalName.substring(0, dotIndex);
  let extension = originalName.substring(dotIndex);
  
    // ambil waktu sekarang
   let now = new Date();
   let year = now.getFullYear();
    let month = String(now.getMonth() + 1).padStart(2, "0");
    let day = String(now.getDate()).padStart(2, "0");
   let hour = String(now.getHours()).padStart(2, "0");
    let minute = String(now.getMinutes()).padStart(2, "0");
 let second = String(now.getSeconds()).padStart(2, "0");
  
   let timestamp = `${year}${month}${day}_${hour}${minute}${second}`;
  
    // nama file hasil
   a.download = `${baseName}-besarkanfoto-${timestamp}${extension}`;
  
    a.href = url;
    a.click();
    URL.revokeObjectURL(url);
   return;
  } 
  
  

});
