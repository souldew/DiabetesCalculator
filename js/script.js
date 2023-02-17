function calc(){
    // 日付の計算
    let necessary_day = document.getElementById("days-until").innerHTML;
    let spare_day = document.getElementById("spareday").value;

    // 詳細必要数を計算
    let items = [
        "alcohol",
        "glucose-needle",
        "LFS",
        "insulin-needle",
    ];
    let insulins = [
        "fast-acting-insulin",
        "long-acting-insulin",
    ];
    // インスリン以外の計算
    for (let i = 0; i < items.length; i++) {
        let item = items[i];
        let remaining = document.getElementsByClassName("remaining-wrap")[0].getElementsByClassName(item)[0].value;
        let day_use = document.getElementsByClassName("oneday-use-wrap")[0].getElementsByClassName(item)[0].value;
        let minimum_recieved = parseInt(document.getElementsByClassName("oneday-use-wrap")[0].getElementsByClassName(item)[1].value);

        // 最低必要数
        let hituyousuu = parseInt(necessary_day)*parseInt(day_use) - parseInt(remaining);
        document.getElementsByClassName("necessary-unit-wrap")[0].getElementsByClassName(item)[0].innerHTML = hituyousuu;
        // 最低数+予備
        hituyousuu = (parseInt(necessary_day)+parseInt(spare_day))*parseInt(day_use) - parseInt(remaining);
        document.getElementsByClassName("necessary-unit-wrap")[0].getElementsByClassName(item)[1].innerHTML = hituyousuu;

        // もらう量を変更
        document.getElementsByClassName("received-wrap")[0].getElementsByClassName(item)[0].innerHTML = hituyousuu;
        let gairyou = parseInt(parseInt(hituyousuu) / parseInt(minimum_recieved))*parseInt(minimum_recieved) + parseInt(minimum_recieved);
        document.getElementsByClassName("received-wrap")[0].getElementsByClassName(item)[1].innerHTML = gairyou;
    }
    // インスリンの計算
    for (let i = 0; i < insulins.length; i++) {
        let item = insulins[i];
        let remaining = document.getElementsByClassName("remaining-wrap")[0].getElementsByClassName(item)[0].value;
        let day_use = document.getElementsByClassName("oneday-use-wrap")[0].getElementsByClassName(item)[0].innerHTML;
        let minimum_recieved = parseInt(document.getElementsByClassName("oneday-use-wrap")[0].getElementsByClassName(item)[1].value);

        //最低必要数
        let hituyousuu = parseFloat((parseInt(necessary_day)*parseInt(day_use) - parseInt(remaining)*parseInt(minimum_recieved)) / parseInt(minimum_recieved));
        hituyousuu = Math.floor(hituyousuu * 100) / 100 // 小数点第2以下切り捨て
        document.getElementsByClassName("necessary-unit-wrap")[0].getElementsByClassName(item)[0].innerHTML = hituyousuu;

        //最低数+予備
        hituyousuu = parseFloat(((parseInt(necessary_day)+parseInt(spare_day))*parseInt(day_use) - parseInt(remaining)*parseInt(minimum_recieved)) / parseInt(minimum_recieved));
        hituyousuu = Math.floor(hituyousuu * 100) / 100 // 小数点第2以下切り捨て
        document.getElementsByClassName("necessary-unit-wrap")[0].getElementsByClassName(item)[1].innerHTML = hituyousuu;

        // もらう量を変更
        document.getElementsByClassName("received-wrap")[0].getElementsByClassName(item)[0].innerHTML = hituyousuu;
        let gairyou = parseInt(hituyousuu)+1;
        document.getElementsByClassName("received-wrap")[0].getElementsByClassName(item)[1].innerHTML = gairyou;
    }
}

function calc_days_until(){
    let last = new Date(document.getElementById("nextday").value);
    let start = new Date(document.getElementById("today").value);

    let diff = last.getTime() - start.getTime();
    let diff_day = diff / (1000*60*60*24);

    document.getElementById("days-until").innerHTML = diff_day;
}

function calc_insulin(classname){
    let used_insulin_lst = document.getElementsByClassName("insulin-wrap")[0].getElementsByClassName("day-use-" + classname);
    let ans = 0
    for (let i = 0; i < 3; i++) {
        let value = used_insulin_lst[i].value;
        if (value == 0) {
            continue
        }
        ans += parseInt(value) + parseInt(used_insulin_lst[3].value)
    }
    document.body.getElementsByClassName("oneday-use-wrap")[0].getElementsByClassName(classname)[0].innerHTML = ans;
}

