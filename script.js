"use strict";
const form = document.getElementById("form");
const input_placeholder = document.querySelectorAll(".input-placeholder");
const output = document.getElementById("output");
const input = document.querySelectorAll(".input");
const styleTimeout = (func, time = 300) => new Promise(resolve => {
  setTimeout(() => {
    if (typeof func === "function") {
      func();
    }
    resolve();
  }, time)
});
// Style
setTimeout(() => {

  form.style.marginTop = "0pc";
  (
    async function () {
      for (let c = 0; c < input_placeholder.length; c++) {
        await styleTimeout(() => {
          input_placeholder[c].style.rotate = "0deg"
        })
      }
    }
  )()
}, 1000);
// clear input value
function clearValue() {
  input.forEach(v => v.value = "");
}
clearValue();
// Pre Fill Form ?
{
  const search = new URLSearchParams(location.search);
  const hire = search.get("hire");
  const referral_code = search.get("refcode");
  input[2].value = referral_code;
  switch (hire) {
    case "frontend":
    case "backend":
    case "fullstack":
    case "seo":
      input[4].value = hire;
  }
}
// Form Valid Chack
function email_mobileNo_isValid(email, mobile_no) {
  if ((email.lastIndexOf(".") === -1 || email.lastIndexOf("@") === -1) || email.lastIndexOf("@") > email.lastIndexOf(".")) {
    return "email";
  }
  if (mobile_no.length !== 10 || isNaN(+mobile_no)) {
    return "mobile";
  }
  return;
}
// output design
function outputDesign(text) {
  switch (text) {
    case "Hire Message Send":
      output.children[0].src = "./img/hire_message_send.svg";
      break;
    case "Try Again":
      output.children[0].src = "./img/try_again.svg";

  }
  (
    async function () {
      await styleTimeout(() => {
        form.style.marginTop = "60pc";
      }, 800);
      await styleTimeout(() => {
        form.style.display = "none";
      }, 800);
      await styleTimeout(() => {
        output.style.display = "block";
      }, 800);
      await styleTimeout(() => {
        output.style.marginTop = "2pc";
      }, 800);
    }
  )()
}
// Form Submit
function formSubmit() {
  let count = -1;
  const userInfo = {
    name: input[0].value,
    email: input[1].value,
    referral_code: input[2].value,
    mobile_no: input[3].value,
    hire_for: input[4].value,
    website_details: input[5].value
  }
  const isValid = email_mobileNo_isValid(userInfo.email, userInfo.mobile_no);
  switch (isValid) {
    case "mobile":
      userInfo.mobile_no = "";
      break;
    case "email":
      userInfo.email = "";
      break;
  }

  for (let c = 0; c < 6; c++) {
    const notValidStyle = input[c].parentNode.style;
    notValidStyle.background = "#cc00ff88";
  }

  for (let i in userInfo) {
    count++;
    if (count === 2) {
      continue;
    }
    const notValidStyle = input[count].parentNode.style;
    if (userInfo[i] === "") {
      notValidStyle.background = "red";
      setTimeout(() => {
        notValidStyle.background = "#cc00ff88";
      }, 4500);
      if (count < 3) {
        window.location.href = "#form";
      }
      return;
    }
  }

  // action
  const submissionUrl = encodeURI(`https://docs.google.com/forms/d/e/1FAIpQLSdbQrpwMaQDPfxV_hBV56uHb1au_Js_epAoDe1BTuqCH0157A/formResponse?usp=pp_url&entry.816456452=${userInfo.name}&entry.1845358950=${userInfo.email}&entry.1081442022=${userInfo.mobile_no}&entry.1410788869=${userInfo.referral_code}&entry.1333368811=${userInfo.hire_for}&entry.2105424427=${userInfo.website_details}`);

  fetch(submissionUrl, {
    method: 'GET',
    mode: 'no-cors'
  })
    .then(() => {
      outputDesign("Hire Message Send");
    })
    .catch(error => {
      outputDesign("Try Again");
      console.error("Submission failed:", error);
    });


  outputDesign("Hello");
}