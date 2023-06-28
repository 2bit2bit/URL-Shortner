const urlList = document.getElementById("urlList");

showUrl();

async function showUrl() {
  showLoading();
  try {
    const response = await fetch(host + `/user/url`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${document.cookie.split("=")[1]}`,
      },
    });

    const responseStatus = response.status;
    const responseData = (await response.json()).Urls;

    console.log(responseData, responseStatus);
    
    responseData.forEach((url) => {
      console.log(url);
      createUrlElement(url);
    });
    unshowLoading();
  } catch (err) {
    // window.location.href = "./error.html";
    console.log(err);
  }
}

function createUrlElement(url) {
  const el = document.createElement("a");
  el.setAttribute("href", `./url.html?urlId=${url._id}`);

  const li = document.createElement("li");

  const label = document.createElement("h4");
  label.innerHTML = `${url.label}`;

  const shortUrl = document.createElement("h4");  
  shortUrl.innerHTML = `${host.split('.')[1]}.${host.split('.')[2]}/${url.shortId}`;

  const date = document.createElement("h5");
  date.innerHTML = `${url.createdAt.split("T")[0]}`;

  const clicks = document.createElement("h5");
  clicks.innerHTML = `Clicks: ${url.clicks}`;

  const div1 = document.createElement("div");
  div1.appendChild(label);
  div1.appendChild(shortUrl);

  const div2 = document.createElement("div");
  div2.appendChild(date);
  div2.appendChild(clicks);

  li.appendChild(div1);
  li.appendChild(div2);
  el.appendChild(li);
  urlList.appendChild(el);
}
