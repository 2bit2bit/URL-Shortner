const redirectUrl = document.getElementById("originalUrl");
const customUrl = document.getElementById("customUrl");
const label = document.getElementById("label");
const QRcode = document.getElementById("QRcode");
const createBtn = document.getElementById("create-btn");
const responseErr = document.getElementById("responseErr");

createBtn.addEventListener("click", (event) => {
  event.preventDefault();
  showLoading();
  create(redirectUrl.value, customUrl.value, label.value, QRcode.checked);
});

async function create(redirectUrl, customUrl, label, generateQR) {
  const body = { redirectUrl, customUrl, label, generateQR };
  console.log(body);
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

    if (responseStatus !== 201 && responseStatus !== 200) {
      if (!responseData.data[0].msg) {
        responseErr.innerText = responseData.message;
      } else {
        responseErr.innerText = responseData.data[0].msg;
      }
      responseErr.style.visibility = "visible";
      unshowLoading();
    } else if (responseStatus === 201 || responseStatus === 200 && responseStatus !== 500) {
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
