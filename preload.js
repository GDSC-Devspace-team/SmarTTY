const ipc = require("electron").ipcRenderer;
const { sdk } = require("@symblai/symbl-js");
const axios = require("axios");

const { Terminal } = require("xterm");
const { FitAddon } = require("xterm-addon-fit");

window.addEventListener("DOMContentLoaded", async () => {
  const appId =
    "386575386f51394269456d6739544c3768526d57536c486d5647594948303748";
  const appSecret =
    "756e4f554a41554b50696e526e464c5864457264396758772d48437954316b716a59327835455170696e3654754341452d524b584b396839666a613144763167";

  const { data: { accessToken } } = await axios.post(
    "https://api.symbl.ai/oauth2/token:generate",
    {
      type: "application",
      appId,
      appSecret,
    }
  );

  console.log(accessToken)

  const term = new Terminal({
    windowOptions: {
      fullscreenWin: true,
    },
    theme: {
      background: "#1b1b1b",
    },
    fontFamily: "JetBrains Mono",
  });
  const fitAddon = new FitAddon();
  term.loadAddon(fitAddon);
  term.open(document.getElementById("terminal"));
  fitAddon.fit();

  ipc.send("terminal.keystroke", "\r");

  ipc.on("terminal.incomingData", (event, data) => {
    term.write(data);
  });

  term.onData((e) => {
    ipc.send("terminal.keystroke", e);
  });

  const chunks = [];
  function errorCallback(e) {
    console.log("Error", e);
  }

  let mediaRecorder;

  const btn = document.getElementById("recordBtn");

  const audioChunks = [];

  function onRecordClicked(e) {
    if (btn.innerHTML === "Record!") {
      btn.innerHTML = "Stop!";
      navigator.mediaDevices
        .getUserMedia({ video: false, audio: true })
        .then((localMediaStream) => {
          mediaRecorder = new MediaRecorder(localMediaStream);
          mediaRecorder.start();

          mediaRecorder.addEventListener("dataavailable", (event) => {
            audioChunks.push(event.data);
          });

          mediaRecorder.addEventListener("stop", () => {
            const audioBlob = new Blob(audioChunks);
            const audioUrl = URL.createObjectURL(audioBlob);

            const { data } = axios.post(
              "https://api.symbl.ai/v1/process/audio"
            );
          });
        });
    } else {
      btn.innerHTML = "Record!";
      mediaRecorder.stop();
    }
  }

  btn.onclick = onRecordClicked;
});
