async function login(email, password) {
    const body = { email, password };
  
    try {
      const response = await fetch(host + `/user/urls`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
  
      const responseStatus = response.status;
      const responseData = await response.json();
  
    } catch (err) {
      unshowLoading();
    }
  }
  