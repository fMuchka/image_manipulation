let scale = 1;
let altPressed = false;
let img;
let ctx;
let canvas;

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
    };

    img.src = "../assets/test.png";
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
        
        const delta = e.wheelDelta / 120;
        let factor = 0.8;
        
        if (delta < 0) {
            factor = 1/factor;
        }
        
        const currentMouse = {
            x: e.clientX - canvas._offset.left,
            y: e.clientY - canvas._offset.top
        };
        
        // Zoom into the image.
        img.scaleX = img.scaleX * factor;
        img.scaleY = img.scaleY * factor;

        // Calculate displacement of zooming position.
        let dx = (currentMouse.x - img.left) * (factor - 1),
            dy = (currentMouse.y - img.top) * (factor - 1);
        // Compensate for displacement.
        img.left = img.left - dx;
        img.top = img.top - dy;
        
        canvas.renderAll();
    }
}

function toggleDrawingMode() {
    canvas.isDrawingMode = !canvas.isDrawingMode;

    console.log(canvas.isDrawingMode);
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