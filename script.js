const maxtimestamp = 2147483647;
var readable_timer_mode = 0;
var msec_display = true;

function ReadableTimerSwitcher(){
    readable_timer_mode++
    if(readable_timer_mode > 2){readable_timer_mode = 0}
}
addEventListener("fullscreenchange", (event) => {
    if(document.fullscreen){
        $("#style").attr("href", "fullscreen-style.css")
    }else{
        $("#style").attr("href", "style.css")
    }
})
function msecDisplaySwitcher(){
    if(msec_display){
        msec_display = false
        $("#time-left-msec").css("display", "none");
    }else{
        msec_display = true
        $("#time-left-msec").css("display", "unset");
    }
}
function Cycle() {
    var timestamp = Date.now() / 1000,
        left = maxtimestamp - timestamp,
        lmsec = Math.floor(left * 1000) % 1000,
        t = Math.floor(left);
    $("#time-left").html(t.toLocaleString('ru'));
    $("#time-left-msec").html("." + ("00" + lmsec).slice(-3))
    $("#prog").val(timestamp);
    $("#timestamp").html(Math.trunc(timestamp).toLocaleString('ru'));
    if (left < 60 && readable_timer_mode != 2) { $("#time-left-readable").css("display", "none") }
    if (left <= 0) {
        clearInterval(c);
        $("#time-left").html("0");
        $("#time-left-msec").html("000")
        $("#title").html("С͓̪̩̳͕͍̄ͮͤ̚̚м̦͎͉̝̋̄е̥͕̫̫̱̱͓̞̾р̞̤̰͖̤̟̫͓̏̍͒ͣ͐͂̚ͅт̗̥̲̩̣̯̹̅ͅь̙͍̟̟̮̩̦̹ͩͤ");
    }
    switch (readable_timer_mode){
        case 0:
        var tsec = Math.floor(left % 60),
            tmin = Math.floor(left / 60) % 60,
            thour = Math.floor(left / 60 / 60) % 24,
            tday = Math.floor(left / 60 / 60 / 24);
        $("#time-left-readable").html("(" + tday + ":" + ("0" + thour).slice(-2) + ":" + ("0" + tmin).slice(-2) + ":" + ("0" + tsec).slice(-2) + ")");
        break;
        case 1:
        var tsec = Math.floor(left % 60),
            tmin = Math.floor(left / 60) % 60,
            thour = Math.floor(left / 60 / 60) % 24,
            tday = Math.floor(left / 60 / 60 / 24) % 365,
            tyear = Math.floor(left / 60 / 60 / 24 / 365);
        $("#time-left-readable").html("(" + tyear + " л. " + tday + " дн. " + ("0" + thour).slice(-2) + ":" + ("0" + tmin).slice(-2) + ":" + ("0" + tsec).slice(-2) + ")");
        break;
        case 2:
        var precentage = (timestamp/maxtimestamp)*100;
        $("#time-left-readable").html(Math.trunc(timestamp).toLocaleString('ru')+" / "+maxtimestamp.toLocaleString('ru')+" ("+precentage.toFixed(8)+"%)");
        break;
    }
}
var c = setInterval(Cycle, 1000 / 60);