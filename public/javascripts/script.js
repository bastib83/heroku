/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function notifyMe() {
  if (!("Notification" in window)) {
    alert("This browser does not support desktop notification");
  }
  else if (Notification.permission === "granted") {
        var options = {
                body: "This is the body of the notification1",
                icon: "icon.jpg",
                dir : "ltr"
             };
          var notification = new Notification("Hi there",options);
  }
  else if (Notification.permission !== 'denied') {
    Notification.requestPermission(function (permission) {
      if (!('permission' in Notification)) {
        Notification.permission = permission;
      }
   
      if (permission === "granted") {
        var options = {
              body: "This is the body of the notification2",
              icon: "icon.jpg",
              dir : "ltr"
          };
        var notification = new Notification("Hi there",options);
      }
    });
  }
}

function loaderTimeout() {
    var myVar = setTimeout(showPage, 0000);
}

function showPage() {
  document.getElementById("loader").style.display = "none";
  document.getElementById("main").style.display = "block";
}