const API_URL = "http://api.local/users";

const userForm = document.getElementById("userForm");
const userIdInput = document.getElementById("userId");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const roleInput = document.getElementById("role");
const submitBtn = document.getElementById("submitBtn");
const cancelBtn = document.getElementById("cancelBtn");
const refreshBtn = document.getElementById("refreshBtn");
const tableBody = document.getElementById("userTableBody");

async function fetchUsers() {
  try {
    const response = await fetch(API_URL);
    const users = await response.json();
    renderUsers(users);
  } catch (error) {
    console.error("Failed to fetch users:", error);
  }
}

async function createUser(userData) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData)
    });
    const newUser = await response.json();
    console.log(newUser);
    return newUser;
  } catch (error) {
    console.error("Error creating user:", error);
  }
}

async function updateUser(id, partialData) {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(partialData)
    });
    const updatedUser = await response.json();
    return updatedUser;
  } catch (error) {
    console.error("Error updating user:", error);
  }
}

async function deleteUser(id) {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE"
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error deleting user:", error);
  }
}

function renderUsers(users) {
  tableBody.innerHTML = "";

  users.forEach((user) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${user.id}</td>
      <td>${user.name}</td>
      <td>${user.email}</td>
      <td>${user.role}</td>
      <td>
        <button class="btn-edit" onclick="handleEditClick(${user.id}, '${user.name}', '${user.email}', '${user.role}')">Edit</button>
        <button class="btn-delete" onclick="handleDeleteClick(${user.id})">Delete</button>
      </td>
    `;

    tableBody.appendChild(row);
  });
}

userForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  const id = userIdInput.value;
  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const role = roleInput.value.trim();

  const userData = { name, email, role };

  if (id) {
    await updateUser(id, userData);
  } else {
    await createUser(userData);
  }

  resetForm();
  await fetchUsers();
});

window.handleEditClick = function (id, name, email, role) {
  userIdInput.value = id;
  nameInput.value = name;
  emailInput.value = email;
  roleInput.value = role;

  submitBtn.innerText = "Update User (PATCH)";
  cancelBtn.style.display = "inline-block";
};

window.handleDeleteClick = async function (id) {
  const confirmed = confirm(`Are you sure you want to delete user #${id}?`);
  if (confirmed) {
    await deleteUser(id);
    await fetchUsers();
  }
};

cancelBtn.addEventListener("click", resetForm);

function resetForm() {
  userIdInput.value = "";
  nameInput.value = "";
  emailInput.value = "";
  roleInput.value = "";
  submitBtn.innerText = "Create User (POST)";
  cancelBtn.style.display = "none";
}

refreshBtn.addEventListener("click", fetchUsers);

document.addEventListener("DOMContentLoaded", fetchUsers);