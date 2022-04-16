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

  function errorCallback(e) {
    console.log("Error", e);
  }

  const btn = document.getElementById("recordBtn");

  function onRecordClicked(e) {
    if (btn.innerHTML === "Record!") {
      btn.innerHTML="Recording!";
      const accessToken =  'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IlFVUTRNemhDUVVWQk1rTkJNemszUTBNMlFVVTRRekkyUmpWQ056VTJRelUxUTBVeE5EZzFNUSJ9.eyJodHRwczovL3BsYXRmb3JtLnN5bWJsLmFpL3VzZXJJZCI6IjUxMDQwODUzMzMxODA0MTYiLCJpc3MiOiJodHRwczovL2RpcmVjdC1wbGF0Zm9ybS5hdXRoMC5jb20vIiwic3ViIjoiVXJEc1daRHVFdlg5d1E4RDU2dEV4V0xvN0RlTUVYWjRAY2xpZW50cyIsImF1ZCI6Imh0dHBzOi8vcGxhdGZvcm0ucmFtbWVyLmFpIiwiaWF0IjoxNjUwMDk0MTU4LCJleHAiOjE2NTAxODA1NTgsImF6cCI6IlVyRHNXWkR1RXZYOXdROEQ1NnRFeFdMbzdEZU1FWFo0IiwiZ3R5IjoiY2xpZW50LWNyZWRlbnRpYWxzIn0.LCgl7DuCH5BsgkR8EQfTMrpEIJW0s7EFSlwhkvdCl7wP6boJR9YYRABjSa6dhhAwOBNWVSjK3DMqs0PCmiai0_I91gVfcr5dGQL8X15v5P2iJmThmFr6gWWVkQud338VvWtjV7VRnidH_oCcDSQlmZM04iFJMKeFkc0IfSN0VukReBaof5QkZqsxVMWklZUG_ZdBRWPe4G_tudYo2xHic6VT5glHN2a8fymg9DMUiQLYDWoUAlYnrwGyJBO1-aZPCoNWmrCeSfGkNsx8rrJYETKArQQi_gy2mgEaWpkzlXsJ_xEFowje9d_fCdDOxY2-vVuyy7fuHNfgUY3d7slH9Q';
// Refer to the section for how to generate the accessToken: https://docs.symbl.ai/docs/developer-tools/authentication
const uniqueMeetingId = btoa("gamedevcorp2002@gmail.com"); // btoa will take a string and generate a unique ID
const symblEndpoint = `wss://api.symbl.ai/v1/streaming/${uniqueMeetingId}?access_token=${accessToken}`;

const ws = new WebSocket(symblEndpoint);

// Fired when a message is received from the WebSocket server
ws.onmessage = (event) => {
  // You can find the conversationId in event.message.data.conversationId;
  const data = JSON.parse(event.data);
  if (data.type === 'message' && data.message.hasOwnProperty('data')) {
    console.log('conversationId', data.message.data.conversationId);
  }
  if (data.type === 'tracker_response') {
    for (let tracker of data.trackers) {
      if(tracker.name==="list_dir"){
        ipc.send("terminal.keystroke", "ls");
        break;
      }
      else if(tracker.name==="new_folder"){
        for(let match of tracker.matches){
          let str=match.messageRefs[0].text//.messageRefs;
          let folder_name=str.split(" ").pop();
          ipc.send("terminal.keystroke", `mkdir ${folder_name}`);
          break;
        }
        
       break; 
      }
      else if(tracker.name==="move_dir"){
        for(let match of tracker.matches){
          let str=match.messageRefs[0].text//.messageRefs;
          let folder_name=str.split(" ").pop();
          ipc.send("terminal.keystroke", `cd ${folder_name}`);
          break;
        }
        
       break; 
      }
    }
  }
  console.log(`Response type: ${data.type}. Object: `, data);
};

// Fired when the WebSocket closes unexpectedly due to an error or lost connetion
ws.onerror  = (err) => {
  console.error(err);
};

// Fired when the WebSocket connection has been closed
ws.onclose = (event) => {
  console.info('Connection to websocket closed');
};

// Fired when the connection succeeds.
ws.onopen = (event) => {
  ws.send(JSON.stringify({
    type: 'start_request',
    meetingTitle: 'Websockets How-to', // Conversation name
    insightTypes: ['question', 'action_item'], // Will enable insight generation
    trackers: [
      {
        name: "new_folder",
        vocabulary: [
          "make a new folder",
          "make a new directory",
          "create a new folder",
        ]
      },
      {
        name: "list_dir",
        vocabulary: [
          "show all directories",
          "list folders",
        ]
      },{
        name: "move_dir",
        vocabulary: [
          "move into folder",
        ]        
      }

    ],
    config: {
      confidenceThreshold: 0.5,
      languageCode: 'en-US',
      speechRecognition: {
        encoding: 'LINEAR16',
        sampleRateHertz: 44100,
      }
    },
    speaker: {
      userId: 'example@symbl.ai',
      name: 'Example Sample',
    }
  }));
};

const handleSuccess = (stream) => {
   
  const AudioContext = window.AudioContext;
  const context = new AudioContext();
  const source = context.createMediaStreamSource(stream);
  const processor = context.createScriptProcessor(1024, 1, 1);
  const gainNode = context.createGain();
  source.connect(gainNode);
  gainNode.connect(processor);
  processor.connect(context.destination);
  processor.onaudioprocess = (e) => {
    // convert to 16-bit payload
    const inputData = e.inputBuffer.getChannelData(0) || new Float32Array(this.bufferSize);
    const targetBuffer = new Int16Array(inputData.length);
    for (let index = inputData.length; index > 0; index--) {
        targetBuffer[index] = 32767 * Math.min(1, inputData[index]);
    }
    // Send audio stream to websocket.
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(targetBuffer.buffer);
    }
  };
};


stream = navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then(handleSuccess);
    } 
    else {
      btn.innerHTML = "Record!";
      //mediaRecorder.stop();
    }
  }

  btn.onclick = onRecordClicked;
});