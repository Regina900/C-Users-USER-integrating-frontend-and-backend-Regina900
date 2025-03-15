// Show/Hide Password Function
function togglePassword() {
    const passwordField = document.getElementById("password");
    if (passwordField) {
        passwordField.type = passwordField.type === "password" ? "text" : "password";
    }
}

// Handle Login
document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", async function (e) {
            e.preventDefault();
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            try {
                const response = await fetch('http://localhost:3000/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();

                if (response.ok) {
                    localStorage.setItem("user", JSON.stringify(data.user));
                    alert("Login successful!");

                    // Redirect to the dashboard
                    window.location.href = "dashboard.html";
                } else {
                    alert(data.message || "Invalid credentials");
                }
            } catch (error) {
                console.error("Error during login:", error);
                alert("An error occurred. Please try again.");
            }
        });
    }

    // Handle Signup
    const signupForm = document.getElementById("signupForm");
    if (signupForm) {
        signupForm.addEventListener("submit", async function (e) {
            e.preventDefault();
            const name = document.getElementById("name").value;
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;
            const role = document.getElementById("role").value;

            if (name && email && password && role) {
                try {
                    const response = await fetch('http://localhost:3000/auth/register', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ name, email, password, role })
                    });

                    const data = await response.json();

                    if (response.ok) {
                        alert("Signup successful! Redirecting to login...");
                        window.location.href = "index.html";
                    } else {
                        alert(data.message || "Signup failed. Please try again.");
                    }
                } catch (error) {
                    console.error("Error during signup:", error);
                    alert("An error occurred. Please try again.");
                }
            } else {
                alert("Please fill in all the fields.");
            }
        });
    }

    // Redirect users after login
    function loadUserDashboard() {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) {
            alert("You need to log in first.");
            window.location.href = "index.html";
            return;
        }

        document.querySelector("h2").innerText = `Welcome, ${user.name}`;

        const doctorSection = document.getElementById("doctorManagementSection");
        const appointmentSection = document.getElementById("appointmentBookingSection");

        if (user.role === "doctor") {
            if (doctorSection) doctorSection.style.display = "block";
            if (appointmentSection) appointmentSection.style.display = "none";
        } else {
            if (doctorSection) doctorSection.style.display = "none";
            if (appointmentSection) appointmentSection.style.display = "block";
        }
    }

    if (window.location.pathname.includes("dashboard.html")) {
        loadUserDashboard();
    }

    // Save Doctor Availability
    function saveDoctorAvailability() {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user || user.role !== "doctor") return;

        const specialization = document.getElementById("specialization").value;
        const availableDays = document.getElementById("availableDays").value;
        const availableTimes = document.getElementById("availableTimes").value;

        if (specialization && availableDays && availableTimes) {
            const doctorAvailability = {
                email: user.email,
                specialization,
                availableDays,
                availableTimes
            };

            localStorage.setItem(`doctorAvailability_${user.email}`, JSON.stringify(doctorAvailability));
            alert("Availability updated successfully!");
            loadDoctorAvailability();
        } else {
            alert("Please fill in all fields.");
        }
    }

    // Load Doctor Availability
    function loadDoctorAvailability() {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user || user.role !== "doctor") return;

        const storedAvailability = JSON.parse(localStorage.getItem(`doctorAvailability_${user.email}`));

        if (storedAvailability) {
            const tableBody = document.getElementById("doctorAvailabilityTable")?.getElementsByTagName('tbody')[0];
            if (!tableBody) return;

            tableBody.innerHTML = ""; // Clear previous entries

            const row = tableBody.insertRow();
            row.insertCell(0).textContent = storedAvailability.specialization;
            row.insertCell(1).textContent = storedAvailability.availableDays;
            row.insertCell(2).textContent = storedAvailability.availableTimes;
        }
    }

    function loadUserDashboard() {
        console.log("User dashboard loaded");
    }
    window.loadUserDashboard = loadUserDashboard;
    


    // Book an Appointment
    function bookAppointment() {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) {
            alert("You need to log in first.");
            window.location.href = "index.html";
            return;
        }

        const doctor = prompt("Enter the doctor's name:");
        const date = prompt("Enter the appointment date (YYYY-MM-DD):");
        const time = prompt("Enter the appointment time (HH:MM):");

        if (doctor && date && time) {
            const table = document.getElementById("appointmentsTable")?.getElementsByTagName('tbody')[0];
            if (!table) return;

            const row = table.insertRow();
            row.insertCell(0).textContent = doctor;
            row.insertCell(1).textContent = date;
            row.insertCell(2).textContent = time;
            row.insertCell(3).textContent = 'Pending';

            alert("Appointment booked successfully!");
        } else {
            alert("Please fill in all details to book the appointment.");
        }
    }

    // Locate Nearby Health Centers
    function locateHealthCenters() {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser.");
            return;
        }

        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;

            const map = L.map('map').setView([latitude, longitude], 12);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; OpenStreetMap contributors'
            }).addTo(map);

            L.marker([latitude, longitude]).addTo(map)
                .bindPopup("You are here")
                .openPopup();
        }, () => {
            alert("Could not get your location.");
        });
    }

    // Logout Function
    function logout() {
        localStorage.removeItem("user");
        alert("Logged out!");
        window.location.href = "index.html";
    }

    
    

    // Ensure functions are globally accessible
    window.togglePassword = togglePassword;
    window.loadUserDashboard = loadUserDashboard;
    window.saveDoctorAvailability = saveDoctorAvailability;
    window.loadDoctorAvailability = loadDoctorAvailability;
    window.bookAppointment = bookAppointment;
    window.locateHealthCenters = locateHealthCenters;
    window.logout = logout;
});
