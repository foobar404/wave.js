import React, { useEffect } from 'react';
import Wave from '@foobar404/wave';

export default () => {
  useEffect(() => {
    let audio = document.querySelector('audio');
    let canvas = document.querySelector('canvas');

    let wave = new Wave();
    wave.fromElement(audio, canvas, { type: 'star', context: new AudioContext() });
  }, []);
  return (
    <div>
      <canvas id='canvas' height='400' width='400'></canvas>
      <audio
        src={process.env.PUBLIC_URL + '/song.mp3'}
        id='audio'
        controls
      ></audio>
    </div>
  );
};
