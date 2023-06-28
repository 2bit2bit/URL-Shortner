const label = document.getElementById("label");
const clicks = document.getElementById("clicks");
const longUrl = document.getElementById("longUrl");
const shortUrl = document.getElementById("shortUrl");
const qrCode = document.getElementById("qrCode");
const downloadQrCode = document.getElementById("download_qr");

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

    if (responseStatus === 404) {
      window.location.replace(`./404.html`);
    } else if (responseStatus == 200) {
      shortUrl.innerHTML = `${host.split(".")[1]}.${host.split(".")[2]}/${
        responseData.shortId
      }`;
      label.innerHTML = responseData.label;
      clicks.innerHTML = responseData.clicks;
      longUrl.innerHTML = responseData.redirectUrl;
      qrCode.setAttribute("src", `${responseData.qrCode}`);
      downloadQrCode.setAttribute("href", `${responseData.qrCode}`);
      if (!responseData.qrCode) {
        qrCode.setAttribute("src", `./img/qrcode.png`);
      }

      editBtn.addEventListener("click", () => {
        window.location.replace(`./update-url.html?urlId=${urlId}`);
      });
      deleteBtn.addEventListener("click", () => {
        deleteUrl();
      });

      getAnalyticsData(responseData.analytics);

      setTimeout(() => {
        unshowLoading();
      }, 2000);
    } else {
      window.location.replace(`./error.html`);
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

function getAnalyticsData(data) {
  const location = {};
  const device = {};

  data.forEach((item) => {
    device[item.device] = (device[item.device] || 0) + 1;
    location[item.country] = (location[item.country] || 0) + 1;
  });

  const clicksByDevice = document.getElementById("clicksByDevice");
  const clicksByLocation = document.getElementById("clicksByLocation");


  for (const key in device) {
    const li = document.createElement("li");
    li.innerHTML = `${key}: ${(device[key]/data.length*100).toFixed(1)}%`;
    clicksByDevice.appendChild(li);
  }

  for (const key in location) {
    const li = document.createElement("li");
    li.innerHTML = `${key}: ${(location[key]/data.length*100).toFixed(1)}%`;
    clicksByLocation.appendChild(li);
  }

  // if (device.length !== 0) {
  //   device.forEach((item) => {
  //     console.log(item);
  //     // const li = document.createElement("li");
  //     // li.innerHTML = `${item}`;
  //     // clicksByDevice.appendChild(li);
  //   });
  // }
  // console.log(location, device);
}
