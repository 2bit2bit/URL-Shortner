const label = document.getElementById("label");
const clicks = document.getElementById("clicks");
const longUrl = document.getElementById("longUrl");
const shortUrl = document.getElementById("shortUrl");
const qrCode = document.getElementById("qrCode");

const deleteBtn = document.getElementById("deleteBtn");
const editBtn = document.getElementById("editBtn");

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

    if (responseStatus !== 200) {
      window.location.replace(`./error.html`);
    } else {
      shortUrl.innerHTML = `${host}/${responseData.shortId}`;
      label.innerHTML = responseData.label;
      clicks.innerHTML = responseData.clicks;
      longUrl.innerHTML = responseData.redirectUrl;
      qrCode.setAttribute("src", `${responseData.qrCode}`);
      if (!responseData.qrCode) {
        qrCode.setAttribute("src", `./img/qrcode.png`);
      }

      editBtn.addEventListener("click", () => {
        window.location.replace(`./update-url.html?urlId=${urlId}`);
      });
      deleteBtn.addEventListener("click", () => {
        deleteUrl();
      });

      setTimeout(() => {
        unshowLoading();
      }, 2000);
    }
  } catch (err) {
    console.log(err);
    unshowLoading();
  }
}

async function deleteUrl() {
  showLoading();
  try {
    const response = await fetch(host + `/user/url/${urlId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${document.cookie.split("=")[1]}`,
      },
    });

    const responseStatus = response.status;
    const responseData = await response.json();
    console.log(responseData, responseStatus);

    if (responseStatus !== 200) {
      window.location.replace(`./error.html`);
    } else {
      window.location.replace(`./dashboard.html`);
    }
  } catch (err) {
    console.log(err);
    window.location.replace(`./error.html`);
  }
}
