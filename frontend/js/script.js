/* =========================================
   PARTICLES BACKGROUND
========================================= */

particlesJS("particles-js", {

    particles: {

        number: {
            value: 70,
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
            value: 0.35,
            random: true
        },

        size: {
            value: 2,
            random: true
        },

        line_linked: {

            enable: true,

            distance: 140,

            color: "#00e5ff",

            opacity: 0.12,

            width: 1

        },

        move: {

            enable: true,

            speed: 1,

            direction: "none",

            random: true,

            straight: false,

            out_mode: "out",

            bounce: false

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

                    opacity: 0.4

                }

            },


            push: {

                particles_nb: 4

            }

        }

    },


    retina_detect: true

});



/* =========================================
   START DETECTION
========================================= */

function startDetection() {

    alert(
        "Detection system will be connected to the AI backend here."
    );

}



/* =========================================
   DASHBOARD
========================================= */

function openDashboard() {

    window.location.href = "dashboard.html";

}