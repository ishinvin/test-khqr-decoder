const { BakongKHQR } = require("bakong-khqr");
const QrCode = require('qrcode-reader');

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

        // FileReader will emit the load event when the data URL is ready
        // Access the string using result property inside the callback function
        reader.addEventListener('load', () => {
            // Get the data URL string
            var qr = new QrCode();
            qr.callback = function (err, value) {
                if (err) {
                    console.error(err);
                    // TODO handle error
                    infoText.innerText = "Couldn't scan QR Code";
                }

                if (!(value && value.result)) return;
                result = value.result;
                infoText.innerText = result ? "Upload QR Code to Scan" : "Couldn't scan QR Code";

                qrText.value = result;
                khqrText.value = JSON.stringify(BakongKHQR.decode(result).data, undefined, 4);
                details.hidden = false;
                form.querySelector("img").src = URL.createObjectURL(file);
                wrapper.classList.add("active");
            };
            qr.decode(reader.result);
        });
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

