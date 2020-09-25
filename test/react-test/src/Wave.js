import React, { useEffect } from 'react'
import Wave from "@foobar404/wave"

export default () => {
    useEffect(() => {
        let audio = document.querySelector("audio")
        let canvas = document.querySelector("canvas")

        let wave = new Wave();
        wave.fromElement(audio, canvas, { type: "star" })
    }, [])
    return (
        <div>

            <canvas id="canvas" height="400" width="400"></canvas>
            <audio src={process.env.PUBLIC_URL + "/song.mp3"} controls></audio>

        </div>
    )
}
