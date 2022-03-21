const UNITS = [101, 102, 103, 201, 202, 203, 205, 206, 207,
    301, 302, 303, 305, 306, 307, 401, 402, 403, 405, 406, 407, 501, 502, 503, 505,
    506, 507, 701, 702, 703, 705]

localStorage.setItem("202202gas",JSON.stringify([825,575,693,2074,857,517,901,935,394,1014,1532,557,595,1513,603,2666,700,2080,1325,450,578,1643,1329,875,351,98,1258,1573,1216,279,367]));
localStorage.setItem("202202elec",JSON.stringify([4953,7841,8251,9186,10389,7717,6709,8273,9025,7858,8421,6384,12569,9519,6840,6603,7009,15372,10612,6445,13433,6125,7193,12939,11953,11398,15242,12390,15102,10175,9675]));
localStorage.setItem("202203gas",JSON.stringify([830,611,965,2133,882,517,951,937,420,1040,1614,566,595,1514,603,2784,753,2092,1342,457,579,1643,1376,880,363,98,1265,1596,1255,279,398]));
localStorage.setItem("202203elec",JSON.stringify([4956,7862,8274,9232,10430,7725,6740,8273,9051,7907,8502,6457,12698,9658,6924,6630,7071,15415,10673,6448,13473,6142,7211,13027,12057,11464,15318,12523,15127,10254,9733]));
localStorage.setItem("202203",JSON.stringify([2350,356290,25090,201590,206570,217250,195890,156750,328370]));
localStorage.setItem("phonebooks",JSON.stringify(["01035371010","01025264824","01085681448","01066654957","01066114906","01034055305","01048135003","01075384908","01071717370","01075534221","01076786167","01053066396","01035401936","01023664095","01074534379","01028140574","01094146550","01068648161","01088336320","01026675227","01059568386","01093704142","01051978820","01084483627","01073938975","01025154814","01040000662","01031314411","01085698567","01023437870","01059199000"]));


function pass() {
    buildTable(document.getElementById('date').value, document.getElementById('type').value);
    document.getElementById("inputMeters").style.display="";
}

function buildTable(date, type) {
    var tableCaption = document.getElementById('tableCaption')
    tableCaption.innerHTML = date + " " + type

    var table = document.getElementById('tableMeter')
    var row = '';
    for (var i=0; i < UNITS.length; i++) { 
        row += `<tr> 
                <td>${UNITS[i]+'호'}</td> 
                <td><input type="number" id="${i}" size="20"></td> 
                </tr>` 
         
    }
    table.innerHTML = row;

    checkJSON(date, type);
}

function inputMeter() {
    var date = document.getElementById('date').value;
    var type = document.getElementById('type').value;
    var arr = [,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,];
    for (var i = 0; i < arr.length; i++) {
        arr[i] = parseInt(document.getElementById(i).value);
    }
    arr[30] = parseInt(document.getElementById(30).value);
    
    localStorage.setItem(date+type, JSON.stringify(arr));

    alert("입력완료!");

}

function checkJSON(date, type) {

    if(localStorage.getItem(date+type) !== null) {

        var usage = JSON.parse(localStorage.getItem(date+type));

        for(var i = 0; i < UNITS.length; i++) {
            document.getElementById(i).value = usage[i];
        }
        document.getElementById("30").value = usage[30];
    }

}

