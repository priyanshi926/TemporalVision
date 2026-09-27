
/* =========================================
   PARTICLE BACKGROUND
========================================= */

particlesJS("particles-js", {

    particles: {

        number: {
            value: 55,
            density: {
                enable: true,
                value_area: 900
            }
        },

        color: {
            value: "#00e5ff"
        },

        shape: {
            type: "circle"
        },

        opacity: {
            value: 0.3,
            random: true
        },

        size: {
            value: 2,
            random: true
        },

        line_linked: {

            enable: true,

            distance: 150,

            color: "#00e5ff",

            opacity: 0.1,

            width: 1

        },

        move: {

            enable: true,

            speed: 0.8,

            direction: "none",

            random: true,

            straight: false,

            out_mode: "out"

        }

    },

    interactivity: {

        detect_on: "canvas",

        events: {

            onhover: {
                enable: true,
                mode: "grab"
            },

            onclick: {
                enable: true,
                mode: "push"
            },

            resize: true

        },

        modes: {

            grab: {
                distance: 180,
                line_linked: {
                    opacity: 0.35
                }
            },

            push: {
                particles_nb: 3
            }

        }

    },

    retina_detect: true

});



/* =========================================
   LIVE VALUES
========================================= */

let running = true;

let frame = 1248;

let fps = 30.4;



setInterval(() => {

    if (!running) {
        return;
    }


    /*
        Simulated values for now.

        Later these values will come
        directly from your Python backend.
    */

    fps =
        29 +
        Math.random() * 3;


    const confidence =
        91 +
        Math.random() * 6;


    const inference =
        22 +
        Math.random() * 5;


    document.getElementById("fpsValue")
        .textContent = fps.toFixed(1);


    document.getElementById("confidenceValue")
        .textContent =
        confidence.toFixed(1) + "%";


    document.getElementById("inferenceValue")
        .textContent =
        inference.toFixed(1) + "ms";


    frame++;


    document.getElementById("frameNumber")
        .textContent =
        String(frame).padStart(6, "0");


}, 1000);



/* =========================================
   PLAY / PAUSE DETECTION
========================================= */

function toggleDetection() {

    const button =
        document.getElementById("playButton");

    const icon =
        button.querySelector("i");


    running = !running;


    if (running) {

        icon.className =
            "fa-solid fa-pause";

    } else {

        icon.className =
            "fa-solid fa-play";

    }

}



/* =========================================
   FULLSCREEN
========================================= */

function toggleFullscreen() {

    const container =
        document.getElementById("videoContainer");


    if (!document.fullscreenElement) {

        container.requestFullscreen();

    } else {

        document.exitFullscreen();

    }

}



/* =========================================
   SETTINGS
========================================= */

function toggleSettings() {

    alert(
        "Detection settings will be connected here."
    );

}
