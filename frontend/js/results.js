// =========================================
// TEMPORALVISION RESULTS
// =========================================

const BACKEND_URL = "http://127.0.0.1:8000";

// Get analysis ID from URL
const params = new URLSearchParams(
    window.location.search
);

const analysisId =
    params.get("analysis_id") ||
    localStorage.getItem("analysisId");


// =========================================
// START
// =========================================

if (!analysisId) {

    console.error("No analysis ID found.");

    updateStatus("No analysis found.");

} else {

    console.log(
        "Analysis ID:",
        analysisId
    );

    updateAnalysisId();

    checkAnalysis();
}


// =========================================
// UPDATE ANALYSIS ID
// =========================================

function updateAnalysisId() {

    const idElement =
        document.querySelector(".analysis-id");

    if (idElement) {

        idElement.textContent =
            "ANALYSIS ID: " + analysisId;

    }

}


// =========================================
// CHECK ANALYSIS STATUS
// =========================================

async function checkAnalysis() {

    try {

        console.log(
            "Checking analysis status..."
        );

        const response = await fetch(
            `${BACKEND_URL}/api/detection/status/${analysisId}`
        );


        if (!response.ok) {

            throw new Error(
                "Status request failed: " +
                response.status
            );

        }


        const data =
            await response.json();


        console.log(
            "Backend status:",
            data
        );


        // =====================================
        // PROCESSING
        // =====================================

        if (
            data.status === "queued" ||
            data.status === "processing"
        ) {

            updateStatus(
                "AI is processing your video..."
            );

            setTimeout(
                checkAnalysis,
                2000
            );

            return;

        }


        // =====================================
        // COMPLETED
        // =====================================

        if (data.status === "completed") {

            console.log(
                "Analysis completed:",
                data
            );

            updateStatus(
                "Analysis completed successfully"
            );

            showResults(data);

            return;

        }


        // =====================================
        // FAILED
        // =====================================

        if (data.status === "failed") {

            updateStatus(
                "Analysis failed"
            );

            console.error(
                "Detection error:",
                data.error
            );

            return;

        }


    } catch (error) {

        console.error(
            "Backend connection error:",
            error
        );

        updateStatus(
            "Connecting to AI backend..."
        );

        setTimeout(
            checkAnalysis,
            3000
        );

    }

}


// =========================================
// UPDATE STATUS
// =========================================

function updateStatus(message) {

    console.log(
        "Status:",
        message
    );


    const statusElements =
        document.querySelectorAll(
            ".action-bar p"
        );


    if (statusElements.length > 0) {

        statusElements[0].textContent =
            message;

    }

}


// =========================================
// SHOW RESULTS
// =========================================

function showResults(data) {

    console.log(
        "FINAL RESULT:",
        data
    );


    /*
     * Backend may return the actual
     * result inside "result".
     */

    const result =
        data.result || data;


    console.log(
        "Result object:",
        result
    );


    // =====================================
    // PROCESSING STATUS
    // =====================================

    const processingStatus =
        document.getElementById(
            "processingStatus"
        );


    if (processingStatus) {

        processingStatus.textContent =
            "Complete";

    }


    // =====================================
    // VIDEO
    // =====================================

    const video =
        document.getElementById(
            "resultVideo"
        );


    if (video) {

        let videoUrl =
            result.video_url ||
            result.video ||
            data.video_url;


        /*
         * If backend gives a relative path,
         * attach backend URL.
         */

        if (
            videoUrl &&
            videoUrl.startsWith("/")
        ) {

            videoUrl =
                BACKEND_URL +
                videoUrl;

        }


        /*
         * If backend doesn't provide a URL,
         * use the existing result endpoint.
         */

        if (!videoUrl) {

            videoUrl =
                `${BACKEND_URL}/results/${analysisId}`;

        }


        console.log(
            "Result video URL:",
            videoUrl
        );


        video.src =
            videoUrl;

        video.load();

    }


    // =====================================
    // FRAME COUNT
    // =====================================

    const frameCount =
        document.getElementById(
            "frameCount"
        );


    if (
        frameCount &&
        result.frames !== undefined
    ) {

        frameCount.textContent =
            Number(
                result.frames
            ).toLocaleString() +
            " Frames";

    }


    // =====================================
    // ENHANCED FRAME CARD
    // =====================================

    const enhancedFrames =
        document.getElementById(
            "enhancedFrames"
        );


    if (
        enhancedFrames &&
        result.frames !== undefined
    ) {

        enhancedFrames.textContent =
            Number(
                result.frames
            ).toLocaleString();

    }


    // =====================================
    // FPS
    // =====================================

    const fpsValue =
        document.getElementById(
            "fpsValue"
        );


    if (
        fpsValue &&
        result.fps !== undefined
    ) {

        fpsValue.textContent =
            Number(
                result.fps
            ).toFixed(1) +
            " FPS";

    }


    // =====================================
    // ENHANCED FPS CARD
    // =====================================

    const enhancedFPS =
        document.getElementById(
            "enhancedFPS"
        );


    if (
        enhancedFPS &&
        result.fps !== undefined
    ) {

        enhancedFPS.textContent =
            Number(
                result.fps
            ).toFixed(2) +
            " FPS";

    }


    // =====================================
    // AVERAGE CONFIDENCE
    // =====================================

    const enhancedConfidence =
        document.getElementById(
            "enhancedConfidence"
        );


    if (
        enhancedConfidence &&
        result.average_confidence !== undefined
    ) {

        enhancedConfidence.textContent =
            Number(
                result.average_confidence
            ).toFixed(2) +
            "%";

    }


    // =====================================
    // VIDEO DURATION
    // =====================================

    if (
        result.duration !== undefined
    ) {

        console.log(
            "Video duration:",
            result.duration
        );

    }


    // =====================================
    // TOTAL OBJECTS
    // =====================================

    console.log(
        "Total objects detected:",
        result.total_objects
    );


    // =====================================
    // AVERAGE CONFIDENCE
    // =====================================

    console.log(
        "Average confidence:",
        result.average_confidence
    );

}


// =========================================
// VIDEO METADATA
// =========================================

const resultVideo =
    document.getElementById(
        "resultVideo"
    );


if (resultVideo) {

    resultVideo.addEventListener(
        "loadedmetadata",
        () => {

            const duration =
                resultVideo.duration;


            if (
                !isNaN(duration)
            ) {

                const minutes =
                    Math.floor(
                        duration / 60
                    );


                const seconds =
                    Math.floor(
                        duration % 60
                    );


                const formatted =
                    String(minutes)
                        .padStart(2, "0") +
                    ":" +
                    String(seconds)
                        .padStart(2, "0");


                const durationElement =
                    document.getElementById(
                        "durationValue"
                    );


                if (durationElement) {

                    durationElement.textContent =
                        formatted +
                        " Duration";

                }


                console.log(
                    "Video duration:",
                    formatted
                );

            }

        }
    );

}