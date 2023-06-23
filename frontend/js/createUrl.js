const redirectUrl = document.getElementById("originalUrl");
const customUrl = document.getElementById("customUrl");
const label = document.getElementById("label");
const QRcode = document.getElementById("QRcode");
const createBtn = document.getElementById("create-btn");
const responseErr = document.getElementById("responseErr");

createBtn.addEventListener("click", (event) => {
  event.preventDefault();
  showLoading();
  create(redirectUrl.value, customUrl.value, label.value, QRcode.value);
});

async function create(redirectUrl, customUrl, label, QRcode) {
  const body = { redirectUrl, customUrl, label, QRcode };
  try {
    const response = await fetch(host + `/user/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${document.cookie.split("=")[1]}`,
      },
      body: JSON.stringify(body),
    });

    const responseStatus = response.status;
    const responseData = await response.json();
    // console.log(responseData, responseStatus);

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
