const maxtimestamp = 2147483647;
var readable_timer_mode = 0;
var msec_display = true;
var fullscreen = false;
var other_counters = [ // Title EN, Title RU, Start Unix timestamp, End Unix timestamp, Description EN, Description RU 
                        ["UNIX unsinged 32-bit timestamp", "UNIX 32 бита без знака", 0n, 4294967295n, "Developers of some systems have thought that singed 32-bit may not be enough and decided to use unsinged 32-bit.", "Разработчики некоторых систем додумались, что 32 бита со знаком однажды может не хватить и решили использовать 32 бита без знака."],
                        ["FAT filesystems timestamps", "Штампы времени файловой системы FAT", 315532800n, 4354819198n, "", "На каждую отметку времени отводится четыре байта: два - на дату и два - на время. Год хранится в формате количества лет от начала эпохи Microsoft. Отсюда и диапазон - от 1980 до 2107 года"],
                        ["ext4 filesystems timestamps", "Штампы времени файловой системы ext4", -2147483648n, 15032385529n, "Inode Timestamps", ""],
                        ["NTFS filesystems timestamps", "Штампы времени файловой системы NTFS", -11644473600n, 1833029984880n, "File times are 64-bit numbers counting 100-nanosecond intervals (ten million per second) since 1601, which is 58,000+ years", "Для хранения даты и времени отведено 64 бита; шаг — 100 наносекунд (десять миллионов интервалов в секунду). Это позволяет указать дату и время в промежутке из 58 тысяч лет."],
                        // ["Year 32,768 bug", "Проблема 32 768 года", -62167219200, 971890963200, "", ""],
                        // ["Year 65,536 bug", "Проблема 65 536 года", -62167219200, 2005949145600, "", ""],
                        ["UNIX singed 64-bit timestamp", "UNIX 64 бита со знаком", 0n, 9223372036854775807n, "Proposed as a solution to problem 2038 and turns it into problem 292277026596 because the extreme time that can be represented by this format is December 4, 292,277,026,596, 15:30:08 UTC.", "Предлагается в качестве решения проблемы 2038 и превращает её в проблему 292277026596 года, потому что крайнее время, которое может быть представлено данным форматом - 4 Декабря 292 277 026 596 года, 15:30:08 UTC."],
                        ["UNIX unsinged 64-bit timestamp", "UNIX 64 бита без знака", 0n, 18446744073709551615n, "Humanity will never get to November 29, 584,554,051,223, 16:51:49 UTC, don't worry", "Человечество никогда не доживёт до 29 ноября 584 554 051 223 года, 16:51:49 UTC, не волнуйтесь"],
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
    $("#time-left").html(t.toLocaleString(language_site));
    $("#time-left-msec").html("." + ("00" + lmsec).slice(-3))
    $("#prog").val(timestamp);
    $("#timestamp_ru").html(Math.trunc(timestamp).toLocaleString(language_site));
    $("#timestamp_en").html(Math.trunc(timestamp).toLocaleString(language_site));
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
        $("#time-left-readable").html("(" + tyear.toLocaleString(language_site, {style: "unit", unit: "year"}) + " " + tday.toLocaleString(language_site, {style: "unit", unit: "day"}) + " " + ("0" + thour).slice(-2) + ":" + ("0" + tmin).slice(-2) + ":" + ("0" + tsec).slice(-2) + ")");
        break;
        case 2:
        $("#time-left-readable").html(Math.trunc(timestamp).toLocaleString(language_site)+" / "+maxtimestamp.toLocaleString(language_site)+" ("+(timestamp/maxtimestamp).toLocaleString(language_site, {style: "percent", minimumFractionDigits: 8})+")");
        break;
    }
    let other_counters_html = (language_site == "ru") ? "<h3>Другие, более далёкие проблемы времени в вычислительной технике</h3>" : "<h3>Other, more distant time problems in computing</h3>";
    other_counters.forEach(element => {
        l = element[3] - BigInt(Math.trunc(timestamp));
        date_from = new Date(parseInt(element[2])*1000);
        date_to = new Date(parseInt(element[3])*1000);
        date_to_local = new Intl.DateTimeFormat(language_site, {timeZone: 'UTC', weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', timeZoneName: 'short'})
        other_counters_html = other_counters_html + '<div id="other_counter"><h4>'+ element[(language_site == "ru") ? 1 : 0] + '</h4><span style="font-size: 2rem; font-family: \'7Digital\'">'
        + l.toLocaleString(language_site) + '</span><div class="othr_progress" style="float: right">' // second argument: {notation: "compact", compactDisplay: "long", style: "unit", unit: "second", unitDisplay: 'long'}
        + ((timestamp-parseInt(element[2]))/(parseInt(element[3])-parseInt(element[2]))).toLocaleString(language_site, {style: "percent", minimumFractionDigits: 8})
        + " · "; try {other_counters_html = other_counters_html + date_to_local.format(date_from)} catch (e) {other_counters_html = other_counters_html + ((element[2] / 60n / 60n / 24n / 365n) + 1970n).toLocaleString(language_site, {style: "unit", unit: "year"})}; other_counters_html = other_counters_html + " ‒ "; try {other_counters_html = other_counters_html + date_to_local.format(date_to)} catch (e) {other_counters_html = other_counters_html + ((element[3] / 60n / 60n / 24n / 365n) + 1970n).toLocaleString(language_site, {style: "unit", unit: "year"})}; other_counters_html = other_counters_html
        + ' · ' + (l / 60n / 60n / 24n / 365n).toLocaleString(language_site, {style: "unit", unit: "year"}) + ' ' + (l / 60n / 60n / 24n % 365n).toLocaleString(language_site, {style: "unit", unit: "day"}) + ' ' + ("0" + (l / 60n / 60n % 24n)).slice(-2) + ':' + ("0" + (l / 60n % 60n)).slice(-2) + ':' + ("0" + (l % 60n)).slice(-2)
        + '</div><p>' + element[(language_site == "ru") ? 5 : 4] + '</p></div>';
    });
    $("#other_countdowns").html(other_counters_html)
}
var c = setInterval(Cycle, 1000 / 15);