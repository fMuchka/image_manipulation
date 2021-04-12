let scale = 1;
let altPressed = false;
let img;
let ctx;
let canvas;
let isAllSelected = false;

function defaultIMG() {
    const container = document.getElementById("img-container");
    const message = document.getElementById("message");
    if (message) {
        message.remove();
    }
    
    img = new Image();

    img.onload = function () {
        img = new fabric.Image(img, {
            centeredRotation: true,
            centeredScaling: true,
            top: 0,
            left: 0
        });

        defaultScaleIMG( { canvas, img } );
            
        canvas._objects = [];
        canvas.add(img);

        addListenersToIMG(img);
    };

    img.src = "../assets/test.png";
}

function addListenersToIMG(img) {
    img.on("selected", (options) => {
        if (!isAllSelected) {
            canvas.discardActiveObject();
            let sel = new fabric.ActiveSelection(canvas.getObjects(), {
                    canvas: canvas,
                });
            isAllSelected = true;
            canvas.setActiveObject(sel);
            canvas.requestRenderAll();   
        }
    });

    img.on("deselected", (options) => {
        isAllSelected = false;
    })
}

function updateImage() {
    const container = document.getElementById("img-container");
    const message = document.getElementById("message");
    if (message) {
        message.remove();
    }
    const file = event.target.files[0];
    let reader = new FileReader();

    reader.onload = (e) => {
        let dataURL = e.target.result;
        img = new Image();

        img.onload = function () {
            img = new fabric.Image(img, {
                centeredRotation: true,
                centeredScaling: true,
                top: 0,
                left: 0
            });

            defaultScaleIMG({ canvas, img });
            
            canvas._objects = [];
            canvas.add(img)
        }

        img.src = dataURL;
    }

    reader.readAsDataURL(file);
}

function defaultScaleIMG({ canvas, img }) {
    const biggestDim = Math.round(img.width, img.height);
    const ratio = canvas.width / biggestDim;
    img.scale(ratio);
}

function zoom(e) {
    if (altPressed) {
        e.preventDefault();
        const cObjects = canvas._objects;
        const delta = e.wheelDelta / 120;
        let factor = 0.8;
        
        if (delta < 0) {
            factor = 1/factor;
        }
        
        const currentMouse = {
            x: e.clientX - canvas._offset.left,
            y: e.clientY - canvas._offset.top
        };
        
        for (let i = 0; i < cObjects.length; i++) {
            const obj = cObjects[i];
            // Zoom into the image.
            obj.scaleX = obj.scaleX * factor;
            obj.scaleY = obj.scaleY * factor;

            // Calculate displacement of zooming position.
            let dx = (currentMouse.x - obj.left) * (factor - 1),
                dy = (currentMouse.y - obj.top) * (factor - 1);
            // Compensate for displacement.
            obj.left = obj.left - dx;
            obj.top = obj.top - dy;
        }

        canvas.renderAll();
    }
}

function toggleDrawingMode() {
    canvas.isDrawingMode = !canvas.isDrawingMode;

    const button = event.target;
    const isActive = canvas.isDrawingMode;

    button.innerText = isActive ? "Disable Draw Mode" : "Activate Draw Mode";
    button.classList.toggle("active")
}

function listDrawnPaths() {
    const list = document.getElementById("drawn-paths-list");
    list.classList.toggle("show");

    const isShown = list.classList.contains("show");
    const cObjects = canvas._objects;

    list.innerHTML = "";
    let objToWrite = [];

    for (let i = 0; i < cObjects.length; i++) {
        const obj = cObjects[i];
        
        if (obj.constructor.prototype.type === "path") {
            let pathPoints = obj.path;

            objToWrite[objToWrite.length] = {
                id: `Path_${objToWrite.length}`,
                points: []
            };

            for (let j = 0; j < pathPoints.length; j++) {
                const point = pathPoints[j];
                objToWrite[objToWrite.length - 1].points.push(point.toString());
            }
        }
    }

    objToWrite.forEach((e) => {
        let column = document.createElement("DIV");
        column.innerHTML = `<div class="list-title">${e.id}</div>`;
        
        e.points.forEach((p) => {
            column.innerHTML += `<div>${p}</div>`;
        });

        list.appendChild(column);
    });

    event.target.innerText = isShown ? "Hide Drawn Paths" : "List Drawn Paths";
}


window.onload = () => {
    canvas = new fabric.Canvas(document.querySelector("canvas"));
    const canvasWrapper = document.getElementById("img-container");
    
    canvasWrapper.onwheel = zoom;
    
    window.addEventListener("keydown", (keyEvent) => {
        if (keyEvent.key === "Alt") {
            altPressed = true;
       } 
    });

    document.addEventListener("keyup", (keyEvent) => {
        if (keyEvent.key === "Alt") {
            altPressed = false;
       } 
    })
}