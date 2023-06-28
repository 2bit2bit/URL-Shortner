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

    if (responseStatus === 404) {
      window.location.replace(`./404.html`);
    } else if (responseStatus == 200) {
      redirectUrl.setAttribute("value", responseData.redirectUrl);
      customUrl.setAttribute("value", responseData.shortId);
      label.setAttribute("value", responseData.label);
      unshowLoading();
    } else {
      window.location.replace(`./error.html`);
    }
  } catch (err) {
    console.log(err);
  }
}

updateBtn.addEventListener("click", (event) => {
  event.preventDefault();
  showLoading();
  create(redirectUrl.value, customUrl.value, label.value, QRcode.checked);
});

async function create(redirectUrl, customUrl, label, generateQR) {
  const body = { redirectUrl, customUrl, label, generateQR };
  console.log(body);
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

    if (responseStatus !== 201 && responseStatus !== 200 && responseStatus !== 500) {
      if (!responseData.data[0].msg) {
        responseErr.innerText = responseData.message;
      } else {
        responseErr.innerText = responseData.data[0].msg;
      }
      responseErr.style.visibility = "visible";
      unshowLoading();
    } else if (responseStatus === 201 || responseStatus === 200) {
      responseErr.innerText = responseData.message;
      responseErr.style.color = "green";
      responseErr.style.visibility = "visible";
      setTimeout(() => {
        unshowLoading();
        window.location.replace(`./url.html?urlId=${responseData.urlId}`);
      }, 1000);
    } else {
      window.location.replace(`./error.html`);
    }
  } catch (err) {
    unshowLoading();
  }
}
