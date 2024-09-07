let currentCustomerList = [];
let currentPage = 1;
const usersPerPage = 5;
let currentUserId = null;  // To track the current user being updated
let sortDirection = 'asc';

async function loadUserTable() {
    doneMsgLbl.style.display = "none";

    let customerResponse = await sendHttpRequest(CUSTOMER_SERVICE_URL_ALL_USERS);
    currentCustomerList = customerResponse.json;

    renderUserTable(currentPage);  // Load the first page
    renderPagination();            // Render the pagination controls
}

function hideModal()
{
    $('#userModal').modal('hide');
}

function renderUserRow(user) {
    return `
        <tr id="userRow${user.id}">
            <td id="idValue${user.id}">${user.id}</td>
            <td id="firstNameValue${user.id}">${user.firstName}</td>
            <td id="lastNameValue${user.id}">${user.lastName}</td>
            <td id="occupationValue${user.id}">${user.occupation}</td>
            <td>
                <button class="btn btn-primary" onclick="loadUser(${user.id})">
                    Update
                </button>
                <button class="btn btn-danger" onclick="confirmDeleteUser(${user.id})">
                    Delete
                </button>
            </td>
        </tr>
    `;
}

function sortTable(column)
{
    //Toggle sorting direction
    sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';

    // Sort the currentCustomerList array
    currentCustomerList.sort((a,b) =>{
        let valueA = a[column];
        let valueB = b[column];

        if (typeof valueA === 'string')
            {
                valueA = valueA.toLowerCase();
                valueB = valueB.toLowerCase();
            }

        if (valueA < valueB)
            {
                return sortDirection === 'asc' ? -1 : 1;
            }
        if (valueA > valueB)
            {
                return sortDirection === 'asc' ? 1 : -1;
            }
        return 0;
    });

    // Render the sorted table
    renderUserTable(currentPage);

    // Update sorting indicators
    updateSortIndicators();
}

function updateSortIndicators() {
    // Reset all sort indicators
    document.querySelectorAll('.sort-indicator').forEach(indicator => {
        indicator.style.opacity = '0.5';
    });

    // Update the indicator for the sorted column
    const indicator = document.getElementById(`sort-${column}`);
    if (sortDirection === 'asc') {
        indicator.classList.add('sort-asc');
        indicator.classList.remove('sort-desc');
    } else {
        indicator.classList.add('sort-desc');
        indicator.classList.remove('sort-asc');
    }
    indicator.style.opacity = '1';
}

function renderUserTable(page) {
    let customerTblBody = document.getElementById('customerTblBody');
    customerTblBody.innerHTML = '';

    const startIndex = (page - 1) * usersPerPage;
    const endIndex = startIndex + usersPerPage;
    const customersOnPage = currentCustomerList.slice(startIndex, endIndex);

    customersOnPage.forEach(customer => {
        customerTblBody.innerHTML += renderUserRow(customer);
    });
}

// Function to create clickable pagination controls
function renderPagination() {
    const paginationControls = document.getElementById('paginationControls');
    paginationControls.innerHTML = '';

    const totalPages = Math.ceil(currentCustomerList.length / usersPerPage);

    for (let i = 1; i <= totalPages; i++) {
        paginationControls.innerHTML += `
            <li class="page-item ${i === currentPage ? 'active' : ''}">
                <a class="page-link" href="#" onclick="goToPage(${i})">${i}</a>
            </li>
        `;
    }
}

function goToPage(page) {
    currentPage = page;
    renderUserTable(page);
    renderPagination();  // Update pagination to reflect the current page
}

let doneMsgLbl = document.querySelector("#doneMsgLbl");

