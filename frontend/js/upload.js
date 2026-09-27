let selectedVideo = null;


// =========================================
// VIDEO SELECTION
// =========================================

document.addEventListener("DOMContentLoaded", function () {

    const fileInput = document.getElementById("videoInput");

    if (!fileInput) {
        console.error("videoInput not found");
        return;
    }


    fileInput.addEventListener("change", function () {

        const file = this.files[0];

        if (!file) {
            return;
        }


        // Check video

        if (!file.type.startsWith("video/")) {

            alert("Please select a valid video file.");

            return;
        }


        // Store selected video

        selectedVideo = file;

        console.log("Selected video:", file.name);


        // =====================================
        // SHOW FILE NAME
        // =====================================

        const fileName = document.getElementById("fileName");

        if (fileName) {
            fileName.textContent = file.name;
        }


        // =====================================
        // SHOW FILE SIZE
        // =====================================

        const fileSize = document.getElementById("fileSize");

        if (fileSize) {

            const sizeMB =
                (file.size / (1024 * 1024)).toFixed(2);

            fileSize.textContent =
                sizeMB + " MB • Ready for analysis";
        }


        // =====================================
        // SHOW FILE BOX
        // =====================================

        const selectedFileBox =
            document.getElementById("selectedFileBox");

        if (selectedFileBox) {

            selectedFileBox.style.display = "flex";
        }


        // =====================================
        // VIDEO PREVIEW
        // =====================================

        const videoPreview =
            document.getElementById("videoPreview");

        if (videoPreview) {

            videoPreview.src =
                URL.createObjectURL(file);

            videoPreview.style.display = "block";
        }

    });

});


// =========================================
// START AI ANALYSIS
// =========================================

async function startAnalysis() {

    if (!selectedVideo) {

        alert("Please select a video first.");

        return;
    }


    console.log("Uploading:", selectedVideo.name);


    const formData = new FormData();

    formData.append("file", selectedVideo);


    try {

        const response = await fetch(
            "http://127.0.0.1:8000/api/detection/upload",
            {
                method: "POST",
                body: formData
            }
        );


        if (!response.ok) {

            throw new Error(
                "Server returned " + response.status
            );
        }


        const data = await response.json();


        console.log(
            "Backend response:",
            data
        );


        // Save analysis ID

        localStorage.setItem(
            "analysisId",
            data.analysis_id
        );


        localStorage.setItem(
            "videoName",
            selectedVideo.name
        );


        // Go to results page

        window.location.href =
            "results.html?analysis_id=" +
            data.analysis_id;


    } catch (error) {

        console.error(
            "Upload error:",
            error
        );

        alert(
            "Could not connect to the TemporalVision backend."
        );
    }

}


// ===============================
// START AI ANALYSIS
// ===============================

async function startAnalysis() {

    if (!selectedVideo) {
        alert("Please select a video first.");
        return;
    }

    console.log("Uploading video...");

    const formData = new FormData();

    formData.append("file", selectedVideo);

    try {

        const response = await fetch(
            "http://127.0.0.1:8000/api/detection/upload",
            {
                method: "POST",
                body: formData
            }
        );

        if (!response.ok) {
            throw new Error(
                "Upload failed: " + response.status);
        }

        const data = await response.json();

        console.log("Backend response:", data);

        const analysisId = data.analysis_id;
        
        if (!analysisId) {
            throw new Error(
                "Backend did not return an analysis ID."
            );
        }

        // Save ID for results page
        localStorage.setItem(
            "analysisId",
            analysisId
        );

        localStorage.setItem(
            "videoName",
            selectedVideo.name
        );

        // Go to results page
        window.location.href =
            "results.html?analysis_id=" + analysisId;

    } catch (error) {

        console.error(
             "Upload error:",
             error
            );

        alert(
            "Could not connect to the backend. Make sure FastAPI is running."
        );
    }
}