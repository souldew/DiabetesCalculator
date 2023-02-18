function calcNecessaryDrug(){
    // 日付の計算
    let necessaryDay = document.getElementById("days-until").innerHTML;
    let spareday = document.getElementById("spareday").value;

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
        let dayUse = document.getElementsByClassName("oneday-use-wrap")[0].getElementsByClassName(item)[0].value;
        let minimumRecieved = parseInt(document.getElementsByClassName("oneday-use-wrap")[0].getElementsByClassName(item)[1].value);

        // 最低必要数
        let necessaryNum = parseInt(necessaryDay)*parseInt(dayUse) - parseInt(remaining);
        document.getElementsByClassName("necessary-unit-wrap")[0].getElementsByClassName(item)[0].innerHTML = necessaryNum;
        // 最低数+予備
        necessaryNum = (parseInt(necessaryDay)+parseInt(spareday))*parseInt(dayUse) - parseInt(remaining);
        document.getElementsByClassName("necessary-unit-wrap")[0].getElementsByClassName(item)[1].innerHTML = necessaryNum;

        // もらう量を変更
        document.getElementsByClassName("received-wrap")[0].getElementsByClassName(item)[0].innerHTML = necessaryNum;
        let approximateNum = parseInt(parseInt(necessaryNum) / parseInt(minimumRecieved))*parseInt(minimumRecieved) + parseInt(minimumRecieved);
        document.getElementsByClassName("received-wrap")[0].getElementsByClassName(item)[1].innerHTML = approximateNum;
    }
    // インスリンの計算
    for (let i = 0; i < insulins.length; i++) {
        let item = insulins[i];
        let remaining = document.getElementsByClassName("remaining-wrap")[0].getElementsByClassName(item)[0].value;
        let dayUse = document.getElementsByClassName("oneday-use-wrap")[0].getElementsByClassName(item)[0].innerHTML;
        let minimumRecieved = parseInt(document.getElementsByClassName("oneday-use-wrap")[0].getElementsByClassName(item)[1].value);

        //最低必要数
        let necessaryNum = parseFloat((parseInt(necessaryDay)*parseInt(dayUse) - parseInt(remaining)*parseInt(minimumRecieved)) / parseInt(minimumRecieved));
        necessaryNum = Math.floor(necessaryNum * 100) / 100 // 小数点第2以下切り捨て
        document.getElementsByClassName("necessary-unit-wrap")[0].getElementsByClassName(item)[0].innerHTML = necessaryNum;

        //最低数+予備
        necessaryNum = parseFloat(((parseInt(necessaryDay)+parseInt(spareday))*parseInt(dayUse) - parseInt(remaining)*parseInt(minimumRecieved)) / parseInt(minimumRecieved));
        necessaryNum = Math.floor(necessaryNum * 100) / 100 // 小数点第2以下切り捨て
        document.getElementsByClassName("necessary-unit-wrap")[0].getElementsByClassName(item)[1].innerHTML = necessaryNum;

        // もらう量を変更
        document.getElementsByClassName("received-wrap")[0].getElementsByClassName(item)[0].innerHTML = necessaryNum;
        let approximateNum = parseInt(necessaryNum)+1;
        document.getElementsByClassName("received-wrap")[0].getElementsByClassName(item)[1].innerHTML = approximateNum;
    }
}

function calcDaysUntil(){
    let last = new Date(document.getElementById("nextday").value);
    let start = new Date(document.getElementById("today").value);

    let diff = last.getTime() - start.getTime();
    let diffDay = diff / (1000*60*60*24);

    document.getElementById("days-until").innerHTML = diffDay;
}

function calcInsulin(classname){
    let usedInsulinLst = document.getElementsByClassName("insulin-wrap")[0].getElementsByClassName("day-use-" + classname);
    let ans = 0
    for (let i = 0; i < 3; i++) {
        let value = usedInsulinLst[i].value;
        if (value == 0) {
            continue
        }
        ans += parseInt(value) + parseInt(usedInsulinLst[3].value)
    }
    document.body.getElementsByClassName("oneday-use-wrap")[0].getElementsByClassName(classname)[0].innerHTML = ans;
}

function saveCookie(){
    let items = [
        "alcohol",
        "glucose-needle",
        "LFS",
        "insulin-needle",
        "fast-acting-insulin",
        "long-acting-insulin"
    ];
    let cookieInfo = "SameSite=strict; Secure; Expires=Thu, 01 Jan 2099 00:00:00 GMT";

    // 残数
    let lst = document.getElementsByClassName("remaining-wrap")[0].getElementsByTagName("input");
    for (let i = 0; i < items.length; i++) {
        let value = lst[i].value;
        let str = `remaining-${items[i]}=${value}; ${cookieInfo}`;
        document.cookie = str;
    }

    // 予備日
    do{
        let value = document.getElementById("spareday").value;
        let str = `spareday=${value}; ${cookieInfo}`;
        document.cookie = str;
    } while(0);

    // インスリン1日使用量
    let insulins = ["fast-acting-insulin", "long-acting-insulin"];
    insulins.forEach(insulin => {
        lst = document.getElementsByClassName("insulin-wrap")[0].getElementsByClassName(`day-use-${insulin}`);
        for (let i = 0; i < lst.length; i++){
            let value = lst[i].value;
            let str = `day-use-${insulin}_${i}=${value}; ${cookieInfo}`;
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
            let str = `oneday-use-${item}=${value}; ${cookieInfo}`;
            document.cookie = str;
            input_i++;
        }
        let value = lst[input_i].value;
        let str = `min-${item}=${value}; ${cookieInfo}`;
        document.cookie = str;
        input_i++;
    }
    alert("保存しました");
}

function loadCookie(){
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
let diffDay = diff / (1000*60*60*24);

document.getElementById("days-until").innerHTML = diffDay;

// Cookie読み込み
loadCookie();
// インスリン1日使用量の初期化
calcInsulin("fast-acting-insulin");
calcInsulin("long-acting-insulin");
