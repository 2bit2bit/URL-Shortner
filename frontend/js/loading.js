const host = "http://localhost:8080";
function showLoading() {
  var windowWidth = 0;
  var windowHeight = 0;

  if (document.documentElement && document.documentElement.clientWidth)
    windowWidth = document.documentElement.clientWidth;
  else if (document.body && document.body.clientWidth)
    windowWidth = document.body.clientWidth;
  else if (document.body && document.body.offsetWidth)
    windowWidth = document.body.offsetWidth;
  else if (window.innerWidth) windowWidth = window.innerWidth - 18;

  if (document.documentElement && document.documentElement.clientHeight)
    windowHeight = document.documentElement.clientHeight;
  else if (document.body && document.body.clientHeight)
    windowHeight = document.body.clientHeight;
  else if (document.body && document.body.offsetHeight)
    windowHeight = document.body.offsetHeight;
  else if (window.innerHeight) windowHeight = window.innerHeight - 18;

  document.getElementById("blackOut").style.display = "block";
  var height = windowHeight + "px";
  document.getElementById("blackOut").style.height = height;
  document.getElementById("blackOut").style.width = windowWidth + "px";
}

function unshowLoading() {
  document.getElementById("blackOut").style.display = "none";
}
