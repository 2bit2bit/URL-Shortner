const email = document.getElementById("email");
const password = document.getElementById("psw");
const signUpBtn = document.getElementById("sign-up_btn");
const responseErr = document.getElementById("responseErr");

signUpBtn.addEventListener("click", (event) => {
  event.preventDefault();
  showLoading();
  signUp(email.value, password.value);
});

async function signUp(email, password) {
  const body = { email, password };

  try {
    const response = await fetch(host + `/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const responseStatus = response.status;
    const responseData = await response.json();

    if (responseStatus !== 201) {
      responseErr.innerText = responseData.data[0].msg;
      responseErr.style.visibility = "visible";
      unshowLoading();
    } else {
      responseErr.innerText = "Account created, login to start";
      responseErr.style.color = "green";
      responseErr.style.visibility = "visible";
      setTimeout(() => {
        unshowLoading();
        window.location.replace("./login.html");
      }, 2000);
    }
  } catch (err) {
    responseErr.innerText = "Network Error! connect to Internet and Try again";
    responseErr.style.visibility = "visible";
    unshowLoading();
  }
}

// async function login(email, password) {
//   const body = { email, password };

//   try {
//     const response = await fetch(host + `/auth/login`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(body),
//     });

//     const responseStatus = response.status;
//     const responseData = await response.json();

//     if (responseStatus !== 200) {
//       responseErr.innerText = responseData.data[0].msg;
//       responseErr.style.visibility = "visible";
//       unshowLoading();
//     } else {
//       //save token in cookies
//       responseErr.innerText = "Logging you in...";
//       responseErr.style.color = "green";
//       responseErr.style.visibility = "visible";
//       setTimeout(() => {
//         unshowLoading();
//         window.location.replace("./dashboard.html");
//       }, 2000);
//     }
//   } catch (err) {
//     responseErr.innerText = "Network Error! connect to Internet and Try again";
//     responseErr.style.visibility = "visible";
//     unshowLoading();
//   }
// }
