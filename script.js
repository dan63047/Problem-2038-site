const maxtimestamp = 2147483647;
var readable_timer_mode = 0;
var msec_display = true;
var fullscreen = false;
const other_counters = [ // Title EN, Title RU, Start Unix timestamp, End Unix timestamp, Description EN, Description RU 
                        ["UNIX unsinged 32-bit timestamp", "UNIX 32 бита без знака", 0n, 4294967295n, "Developers of some systems have thought that singed 32-bit may not be enough and decided to use unsinged 32-bit.", "Разработчики некоторых систем додумались, что 32 бита со знаком однажды может не хватить и решили использовать 32 бита без знака."],
                        ["FAT filesystems timestamps", "Штампы времени файловой системы FAT", 315532800n, 4354819198n, "Four bytes are assigned to each timestamp: two for the date and two for the time. The year is stored in the last 7 bits in the format of the number of years since the beginning of the Microsoft era. Hence the range - from 1980 to 2107", "На каждую отметку времени отводится четыре байта: два - на дату и два - на время. Год хранится в последних 7 битах в формате количества лет от начала эпохи Microsoft. Отсюда и диапазон - от 1980 до 2107 года"],
                        ["ext4 Inode Timestamps", "Inode Timestamps файловой системы ext4", -2147483648n, 15032385535n, "Four timestamps are recorded in the lower 128 bytes of the inode structure -- inode change time (<code>ctime</code>), access time (<code>atime</code>), data modification time (<code>mtime</code>), and deletion time (<code>dtime</code>). The four fields are 32-bit signed integers that represent seconds since the Unix epoch (1970-01-01 00:00:00 GMT), which means that the fields will overflow in January 2038. If the inode structure size <code>sb->s_inode_size</code> is larger than 128 bytes and the <code>i_inode_extra</code> field is large enough to encompass the respective <code>i_[cma]time_extra</code> field, the ctime, atime, and mtime inode fields are widened to 64 bits. Within this \"extra\" 32-bit field, the lower two bits are used to extend the 32-bit seconds field to be 34 bit wide; the upper 30 bits are used to provide nanosecond timestamp accuracy. Therefore, timestamps should not overflow until May 2446. dtime was not widened.", "В нижних 128 байтах структуры индексного дескриптора записываются четыре метки времени: время изменения индексного дескриптора (<code>ctime</code>), время доступа (<code>atime</code>), время модификации данных (<code>mtime</code>) и время удаления (<code>dtime</code>). Четыре поля представляют собой 32-разрядные целые числа со знаком, представляющие секунды с эпохи Unix (1970-01-01 00:00:00 GMT), что означает, что поля будут переполнены в январе 2038 года. Если размер структуры inode <code>sb->s_inode_size</code> превышает 128 байт, а поле <code>i_inode_extra</code> достаточно велико, чтобы охватить соответствующее поле <code>i_[cma]time_extra</code>, поля ctime, atime и mtime inode расширяются до 64 бит. В этом «дополнительном» 32-битном поле младшие два бита используются для расширения 32-битного поля секунд до 34-бит; верхние 30 бит используются для обеспечения наносекундной точности отметки времени. Поэтому временные метки не должны переполняться до мая 2446 года. Время dtime не расширялось."],
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
const local_date_settings = {timeZone: 'UTC', weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', timeZoneName: 'short'};
var date_to_local = new Intl.DateTimeFormat(language_site, local_date_settings);
const local_relative_settings = {numeric: 'auto', style: 'long'};
var relative_to_local = new Intl.RelativeTimeFormat(language_site, local_relative_settings);
function ReadableTimerSwitcher(){
    readable_timer_mode++
    if(readable_timer_mode > 2){readable_timer_mode = 0}
}
addEventListener("fullscreenchange", (event) => {
    if(!fullscreen){
        document.querySelector("#style").attributes.href.value = "fullscreen-style.css";
        document.querySelector("#description_en").style = "display: none;";
        document.querySelector("#description_ru").style = "display: none;";
        fullscreen = true;
    }else{
        document.querySelector("#style").attributes.href.value = "style.css";
        languageSwitcher(language_site)
        fullscreen = false;
    }
})

function languageSwitcher(lang_code){
    counter_id = 0;
    switch (lang_code) {
        case "ru":
            document.querySelector("#title_en").style = "display: none;";
            document.querySelector("#title_ru").style = "display: block;";
            document.querySelector("#description_en").style = "display: none;";
            document.querySelector("#description_ru").style = "display: block;";
            document.querySelector("#me_tg_en").style = "display: none;";
            document.querySelector("#me_tg_ru").style = "display: block;";
            language_site = "ru";
            other_counters.forEach(element => {
                document.querySelector("#title_"+counter_id).innerHTML = element[1];
                document.querySelector("#desc_"+counter_id).innerHTML = element[5];
                counter_id++;
            });
            break;
        case "en":
            document.querySelector("#title_ru").style = "display: none;";
            document.querySelector("#title_en").style = "display: block;";
            document.querySelector("#description_ru").style = "display: none;";
            document.querySelector("#description_en").style = "display: block;";
            document.querySelector("#me_tg_ru").style = "display: none;";
            document.querySelector("#me_tg_en").style = "display: block;";
            other_counters.forEach(element => {
                document.querySelector("#title_"+counter_id).innerHTML = element[0];
                document.querySelector("#desc_"+counter_id).innerHTML = element[4];
                counter_id++
            });
            language_site = "en";
            break;
    }
    date_to_local = new Intl.DateTimeFormat(language_site, local_date_settings);
    relative_to_local = new Intl.RelativeTimeFormat(language_site, local_relative_settings);
}
function msecDisplaySwitcher(){
    if(msec_display){
        msec_display = false
        document.querySelector("#time-left-msec").style = "display: none;";
    }else{
        msec_display = true
        document.querySelector("#time-left-msec").style = "display: unset;";
    }
}
function SpawnOtherCounters(){
    let other_counters_html = (language_site == "ru") ? "<h3>Другие, более далёкие проблемы времени в вычислительной технике</h3>" : "<h3>Other, more distant time problems in computing</h3>";
    counter_id = 0;
    var timestamp = Date.now() / 1000;
    other_counters.forEach(element => {
        l = element[3] - BigInt(Math.trunc(timestamp));
        date_from = new Date(parseInt(element[2])*1000);
        try {
            date_from = date_to_local.format(date_from)
        } catch (e) {
            date_from = ((language_site == "ru") ? "Год " : "Year ") + ((element[2] / 60n / 60n / 24n / 365n) + 1970n).toLocaleString(language_site)
        }
        date_to = new Date(parseInt(element[3])*1000);
        try {
            date_to = date_to_local.format(date_to)
        } catch (e) {
            date_to = ((language_site == "ru") ? "Год " : "Year ") + ((element[3] / 60n / 60n / 24n / 365n) + 1970n).toLocaleString(language_site)
        }
        other_counters_html = other_counters_html + '<div id="other_counter"><h4 id="title_'+counter_id+'">'+ element[(language_site == "ru") ? 1 : 0] + '</h4><span style="font-size: 2rem; font-family: \'Eurostile Round Extended\'; overflow-wrap: break-word; text-align: center" id="main_cd_'+counter_id+'">'
        + l.toLocaleString(language_site) + '</span><table id="other_progress_'+counter_id+'"><tr><th>' + ((language_site == "ru") ? "От" : "From") +'</th><td>' + date_from + '</td></tr><tr><th>' + ((language_site == "ru") ? "До" : "Until") +'</th><td>' + date_to + '</td></tr><tr><th>' + ((language_site == "ru") ? "Прогресс" : "Progress") +'</th><td>' + ((timestamp-parseInt(element[2]))/(parseInt(element[3])-parseInt(element[2]))).toLocaleString(language_site, {style: "percent", minimumFractionDigits: 8}) + '</td></tr>'
        + '<tr><th>' + ((language_site == "ru") ? "Осталось" : "Left") +'</th><td>' + (l / 60n / 60n / 24n / 365n).toLocaleString(language_site, {style: "unit", unit: "year"}) + ' ' + (l / 60n / 60n / 24n % 365n).toLocaleString(language_site, {style: "unit", unit: "day"}) + ' ' + ("0" + (l / 60n / 60n % 24n)).slice(-2) + ':' + ("0" + (l / 60n % 60n)).slice(-2) + ':' + ("0" + (l % 60n)).slice(-2) + '</td></tr>'
        + '</table><p id="desc_'+ counter_id +'">' + element[(language_site == "ru") ? 5 : 4] + '</p></div>'; counter_id++;
    });
    document.querySelector("#other_countdowns").innerHTML = other_counters_html
}
SpawnOtherCounters();
languageSwitcher(language_site);
function Cycle() {
    var timestamp = Date.now() / 1000,
        left = maxtimestamp - timestamp,
        lmsec = Math.floor(left * 1000) % 1000,
        t = Math.floor(left);
    document.querySelector("#time-left").innerHTML = t.toLocaleString(language_site);
    document.querySelector("#time-left-msec").innerHTML =  "." + ("00" + lmsec).slice(-3);
    document.querySelector("#prog").value = timestamp;
    document.querySelector("#timestamp_ru").innerHTML = Math.trunc(timestamp).toLocaleString(language_site);
    document.querySelector("#timestamp_en").innerHTML = Math.trunc(timestamp).toLocaleString(language_site);
    if (left < 60 && readable_timer_mode != 2) { document.querySelector("#time-left-readable").style = "display: none;" }
    if (left <= 0) {
        clearInterval(c);
        document.querySelector("#time-left").innerHTML = "0";
        document.querySelector("#time-left-msec").innerHTML = ".000";
        document.querySelector("#title_ru").innerHTML = "С͓̪̩̳͕͍̄ͮͤ̚̚м̦͎͉̝̋̄е̥͕̫̫̱̱͓̞̾р̞̤̰͖̤̟̫͓̏̍͒ͣ͐͂̚ͅт̗̥̲̩̣̯̹̅ͅь̙͍̟̟̮̩̦̹ͩͤ";
        document.querySelector("#title_en").innerHTML = "D̴̠͆̉̑͑̏e̴̦͑́ǎ̷̯̟̳͙t̸̡͔̖̞̝͔̅͌̒̎̓͑͊ͅh̶͈̩̰͈̾̾̑̂̌̇̈́ͅ";
        document.title = (language_site == "ru" ? "С͓̪̩̳͕͍̄ͮͤ̚̚м̦͎͉̝̋̄е̥͕̫̫̱̱͓̞̾р̞̤̰͖̤̟̫͓̏̍͒ͣ͐͂̚ͅт̗̥̲̩̣̯̹̅ͅь̙͍̟̟̮̩̦̹ͩͤ" : "D̴̠͆̉̑͑̏e̴̦͑́ǎ̷̯̟̳͙t̸̡͔̖̞̝͔̅͌̒̎̓͑͊ͅh̶͈̩̰͈̾̾̑̂̌̇̈́ͅ");
        return;
    }
    var tsec = Math.floor(left % 60),
        tmin = Math.floor(left / 60) % 60,
        thour = Math.floor(left / 60 / 60) % 24,
        tday = Math.floor(left / 60 / 60 / 24) % 365,
        ttday = Math.floor(left / 60 / 60 / 24),
        ttmonth = Math.floor(left/ 60 / 60 / 24 / 30),
        tyear = Math.floor(left / 60 / 60 / 24 / 365);
    if (tyear > 0){
        document.title = (language_site == "ru" ? "Проблема 2038 года " : "Problem 2038 ") + relative_to_local.format(tyear, "year")
    }else if(ttmonth > 0){
        document.title = (language_site == "ru" ? "Проблема 2038 года " : "Problem 2038 ") + relative_to_local.format(ttmonth, "month")
    }else if(ttday > 0){
        document.title = (language_site == "ru" ? "Проблема 2038 года " : "Problem 2038 ") + relative_to_local.format(ttday, "day")
    }else if(thour > 0){
        document.title = (language_site == "ru" ? "Проблема 2038 года " : "Problem 2038 ") + relative_to_local.format(thour, "hour")
    }else if(tmin > 0){
        document.title = (language_site == "ru" ? "Проблема 2038 года " : "Problem 2038 ") + relative_to_local.format(tmin, "minute")
    }else{
        document.title = (language_site == "ru" ? "Проблема 2038 года " : "Problem 2038 ") + relative_to_local.format(tsec, "second")
    }
    switch (readable_timer_mode){
        case 0:
            document.querySelector("#time-left-readable").innerHTML = "(" + ttday + ":" + ("0" + thour).slice(-2) + ":" + ("0" + tmin).slice(-2) + ":" + ("0" + tsec).slice(-2) + ")";
        break;
        case 1:
            document.querySelector("#time-left-readable").innerHTML = "(" + tyear.toLocaleString(language_site, {style: "unit", unit: "year", unitDisplay: 'long'}) + " " + tday.toLocaleString(language_site, {style: "unit", unit: "day", unitDisplay: 'long'}) + " " + ("0" + thour).slice(-2) + ":" + ("0" + tmin).slice(-2) + ":" + ("0" + tsec).slice(-2) + ")";
        break;
        case 2:
            document.querySelector("#time-left-readable").innerHTML = Math.trunc(timestamp).toLocaleString(language_site)+" / "+maxtimestamp.toLocaleString(language_site)+" ("+(timestamp/maxtimestamp).toLocaleString(language_site, {style: "percent", minimumFractionDigits: 9})+")";
        break;
    }
}
function OtherCountersCycle(){
    counter_id = 0;
    var timestamp = Date.now() / 1000;
    other_counters.forEach(element => {
        l = element[3] - BigInt(Math.trunc(timestamp));
        date_from = new Date(parseInt(element[2])*1000);
        try {
            date_from = date_to_local.format(date_from)
        } catch (e) {
            date_to = ((language_site == "ru") ? "Год " : "Year ") + ((element[2] / 60n / 60n / 24n / 365n) + 1970n).toLocaleString(language_site)
        }
        date_to = new Date(parseInt(element[3])*1000);
        try {
            date_to = date_to_local.format(date_to)
        } catch (e) {
            date_to = ((language_site == "ru") ? "Год " : "Year ") + ((element[3] / 60n / 60n / 24n / 365n) + 1970n).toLocaleString(language_site)
        }
        document.querySelector("#main_cd_"+counter_id).innerHTML = l.toLocaleString(language_site);
        document.querySelector("#other_progress_"+counter_id).innerHTML = '<tr><th>' + ((language_site == "ru") ? "От" : "From") +'</th><td>' + date_from + '</td></tr><tr><th>' + ((language_site == "ru") ? "До" : "Until") +'</th><td>' + date_to + '</td></tr><tr><th>' + ((language_site == "ru") ? "Прогресс" : "Progress") +'</th><td>' + ((timestamp-parseInt(element[2]))/(parseInt(element[3])-parseInt(element[2]))).toLocaleString(language_site, {style: "percent", minimumFractionDigits: 9}) + '</td></tr>'
        + '<tr><th>' + ((language_site == "ru") ? "Осталось" : "Left") +'</th><td>' + (l / 60n / 60n / 24n / 365n).toLocaleString(language_site, {style: "unit", unit: "year"}) + ' ' + (l / 60n / 60n / 24n % 365n).toLocaleString(language_site, {style: "unit", unit: "day"}) + ' ' + ("0" + (l / 60n / 60n % 24n)).slice(-2) + ':' + ("0" + (l / 60n % 60n)).slice(-2) + ':' + ("0" + (l % 60n)).slice(-2) + '</td></tr>'
        counter_id++;
    });
}
var c = setInterval(Cycle, 1000 / 15);
var d = setInterval(OtherCountersCycle, 1000);