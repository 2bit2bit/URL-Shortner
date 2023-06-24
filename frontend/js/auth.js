if (!document.cookie) {
  document.getElementById("dashboardBtn").style.display = "none";
  document.getElementById("dashboardBtnMobile").style.display = "none";
  document.getElementById("logoutBtn").style.display = "none";
  document.getElementById("logoutBtnMobile").style.display = "none";
} else {
  document.getElementById("loginBtn").style.display = "none";
  document.getElementById("loginBtnMobile").style.display = "none";
  document.getElementById("signupBtn").style.display = "none";
  document.getElementById("signupBtnMobile").style.display = "none";
}