async function createUser() {
    let firstName = document.querySelector("#firstNameInput").value;
    let lastName = document.querySelector("#lastNameInput").value;
    let occupation = document.querySelector("#occupationInput").value;
    
    if (firstName.trim().length > 0 && lastName.trim().length > 0) {
        let newCustomer = {
            firstName: firstName,
            lastName: lastName,
            occupation: occupation
        };

        let response = await sendHttpRequest(CUSTOMER_SERVICE_URL, "POST", JSON.stringify(newCustomer));

        if (response.status == 200) {
            doneMsgLbl.style.display = "block";
            loadUserTable();
            hideModal()
        }
    }
}

// Function to dynamically create a user object based on the current list
async function createUserDynamic() {
    let newUser = constructUserObj();

    let response = await sendHttpRequest(CUSTOMER_SERVICE_URL, "POST", JSON.stringify(newUser));

    if (response.status == 200) {
        doneMsgLbl.style.display = "block";
        loadUserTable();
    }
}

function constructUserObj() {
    let newUser = {};

    if (currentCustomerList.length > 0) {
        let userAttrs = Object.keys(currentCustomerList[0]);

        userAttrs.forEach(userAttr => {
            let attrHtmlElement = document.querySelector(`#${userAttr}Input`);

            if (attrHtmlElement != null) {
                let attrInputValue = attrHtmlElement.value;
                newUser[userAttr] = attrInputValue;
            }
        });
    }

    return newUser;
}

//Update
async function updateUser() {
    let firstName = document.querySelector("#firstNameInput").value;
    let lastName = document.querySelector("#lastNameInput").value;
    let occupation = document.querySelector("#occupationInput").value;

    if (firstName.trim().length > 0 && lastName.trim().length > 0) {
        let updatedCustomer = {
            firstName: firstName,
            lastName: lastName,
            occupation: occupation
        };

        let response = await sendHttpRequest(`${CUSTOMER_SERVICE_URL}/${currentUserId}`, "PUT", JSON.stringify(updatedCustomer));

        if (response.status == 200) {
            doneMsgLbl.style.display = "block";
            
            loadUserTable();
            hideModal()
        }
    }
}



// Delete user
async function deleteUser(userId) {
    let response = await sendHttpRequest(`${CUSTOMER_SERVICE_URL}/${userId}`, "DELETE");
    
    if (response.status == 200) {
        loadUserTable();  // Refresh table after deletion
    }
}

function confirmDeleteUser(userId) {
    if (confirm("Are you sure you want to delete this user?")) {
        deleteUser(userId);  // Call delete function if confirmed
    }
}

// Load customer data into the modal for updating
function loadUser(userId) {
    currentUserId = userId;  // Store current user ID globally for updates
    let user = currentCustomerList.find(user => user.id === userId);

    if (user) {
        document.querySelector("#firstNameInput").value = user.firstName;
        document.querySelector("#lastNameInput").value = user.lastName;
        document.querySelector("#occupationInput").value = user.occupation;
    }

    // Make sure the modal is shown
    $('#userModal').modal('show');  // Show the modal when loading the user data
}

async function updateUser()
{
    let firstName = document.querySelector("#firstNameInput").value;
    let lastName = document.querySelector("#lastNameInput").value;
    let occupation = document.querySelector("#occupationInput").value;
    
    if (firstName.trim().length > 0 && lastName.trim().length > 0) {
        let updatedCustomer = {
            firstName: firstName,
            lastName: lastName,
            occupation: occupation
        };

        // Send a PUT request to update the customer
        let response = await sendHttpRequest(`${CUSTOMER_SERVICE_URL}/${currentUserId}`, "PUT", JSON.stringify(updatedCustomer));

        if (response.status == 200) {
            doneMsgLbl.style.display = "block";
            loadUserTable();  // Reload the table after the update
            hideModal();
        }
    }
}

function resetForm()
{
    document.querySelector("#firstNameInput").value = '';
    document.querySelector("#lastNameInput").value = '';
    document.querySelector("#occupationInput").value = '';
}

function openCreateUserModal()
{
    resetForm()
    currentUserId = null;
    $('#userModal').modal('show');
}

loadUserTable();
