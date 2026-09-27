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


/* ================= SEARCH + FILTER ================= */

function filterHistory() {

    const search =
        document
            .getElementById("searchInput")
            .value
            .toLowerCase();

    const model =
        document
            .getElementById("modelFilter")
            .value;

    const status =
        document
            .getElementById("statusFilter")
            .value;


    const rows =
        document.querySelectorAll(
            "#historyTable tbody tr"
        );


    rows.forEach(row => {

        const text =
            row.textContent.toLowerCase();

        const rowModel =
            row.dataset.model;

        const rowStatus =
            row.dataset.status;


        const matchesSearch =
            text.includes(search);

        const matchesModel =
            model === "all" ||
            rowModel === model;

        const matchesStatus =
            status === "all" ||
            rowStatus === status;


        if (
            matchesSearch &&
            matchesModel &&
            matchesStatus
        ) {

            row.style.display = "";

        } else {

            row.style.display = "none";

        }

    });

}


/* ================= CLEAR FILTERS ================= */

function clearFilters() {

    document.getElementById("searchInput").value = "";

    document.getElementById("modelFilter").value = "all";

    document.getElementById("statusFilter").value = "all";

    filterHistory();

}


/* ================= VIEW RESULT ================= */

function viewResult(id) {

    localStorage.setItem(
        "selectedAnalysis",
        id
    );

    window.location.href =
        "results.html";

}


/* ================= PAGINATION ================= */

document
    .querySelectorAll(".page-btn")
    .forEach(button => {

        button.addEventListener(
            "click",
            function () {

                document
                    .querySelectorAll(".page-btn")
                    .forEach(btn => {

                        btn.classList.remove(
                            "active"
                        );

                    });

                this.classList.add("active");

            }
        );

    });


/* ================= LOAD ================= */

window.addEventListener("load", () => {

    console.log(
        "TemporalVision History Loaded"
    );

});