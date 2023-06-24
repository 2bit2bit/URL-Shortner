const redirectUrl = document.getElementById("originalUrl");
const customUrl = document.getElementById("customUrl");
const label = document.getElementById("label");
const QRcode = document.getElementById("QRcode");
const updateBtn = document.getElementById("update-btn");
const responseErr = document.getElementById("responseErr");

let urlId = window.location.href.split("?")[1].split("=")[1];
getUrlData();

async function getUrlData() {
  showLoading();
  try {
    const response = await fetch(host + `/user/url/${urlId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${document.cookie.split("=")[1]}`,
      },
    });

    const responseStatus = response.status;
    const responseData = (await response.json()).url;
    console.log(responseData, responseStatus);

    redirectUrl.setAttribute("value", responseData.redirectUrl) ;
    customUrl.setAttribute("value", responseData.shortId)
    label.setAttribute("value", responseData.label)
    unshowLoading();
  } catch (err) {
    console.log(err);
  }
}

updateBtn.addEventListener("click", (event) => {
  event.preventDefault();
  showLoading();
  create(redirectUrl.value, customUrl.value, label.value, QRcode.value);
});

async function create(redirectUrl, customUrl, label, generateQR) {
  const body = { redirectUrl, customUrl, label, generateQR };
  console.log(body)
  try {
    const response = await fetch(host + `/user/url/${urlId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${document.cookie.split("=")[1]}`,
      },
      body: JSON.stringify(body),
    });

    const responseStatus = response.status;
    const responseData = await response.json();
    console.log(responseData, responseStatus);

    if (responseStatus !== 200) {
      responseErr.innerText = responseData.data[0].msg;
      responseErr.style.visibility = "visible";
      unshowLoading();
    } else {
      responseErr.innerText = responseData.message;
      responseErr.style.color = "green";
      responseErr.style.visibility = "visible";
      setTimeout(() => {
        unshowLoading();
        window.location.replace(`./url.html?urlId=${responseData.urlId}`);
      }, 2000);
    }
  } catch (err) {
    unshowLoading();
  }
}
