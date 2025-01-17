function init() {
  document.addEventListener("DOMContentLoaded", () => {
    const section1 = document.getElementById("section1");
    const section2 = document.getElementById("section2");
    const section3 = document.getElementById("section3");
    const section4 = document.getElementById("section4");

    const section2YesButton = document.getElementById("yesRegister");
    const section2NoButton = document.getElementById("noRegister");
    const warrantyForm = document.getElementById("warranty-registration-form");
    const purchaseFromSelect = document.getElementById("purchasedFrom");
    const storeName = document.getElementById("storeNameWrapper");
    const warrantyError = document.getElementById("warrantyError");
    const productRegistered = document.getElementById("productRegistered");
    const emailError = document.getElementById("emailError");

    const itemInfoSection = document.querySelector(".item-info");
    const itemInfoTable = document.querySelector(".info-table");
    const headerContainer = document.querySelector(".header-container");
    const dropdownIcon = document.querySelector(".dropdown-icon");

    const inputFields = document.querySelectorAll(".input");
    const registrationBtn = document.getElementById("registration-btn");
    const registrationBtnLabel = document.getElementById("registerBtnLabel");
    const loader = document.querySelector(".loader");

    inputFields.forEach((inputField) => {
      inputField.addEventListener("input", function () {
        if (inputField.value !== "") {
          inputField.nextElementSibling.classList.add("label_filled");
        } else {
          inputField.nextElementSibling.classList.remove("label_filled");
        }
      });
    });

    const showSections = () => {
      setTimeout(() => {
        section1.classList.add("animate");
        section1.addEventListener(
          "transitionend",
          () => {
            section2.classList.remove("hide");
            section2.classList.remove("animate");
            section1.classList.add("hide");
          },
          { once: true }
        );
      }, 4000);
    };

    if (section2YesButton && section2NoButton) {
      section2YesButton.addEventListener("click", () => {
        section2.classList.add("hide");
        section3.classList.remove("hide");
      });

      section2NoButton.addEventListener("click", () => {
        section2.classList.add("hide");
        section4.classList.remove("hide");
      });
    }

    if (page === "authentic") {
      warrantyForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const formData = new FormData(warrantyForm);

        const data = {};

        formData.forEach((value, key) => {
          data[key] = value;
        });

        switch (data.purchasedFrom) {
          case "website": {
            data.purchasedFrom = `Moose Knuckles Website`;
            break;
          }
          case "moose": {
            data.purchasedFrom = `Moose Knuckles Store - ${data.storeName}`;
            break;
          }
          case "store": {
            data.purchasedFrom = `Wholesale store - ${data.storeName}`;
            break;
          }
          case "other": {
            data.purchasedFrom = `Other - ${data.storeName}`;
            break;
          }
          default:
            break;
        }

        if (storeName.classList.contains("hide")) {
          delete data.storeName;
        }

        if (
          data.name === "" ||
          data.email === "" ||
          data.receiptNumber === ""
        ) {
          warrantyError.classList.remove("hide");
          return;
        } else {
          warrantyError.classList.add("hide");
        }

        if (!validateEmail(data.email)) {
          emailError.classList.remove("hide");
        } else {
          emailError.classList.add("hide");
        }

        try {
          const response = await submitForm(data);

          if (response.status > 200 && response.status < 299) {
            section3.classList.add("hide");
            section4.classList.remove("hide");
          }

          if (response.status === 409) {
            productRegistered.classList.remove("hide");
          }
        } catch (error) {
          console.error(error);
        }
      });

      purchaseFromSelect.addEventListener("change", (e) => {
        const chosenOption = e.target.value;
        if (chosenOption !== "website") {
          storeName.classList.remove("hide");
          storeName.firstElementChild.required = true;
        } else {
          storeName.classList.add("hide");
          storeName.firstElementChild.required = false;
        }
      });

      if (headerContainer && itemInfoSection && itemInfoTable) {
        headerContainer.addEventListener("click", () => {
          dropdownIcon.classList.toggle("inverted");
          itemInfoTable.classList.toggle("hide");
        });
      }
    }

    const registering = (value) => {
      if (value) {
        registrationBtn.disabled = true;
        registrationBtnLabel.classList.add("hide");
        loader.classList.remove("hide");
      } else {
        registrationBtn.disabled = false;
        registrationBtnLabel.classList.remove("hide");
        loader.classList.add("hide");
      }
    };

    const submitForm = async (formData) => {
      try {
        registering(true);

        const response = await fetch(`/mk/v1/register?t=${token}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        registering(false);

        return response;
      } catch (error) {
        console.error("Error:", error);
        registering(false);
        throw error;
      }
    };

    const validateEmail = (email) => {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailPattern.test(email);
    };

    showSections();
  });
}

init();
