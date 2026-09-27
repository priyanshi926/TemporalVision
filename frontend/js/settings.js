/* =========================================================
   TEMPORALVISION - SETTINGS JAVASCRIPT
   ========================================================= */

// =========================================================
// PARTICLES BACKGROUND
// =========================================================

if (typeof particlesJS !== "undefined") {

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
                value: "#00eaff"
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
                color: "#00eaff",
                opacity: 0.12,
                width: 1
            },

            move: {
                enable: true,
                speed: 1,
                direction: "none",
                random: false,
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
                    distance: 160,
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
}


// =========================================================
// DEFAULT SETTINGS
// =========================================================

const defaultSettings = {

    model: "TemporalVision Hybrid",

    confidence: 0.50,

    nms: 0.45,

    resolution: "416",

    targetFPS: "30",

    temporalAggregation: true,

    recurrentMemory: true,

    temporalWindow: "7",

    gpuAcceleration: true,

    performanceMode: "balanced",

    classes: [
        "person",
        "car",
        "motorcycle",
        "bus",
        "truck",
        "bicycle"
    ]

};


// =========================================================
// GET ELEMENTS
// =========================================================

const confidence = document.getElementById("confidence");
const confidenceValue = document.getElementById("confidenceValue");

const nms = document.getElementById("nms");
const nmsValue = document.getElementById("nmsValue");

const resolution = document.getElementById("resolution");
const targetFPS = document.getElementById("targetFPS");

const temporalAggregation =
    document.getElementById("temporalAggregation");

const recurrentMemory =
    document.getElementById("recurrentMemory");

const temporalWindow =
    document.getElementById("temporalWindow");

const gpuAcceleration =
    document.getElementById("gpuAcceleration");

const performanceMode =
    document.getElementById("performanceMode");

const saveBtn =
    document.getElementById("saveBtn");

const resetBtn =
    document.getElementById("resetBtn");

const toast =
    document.getElementById("toast");

const sidebarModel =
    document.getElementById("sidebarModel");


// =========================================================
// MODEL SELECTION
// =========================================================

const modelOptions =
    document.querySelectorAll(".model-option");


modelOptions.forEach(function(option) {

    option.addEventListener("click", function() {

        // Remove selected class
        modelOptions.forEach(function(item) {
            item.classList.remove("selected");
        });

        // Select clicked model
        option.classList.add("selected");

        // Update sidebar model
        sidebarModel.textContent =
            option.dataset.model;

    });

});


// =========================================================
// CONFIDENCE SLIDER
// =========================================================

confidence.addEventListener("input", function() {

    let value =
        parseFloat(confidence.value) * 100;

    confidenceValue.textContent =
        Math.round(value) + "%";

});


// =========================================================
// NMS SLIDER
// =========================================================

nms.addEventListener("input", function() {

    let value =
        parseFloat(nms.value) * 100;

    nmsValue.textContent =
        Math.round(value) + "%";

});


// =========================================================
// SHOW TOAST
// =========================================================

function showToast(message) {

    toast.querySelector("span").textContent =
        message;

    toast.classList.add("show");

    setTimeout(function() {

        toast.classList.remove("show");

    }, 2500);

}


// =========================================================
// GET SELECTED MODEL
// =========================================================

function getSelectedModel() {

    const selected =
        document.querySelector(".model-option.selected");

    if (selected) {
        return selected.dataset.model;
    }

    return defaultSettings.model;
}


// =========================================================
// GET SELECTED DETECTION CLASSES
// =========================================================

function getSelectedClasses() {

    const checkboxes =
        document.querySelectorAll(
            ".class-item input[type='checkbox']"
        );

    const selectedClasses = [];

    checkboxes.forEach(function(checkbox) {

        if (checkbox.checked) {

            selectedClasses.push(
                checkbox.value
            );

        }

    });

    return selectedClasses;
}


// =========================================================
// SAVE SETTINGS
// =========================================================

function saveSettings() {

    const settings = {

        model: getSelectedModel(),

        confidence:
            parseFloat(confidence.value),

        nms:
            parseFloat(nms.value),

        resolution:
            resolution.value,

        targetFPS:
            targetFPS.value,

        temporalAggregation:
            temporalAggregation.checked,

        recurrentMemory:
            recurrentMemory.checked,

        temporalWindow:
            temporalWindow.value,

        gpuAcceleration:
            gpuAcceleration.checked,

        performanceMode:
            performanceMode.value,

        classes:
            getSelectedClasses()

    };


    // Save settings in browser
    localStorage.setItem(
        "temporalVisionSettings",
        JSON.stringify(settings)
    );


    // Update sidebar
    sidebarModel.textContent =
        settings.model;


    // Show success message
    showToast(
        "Configuration saved successfully"
    );


    console.log(
        "TemporalVision Settings:",
        settings
    );
}


