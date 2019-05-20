var player = document.getElementById("player");
var audio = document.getElementById("audio");
var canvas = document.getElementById("wave");

var o = {
    "wave": {
        wave: true,
        colors: ["rgb(0, 255, 255)", "rgba(0, 255, 255,.2)"]
    },
    "bars":{
        bars:true,
        colors:["#f32a66","#f55c57","#f7a942","#f8e82f"],
        stroke:4
    },
    "bars_blocks":{
        bars_blocks:true,
        colors:["#f604a3","#f604a333"]
    },
    "dualbars":{
        dualbars:true,
        colors:["#4d9a6c","#3bbe9c","#0cb3da","#1d6b9b"]
    },
    "orbs":{
        orbs:true,
        colors:["rgba(68, 8, 247,.4)","rgba(68, 8, 247,1)"]
    },
    "dualbars_blocks":{
        dualbars_blocks:true,
        colors:["#8008f7","#8008f733"]
    },
    "round_wave":{
        round_wave:true,
        colors:["#f86300","#f86300"]
    },
    "shine":{
        shine:true,
        colors:["#fff","#111"]
    },
    "ring":{
        ring:true,
        colors:["#ff1600","#fe522e44"]
    },
    "flower":{
        flower:true,
        colors:["#ac3c7c","#c1653c","#aac340","#45bb60","#429f96","#459cbe","#2ab478","#accf2e","#ca913e","#cb4e54"]
    },
    "flower_blocks":{
        flower_blocks:true,
        colors:["#80f708","#80f70833"]
    },
    "star":{
        star:true,
        colors:["#f70880","#f7088044","#f8305c"]
    }
}

canvas.height = $("#wave").height();
canvas.width = $("#wave").width();

$(function () {
    W.fromElement("audio", "wave", o.wave);
    audio.play();
})


audio.addEventListener("ended", function () {
    player.innerHTML = `<i class="fas fa-play"></i>`;
})
player.addEventListener("click", function () {
    if (player.childNodes[0].classList.contains("fa-pause")) { //pause
        audio.pause();
        player.innerHTML = `<i class="fas fa-play"></i>`;
    } else {
        audio.play();
        player.innerHTML = `<i class="fas fa-pause"></i>`;
    }
})

const W = new Wave();

var waves = document.getElementsByClassName("wave_option");
for (var wave = 0; wave < waves.length; wave++) {
    w = waves[wave];

    w.addEventListener("click", function () {
        var vals = this.dataset.wave.split(",");
        changeVisual(vals);

        $(".wave_option").removeClass("active");
        $(this).addClass("active");



    })
}

function changeVisual(v) {
    audio.pause();

    var options = o[v];

    W.fromElement("audio", "wave", options);

    audio.play();
    player.innerHTML = `<i class="fas fa-pause"></i>`;
}
