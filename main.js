const { BakongKHQR } = require("bakong-khqr");
const jsQR = require("jsqr");

const wrapper = document.querySelector(".wrapper"),
    form = document.querySelector("form"),
    fileInp = form.querySelector("input"),
    infoText = form.querySelector("p"),
    details = document.querySelector('.details'),
    qrText = document.querySelector(".qr-result"),
    khqrText = document.querySelector(".khqr"),
    closeBtn = document.querySelector(".close"),
    khqrCopyBtn = document.querySelector(".khqr-copy"),
    qrCopyBtn = document.querySelector(".qr-result-copy");

function decodeQRcode(file) {
    infoText.innerText = "Scanning QR Code...";
    if (file) {
        // Convert the image file to a string
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = (event) => {
            const image = new Image();
            image.src = event.target.result;
            image.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = image.width;
                canvas.height = image.height;
                ctx.drawImage(image, 0, 0, image.width, image.height);
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const code = jsQR(imageData.data, imageData.width, imageData.height);
                if (code) {
                    const result = code.data;
                    infoText.innerText = result ? "Upload QR Code to Scan" : "Couldn't scan QR Code";

                    qrText.value = result;
                    khqrText.value = JSON.stringify(BakongKHQR.decode(result).data, undefined, 4);
                    details.hidden = false;
                    form.querySelector("img").src = URL.createObjectURL(file);
                    wrapper.classList.add("active");
                } else {
                    // TODO handle error
                    infoText.innerText = "Couldn't scan QR Code";
                }
            };
        };
    }

}

fileInp.addEventListener("change", async e => {
    let file = e.target.files[0];
    if (!file) return;
    decodeQRcode(file);
});

qrCopyBtn.addEventListener("click", () => {
    let text = qrText.value;
    navigator.clipboard.writeText(text);
});

khqrCopyBtn.addEventListener("click", () => {
    let text = khqrText.value;
    navigator.clipboard.writeText(text);
});

form.addEventListener("click", () => fileInp.click());
closeBtn.addEventListener("click", () => {
    wrapper.classList.remove("active");
    fileInp.value = '';
    qrText.value = '';
    khqrText.value = '';
    details.hidden = true;
});

