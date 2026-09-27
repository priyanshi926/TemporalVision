/* =========================================
   TEMPORALVISION UI ENHANCEMENTS
========================================= */

(function () {

    "use strict";

    const BACKEND_URL = "http://127.0.0.1:8000";

    const params = new URLSearchParams(
        window.location.search
    );

    const analysisId =
        params.get("analysis_id") ||
        localStorage.getItem("analysisId");

    const video =
        document.getElementById("resultVideo");


    /* =====================================
       TOAST SYSTEM
    ===================================== */

    function createToast(message, type = "success") {

        let container =
            document.querySelector(".tv-toast-container");

        if (!container) {

            container =
                document.createElement("div");

            container.className =
                "tv-toast-container";

            document.body.appendChild(container);
        }

        const toast =
            document.createElement("div");

        toast.className =
            `tv-toast ${type}`;

        toast.innerHTML = `
            <i class="fa-solid ${
                type === "error"
                    ? "fa-circle-exclamation"
                    : "fa-circle-check"
            }"></i>

            <span>${message}</span>
        `;

        container.appendChild(toast);

        setTimeout(() => {

            toast.remove();

        }, 3500);
    }


    /* =====================================
       PLAY / PAUSE
    ===================================== */

    const playPauseBtn =
        document.getElementById("playPauseBtn");

    if (playPauseBtn && video) {

        playPauseBtn.addEventListener(
            "click",
            () => {

                if (video.paused) {

                    video.play();

                    playPauseBtn.innerHTML =
                        '<i class="fa-solid fa-pause"></i> Pause';

                } else {

                    video.pause();

                    playPauseBtn.innerHTML =
                        '<i class="fa-solid fa-play"></i> Play';
                }
            }
        );
    }


    /* =====================================
       RESTART
    ===================================== */

    const restartBtn =
        document.getElementById("restartVideoBtn");

    if (restartBtn && video) {

        restartBtn.addEventListener(
            "click",
            () => {

                video.currentTime = 0;

                video.play();

                createToast(
                    "Video restarted."
                );
            }
        );
    }


    /* =====================================
       FULLSCREEN
    ===================================== */

    const fullscreenBtn =
        document.getElementById("fullscreenBtn");

    if (fullscreenBtn && video) {

        fullscreenBtn.addEventListener(
            "click",
            async () => {

                try {

                    if (video.requestFullscreen) {

                        await video.requestFullscreen();

                    }

                } catch (error) {

                    createToast(
                        "Fullscreen is not available.",
                        "error"
                    );
                }
            }
        );
    }


    /* =====================================
       PICTURE IN PICTURE
    ===================================== */

    const pipBtn =
        document.getElementById("pipBtn");

    if (pipBtn && video) {

        pipBtn.addEventListener(
            "click",
            async () => {

                try {

                    if (
                        document.pictureInPictureEnabled
                    ) {

                        await video.requestPictureInPicture();

                    } else {

                        createToast(
                            "Picture-in-picture is not supported.",
                            "error"
                        );
                    }

                } catch (error) {

                    createToast(
                        "Unable to start picture-in-picture.",
                        "error"
                    );
                }
            }
        );
    }


    /* =====================================
       SCREENSHOT
    ===================================== */

    const screenshotBtn =
        document.getElementById("screenshotBtn");

    if (screenshotBtn && video) {

        screenshotBtn.addEventListener(
            "click",
            () => {

                if (!video.videoWidth) {

                    createToast(
                        "Video is not ready yet.",
                        "error"
                    );

                    return;
                }

                const canvas =
                    document.createElement("canvas");

                canvas.width =
                    video.videoWidth;

                canvas.height =
                    video.videoHeight;

                const ctx =
                    canvas.getContext("2d");

                ctx.drawImage(
                    video,
                    0,
                    0,
                    canvas.width,
                    canvas.height
                );

                const link =
                    document.createElement("a");

                link.download =
                    `TemporalVision_${Date.now()}.png`;

                link.href =
                    canvas.toDataURL("image/png");

                link.click();

                createToast(
                    "Detection screenshot saved."
                );
            }
        );
    }


    /* =====================================
       DOWNLOAD PROCESSED VIDEO
    ===================================== */

    const downloadBtn =
        document.getElementById(
            "downloadVideoBtn"
        );

    if (downloadBtn && analysisId) {

        downloadBtn.addEventListener(
            "click",
            () => {

                const url =
                    `${BACKEND_URL}/results/${analysisId}`;

                const link =
                    document.createElement("a");

                link.href = url;

                link.download =
                    `TemporalVision_${analysisId}.mp4`;

                document.body.appendChild(link);

                link.click();

                link.remove();

                createToast(
                    "Processed video download started."
                );
            }
        );
    }


    /* =====================================
       VIDEO SPEED
    ===================================== */

    const speedSelect =
        document.getElementById("speedSelect");

    if (speedSelect && video) {

        speedSelect.addEventListener(
            "change",
            () => {

                video.playbackRate =
                    Number(speedSelect.value);

                createToast(
                    `Playback speed: ${speedSelect.value}×`
                );
            }
        );
    }


    /* =====================================
       COPY ANALYSIS ID
    ===================================== */

    const copyBtn =
        document.getElementById(
            "copyAnalysisBtn"
        );

    if (copyBtn && analysisId) {

        copyBtn.addEventListener(
            "click",
            async () => {

                try {

                    await navigator.clipboard.writeText(
                        analysisId
                    );

                    createToast(
                        "Analysis ID copied."
                    );

                } catch {

                    createToast(
                        "Could not copy Analysis ID.",
                        "error"
                    );
                }
            }
        );
    }


    /* =====================================
       EXPORT JSON
    ===================================== */

    const exportBtn =
        document.getElementById(
            "exportJsonBtn"
        );

    if (exportBtn) {

        exportBtn.addEventListener(
            "click",
            async () => {

                try {

                    const response =
                        await fetch(
                            `${BACKEND_URL}/detect/${analysisId}`
                        );

                    const data =
                        await response.json();

                    const blob =
                        new Blob(
                            [
                                JSON.stringify(
                                    data,
                                    null,
                                    4
                                )
                            ],
                            {
                                type:
                                    "application/json"
                            }
                        );

                    const url =
                        URL.createObjectURL(blob);

                    const link =
                        document.createElement("a");

                    link.href = url;

                    link.download =
                        `TemporalVision_${analysisId}.json`;

                    link.click();

                    URL.revokeObjectURL(url);

                    createToast(
                        "Analysis JSON exported."
                    );

                } catch (error) {

                    createToast(
                        "Could not export analysis.",
                        "error"
                    );
                }
            }
        );
    }


    /* =====================================
       PRINT REPORT
    ===================================== */

    const printBtn =
        document.getElementById(
            "printReportBtn"
        );

    if (printBtn) {

        printBtn.addEventListener(
            "click",
            () => {

                window.print();

            }
        );
    }


    /* =====================================
       SEARCH DETECTION CARDS
    ===================================== */

    const search =
        document.getElementById(
            "detectionSearch"
        );

    if (search) {

        search.addEventListener(
            "input",
            () => {

                const query =
                    search.value
                        .toLowerCase()
                        .trim();

                const cards =
                    document.querySelectorAll(
                        ".detection-card, .summary-card, .object-card"
                    );

                cards.forEach(card => {

                    const text =
                        card.textContent
                            .toLowerCase();

                    card.style.display =
                        text.includes(query)
                            ? ""
                            : "none";
                });
            }
        );
    }


    /* =====================================
       KEYBOARD SHORTCUTS
    ===================================== */

    document.addEventListener(
        "keydown",
        (event) => {

            if (!video) return;

            if (
                event.target.tagName ===
                "INPUT"
            ) {
                return;
            }

            switch (event.key) {

                case " ":

                    event.preventDefault();

                    if (video.paused) {

                        video.play();

                    } else {

                        video.pause();
                    }

                    break;


                case "ArrowRight":

                    video.currentTime += 5;

                    break;


                case "ArrowLeft":

                    video.currentTime -= 5;

                    break;


                case "f":

                    if (
                        video.requestFullscreen
                    ) {

                        video.requestFullscreen();
                    }

                    break;


                case "m":

                    video.muted =
                        !video.muted;

                    break;
            }
        }
    );


    /* =====================================
       VIDEO TIME DISPLAY
    ===================================== */

    const timeDisplay =
        document.createElement("div");

    timeDisplay.style.cssText = `
        margin-top: 8px;
        font-size: 12px;
        color: #8295ad;
    `;

    if (video) {

        video.parentElement
            .appendChild(timeDisplay);

        video.addEventListener(
            "timeupdate",
            () => {

                const current =
                    formatTime(
                        video.currentTime
                    );

                const duration =
                    formatTime(
                        video.duration || 0
                    );

                timeDisplay.textContent =
                    `Current position: ${current} / ${duration}`;
            }
        );
    }


    function formatTime(seconds) {

        if (!Number.isFinite(seconds)) {

            return "00:00";
        }

        const minutes =
            Math.floor(seconds / 60);

        const secs =
            Math.floor(seconds % 60);

        return `${String(minutes).padStart(2,"0")}:${String(secs).padStart(2,"0")}`;
    }


    /* =====================================
       SAVE LAST ANALYSIS
    ===================================== */

    if (analysisId) {

        localStorage.setItem(
            "lastAnalysisId",
            analysisId
        );

        localStorage.setItem(
            "lastAnalysisTime",
            new Date().toISOString()
        );
    }


    /* =====================================
       ONLINE BACKEND STATUS
    ===================================== */

    async function checkBackend() {

        try {

            const response =
                await fetch(
                    `${BACKEND_URL}/`
                );

            if (response.ok) {

                console.log(
                    "TemporalVision backend connected."
                );
            }

        } catch {

            console.warn(
                "TemporalVision backend unavailable."
            );
        }
    }

    checkBackend();
    /* =====================================
   REAL BACKEND STATISTICS
===================================== */

async function loadEnhancedStatistics() {

    if (!analysisId) return;

    try {

        const response =
            await fetch(
                `${BACKEND_URL}/detect/${analysisId}`
            );

        if (!response.ok) return;

        const data =
            await response.json();

        const result =
            data.result || data;


        const frames =
            document.getElementById(
                "enhancedFrames"
            );

        const fps =
            document.getElementById(
                "enhancedFPS"
            );

        const confidence =
            document.getElementById(
                "enhancedConfidence"
            );


        if (
            frames &&
            result.frames !== undefined
        ) {

            frames.textContent =
                Number(
                    result.frames
                ).toLocaleString();
        }


        if (
            fps &&
            result.fps !== undefined
        ) {

            fps.textContent =
                Number(
                    result.fps
                ).toFixed(2);
        }


        if (
            confidence &&
            result.average_confidence !== undefined
        ) {

            confidence.textContent =
                Number(
                    result.average_confidence
                ).toFixed(2) + "%";
        }

    } catch (error) {

        console.error(
            "Could not load statistics:",
            error
        );
    }
}


loadEnhancedStatistics();


    /* =====================================
       PAGE READY
    ===================================== */

    window.addEventListener(
        "load",
        () => {

            setTimeout(
                () => {

                    createToast(
                        "TemporalVision analysis interface ready."
                    );

                },
                700
            );
        }
    );

})();