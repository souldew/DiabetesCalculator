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