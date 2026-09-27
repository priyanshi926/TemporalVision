/* ================= PARTICLES ================= */

particlesJS("particles-js", {

    particles: {

        number: {
            value: 65,
            density: {
                enable: true,
                value_area: 900
            }
        },

        color: {
            value: "#00eaff"
        },

        shape: {
            type: "circle"
        },

        opacity: {
            value: 0.35
        },

        size: {
            value: 2
        },

        line_linked: {
            enable: true,
            distance: 140,
            color: "#00eaff",
            opacity: 0.12,
            width: 1
        },

        move: {
            enable: true,
            speed: 1.2
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
            }

        },

        modes: {

            grab: {
                distance: 180,
                line_linked: {
                    opacity: 0.3
                }
            },

            push: {
                particles_nb: 3
            }

        }

    },

    retina_detect: true

});


/* ================= VARIABLES ================= */

let detectionRunning = false;

let frame = 1;

let fps = 28.6;


/* ================= SOURCE ================= */

function selectSource(source, button) {

    document
        .querySelectorAll(".source-btn")
        .forEach(btn => {

            btn.classList.remove("active");

        });

    button.classList.add("active");

    console.log("Selected source:", source);

}


/* ================= START ================= */

function startDetection() {

    detectionRunning = true;

    document.getElementById("startBtn").innerHTML =
        '<i class="fa-solid fa-spinner fa-spin"></i> Detection Running';

    startSimulation();

}


/* ================= STOP ================= */

function stopDetection() {

    detectionRunning = false;

    document.getElementById("startBtn").innerHTML =
        '<i class="fa-solid fa-play"></i> Start Detection';

}


/* ================= SIMULATION ================= */

function startSimulation() {

    if (!detectionRunning) {
        return;
    }

    frame++;

    document.getElementById("frameNumber").textContent =
        String(frame).padStart(6, "0");


    /* FPS variation */

    fps =
        27 +
        Math.random() * 3;

    document.getElementById("fps").textContent =
        fps.toFixed(1);


    /* Latency */

    const latency =
        Math.floor(
            28 + Math.random() * 12
        );

    document.getElementById("latency").textContent =
        latency + "ms";


    /* Object counts */

    const cars =
        Math.floor(
            6 + Math.random() * 5
        );

    const persons =
        Math.floor(
            2 + Math.random() * 4
        );

    const trucks =
        Math.floor(
            1 + Math.random() * 3
        );

    const bikes =
        Math.floor(
            Math.random() * 3
        );


    const total =
        cars +
        persons +
        trucks +
        bikes;


    document.getElementById("cars").textContent =
        cars;

    document.getElementById("persons").textContent =
        persons;

    document.getElementById("trucks").textContent =
        trucks;

    document.getElementById("bikes").textContent =
        bikes;

    document.getElementById("totalObjects").textContent =
        total;


    /* Confidence */

    const confidence =
        88 + Math.random() * 9;

    document.getElementById("confidenceValue").textContent =
        confidence.toFixed(1) + "%";

    document.getElementById("confidenceBar").style.width =
        confidence + "%";


    setTimeout(startSimulation, 1000);

}


/* ================= INITIALIZATION ================= */

window.addEventListener("load", () => {

    console.log(
        "TemporalVision Live Detection Loaded"
    );

});S