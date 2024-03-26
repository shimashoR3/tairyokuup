const time = document.getElementById('time');
const startButton = document.getElementById('start');
const stopButton = document.getElementById('stop');
const resetButton = document.getElementById('reset');

// 開始時間
let startTime;
// 停止時間
let stopTime = 0;
// タイムアウトID
let timeoutID;

// 時間を表示する関数
function displayTime() {
  const currentTime = new Date(Date.now() - startTime + stopTime);
  const h = String(currentTime.getHours()-1).padStart(2, '0');
  const m = String(currentTime.getMinutes()).padStart(2, '0');
  const s = String(currentTime.getSeconds()).padStart(2, '0');
  const ms = String(currentTime.getMilliseconds()).padStart(3, '0');

  time.textContent = `${h}:${m}:${s}.${ms}`;
  timeoutID = setTimeout(displayTime, 10);
}

// スタートボタンがクリックされたら時間を進める
startButton.addEventListener('click', () => {
  startButton.disabled = true;
  stopButton.disabled = false;
  resetButton.disabled = true;
  startTime = Date.now();
  displayTime();
});

// ストップボタンがクリックされたら時間を止める
stopButton.addEventListener('click', function() {
  startButton.disabled = false;
  stopButton.disabled = true;
  resetButton.disabled = false;
  clearTimeout(timeoutID);
  stopTime += (Date.now() - startTime);
});

// リセットボタンがクリックされたら時間を0に戻す
resetButton.addEventListener('click', function() {
  startButton.disabled = false;
  stopButton.disabled = true;
  resetButton.disabled = true;
  time.textContent = '00:00:00.000';
  stopTime = 0;
});

setInterval(showRestTime, 1000);

var Main = (function() {
    var url = {
        "productUrl" : "/api/v1/product"
    }

    var productModel = {
        productId : 0,
        productName : "",
        set : function() {
            this.productId = document.getElementById("productId").value;
            this.productName = document.getElementById("productName").value;
        }
    }

    var view = {
        render : function(data) {
            document.getElementById("data").textContent = JSON.stringify(data);
        }
    }

    var service = {
        search : function() {
            return fetch(url.productUrl).then(function(response) {
                return response.json();
            });
        },
        add : function(data) {
            return fetch(url.productUrl, {
                method : 'post',
                headers : new Headers({
                    "Content-type": "application/json"
                }),
                body : data
            })
        }
    }

    return {
        init : function() {
            service.search().then(function(json) {
                view.render(json);
            });

            var submitDom = document.getElementById("submit");
            submitDom.addEventListener("click", function() {
                productModel.set();
                var data = JSON.stringify(productModel);
                service.add(data).then(function(res) {
                    if (res.ok) {
                        service.search().then(function(json) {
                            view.render(json);
                        });
                    } else {
                        window.alert("error occured");
                    }
                })
            });
        }
    }
})();

Main.init();


