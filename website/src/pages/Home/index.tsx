import mixpanel from 'mixpanel-browser';
import React, { useRef, useState, useEffect } from 'react';
import { MdMovieFilter, MdStarRate } from "react-icons/md"
import AudioPlayer from 'material-ui-audio-player';
import { Wave } from "@foobar404/wave";
import { IAnimation } from "@foobar404/wave/dist/src/types";


export function Home() {
    let canvasElm = useRef<HTMLCanvasElement | null>(null);
    let [audioElm, setAudioElm] = useState<HTMLAudioElement | null>(null);
    let [wave, setWave] = useState<Wave | null>(null);
    let [activeAnimation, setActiveAnimation] = useState(0);
    let [activeTab, setActiveTab] = useState(0);

    useEffect(() => {
        if (!canvasElm.current) return;
        if (!audioElm) return;
        if (wave) return;

        setWave(new Wave(audioElm, canvasElm.current));
        canvasElm.current.style.width = '100%';
        canvasElm.current.style.height = '100%';
        canvasElm.current.width = canvasElm.current.offsetWidth;
        canvasElm.current.height = canvasElm.current.offsetHeight;
    }, [audioElm]);

    useEffect(() => {
        if (!wave) return;
        setPreset(0);
    }, [wave]);

    useEffect(() => {
        mixpanel.init('e238a814305e867f893f885da1a78b23');
        mixpanel.track('New User');
    }, [])

    function setAnimation(name: string) {
        if (!wave) return;

        wave.clearAnimations();
        let fillColor = (name === "Circles") ? "rgba(0,0,0,0)" : "white";
        // @ts-ignore
        let animation = new wave.animations[name]({ lineColor: "white", fillColor });
        wave?.addAnimation(animation as IAnimation);
    }

    function setPreset(preset: number) {
        wave?.clearAnimations();

        if (preset == 0) {
            wave?.addAnimation(new wave.animations.Wave({
                lineColor: "white",
                lineWidth: 10,
                fillColor: { gradient: ["#FF9A8B", "#FF6A88", "#FF99AC"] },
                mirroredX: true,
                count: 5,
                rounded: true,
                frequencyBand: "base"
            }));
            wave?.addAnimation(new wave.animations.Wave({
                lineColor: "white",
                lineWidth: 10,
                fillColor: { gradient: ["#FA8BFF", "#2BD2FF", "#2BFF88"] },
                mirroredX: true,
                count: 60,
                rounded: true
            }));
            wave?.addAnimation(new wave.animations.Wave({
                lineColor: "white",
                lineWidth: 10,
                fillColor: { gradient: ["#FBDA61", "#FF5ACD"] },
                mirroredX: true,
                count: 25,
                rounded: true,
                frequencyBand: "highs"
            }));
        }
        if (preset == 1) {
            wave?.addAnimation(new wave.animations.Cubes({
                bottom: true,
                count: 60,
                cubeHeight: 5,
                fillColor: { gradient: ["#FAD961", "#F76B1C"] },
                lineColor: "rgba(0,0,0,0)",
                radius: 10
            }));
            wave?.addAnimation(new wave.animations.Cubes({
                top: true,
                count: 60,
                cubeHeight: 5,
                fillColor: { gradient: ["#FAD961", "#F76B1C"] },
                lineColor: "rgba(0,0,0,0)",
                radius: 10
            }));
            wave?.addAnimation(new wave.animations.Circles({
                lineColor: { gradient: ["#FAD961", "#FAD961", "#F76B1C"], rotate: 90 },
                lineWidth: 4,
                diameter: 20,
                count: 10,
                frequencyBand: "base"
            }));
        }
        if (preset == 2) {
            wave?.addAnimation(new wave.animations.Glob({
                fillColor: { gradient: ["#FAD961", "#FAD961", "#F76B1C"], rotate: 45 },
                lineColor: "white",
                glow: { strength: 15, color: "#FAD961" },
                lineWidth: 10,
                count: 45
            }));
            wave?.addAnimation(new wave.animations.Shine({
                lineColor: "#FAD961",
                glow: { strength: 15, color: "#FAD961" },
                diameter: 300,
                lineWidth: 10,
            }));
        }
        if (preset == 3) {
            wave?.addAnimation(new wave.animations.Square({
                lineColor: { gradient: ["#21D4FD", "#B721FF"] }
            }));
            wave?.addAnimation(new wave.animations.Arcs({
                lineWidth: 4,
                lineColor: { gradient: ["#21D4FD", "#B721FF"] },
                diameter: 500,
                fillColor: { gradient: ["#21D4FD", "#21D4FD", "#B721FF"], rotate: 45 }
            }));
        }
    }

    return (<main className={"p-home"}>
        <section className={"__menu"}>
            <h1 className={"__menu-title"}>🌊 Wave.js</h1>

            <h2 className={"__menu-subtitle"}>Showcase</h2>
            <hr className={"__menu-spacer"} />

            <div className={`__menu-item ${activeAnimation == 0 ? '--active' : ''}`}
                onClick={() => {
                    setPreset(0);
                    setActiveAnimation(0);
                }}>
                <MdStarRate className={"c-icon"} /> Example 1
            </div>

            <div className={`__menu-item ${activeAnimation == 1 ? '--active' : ''}`}
                onClick={() => {
                    setPreset(1);
                    setActiveAnimation(1);
                }}>
                <MdStarRate className={"c-icon"} /> Example 2
            </div>

            <div className={`__menu-item ${activeAnimation == 2 ? '--active' : ''}`}
                onClick={() => {
                    setPreset(2);
                    setActiveAnimation(2);
                }}>
                <MdStarRate className={"c-icon"} /> Example 3
            </div>

            <div className={`__menu-item ${activeAnimation == 3 ? '--active' : ''}`}
                onClick={() => {
                    setPreset(3);
                    setActiveAnimation(3);
                }}>
                <MdStarRate className={"c-icon"} /> Example 4
            </div>

            <h2 className={"__menu-subtitle"}>All Animations</h2>
            <hr className={"__menu-spacer"} />

            {Object.keys(wave?.animations ?? {}).map((name, i) => (
                <div key={i} className={`__menu-item ${activeAnimation == 4 + i ? '--active' : ''}`}
                    onClick={() => {
                        setAnimation(name);
                        setActiveAnimation(4 + i);
                    }}>
                    <MdMovieFilter className={"c-icon"} /> {name}
                </div>
            ))}
        </section>

        <section className={"__display"}>
            <nav className={"__nav"}>
                <a href="./#/"
                    className={`c-link __nav-item ${activeTab == 0 ? '--active' : ''}`}
                    onClick={() => {
                        setActiveTab(0);
                        mixpanel.track('Home');
                    }}>Home</a>
                <a href="./docs"
                    className={`c-link __nav-item ${activeTab == 1 ? '--active' : ''}`}
                    onClick={() => {
                        setActiveTab(1);
                        mixpanel.track('Docs');
                    }}
                    target={"_blank"}>Docs</a>
                <a href="https://github.com/foobar404/Wave.js"
                    className={`c-link __nav-item ${activeTab == 2 ? '--active' : ''}`}
                    onClick={() => {
                        setActiveTab(2);
                        mixpanel.track('Github');
                    }}
                    target={"_blank"}>Github</a>
                <a href="https://www.npmjs.com/package/@foobar404/wave"
                    className={`c-link __nav-item ${activeTab == 3 ? '--active' : ''}`}
                    onClick={() => {
                        setActiveTab(3);
                        mixpanel.track('NPM');
                    }}
                    target={"_blank"}>NPM</a>
                <a href="https://github.com/sponsors/foobar404"
                    className={`c-link __nav-item ${activeTab == 4 ? '--active' : ''}`}
                    onClick={() => {
                        setActiveTab(4);
                        mixpanel.track('Donate');
                    }}
                    target="_blank">Donate</a>
            </nav>
            <div className={"__canvas"}>
                <canvas ref={canvasElm}></canvas>
            </div>
        </section>

        <div style={{ marginLeft: 20, minWidth: "98%" }}>
            <AudioPlayer getPlayer={(e) => setAudioElm(e)}
                src="./assets/audio.mp3"
                height={"60px"}
                volume={false} />
        </div>
    </main>)
}