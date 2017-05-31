'use strict';
var BITTREX_URL = "https://bittrex.com";

chrome.runtime.onInstalled.addListener(function (details) {
    console.log('previousVersion', details.previousVersion);
});

// request permission on page load
document.addEventListener('DOMContentLoaded', function () {
    if (Notification.permission !== "granted")
        Notification.requestPermission();
});

function notifications(title, message) {
    if (Notification.permission !== "granted")
        Notification.requestPermission();
    else {
        var notification = new Notification(title, {
            type: "basic",
            icon: "images/icon_40.png",
            body: message
        });
    }
    notification.onclick = function () {
        alert("OK");
    };
}
function bittrex_call_api(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function (data) {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                var data = JSON.parse(xhr.responseText);
                callback(data);
            } else {
                callback(null);
            }
        }
    };
    xhr.open("GET", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send();
}


setInterval(function () {
    chrome.storage.sync.get("bittrex_notifications", function (obj) {
        bittrex_call_api(BITTREX_URL + "/api/v1.1/public/getmarketsummaries", function (data) {
            var list_items = data['result'];
            // Retrieve the object from storage
            var retrievedObject = localStorage.getItem('CoinVolumeObj');
            console.log("Now" + list_items.length);
            console.log("Old" + retrievedObject.length);
            for (var i = 0; i < list_items; i++) {
                for (var j = 0; j < retrievedObject.length; j++) {
                    if (list_items[i]['MarketName'] === retrievedObject[j]['MarketName']) {
                        console.log("1");
                        /*                        if (list_items[i]['BaseVolume'] / retrievedObject[j]['BaseVolume'] == 1) {
                         var name_coin = list_items[i]['MarketName'];
                         var message = "BaseVolume" + list_items[i]['BaseVolume'] + "OpenBuyOrders:" + list_items[i]['OpenBuyOrders'];
                         //notifications(name_coin, message);
                         }*/
                    }
                }
            }
            // Put the object into storage
            localStorage.setItem('CoinVolumeObj', list_items);
            Storage.prototype.setObject = function(key, value) {
                this.setItem(key, JSON.stringify(value));
            }
        })
    });

}, 30000);