// =========================================================
// LOAD SETTINGS
// =========================================================

function loadSettings() {

    const savedSettings =
        localStorage.getItem(
            "temporalVisionSettings"
        );


    // If no saved settings exist
    if (!savedSettings) {

        applySettings(defaultSettings);

        return;
    }


    try {

        const settings =
            JSON.parse(savedSettings);

        applySettings(settings);

    }

    catch (error) {

        console.log(
            "Unable to load saved settings."
        );

        applySettings(defaultSettings);
    }

}


// =========================================================
// APPLY SETTINGS TO UI
// =========================================================

function applySettings(settings) {

    // -------------------------
    // MODEL
    // -------------------------

    modelOptions.forEach(function(option) {

        if (
            option.dataset.model ===
            settings.model
        ) {

            option.classList.add("selected");

        } else {

            option.classList.remove("selected");

        }

    });


    sidebarModel.textContent =
        settings.model;


    // -------------------------
    // CONFIDENCE
    // -------------------------

    confidence.value =
        settings.confidence;

    confidenceValue.textContent =
        Math.round(
            settings.confidence * 100
        ) + "%";


    // -------------------------
    // NMS
    // -------------------------

    nms.value =
        settings.nms;

    nmsValue.textContent =
        Math.round(
            settings.nms * 100
        ) + "%";


    // -------------------------
    // RESOLUTION
    // -------------------------

    resolution.value =
        settings.resolution;


    // -------------------------
    // TARGET FPS
    // -------------------------

    targetFPS.value =
        settings.targetFPS;


    // -------------------------
    // TEMPORAL AGGREGATION
    // -------------------------

    temporalAggregation.checked =
        settings.temporalAggregation;


    // -------------------------
    // RECURRENT MEMORY
    // -------------------------

    recurrentMemory.checked =
        settings.recurrentMemory;


    // -------------------------
    // TEMPORAL WINDOW
    // -------------------------

    temporalWindow.value =
        settings.temporalWindow;


    // -------------------------
    // GPU
    // -------------------------

    gpuAcceleration.checked =
        settings.gpuAcceleration;


    // -------------------------
    // PERFORMANCE MODE
    // -------------------------

    performanceMode.value =
        settings.performanceMode;


    // -------------------------
    // DETECTION CLASSES
    // -------------------------

    const checkboxes =
        document.querySelectorAll(
            ".class-item input[type='checkbox']"
        );


    checkboxes.forEach(function(checkbox) {

        checkbox.checked =
            settings.classes.includes(
                checkbox.value
            );

    });

}


// =========================================================
// RESET SETTINGS
// =========================================================

function resetSettings() {

    const confirmReset =
        confirm(
            "Are you sure you want to reset all settings?"
        );


    if (!confirmReset) {
        return;
    }


    // Apply default settings
    applySettings(defaultSettings);


    // Save defaults
    localStorage.setItem(
        "temporalVisionSettings",
        JSON.stringify(defaultSettings)
    );


    showToast(
        "Settings restored to defaults"
    );

}


// =========================================================
// SAVE BUTTON
// =========================================================

saveBtn.addEventListener(
    "click",
    saveSettings
);


// =========================================================
// RESET BUTTON
// =========================================================

resetBtn.addEventListener(
    "click",
    resetSettings
);


// =========================================================
// TEMPORAL WINDOW VISUALIZATION
// =========================================================

temporalWindow.addEventListener(
    "change",
    function() {

        const selectedFrames =
            parseInt(
                temporalWindow.value
            );

        const frames =
            document.querySelectorAll(
                ".memory-frame"
            );


        frames.forEach(function(frame, index) {

            if (index < selectedFrames) {

                frame.classList.add("active");

            } else {

                frame.classList.remove("active");

            }

        });

    }
);


// =========================================================
// TEMPORAL AGGREGATION CONTROL
// =========================================================

temporalAggregation.addEventListener(
    "change",
    function() {

        if (
            temporalAggregation.checked === false
        ) {

            recurrentMemory.checked = false;

            recurrentMemory.disabled = true;

        } else {

            recurrentMemory.disabled = false;

        }

    }
);


// =========================================================
// MODEL-BASED SETTINGS
// =========================================================

modelOptions.forEach(function(option) {

    option.addEventListener(
        "click",
        function() {

            const selectedModel =
                option.dataset.model;


            // YOLOv4 only
            if (
                selectedModel === "YOLOv4"
            ) {

                temporalAggregation.checked =
                    false;

                recurrentMemory.checked =
                    false;

                recurrentMemory.disabled =
                    true;

            }


            // Hybrid model
            else {

                recurrentMemory.disabled =
                    false;

            }

        }
    );

});


// =========================================================
// INITIALIZE
// =========================================================

loadSettings();


// =========================================================
// CONSOLE MESSAGE
// =========================================================

console.log(
    "TemporalVision Settings initialized."
);