const maxtimestamp = 2147483647;
var readable_timer_mode = 0;
var msec_display = true;
var fullscreen = false;
var other_counters = [  
                        ["UNIX unsinged 32-bit timestamp", "UNIX 32 бита без знака", 0, 4294967295],
                        ["FAT filesystems timestamps", "Штампы времени файловой системы FAT", 351907200, 4354819200],
                        ["ext4 filesystems timestamps", "Штампы времени файловой системы ext4", -2147470217, 17176838400],
                        ["NTFS filesystems timestamps", "Штампы времени файловой системы NTFS", -11644473600, 1833029913600],
                        // ["Year 32,768 bug", "Проблема 32 768 года", -62167219200, 971890963200],
                        // ["Year 65,536 bug", "Проблема 65 536 года", -62167219200, 2005949145600],
                        ["UNIX singed 64-bit timestamp", "UNIX 64 бита со знаком", 0, 9223372036854775807],
                        ["UNIX unsinged 64-bit timestamp", "UNIX 64 бита без знака", 0, 18446744073709551615],
                    ];
var language_user = window.navigator ? (window.navigator.language ||
    window.navigator.systemLanguage ||
    window.navigator.userLanguage) : "ru";
language_user = language_user.substr(0, 2).toLowerCase();
language_site = (language_user == "ru" || language_user == "by" || language_user == "ua") ? "ru" : "en";
function ReadableTimerSwitcher(){
    readable_timer_mode++
    if(readable_timer_mode > 2){readable_timer_mode = 0}
}
addEventListener("fullscreenchange", (event) => {
    if(!fullscreen){
        $("#style").attr("href", "fullscreen-style.css");
        $("#description_en").css("display", "none");
        $("#description_ru").css("display", "none");
        fullscreen = true;
    }else{
        $("#style").attr("href", "style.css");
        languageSwitcher(language_site)
        fullscreen = false;
    }
})

function languageSwitcher(lang_code){
    switch (lang_code) {
        case "ru":
            $("#title_en").css("display", "none");
            $("#title_ru").css("display", "block");
            $("#description_en").css("display", "none");
            $("#description_ru").css("display", "block");
            $("#me_tg_en").css("display", "none");
            $("#me_tg_ru").css("display", "");
            language_site = "ru";
            break;
        case "en":
            $("#title_ru").css("display", "none");
            $("#title_en").css("display", "block");
            $("#description_ru").css("display", "none");
            $("#description_en").css("display", "block");
            $("#me_tg_ru").css("display", "none");
            $("#me_tg_en").css("display", "");
            language_site = "en";
            break;
    }
}
languageSwitcher(language_site);
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
    $("#timestamp_ru").html(Math.trunc(timestamp).toLocaleString('ru'));
    $("#timestamp_en").html(Math.trunc(timestamp).toLocaleString('ru'));
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
        switch (language_site) {
            case "ru":
                $("#time-left-readable").html("(" + tyear + " л. " + tday + " дн. " + ("0" + thour).slice(-2) + ":" + ("0" + tmin).slice(-2) + ":" + ("0" + tsec).slice(-2) + ")");
                break;
            case "en":
                $("#time-left-readable").html("(" + tyear + " y. " + tday + " d. " + ("0" + thour).slice(-2) + ":" + ("0" + tmin).slice(-2) + ":" + ("0" + tsec).slice(-2) + ")");
                break;
        }
        break;
        case 2:
        var precentage = (timestamp/maxtimestamp)*100;
        $("#time-left-readable").html(Math.trunc(timestamp).toLocaleString('ru')+" / "+maxtimestamp.toLocaleString('ru')+" ("+precentage.toFixed(8)+"%)");
        break;
    }
    let other_counters_html = (language_site == "ru") ? "<h3>Другие, более далёкие проблемы времени в вычислительной технике</h3>" : "<h3>Other, more distant time problems in computing</h3>";
    other_counters.forEach(element => {
        l = element[3] - timestamp;
        other_counters_html = other_counters_html + '<div id="other_counter"><h4>'+ element[(language_site == "ru") ? 1 : 0] + '</h4><span style="font-size: 2rem; font-family: \'7Digital\'">' + Math.trunc(l).toLocaleString('ru') +
        '</span><div class="othr_progress" style="float: right">' + new Date(element[3]*1000).toUTCString() + " · " +(((timestamp-element[2])/(element[3]-element[2]))*100).toFixed(8).toString() +
        '% · ' + Math.floor(l / 60 / 60 / 24 / 365).toLocaleString('ru') + ((language_site == "ru") ? " л. " : " y. ") + (Math.floor(l / 60 / 60 / 24) % 365).toString() + ((language_site == "ru") ? " дн. " : " d. ") +
        ("0" + (Math.floor(l / 60 / 60) % 24)).slice(-2) + ':' + ("0" + (Math.floor(l / 60) % 60)).slice(-2) + ':' + ("0" + (Math.floor(l) % 60)).slice(-2) + '</div>' + '</div>';
    });
    $("#other_countdowns").html(other_counters_html)
}
var c = setInterval(Cycle, 1000 / 15);