function save_cookie(){
    let items = [
        "alcohol",
        "glucose-needle",
        "LFS",
        "insulin-needle",
        "fast-acting-insulin",
        "long-acting-insulin"
    ];
    let cookie_info = "SameSite=strict; Secure; Expires=Thu, 01 Jan 2099 00:00:00 GMT";

    // 残数
    let lst = document.getElementsByClassName("remaining-wrap")[0].getElementsByTagName("input");
    for (let i = 0; i < items.length; i++) {
        let value = lst[i].value;
        let str = `remaining-${items[i]}=${value}; ${cookie_info}`;
        document.cookie = str;
    }

    // 予備日
    do{
        let value = document.getElementById("spareday").value;
        let str = `spareday=${value}; ${cookie_info}`;
        document.cookie = str;
    } while(0);

    // インスリン1日使用量
    let insulins = ["fast-acting-insulin", "long-acting-insulin"];
    insulins.forEach(insulin => {
        lst = document.getElementsByClassName("insulin-wrap")[0].getElementsByClassName(`day-use-${insulin}`);
        for (let i = 0; i < lst.length; i++){
            let value = lst[i].value;
            let str = `day-use-${insulin}_${i}=${value}; ${cookie_info}`;
            document.cookie = str;
        }
    });

    // 1日使用量・最小受け取り単位
    lst = document.getElementsByClassName("oneday-use-wrap")[0].getElementsByTagName("input");
    let input_i = 0;
    for (let item_i = 0; item_i < items.length; item_i++){
        let item = items[item_i];
        if (!insulins.includes(item)) {
            let value = lst[input_i].value;
            let str = `oneday-use-${item}=${value}; ${cookie_info}`;
            document.cookie = str;
            input_i++;
        }
        let value = lst[input_i].value;
        let str = `min-${item}=${value}; ${cookie_info}`;
        document.cookie = str;
        input_i++;
    }
}

function load_cookie(){
    // cookie読み込み
    let cookiesStr = document.cookie;
    let cookieItems = cookiesStr.split(";");
    let cookies = {};
    for (let i = 0; i < cookieItems.length; i++) {
        let elem = cookieItems[i].split("=");
        elem[0] = elem[0].trim();
        elem[1] = elem[1].trim();
        cookies[elem[0]] = elem[1];
    }

    // 残数
    let items = [
        "alcohol",
        "glucose-needle",
        "LFS",
        "insulin-needle",
        "fast-acting-insulin",
        "long-acting-insulin"
    ];
    let lst = document.getElementsByClassName("remaining-wrap")[0].getElementsByTagName("input");
    for (let i = 0; i < items.length; i++) {
        let str = `remaining-${items[i]}`;
        lst[i].value = cookies[str];
    }

    // 予備日
    do{
        let value = document.getElementById("spareday");
        let str = `spareday`;
        value.value = cookies[str];
    } while(0);

    // インスリン1日使用量
    let insulins = ["fast-acting-insulin", "long-acting-insulin"];
    insulins.forEach(insulin => {
        lst = document.getElementsByClassName("insulin-wrap")[0].getElementsByClassName(`day-use-${insulin}`);
        for (let i = 0; i < lst.length; i++){
            let value = lst[i];
            let str = `day-use-${insulin}_${i}`;
            value.value = cookies[str];
        }
    });

    // 1日使用量・最小受け取り単位
    lst = document.getElementsByClassName("oneday-use-wrap")[0].getElementsByTagName("input");
    let input_i = 0;
    for (let item_i = 0; item_i < items.length; item_i++){
        let item = items[item_i];
        if (!insulins.includes(item)) {
            let value = lst[input_i];
            let str = `oneday-use-${item}`;
            value.value = cookies[str];
            input_i++;
        }
        let value = lst[input_i];
        let str = `min-${item}`;
        value.value = cookies[str];
        input_i++;
    }

}

// 読み込み実行
// 日付の初期化
var date = new Date();

var yyyy = date.getFullYear();
var mm = ("0"+(date.getMonth()+1)).slice(-2);
var dd = ("0"+date.getDate()).slice(-2);

document.getElementById("today").value=yyyy+'-'+mm+'-'+dd;
document.getElementById("nextday").value=yyyy+'-'+mm+'-'+dd;
let last = new Date(document.getElementById("nextday").value);
let start = new Date(document.getElementById("today").value);

let diff = last.getTime() - start.getTime();
let diff_day = diff / (1000*60*60*24);

document.getElementById("days-until").innerHTML = diff_day;

// インスリン1日使用量の初期化
calc_insulin("fast-acting-insulin");
calc_insulin("long-acting-insulin");

load_cookie();