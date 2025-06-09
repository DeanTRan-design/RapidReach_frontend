const logoUrl = new URL('./images/logo.png', import.meta.url).href;
console.log("Logo path:", logoUrl);
// Helper function to decode JWT
function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return {};
  }
}

function loadView(view) {
  const root = document.getElementById("root");

  if (view === "signin") {
    root.innerHTML = `
      <div class="logo-wrapper">
        <img src="${logoUrl}" alt="RapidReach Logo" class="logo-top-right" />
      </div>
      <h2>Sign In</h2>
      <sl-input label="Email" type="email" id="email" required></sl-input>
      <br><br>
      <sl-input label="Password" type="password" id="password" required></sl-input>
      <sl-button variant="success" size="large" id="signin-btn">Sign In</sl-button>
      <br><br>
      <p style="margin-top: 1rem;">Don't have an account? <a href="#signup" style="color: var(--sl-color-primary-600);">Sign up</a></p>
    `;
    setTimeout(() => {
    const btn = document.getElementById("signin-btn");
    btn.addEventListener("click", async () => {
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value.trim();

      btn.innerHTML = `<sl-spinner></sl-spinner> Signing in...`;
      btn.disabled = true;

      const response = await fetch("https://rapidreach-backend-guki.onrender.com/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const result = await response.json();

      if (response.ok) {
        localStorage.setItem("token", result.accessToken);
        window.location.hash = "home";
      } else {
        alert(result.message || "Login failed");
      }
      });
    }, 0);
  } else if (view === "signup") {
    root.innerHTML = `
      <div class="logo-wrapper">
        <img src="${logoUrl}" alt="RapidReach Logo" class="logo-top-right" />
      </div>
      <h2>Please Provide Us Your Info</h2>
      <br><br>
      <sl-input label="First Name" id="firstName" required></sl-input>
      <br><br>
      <sl-input label="Last Name" id="lastName" required></sl-input>
      <br><br>
      <sl-input label="Date of Birth" id="dob" type="date" required></sl-input>
      <br><br>
      <sl-input label="City/Suburb" id="city" required></sl-input>
      <br><br>
      <sl-input label="Email" id="email" type="email" required></sl-input>
      <br><br>
      <sl-select label="You are registering as" id="accessLevel" required>
        <sl-option value="1">Patient</sl-option>
        <sl-option value="2">Responder</sl-option>
      </sl-select>
      <br><br>
      <sl-input label="Password" id="password" type="password" required></sl-input>
      <br><br>
      <sl-input label="Confirm Password" id="confirmPassword" type="password" required></sl-input>
      <sl-button id="register-btn" variant="success" size="large">Submit</sl-button>
      <br><br>
      <p style="margin-top: 1rem;">
      Already have an account?
      <a href="#signin" style="color: var(--sl-color-primary-600);">Sign in</a>
      </p>
    `;

    setTimeout(() => {
      document.getElementById("back-to-signin").addEventListener("click", () => {
        window.location.hash = "signin";
      });

      document.getElementById("register-btn").addEventListener("click", async () => {
        const firstName = document.getElementById("firstName").value.trim();
        const lastName = document.getElementById("lastName").value.trim();
        const dob = document.getElementById("dob").value;
        const city = document.getElementById("city").value.trim();
        const email = document.getElementById("email").value.trim();
        const accessLevel = parseInt(document.getElementById("accessLevel").value);
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        if (!firstName || !lastName || !dob || !city || !email || !accessLevel || !password || !confirmPassword) {
          alert("Please fill in all fields.");
          return;
        }

        if (password !== confirmPassword) {
          alert("Passwords do not match.");
          return;
        }

        const response = await fetch("https://rapidreach-backend-guki.onrender.com/user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firstName,
            lastName,
            dob,
            city,
            email,
            accessLevel,
            password
          })
        });

        const result = await response.json();

        if (response.ok) {
          alert("Account created! Please sign in.");
          window.location.hash = "signin";
        } else {
          alert(result.message || "Failed to register");
        }
      });
    }, 0);
} else if (view === "home") {
    const user = parseJwt(localStorage.getItem("token"));
    
    root.innerHTML = `
      <div class="logo-wrapper">
        <img src="${logoUrl}" alt="RapidReach Logo" class="logo-top-right" />
      </div>
     <h2>Welcome back, <strong>${user.firstName || user.email}</strong>!</h2>
     <p>You are logged in as <strong>${user.accessLevel === 2 ? "Responder" : "Patient"}</strong>.</p>

     <sl-button id="go-report" variant="success">Make Emergency Report</sl-button>
     <sl-button id="go-myreports" variant="neutral">View My Reports</sl-button>
     ${user.accessLevel === 2 ? '<sl-button id="go-allreports" variant="primary">View All Reports</sl-button>' : ''}
     <br /><br />
     <sl-button id="logout-btn" variant="danger">Sign Out</sl-button>
    `;


    setTimeout(() => {
      document.getElementById("go-report").addEventListener("click", () => window.location.hash = "report");
      document.getElementById("go-myreports").addEventListener("click", () => window.location.hash = "myreports");
    
      if (user.accessLevel === 2) {
        document.getElementById("go-allreports").addEventListener("click", () => {
          window.location.hash = "allreports"; 
        });
      }

    document.getElementById("logout-btn").addEventListener("click", () => {
      localStorage.removeItem("token");
      window.location.hash = "signin";
    });
  }, 0);
} else if (view === "report") {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("You must be logged in to report an emergency.");
    window.location.hash = "signin";
    return;
  }  
  root.innerHTML = `
    <div class="logo-wrapper">
        <img src="${logoUrl}" alt="RapidReach Logo" class="logo-top-right" />
    </div>
    <sl-alert id="form-alert" variant="danger" open style="display:none;">
    <sl-icon slot="icon" name="exclamation-triangle"></sl-icon>
    <strong>Error:</strong> Please fill in all fields.
    </sl-alert>
    <h2>Emergency Report</h2>
    <sl-input label="Location" id="location" required></sl-input>
    <br><br>
    <sl-select label="Category" id="category" required>
      <sl-option value="fire">Fire</sl-option>
      <sl-option value="medical">Medical</sl-option>
      <sl-option value="police">Police</sl-option>
    </sl-select>
    <br><br>
    <sl-textarea label="Message" id="message" rows="3" required></sl-textarea>
    <sl-button variant="danger" id="submit-report">Submit Emergency Report</sl-button>
    <sl-button id="go-home" variant="success">Back to Home</sl-button>
  `;

  setTimeout(() => {
    document.getElementById("go-home").addEventListener("click", () => {
      window.location.hash = "home";
    });

    document.getElementById("submit-report").addEventListener("click", async () => {
      const location = document.getElementById("location").value;
      const category = document.getElementById("category").value;
      const message = document.getElementById("message").value;
      const token = localStorage.getItem("token");
      // Reset previous styles
      ["location", "category", "message"].forEach(id => {
        document.getElementById(id).classList.remove("input-error");
      });
      document.getElementById("form-alert").style.display = "none";

      // Validate
      if (!location || !message || !category) {
        if (!location) document.getElementById("location").classList.add("input-error");
        if (!category) document.getElementById("category").classList.add("input-error");
        if (!message) document.getElementById("message").classList.add("input-error");

        const alertBox = document.getElementById("form-alert");
        alertBox.innerHTML = `
          <sl-icon slot="icon" name="exclamation-triangle"></sl-icon>
          <strong>Error:</strong> Please fill in all fields.
        `;
        alertBox.style.display = "block";
        return;
      }
      
      const submitBtn = document.getElementById("submit-report");
      submitBtn.innerHTML = `<sl-spinner></sl-spinner> Sending...`;
      submitBtn.disabled = true;

      const response = await fetch("https://rapidreach-backend-guki.onrender.com/report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ location, category, message })
      });
      
      // Show success screen
      if (response.ok) {
        root.innerHTML = `
          <h2>Report Submitted</h2>
          <p>Thanks! Your emergency report has been successfully sent.</p>
          <sl-button variant="primary" id="go-home">Back to Home</sl-button>
        `;

        setTimeout(() => {
          document.getElementById("go-home").addEventListener("click", () => {
            window.location.hash = "home";
          });
        }, 0);
      } else {
        const result = await response.json();
        alert(result.message || "Failed to send report");
        // Reset button if error
        submitBtn.innerHTML = "Submit Emergency Report";
        submitBtn.disabled = false;
      }
    });
  }, 0);

} else if (view === "myreports") {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("You must be logged in to view your reports.");
    window.location.hash = "signin";
    return;
  }

  root.innerHTML = `
    <div class="logo-wrapper">
        <img src="${logoUrl}" alt="RapidReach Logo" class="logo-top-right" />
    </div>
    <h2>My Reports</h2><div id="report-list">Loading...</div>
    <br><br>
    <sl-button id="go-home" variant="success">Back to Home</sl-button>
  `;

  fetch("https://rapidreach-backend-guki.onrender.com/report", {
    headers: { Authorization: `Bearer ${token}` }
  })
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById("report-list");
      if (Array.isArray(data) && data.length > 0) {
        container.innerHTML = data.map(r => `
          <sl-card class="mb-3">
            <strong>${r.category.toUpperCase()}</strong> - ${r.location}<br/>
            <small>${new Date(r.createdAt).toLocaleString()}</small><br/>
            <p>${r.message}</p>
          </sl-card>
        `).join("");
      } else {
        container.innerHTML = "<p>No reports found.</p>";
      }
    })
    .catch(err => {
      document.getElementById("go-home").addEventListener("click", () => {
      window.location.hash = "home";
      });
      document.getElementById("report-list").innerHTML = "Error loading reports.";
      console.error("Report load error:", err);
    });

} else if (view === "allreports") {
  const token = localStorage.getItem("token");
  const user = parseJwt(token);

  root.innerHTML = `
    <div class="logo-wrapper">
        <img src="${logoUrl}" alt="RapidReach Logo" class="logo-top-right" />
    </div>
    <h2>All Emergency Reports</h2>
    <div id="report-list">Loading...</div>
    <sl-button id="go-home" variant="success">Back to Home</sl-button>
  `;

  setTimeout(() => {
    document.getElementById("go-home").addEventListener("click", () => {
      window.location.hash = "home";
    });

    fetch("https://rapidreach-backend-guki.onrender.com/report/all", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        const container = document.getElementById("report-list");
        if (!Array.isArray(data)) {
          container.innerHTML = "No reports available.";
          return;
        }

        container.innerHTML = data
          .map(report => `
            <sl-card class="report-card">
              <strong>Category:</strong> ${report.category}<br/>
              <strong>Location:</strong> ${report.location}<br/>
              <strong>Message:</strong> ${report.message}<br/>
              <small>Submitted on: ${new Date(report.createdAt).toLocaleString()}</small><br/>
              <small>Submitted by: ${report.userId?.firstName || report.userId?.email}</small><br/>
              <sl-button variant="danger" size="small" data-id="${report._id}" class="delete-report">Delete</sl-button>
            </sl-card><br/>
          `)
          .join("");

        // Add delete functionality
        document.querySelectorAll(".delete-report").forEach(button => {
          button.addEventListener("click", async () => {
            const reportId = button.getAttribute("data-id");
            const confirmed = confirm("Are you sure you want to delete this report?");
            if (!confirmed) return;

            const res = await fetch(`https://rapidreach-backend-guki.onrender.com/report/${reportId}`, {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${token}`
              }
            });

            if (res.ok) {
              alert("Report deleted.");
              window.location.reload(); // Refresh the list
            } else {
              alert("Failed to delete the report.");
            }
          });
        });
      })
      .catch(err => {
        console.error("Error loading all reports", err);
        document.getElementById("report-list").innerHTML = "Error loading reports.";
      });
  }, 0);

} else {
    root.innerHTML = ` 
      <div class="logo-wrapper">
        <img src="${logoUrl}" alt="RapidReach Logo" class="logo-top-right" />
      </div>
      <h2>404 - Page not found</h2>
    `;
  }
}

// Handle hash-based routing
window.addEventListener("hashchange", () => {
  const view = location.hash.replace("#", "");
  loadView(view);
});

// Load initial view
loadView(location.hash.replace("#", "") || "signin");

// Redirect if already logged in
if (localStorage.getItem("token") && location.hash === "#signin") {
  location.hash = "home";
}

window.parseJwt = parseJwt;