import React, { useState, useEffect, useRef } from "react";
import * as speechsdk from "microsoft-cognitiveservices-speech-sdk";
//import TextToSpeech from './TextToSpeech.js';
//import FileUpload from './FileUpload';
//import Header from "./Header";

import "./App.css";


const App = () => {
  const [displayText, setDisplayText] = useState("Pulsa una vez para hablar.");
  //const chatInputRef = useRef(null);
  //const outputTextRef = useRef(null);
  const talkVideoRef = useRef(null);

  //const peerConnectionRef = useRef(null);
  const peerConnectionRef = useRef([
    { id: 0, connection: null, active: false },
    { id: 1, connection: null, active: false },
    { id: 2, connection: null, active: false },
    { id: 3, connection: null, active: false },
  ]);
  const userRefIndexConnection = useRef(0);
  let indexConnection = userRefIndexConnection.current;

  const streamIdRef = useRef(null);
  const sessionIdRef = useRef(null);
  const usuario = "joseluis"; // ver usuario, poasar a variable no es constante

  const SPEECH_KEY = '0c029cad0e45489fa76bca71569b0f3e';
  const SPEECH_REGION = 'westeurope';
  const IMG_URL_ROIG = 'https://create-images-results.d-id.com/auth0%7C646f6fd64196da85cb62a776/upl_dtCm20p57vc6Gz-kKC8oW/image.jpeg';
  
  //const [avatarType, setAvatarType] = useState('algún_valor_inicial');
  const [avatarImgUrl, setAvatarImgUrl] = useState('');
  const [azureVoiceId, setAzureVoiceId] = useState('');
  const [speechRecognitionLanguage, setSpeechRecognitionLanguage] = useState('');
  const [avatar, setAvatar] = useState('roig');
  
  
  //const avatarImgUrl = useRef(IMG_URL_ROIG);
  //const azureVoiceId = useRef('es-ES-DarioNeural');
  //const avatar = useRef('roig');
  //const speechRecognitionLanguage = useRef('es-ES');
  //variable modo video que solo puede ser VIDDEO o AUDIO
 // const modoVideoAudioChat = useRef('VIDEO');

 const urlParams = new URLSearchParams(window.location.search);
 const avatarType = urlParams.get('avatar');
 //setDisplayText(avatarType);
// 

// ...
useEffect(() => {
  (async () => {
    const url = `https://ceu-chatcompletion-python.azurewebsites.net/api/ceuavatarconfigure?avatar_type=${avatarType}`;
    try {
      const response = await fetch(url);
      if (response.ok) {
        const jsonResponse = await response.json();
        setAvatarImgUrl(jsonResponse['avatarImgUrl']);
        setAzureVoiceId(jsonResponse['azureVoiceId']);
        setSpeechRecognitionLanguage(jsonResponse['speechRecognitionLanguage']);
        setAvatar(avatarType);

      }
    } catch (error) {
      console.error('Hubo un error:', error);
    }
  })();
}, []);
// ...


  



  
 

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
    speechConfig.speechRecognitionLanguage = speechRecognitionLanguage.current;
    const audioConfig = speechsdk.AudioConfig.fromDefaultMicrophoneInput();
    const recognizer = new speechsdk.SpeechRecognizer(speechConfig, audioConfig);
    setDisplayText("speak into your microphone...");
    recognizer.recognizeOnceAsync((result) => {
      if (result.reason === speechsdk.ResultReason.RecognizedSpeech) {
        setDisplayText(`Usuario: ${result.text}`);
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
  };

 
  const onIceConnectionStateChange = (event) => {

    if (peerConnectionRef.current[indexConnection].connection.iceConnectionState === 'failed' || peerConnectionRef.current[indexConnection].connection.iceConnectionState === 'closed') {
      stopAllStreams();
      closePC();
    }
  }

  const onConnectionStateChange = (event) => {
    if (!peerConnectionRef.current[indexConnection].connection) return;
    console.log(`Connection State Change: ${peerConnectionRef.current[indexConnection].connection.connectionState}`);
  };

  const onSignalingStateChange = (event) => {
    if (!peerConnectionRef.current[indexConnection].connection) return;
    console.log(`Signaling State Change: ${peerConnectionRef.current[indexConnection].connection.signalingState}`);
  };

  const onTrack = (event) => {
    if (!peerConnectionRef.current[indexConnection].connection) return;
    try {
      if (talkVideoRef.current.srcObject) return;
      talkVideoRef.current.srcObject = event.streams[0];
    }
    catch (e) {
      console.error("Error during onTrack:", e);
    }
  };

  const stopAllStreams = async() => {
   try {
    if (talkVideoRef.current.srcObject) {
      console.log('stopping video streams');
      talkVideoRef.current.srcObject.getTracks().forEach(track => track.stop());
      talkVideoRef.current.srcObject = null;
    }
    }
    catch (e) {
      console.error("Error during stopAllStreams:", e);
    }
  

  };

  const closePC =  () => {

   // console.log("peerConnectionRef.current:", peerConnectionRef.current.signalingState);
    console.log("CLOSE PC INVOKED");
    
    if (peerConnectionRef.current[indexConnection].connection && peerConnectionRef.current[indexConnection].connection.connectionState === 'connected'){
    console.log('stopping peer connection');

    
    peerConnectionRef.current[indexConnection].connection.close();

    peerConnectionRef.current[indexConnection].connection.removeEventListener('icegatheringstatechange', onIceGatheringStateChange);
    peerConnectionRef.current[indexConnection].connection.removeEventListener('icecandidate', onIceCandidate);
    peerConnectionRef.current[indexConnection].connection.removeEventListener('iceconnectionstatechange', onIceConnectionStateChange);
    peerConnectionRef.current[indexConnection].connection.removeEventListener('connectionstatechange', onConnectionStateChange);
    peerConnectionRef.current[indexConnection].connection.removeEventListener('signalingstatechange', onSignalingStateChange);
    peerConnectionRef.current[indexConnection].connection.removeEventListener('track', onTrack);
    }
    peerConnectionRef.current[indexConnection].connection = null;
    peerConnectionRef.current[indexConnection].active = false;
  };

  const createPeerConnection = async (offer, iceServers,indexConnection) => {


    try {
     if (!peerConnectionRef?.current[indexConnection]?.connection)  {  
    
      console.log("peerConnectionRef.current[indexConnection].connection.connectionState:", peerConnectionRef.current[indexConnection].connection?.connectionState);
      //if ( peerConnectionRef.current?.connectionState === 'disconnected' || peerConnectionRef.current?.connectionState === 'failed' || peerConnectionRef.current?.connectionState === 'closed' || peerConnectionRef.current.connectionState === null) {
      console.log("PASO 3 ICESERVERS EN CONFIGURACION:",iceServers);
      console.log("CONECTANDO peerConnectionRef.current.connectionState:", peerConnectionRef.current?.connectionState);
      
      //const newConnection = new RTCPeerConnection(iceServers);
      //peerConnectionRef.current = new RTCPeerConnection({ iceServers });
     //console.log("conexion creada:", newConnection);
     peerConnectionRef.current[indexConnection].connection = new RTCPeerConnection({ iceServers });
     // peerConnectionRef.current = new RTCPeerConnection({ iceServers });

      
      console.log("peerConnectionRef.current[indexConnection].connection:", peerConnectionRef.current[indexConnection].connection);
      peerConnectionRef.current[indexConnection].active = true;
      if (!peerConnectionRef.current || !peerConnectionRef.current[indexConnection] || !peerConnectionRef.current[indexConnection].connection) {
        console.log("Algo está mal con la inicialización de la conexión");
        return;
      }
      
      console.log("peerConnectionRef.current:", peerConnectionRef.current[indexConnection]);
      peerConnectionRef.current[indexConnection].connection.addEventListener('icegatheringstatechange', onIceGatheringStateChange, true);
      peerConnectionRef.current[indexConnection].connection.addEventListener('icecandidate', onIceCandidate, true);
      peerConnectionRef.current[indexConnection].connection.addEventListener('iceconnectionstatechange', onIceConnectionStateChange, true);
      peerConnectionRef.current[indexConnection].connection.addEventListener('connectionstatechange', onConnectionStateChange, true);
      peerConnectionRef.current[indexConnection].connection.addEventListener('signalingstatechange', onSignalingStateChange, true);
      peerConnectionRef.current[indexConnection].connection.addEventListener('track', onTrack, true);
    //}
   } 
    }catch (e) {
      console.error("Error during createPeerConnection:", e);
    }
      
    
      console.log("iceserver", iceServers);
      console.log("peerConnectionRef.current:", peerConnectionRef.current[indexConnection]);
      console.log("offer:", offer);
      await peerConnectionRef.current[indexConnection].connection.setRemoteDescription(offer);
      
      const answer = await peerConnectionRef.current[indexConnection].connection.createAnswer();
      
      await peerConnectionRef.current[indexConnection].connection.setLocalDescription(answer);
      console.log("answer de create connection:", answer);
   
      console.log("peerConnectionRef.current:", peerConnectionRef.current);
    
      return answer;
    
  };
  

  const connect = async (indexConnection) => {
    console.log("Connect function invoked");
    if (peerConnectionRef.current[indexConnection].connection && peerConnectionRef.current[indexConnection].connection.connectionState === 'connected') {
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
          source_url: avatarImgUrl.current
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
      const sessionClientAnswer = await createPeerConnection(offer, iceServers, indexConnection);
      
      
      console.log("peerConnectionRef.current?.connectionState:", peerConnectionRef.current[indexConnection].connection?.connectionState);
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
 // talkVideoRef.current.play();
}

  const talk = async (user_message) => {
  
    console.log("Talk function invoked");
    if (peerConnectionRef.current[indexConnection].connection.signalingState !== 'stable' || peerConnectionRef.current[indexConnection].connection.iceConnectionState !== 'connected') {
      console.log("Peer connection is not stable or not connected, exiting function");

      return;
    }

    try {
      console.log("Trying to get chat response");
      const response = await fetch(`https://ceu-chatcompletion-python.azurewebsites.net/api/ceuavatarcompletion?session_id=${streamIdRef.current}&mensaje=${user_message}&usuario=${usuario}&avatar=${avatar.current}`);
      let chatText = await response.text();
      console.log("Received chat response:", chatText);
      console.log("streamIdRef.current:", streamIdRef.current);
      setDisplayText(`Avatar: ${chatText}`);
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
              voice_id: azureVoiceId.current
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

  const [botonesDesactivados, setBotonesDesactivados] = useState(false)
  const toggleBotones = () => {
    setBotonesDesactivados(!botonesDesactivados);
  };

  const configura_avatar = async (avatar_selecionado) => {
    //desactiva botones
    setBotonesDesactivados(true);
    if (peerConnectionRef.current[indexConnection].connection) { await closePC();}
    avatar.current = avatar_selecionado;
    console.log("Avatar:", avatar);
    if (avatar.current === "camarero") {
      console.log("Avatar: camarero");
      //código para cambiar la imagen del avatar
      avatarImgUrl.current= ( 'https://create-images-results.d-id.com/auth0%7C646f6fd64196da85cb62a776/upl_SIDLEhu5iJYaIUfpHOMEY/image.png');
      //azureVoiceId.current=('es-ES-DarioNeural')
      //azureVoiceId.current=( 'en-US-JennyNeural');
      azureVoiceId.current=('es-ES-LiaNeural' );

      speechRecognitionLanguage.current=('es-ES');
      talkVideoRef.current.poster = avatarImgUrl.current;
      indexConnection = 0;
    }
    if (avatar.current === "profesor_ingles") {
      console.log("Avatar: profesor inglés");
      //código para cambiar la imagen del avatar
      avatarImgUrl.current=( 'https://create-images-results.d-id.com/auth0%7C646f6fd64196da85cb62a776/upl_EBYTrT9M9PueWQMoUwfBW/image.png');
      azureVoiceId.current=( 'en-US-JennyNeural');
      speechRecognitionLanguage.current=( "en-US");
      talkVideoRef.current.poster = avatarImgUrl.current;
      indexConnection = 1;
    }
    if (avatar.current === "entrevistador") {
      console.log("Avatar: entrevistador");
      //código para cambiar la imagen del avatar
      avatarImgUrl.current=( 'https://create-images-results.d-id.com/auth0%7C646f6fd64196da85cb62a776/upl_rE88Wu1Wn2ssGvSG_tR4-/image.png');
      //azureVoiceId.current=('es-ES-LiaNeural' );
      azureVoiceId.current=('es-ES-DarioNeural');
      speechRecognitionLanguage.current =('es-ES');
      talkVideoRef.current.poster = avatarImgUrl.current;
      indexConnection = 2;
    }
    if (avatar.current === "roig") {
      console.log("Avatar: roig");
      //código para cambiar la imagen del avatar
      avatarImgUrl.current=(IMG_URL_ROIG);
      azureVoiceId.current=('es-ES-DarioNeural');
      speechRecognitionLanguage.current =('es-ES');
      talkVideoRef.current.poster = avatarImgUrl.current;
      indexConnection = 3;
    }
    //talkVideoRef.current.poster = avatarImgUrl.current;
    userRefIndexConnection.current = indexConnection;
    await connect(indexConnection);
    console.log("Configura avatar function completed successfully");
    //activa botones
    setBotonesDesactivados(false);
  }
  useEffect(() => {
    if (talkVideoRef.current) {
      talkVideoRef.current.poster = avatarImgUrl.current;
    }
  }, []); // Las dependencias están vacías, por lo que esto se ejecutará sólo una vez después del montaje del componente
  
 
  
  return (
   
    <div className="container">
      

      
      <header className="header">
        
        <h2 className="text-center">Avatar Chat</h2>
        <nav className="menu">
        <div>
          <button onClick={() => configura_avatar("camarero")} disabled={botonesDesactivados}>Camarero</button>
          <button onClick={() => configura_avatar("profesor_ingles")} disabled={botonesDesactivados}>Profesor de Inglés</button>
          <button onClick={() => configura_avatar("entrevistador")} disabled={botonesDesactivados}>Entrevistador</button>
          <button onClick={() => configura_avatar("roig")} disabled={botonesDesactivados}>Asistente Joseluis</button>
          <button onClick={toggleBotones}>{botonesDesactivados ? 'Activar' : 'Desactivar'} Botones</button>
       </div>
        </nav>
      </header>
      
      <main>
        <video ref={talkVideoRef} autoPlay playsInline poster={avatarImgUrl.current} />
        <p>{displayText}</p>
        <button onClick={sttFromMic}>Pulsa para hablar</button>
      </main>
    </div>
  );
  }  
// Path: src/App.js

//<input ref={chatInputRef} type="text" placeholder="Type here for chat..." />
//   <div ref={outputTextRef}></div>
export default App;