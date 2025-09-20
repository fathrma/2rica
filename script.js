let srcImg = null;

function onOpenCvReady() {
  const processBtn = document.getElementById("process");
  const loader = document.getElementById("loader");
  const downloadBtn = document.getElementById("download");

  processBtn.onclick = () => {
    if (!srcImg) {
      alert("Upload gambar dulu!");
      return;
    }

    // Fade out button → show loader
    processBtn.classList.add("hidden");
    setTimeout(() => {
      loader.classList.remove("hidden");
    }, 500);

    let scale = parseFloat(document.getElementById("scale").value) || 2;
    let method = parseInt(document.getElementById("method").value);

    let src = cv.imread(srcImg);
    let dst = new cv.Mat();

    let newWidth = Math.round(src.cols * scale);
    let newHeight = Math.round(src.rows * scale);

    setTimeout(() => {  // Simulasi proses berat
      cv.resize(src, dst, new cv.Size(newWidth, newHeight), 0, 0, method);

      // Buat canvas sementara hanya untuk export hasil
      let tempCanvas = document.createElement("canvas");
      cv.imshow(tempCanvas, dst);

      src.delete();
      dst.delete();

      // Convert ke DataURL
      const dataUrl = tempCanvas.toDataURL("image/png");

      // Update tombol download
      downloadBtn.href = dataUrl;

      // Transition: hide loader → show download
      loader.classList.add("hidden");
      setTimeout(() => {
        downloadBtn.classList.remove("hidden");
      }, 500);
    }, 500); // kasih delay biar efek loading keliatan
  };

  document.getElementById("upload").onchange = e => {
    let file = e.target.files[0];
    if (file) {
      srcImg = new Image();
      srcImg.onload = () => console.log("Gambar siap diproses");
      srcImg.src = URL.createObjectURL(file);
    }
  };
}
