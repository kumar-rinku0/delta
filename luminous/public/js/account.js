const updateUsernameBtn = document.getElementById("update-username");
const cancelUsernameBtn = document.getElementById("cancel-username");
updateUsernameBtn.addEventListener("click", () => {
  updateUsernameBtn.parentElement.classList.add("hidden");
  cancelUsernameBtn.parentElement.classList.remove("hidden");
});
cancelUsernameBtn.addEventListener("click", () => {
  cancelUsernameBtn.parentElement.classList.add("hidden");
  updateUsernameBtn.parentElement.classList.remove("hidden");
});

const changePasswordBtn = document.getElementById("change-password");
const cancelPasswordBtn = document.getElementById("cancel-password");
changePasswordBtn.addEventListener("click", () => {
  changePasswordBtn.parentElement.parentElement.classList.add("hidden");
  cancelPasswordBtn.parentElement.parentElement.classList.remove("hidden");
});
cancelPasswordBtn.addEventListener("click", () => {
  cancelPasswordBtn.parentElement.parentElement.classList.add("hidden");
  changePasswordBtn.parentElement.parentElement.classList.remove("hidden");
});