function dateChange(){
    if(document.getElementById('date').value !== "---") {
        var tableCaption = document.getElementById('tableCaption2')
        tableCaption.innerHTML = document.getElementById("date").value;
    
        for(var i = 0; i < 9; i++) {
            for(var i = 0; i < 9; i++) {
                document.getElementById(i).value = "";
            }
        }
    
        var date = document.getElementById('date').value;
    
        if(localStorage.getItem(date) !== null) {
    
            var a = JSON.parse(localStorage.getItem(date));
    
            for(var i = 0; i < 9; i++) {
                document.getElementById(i).value = a[i];
            }
        }
    
        document.getElementById("fullTable").style.display="";
    }
    else {
        document.getElementById("fullTable").style.display="none";
    }
    document.getElementById("resultDiv").style.display="none";

}
//0-전기사용량 1-전기요금  2,3,4,5,6,7-가스요금  8-수도요금
function inputFeeBtn() {
    var date = document.getElementById('date').value;
    var arr = [,,,,,,,,];
    for(var i = 0; i < arr.length; i++) {
        arr[i] = parseInt(document.getElementById(i). value);
    }
    arr[8] = parseInt(document.getElementById(8). value);
    localStorage.setItem(date, JSON.stringify(arr));
    alert("입력완료!");
    calcSetting(date);
}
//여기가 메인 계산하는곳!!
function calcSetting(date) {
    var a = JSON.parse(localStorage.getItem(date));
    var koreaElec = parseInt(a[0]);
    var totalElecFee = parseInt(a[1]);
    var gas = [,,,,,];
    var water = parseInt(a[8]);
    for(var i = 0; i < gas.length; i++) {
        gas[i] = parseInt(a[i+2]);
    }
    gas[5] = parseInt(a[7]);

    var elecUsage = [,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,];
    var gasUsage = [,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,];

    var prevDate = parseInt(date) - 1;
    if(prevDate % 100 == 0) {
        prevDate -= 88;
    }

    var prevElecJson = JSON.parse(localStorage.getItem(prevDate+"elec"));
    var currElecJson = JSON.parse(localStorage.getItem(date+"elec"));
    var prevGasJson = JSON.parse(localStorage.getItem(prevDate+"gas"));
    var currGasJson = JSON.parse(localStorage.getItem(date+"gas"));

    for(var i = 0; i < UNITS.length; i++) {
        elecUsage[i] = currElecJson[i] - prevElecJson[i];
        gasUsage[i] = currGasJson[i] - prevGasJson[i];
    }

    calcElec(elecUsage, koreaElec, totalElecFee, water);
    calcGas(gasUsage, gas);
    showResult(date);
}

var elecFee = [,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,];
function calcElec(elecUsage, koreaElec, totalElecFee, water) {
    var totalUsage = 0;
    for(var i = 0; i < UNITS.length; i++) {
        totalUsage += elecUsage[i];
    }
    var elecPublicUsage = koreaElec - totalUsage;
    
    
    for (var i = 0; i < UNITS.length; i++) {
        elecFee[i] = parseInt((((elecPublicUsage)/UNITS.length + elecUsage[i])/koreaElec) * totalElecFee);
    }

    for(var i = 0 ; i < UNITS.length; i++) {
        elecFee[i] += parseInt(elecUsage[i] / totalUsage * water);
        
    }
}

var gasFee = [,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,];
function calcGas(gasUsage, gas) {
    const NUM = [3, 6, 6, 6, 6, 4];
    var totalGasUsagePerFlour = [0,0,0,0,0,0];
    var cnt = 0;
    for(var i = 0; i < NUM.length; i++) {
        for(var j = 0; j < NUM[i]; j++) {
            gas[i] -= 5000;
            totalGasUsagePerFlour[i] += gasUsage[cnt];
            cnt++;
        }
    }
    //alert(gas);
    
    cnt = 0;
    for(var i = 0; i < NUM.length; i++) {
        for(var j = 0; j < NUM[i]; j++) {
            gasFee[cnt] = parseInt(gasUsage[cnt]/totalGasUsagePerFlour[i]*gas[i] + 5000);
            cnt++;
        }

    }
}

function showResult(date) {
    
    var phonebooks = JSON.parse(localStorage.getItem("phonebooks"));

    var table = document.getElementById('resultTable')
    var row = '';
    for (var i=0; i < UNITS.length; i++) { 
        row +=  `<tr> 
                    <td><a href="sms://${phonebooks[i]}?body=<<${UNITS[i]+'호'} ${parseInt(date)%100+"월"} 공과금 동인휴>> %0A전기: ${elecFee[i]+"원"} %0A난방+온수: ${gasFee[i]+"원"} %0A합계: ${(elecFee[i]+gasFee[i])+"원"} %0A신한은행 01035371010 동인휴로 입금 바랍니다.">${UNITS[i]+'호'}</a></td> 
                    <td>${elecFee[i]+'원'}</td>
                    <td>${gasFee[i]+'원'}</td> 
                    <td>${(elecFee[i] + gasFee[i])+'원'}</td>  
                   </tr>` 
        
    }
    table.innerHTML = row;

    document.getElementById("resultDiv").style.display = "";
}

function edit(){
    var phonebooks = [,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,];
    for(var i = 0; i < phonebooks.length; i++) {
        phonebooks[i] = document.getElementById(i+1).value;
    }
    phonebooks[30] = document.getElementById(31).value;
    localStorage.setItem("phonebooks", JSON.stringify(phonebooks));
    alert("수정완료!");
}