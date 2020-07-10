import fromElement from "./fromElement.js";
import fromFile from "./fromFile.js";
import fromStream from "./fromStream.js";
import visualize from "./visualize.js";
import Helper from "./helper.js";

'use strict'

function Wave() {
    this.current_stream = {};
    this.sources = {};
    this.onFileLoad = null;
    this.activeElements = {}
    this.activated = false

    window.AudioContext = window.AudioContext || window.webkitAudioContext;
}

Wave.prototype = {
    fromElement,
    fromFile,
    ...fromStream,
    visualize,
    Helper
}

export default Wave



