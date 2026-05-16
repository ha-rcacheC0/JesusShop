// fetch("/api/products", {
//   method: "POST",
//   body: JSON.stringify(data),
//   headers: {
//     "Content-Type": "application/json",
//   },
// })
//   .then((res) => {
//     if (!res.ok) {
//       throw res;
//     }
//     return res.json();
//   })
//   .then((data) => {
//     console.log(data);
//   })
//   .catch((error) => {
//     console.log(error.message);
//   });

document.forms[0].onsubmit = function (event) {
  event.preventDefault();

  let valid = true;

  if (this.email.value == "" || this.contactReason.value == "") {
    valid = false;
    const next = this.firstName.nextElementSibling;

    // if (next.tagName != "SPAN") {
    //   const error = document.createElement("span");
    //   error.innerText = "Your email is required";
    //   this.contactReason.after(error);
    // } else if (next.tagName == "SPAN") {
    //   next.remove();
    // }
  }

  if (valid) {
    const data = {
      firstName: this.firstName.value,
      lastName: this.lastName.value,
      email: this.email.value,
      phone: this.phone.value,
      contactReason: this.contactReason.value,
    };

    fetch("/api/users", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw res;
        }
        return res.json();
      })
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.log(error.message);
      });
  }
};
