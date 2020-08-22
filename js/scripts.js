if (window.location.pathname.includes("mobile") === false) {

  const d = document;
  n = navigator;
  ua = n.userAgent;
  
  const id = document.getElementById("id");
  
  isMobile = {
  
      android: () => ua.match(/android/i),
      ios: () => ua.match(/iphone|ipad|ipod/i),
      windows: () => ua.match(/windows phone/i),
      any: function() {
          return this.android() || this.ios() || this.windows()
      }
  
  }
  
  if (isMobile.any() != null) {
      document.location = "/mobile/add-patient.html"
  }
  
}
if (window.location.pathname === "/pages/add-patient.html" || window.location.pathname === "/mobile/add-patient.html") {
  /* Add a Patient Scripts */
  class Patient {
    constructor(name, age, disease) {
      this.name = name;
      this.age = age;
      this.disease = disease;
    }
  }

  const form = document.getElementById("form");
  form.addEventListener("submit", addPatient);
  function addPatient(e) {
    let name = document.getElementById("name").value;
    let age = document.getElementById("age").value;
    let disease = document.getElementById("disease").value;
    e.preventDefault();
    if (name === "" || (age === "") | (disease === "")) {
      return addMessage("page-body-form", "Please fill all the boxes");
    }

    let newPatient = new Patient(name, age, disease);
    // Adding Patient to Local Storage
    addPatientLocalStorage(newPatient);
    form.reset();
    addMessage("page-body-form", "Patient added succesfully!");
  }

  function addPatientLocalStorage(newPatient) {
    let patient = newPatient;
    if (localStorage.getItem("patients") === null) {
      let patients = [];
      patients.push(patient);
      localStorage.setItem("patients", JSON.stringify(patients));
    } else {
      let patients = JSON.parse(localStorage.getItem("patients"));
      patients.push(patient);
      localStorage.setItem("patients", JSON.stringify(patients));
    }
  }
}

function addMessage(place, message) {
  let messageDOM = document.createElement("div");
  messageDOM.classList.add("messageSuccess");
  let placeDOM = document.querySelector(`.${place}`);
  messageDOM.innerHTML = `
        <p>${message}</p>
    `;
  placeDOM.appendChild(messageDOM);
  setTimeout(() => {
    messageDOM.classList.add("hidden");
  }, 1000);
}

if (window.location.pathname === "/pages/add-date.html" || window.location.pathname === "/mobile/add-date.html") {
  /* Add a Date Code */

  let patientSelect = document.querySelector(".choose-a-date");

  if (localStorage.getItem("patients") === null) {
    patientSelect.innerHTML = `<option selected disabled>Add a patient first</option>`;
  } else {
    let patients = JSON.parse(localStorage.getItem("patients"));
    patients.forEach((patient) => {
      patientName = patient.name;
      patientSelect.innerHTML += `
                <option> ${patientName}</option>
            `;
    });
  }

  class Date {
    constructor(patient, date, reason, patientAge) {
      this.patient = patient;
      this.date = date;
      this.reason = reason;
      this.patientAge = patientAge;
    }
  }

  let dateForm = document.getElementById("date-form");
  dateForm.addEventListener("submit", addDate);
  function addDate(e) {
    e.preventDefault();
    let patientDate = document.getElementById("patient").value;
    let date = document.getElementById("date").value;
    let reason = document.getElementById("reason").value;
    if ((patientDate === "") | (date === "") | (reason === "")) {
      return addMessage("page-body-form", "Please fill the boxes");
    }
    let ages = [];

    let patientsLS = JSON.parse(localStorage.getItem("patients"));

    patientsLS.forEach((patient) => {
      if (patient.name === patientDate) {
        ages.push(patient.age);
      }
    });

    let age = ages[0]
    let patients = localStorage;
    let dateData = new Date(patientDate, date, reason, age);
    addMessage("page-body-form", "Date added succesfully!");
    dateForm.reset();
    addDateLocalStorage(dateData);
  }

  function addDateLocalStorage(dateData) {
    let date = dateData;

    if (localStorage.getItem("dates") === null) {
      let dates = [];
      dates.push(date);
      localStorage.setItem("dates", JSON.stringify(dates));
    } else {
      let dates = JSON.parse(localStorage.getItem("dates"));
      dates.push(date);
      localStorage.setItem("dates", JSON.stringify(dates));
    }
  }
}

/* View Dates Page Scripts */

if (window.location.pathname === "/pages/view-dates.html" || window.location.pathname === "/mobile/view-dates.html") {
  document.addEventListener("DOMContentLoaded", loadDates);

  console.log(localStorage.getItem("dates"))

  function loadDates() {

    if (localStorage.getItem("dates") === null || localStorage.getItem("dates") === "[]") {
      datesDiv = document.querySelector(".dates");
      datesDiv.innerHTML = `
      <p class="no-dates">Please add a date first <i class="fas fa-exclamation-triangle"></i></p>
      <a class="ancle" href="add-date.html">Add a Date</a>`;
    } else {
      datesDiv = document.querySelector(".dates");
      dates = JSON.parse(localStorage.getItem("dates"));
      patients = JSON.parse(localStorage.getItem("patients"));
      dates.forEach((date, index) => {
        let reason = date.reason;
        let dateData = date.date;
        let name = date.patient;
        let age = date.patientAge;
        datesDiv.innerHTML += `
                
                <div class="date date${index + 1}">
                    <p class="name"><span>${name}</span><span class="age"> - ${age} <span class="years">Years</span> </span></p>
                    <p class="details">${reason}<span class="date-details">- ${dateData}</span></p>
                    <i class="far fa-trash-alt delete-i"></i>
                </div>
                
                `;
      });

      dateDiv = document.querySelectorAll(".date")

      dateDiv.forEach(div => {
        div.addEventListener("click", deleteDate)
      })




      function deleteDate(e) {

        if (e.target.classList.contains("delete-i")) {
          removeDateLocalStorage(e)
          e.target.parentElement.remove()
          addMessage("dates", "A date was deleted succesfully")
        }
      }
    }

    function removeDateLocalStorage(e) {

      let name = e.target.parentElement.children[0].children[0].textContent;

      let dates = JSON.parse(localStorage.getItem("dates"))
      dates.forEach((date, index) => {
        if (date.patient === name) {
          dates.splice(index, 1)
        }
      })

      localStorage.setItem("dates", JSON.stringify(dates))


      setTimeout(() => {
        loadDates();
      }, 2000);


    }
  }
}