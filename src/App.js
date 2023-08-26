import React, { useState, useEffect, useRef } from "react";
import * as speechsdk from "microsoft-cognitiveservices-speech-sdk";


import "./App.css";


const App = () => {
  const [displayText, setDisplayText] = useState("Pulsa una vez para hablar.");
  //const chatInputRef = useRef(null);
  //const outputTextRef = useRef(null);
  const talkVideoRef = useRef(null);

  const peerConnectionRef = useRef(null);
  const streamIdRef = useRef(null);
  const sessionIdRef = useRef(null);
  const usuario = "joseluis"; // ver usuario, poasar a variable no es constante

  const SPEECH_KEY = '0c029cad0e45489fa76bca71569b0f3e';
  const SPEECH_REGION = 'westeurope';

  let avatar_img_url = 'https://create-images-results.d-id.com/auth0%7C646f6fd64196da85cb62a776/upl_dtCm20p57vc6Gz-kKC8oW/image.jpeg';
  let azure_voice_id= 'es-ES-DarioNeural'
  let avatar = "roig";

  const getTokenOrRefresh = async () => {
    const response = await fetch(`https://${SPEECH_REGION}.api.cognitive.microsoft.com/sts/v1.0/issueToken`, {
      method: "POST",
      headers: {
        "Ocp-Apim-Subscription-Key": SPEECH_KEY,
      },
    });

    const authToken = await response.text();
    return { authToken, region: SPEECH_REGION };
  };

  useEffect(() => {
    const initialize = async () => {
      const tokenRes = await getTokenOrRefresh();
      if (tokenRes.authToken === null) {
        setDisplayText(`FATAL_ERROR: ${tokenRes.error}`);
      }
    };
    initialize();

  }, []);

  const sttFromMic = async () => {
    const tokenObj = await getTokenOrRefresh();
    const speechConfig = speechsdk.SpeechConfig.fromAuthorizationToken(tokenObj.authToken, tokenObj.region);
    speechConfig.speechRecognitionLanguage = "es-ES";
    const audioConfig = speechsdk.AudioConfig.fromDefaultMicrophoneInput();
    const recognizer = new speechsdk.SpeechRecognizer(speechConfig, audioConfig);
    setDisplayText("speak into your microphone...");
    recognizer.recognizeOnceAsync((result) => {
      if (result.reason === speechsdk.ResultReason.RecognizedSpeech) {
        setDisplayText(`RECOGNIZED: Text=${result.text}`);
        //chatInputRef.current.value = result.text; // Actualiza el input del chat con el texto reconocido
        talk(result.text);
      } else {
        setDisplayText("ERROR: Speech was cancelled or could not be recognized. Ensure your microphone is working properly.");
      }
    });
  };

  const DID_API = {
    key: "bGljZW5zaW5nQGNldS5lcw:c_zuNVYnDitDPkm7uCmDZ",
    url: "https://api.d-id.com",
  };



  const onIceGatheringStateChange = () => {
    // Implementar la lógica aquí
  };

  function onIceCandidate(event) {
    if (event.candidate) {
      const { candidate, sdpMid, sdpMLineIndex } = event.candidate;
  
      fetch(`https://api.d-id.com/talks/streams/${streamIdRef.current}/ice`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${DID_API.key}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          candidate,
          sdpMid,
          sdpMLineIndex,
          session_id: sessionIdRef.current,
        }),
      });
    }
  }

  const onIceConnectionStateChange = (event) => {
    if (!peerConnectionRef.current) return;
    console.log(`ICE Connection State Change: ${peerConnectionRef.current.iceConnectionState}`);
    if (["failed", "disconnected", "closed"].includes(peerConnectionRef.current.iceConnectionState)) {
      closePC();
    }
  };

  const onConnectionStateChange = (event) => {
    if (!peerConnectionRef.current) return;
    console.log(`Connection State Change: ${peerConnectionRef.current.connectionState}`);
  };

  const onSignalingStateChange = (event) => {
    if (!peerConnectionRef.current) return;
    console.log(`Signaling State Change: ${peerConnectionRef.current.signalingState}`);
  };

  const onTrack = (event) => {
    if (!peerConnectionRef.current) return;
    if (talkVideoRef.current.srcObject) return;
    talkVideoRef.current.srcObject = event.streams[0];
  };

  const stopAllStreams = () => {
    if (talkVideoRef.current.srcObject) {
      console.log('stopping video streams');
      talkVideoRef.current.srcObject.getTracks().forEach(track => track.stop());
      talkVideoRef.current.srcObject = null;
    }
  };

  const closePC = () => {
    if (!peerConnectionRef.current) return;
    console.log('stopping peer connection');
    peerConnectionRef.current.close();
    peerConnectionRef.current.removeEventListener('icegatheringstatechange', onIceGatheringStateChange);
    peerConnectionRef.current.removeEventListener('icecandidate', onIceCandidate);
    peerConnectionRef.current.removeEventListener('iceconnectionstatechange', onIceConnectionStateChange);
    peerConnectionRef.current.removeEventListener('connectionstatechange', onConnectionStateChange);
    peerConnectionRef.current.removeEventListener('signalingstatechange', onSignalingStateChange);
    peerConnectionRef.current.removeEventListener('track', onTrack);
  };

  const createPeerConnection = async (offer, iceServers) => {
   
    if (!peerConnectionRef.current) {
      peerConnectionRef.current = new RTCPeerConnection({ iceServers });
      peerConnectionRef.current.addEventListener('icegatheringstatechange', onIceGatheringStateChange, true);
      peerConnectionRef.current.addEventListener('icecandidate', onIceCandidate, true);
      peerConnectionRef.current.addEventListener('iceconnectionstatechange', onIceConnectionStateChange, true);
      peerConnectionRef.current.addEventListener('connectionstatechange', onConnectionStateChange, true);
      peerConnectionRef.current.addEventListener('signalingstatechange', onSignalingStateChange, true);
      peerConnectionRef.current.addEventListener('track', onTrack, true);
    }
    await peerConnectionRef.current.setRemoteDescription(offer);
    const answer = await peerConnectionRef.current.createAnswer();
    await peerConnectionRef.current.setLocalDescription(answer);
    console.log("answer de create connection:", answer);
   
    console.log("peerConnectionRef.current:", peerConnectionRef.current);
    return answer;
  };
  
  

  const connect = async () => {
    console.log("Connect function invoked");
    if (peerConnectionRef.current && peerConnectionRef.current.connectionState === 'connected') {
      console.log("Already connected, exiting function");
      return;
    }
    stopAllStreams();
    closePC();

    try {
      console.log("Trying to establish connection with D-ID API");
      const sessionResponse = await fetch(`${DID_API.url}/talks/streams`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${DID_API.key}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          source_url: avatar_img_url
        }),
      });

      const responseData = await sessionResponse.json();
      console.log("Received response from D-ID API:", responseData);
      const { id: newStreamId, offer, ice_servers: iceServers, session_id: newSessionId } = responseData;
      streamIdRef.current = newStreamId;
      sessionIdRef.current = newSessionId;
      console.log("StreamId:", streamIdRef.current);
      console.log("SessionId:", sessionIdRef.current);

      console.log("CREAMOS LA CONEXIÓN PeerConnection:");
      console.log("Offer:", offer);
      //llamada a creación de la conexión webRTC
      const sessionClientAnswer = await createPeerConnection(offer, iceServers);
      
      
      console.log("peerConnectionRef.current?.connectionState:", peerConnectionRef.current?.connectionState);
      console.log("Trying to send answer to D-ID API");
      await fetch(`${DID_API.url}/talks/streams/${streamIdRef.current}/sdp`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${DID_API.key}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ answer: sessionClientAnswer, session_id: sessionIdRef.current })
      });
      console.log("Connection established successfully");
    } catch (e) {
      console.error("Error during connection:", e);
    }
  };
  if (talkVideoRef.current) {
  talkVideoRef.current.play();
}

  const talk = async (user_message) => {
  
    console.log("Talk function invoked");
    if (peerConnectionRef.current?.signalingState !== 'stable' || peerConnectionRef.current?.iceConnectionState !== 'connected') {
      console.log("Peer connection is not stable or not connected, exiting function");
      console.log("Peer connection state:", peerConnectionRef.current?.signalingState);
      console.log("Peer connection ice state:", peerConnectionRef.current?.iceConnectionState);
      console.log("Peer connection:", peerConnectionRef.current);
      console.log("StreamId", streamIdRef.current);

      return;
    }

    try {
      console.log("Trying to get chat response");
      const response = await fetch(`https://ceu-chatcompletion-python.azurewebsites.net/api/ceuavatarcompletion?session_id=${streamIdRef.current}&mensaje=${user_message}&usuario=${usuario}&avatar=${avatar}`);
      let chatText = await response.text();
      console.log("Received chat response:", chatText);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      //outputTextRef.current.textContent = chatText;
      console.log("Trying to initiate video streaming with D-ID API");
      await fetch(`${DID_API.url}/talks/streams/${streamIdRef.current}`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${DID_API.key}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          script: {
            type: 'text',
            subtitles: 'false',
            provider: {
              type: 'microsoft',
              voice_id: azure_voice_id
            },
            ssml: 'false',
            input: chatText
          },
          driver_url: 'bank://lively/',
          config: {
            stitch: true,
          },
          session_id: sessionIdRef.current
        })
      });
      console.log("Talk function completed successfully");
    } catch (e) {
      console.error("Error during talk:", e);
    }
  };

  //const destroy = () => {
  //  fetch(`${DID_API.url}/talks/streams/${streamIdRef.current}`, {
  //    method: 'DELETE',
  //    headers: {
  //      'Authorization': `Basic ${DID_API.key}`,
  //      'Content-Type': 'application/json'
  //    },
  //    body: JSON.stringify({ session_id: sessionIdRef.current })
  //  });
  //  stopAllStreams();
  //  closePC();
  //};

  const configura_avatar = async (avatar) => {
    console.log("Configura avatar function invoked");
    console.log("Avatar:", avatar);

    if (avatar === "camarero") {
      console.log("Avatar: camarero");
      //código para cambiar la imagen del avatar
      avatar_img_url = 'https://clips-presenters.d-id.com/rian/image.png';
      azure_voice_id= 'es-ES-AlvaroNeural'
      talkVideoRef.current.poster = avatar_img_url;
    }
    if (avatar === "profesor_inglés") {
      console.log("Avatar: profesor inglés");
      //código para cambiar la imagen del avatar
      avatar_img_url = 'https://create-images-results.d-id.com/DefaultPresenters/Emily_f/image.jpeg';
      azure_voice_id= 'en-US-JennyNeural'
      talkVideoRef.current.poster = avatar_img_url;
    }
    if (avatar === "entrevistador") {
      console.log("Avatar: entrevistador");
      //código para cambiar la imagen del avatar
      avatar_img_url = 'https://create-images-results.d-id.com/DefaultPresenters/Brandon_m/image.png';
      azure_voice_id= 'es-ES-DarioNeural'
      talkVideoRef.current.poster = avatar_img_url;
    }

    await connect();
    console.log("Configura avatar function completed successfully");
  }

  
  

  return (
 <div className="container">

      <h2 className="text-center">Avatar Chat</h2>
      <video ref={talkVideoRef} autoPlay playsInline poster={avatar_img_url}  />
      <p>{displayText}</p>
      
   
      
      <button onClick={sttFromMic}>Pulsa para hablar</button>
      <button onClick={() => configura_avatar("camarero")}>camarero</button>
      <button onClick={() => configura_avatar("profesor_inglés")}>profesor inglés</button>
      <button onClick={() => configura_avatar("entrevistador")}>entrevistador</button>



</div>  
  );
};
// Path: src/App.js

//<input ref={chatInputRef} type="text" placeholder="Type here for chat..." />
//   <div ref={outputTextRef}></div>
export default App;
