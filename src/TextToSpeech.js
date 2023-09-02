import React from 'react';
import * as SpeechSDK from 'microsoft-cognitiveservices-speech-sdk';

const TextToSpeech = () => {
  const speechConfig = SpeechSDK.SpeechConfig.fromSubscription("0c029cad0e45489fa76bca71569b0f3e", "westeurope");

  const speakText = (text) => {
    const audioConfig = SpeechSDK.AudioConfig.fromDefaultSpeakerOutput();
    const synthesizer = new SpeechSDK.SpeechSynthesizer(speechConfig, audioConfig);

    synthesizer.speakTextAsync(
      text,
      result => {
        if (result) {
          console.log(`Status: ${result.status}`);
        }
        synthesizer.close();
      },
      error => {
        console.error(error);
        synthesizer.close();
      }
    );
  };

  return (
    <div>
      <button onClick={() => speakText("Hola, ¿cómo estás?")}>
        Hablar
      </button>
    </div>
  );
};

export default TextToSpeech;
