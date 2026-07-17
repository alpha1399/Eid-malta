const ACCOUNT_KEY = "identityPortalAccount";
const PHOTO_KEY = "identityPortalPhoto";

const accountPage = document.getElementById("accountPage");
const profilePage = document.getElementById("profilePage");
const createForm = document.getElementById("createForm");
const signInForm = document.getElementById("signInForm");
const createMessage = document.getElementById("createMessage");
const signInMessage = document.getElementById("signInMessage");
const signOutButton = document.getElementById("signOutButton");
const photoInput = document.getElementById("photoInput");
const profilePhoto = document.getElementById("profilePhoto");
const headerPhoto = document.getElementById("headerPhoto");
const editDetailsButton = document.getElementById("editDetailsButton");
const editForm = document.getElementById("editForm");

const defaultPhoto =
  "data:image/svg+xml;charset=UTF-8," +
  encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="300" height="360" viewBox="0 0 300 360">
      <rect width="300" height="360" fill="#e8f6f8"/>
      <circle cx="150" cy="115" r="62" fill="#1498b2" opacity=".55"/>
      <path d="M55 330c8-78 45-118 95-118s87 40 95 118" fill="#1498b2" opacity=".55"/>
    </svg>
  `);

function showProfile() {
  accountPage.classList.remove("active");
  profilePage.classList.add("active");
  populateProfile();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function showAccountPage() {
  profilePage.classList.remove("active");
  accountPage.classList.add("active");
  signInForm.reset();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function getAccount() {
  const raw = localStorage.getItem(ACCOUNT_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    localStorage.removeItem(ACCOUNT_KEY);
    return null;
  }
}

function saveAccount(account) {
  localStorage.setItem(ACCOUNT_KEY, JSON.stringify(account));
}

function formatDate(value) {
  if (!value) return "—";
  const date = new Date(`${value}T00:00:00`);
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  }).format(date);
}

function setPhoto(source) {
  profilePhoto.src = source;
  headerPhoto.src = source;
}

function populateProfile() {
  const account = getAccount();
  if (!account) return;

  const fullName = `${account.firstName} ${account.surname}`.trim();

  document.getElementById("headerFullName").textContent = fullName;
  document.getElementById("headerReference").textContent = account.referenceNumber;
  document.getElementById("displayName").textContent = fullName;
  document.getElementById("displayBirthDate").textContent = formatDate(account.dateOfBirth);
  document.getElementById("displayReference").textContent = account.referenceNumber;
  document.getElementById("displayEmail").textContent = account.email;
  document.getElementById("displayPhone").textContent = account.phone;
  document.getElementById("displayAddress").textContent = account.address;

  document.getElementById("editFirstName").value = account.firstName;
  document.getElementById("editSurname").value = account.surname;
  document.getElementById("editReference").value = account.referenceNumber;
  document.getElementById("editBirthDate").value = account.dateOfBirth;
  document.getElementById("editEmail").value = account.email;
  document.getElementById("editPhone").value = account.phone;
  document.getElementById("editAddress").value = account.address;

  setPhoto(localStorage.getItem(PHOTO_KEY) || defaultPhoto);
}

createForm.addEventListener("submit", (event) => {
  event.preventDefault();
  createMessage.textContent = "";

  const password = document.getElementById("newPassword").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  if (password !== confirmPassword) {
    createMessage.style.color = "#b23a3a";
    createMessage.textContent = "The passwords do not match.";
    return;
  }

  const account = {
    firstName: document.getElementById("firstName").value.trim(),
    surname: document.getElementById("surname").value.trim(),
    referenceNumber: document.getElementById("referenceNumber").value.trim(),
    dateOfBirth: document.getElementById("dateOfBirth").value,
    email: document.getElementById("email").value.trim(),
    phone: document.getElementById("phone").value.trim(),
    address: document.getElementById("address").value.trim(),
    username: document.getElementById("username").value.trim(),
    password
  };

  saveAccount(account);
  createMessage.style.color = "#2e7658";
  createMessage.textContent = "Account created successfully. You can now sign in.";

  document.getElementById("loginUsername").value = account.username;
  document.getElementById("loginPassword").focus();
});

signInForm.addEventListener("submit", (event) => {
  event.preventDefault();
  signInMessage.textContent = "";

  const account = getAccount();

  if (!account) {
    signInMessage.textContent = "Create an account first.";
    return;
  }

  const username = document.getElementById("loginUsername").value.trim();
  const password = document.getElementById("loginPassword").value;

  if (username !== account.username || password !== account.password) {
    signInMessage.textContent = "Incorrect username or password.";
    return;
  }

  showProfile();
});

signOutButton.addEventListener("click", showAccountPage);

photoInput.addEventListener("change", () => {
  const file = photoInput.files[0];
  if (!file) return;

  if (!file.type.startsWith("image/")) {
    alert("Please choose an image file.");
    photoInput.value = "";
    return;
  }

  const reader = new FileReader();
  reader.addEventListener("load", () => {
    localStorage.setItem(PHOTO_KEY, reader.result);
    setPhoto(reader.result);
  });
  reader.readAsDataURL(file);
});

editDetailsButton.addEventListener("click", () => {
  editForm.classList.toggle("hidden");
  editDetailsButton.textContent = editForm.classList.contains("hidden")
    ? "Edit details"
    : "Cancel editing";
});

editForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const account = getAccount();
  if (!account) return;

  account.firstName = document.getElementById("editFirstName").value.trim();
  account.surname = document.getElementById("editSurname").value.trim();
  account.referenceNumber = document.getElementById("editReference").value.trim();
  account.dateOfBirth = document.getElementById("editBirthDate").value;
  account.email = document.getElementById("editEmail").value.trim();
  account.phone = document.getElementById("editPhone").value.trim();
  account.address = document.getElementById("editAddress").value.trim();

  saveAccount(account);
  populateProfile();
  editForm.classList.add("hidden");
  editDetailsButton.textContent = "Edit details";
  alert("Profile details updated.");
});

document.querySelectorAll(".profile-tab").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".profile-tab").forEach((item) => {
      item.classList.remove("active");
    });

    document.querySelectorAll(".tab-content").forEach((content) => {
      content.classList.remove("active");
    });

    button.classList.add("active");
    const tabName = button.dataset.tab;
    document.getElementById(`${tabName}Tab`).classList.add("active");
  });
});

setPhoto(localStorage.getItem(PHOTO_KEY) || defaultPhoto);
