var e={};const t=new URL(import.meta.resolve("4Cm2X")).href;function o(e){try{return JSON.parse(atob(e.split(".")[1]))}catch(e){return{}}}function r(e){let r=document.getElementById("root");if("signin"===e)r.innerHTML=`
      <div class="logo-wrapper">
        <img src="${t}" alt="RapidReach Logo" class="logo-top-right" />
      </div>
      <h2>Sign In</h2>
      <sl-input label="Email" type="email" id="email" required></sl-input>
      <br><br>
      <sl-input label="Password" type="password" id="password" required></sl-input>
      <sl-button variant="success" size="large" id="signin-btn">Sign In</sl-button>
      <br><br>
      <p style="margin-top: 1rem;">Don't have an account? <a href="#signup" style="color: var(--sl-color-primary-600);">Sign up</a></p>
    `,setTimeout(()=>{let e=document.getElementById("signin-btn");e.addEventListener("click",async()=>{let t=document.getElementById("email").value.trim(),o=document.getElementById("password").value.trim();e.innerHTML="<sl-spinner></sl-spinner> Signing in...",e.disabled=!0;let r=await fetch("https://rapidreach-backend-guki.onrender.com/auth/signin",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:t,password:o})}),n=await r.json();r.ok?(localStorage.setItem("token",n.accessToken),window.location.hash="home"):alert(n.message||"Login failed")})},0);else if("signup"===e)r.innerHTML=`
      <div class="logo-wrapper">
        <img src="${t}" alt="RapidReach Logo" class="logo-top-right" />
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
    `,setTimeout(()=>{document.getElementById("back-to-signin").addEventListener("click",()=>{window.location.hash="signin"}),document.getElementById("register-btn").addEventListener("click",async()=>{let e=document.getElementById("firstName").value.trim(),t=document.getElementById("lastName").value.trim(),o=document.getElementById("dob").value,r=document.getElementById("city").value.trim(),n=document.getElementById("email").value.trim(),a=parseInt(document.getElementById("accessLevel").value),i=document.getElementById("password").value,l=document.getElementById("confirmPassword").value;if(!e||!t||!o||!r||!n||!a||!i||!l)return void alert("Please fill in all fields.");if(i!==l)return void alert("Passwords do not match.");let s=await fetch("https://rapidreach-backend-guki.onrender.com/user",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({firstName:e,lastName:t,dob:o,city:r,email:n,accessLevel:a,password:i})}),d=await s.json();s.ok?(alert("Account created! Please sign in."),window.location.hash="signin"):alert(d.message||"Failed to register")})},0);else if("home"===e){let e=o(localStorage.getItem("token"));r.innerHTML=`
      <div class="logo-wrapper">
        <img src="${t}" alt="RapidReach Logo" class="logo-top-right" />
      </div>
     <h2>Welcome back, <strong>${e.firstName||e.email}</strong>!</h2>
     <p>You are logged in as <strong>${2===e.accessLevel?"Responder":"Patient"}</strong>.</p>

     <sl-button id="go-report" variant="success">Make Emergency Report</sl-button>
     <sl-button id="go-myreports" variant="neutral">View My Reports</sl-button>
     ${2===e.accessLevel?'<sl-button id="go-allreports" variant="primary">View All Reports</sl-button>':""}
     <br /><br />
     <sl-button id="logout-btn" variant="danger">Sign Out</sl-button>
    `,setTimeout(()=>{document.getElementById("go-report").addEventListener("click",()=>window.location.hash="report"),document.getElementById("go-myreports").addEventListener("click",()=>window.location.hash="myreports"),2===e.accessLevel&&document.getElementById("go-allreports").addEventListener("click",()=>{window.location.hash="allreports"}),document.getElementById("logout-btn").addEventListener("click",()=>{localStorage.removeItem("token"),window.location.hash="signin"})},0)}else if("report"===e){if(!localStorage.getItem("token")){alert("You must be logged in to report an emergency."),window.location.hash="signin";return}r.innerHTML=`
    <div class="logo-wrapper">
        <img src="${t}" alt="RapidReach Logo" class="logo-top-right" />
    </div>
    <sl-alert id="form-alert" variant="danger" open style="display:none;">
    <sl-icon slot="icon" name="exclamation-triangle"></sl-icon>
    <strong>Error:</strong> Please fill in all fields.
    </sl-alert>
    <h2>Emergency Report</h2>
    <sl-input label="Location" id="location" required></sl-input>
    <sl-select label="Category" id="category" required>
      <sl-option value="fire">Fire</sl-option>
      <sl-option value="medical">Medical</sl-option>
      <sl-option value="police">Police</sl-option>
    </sl-select>
    <sl-textarea label="Message" id="message" rows="3" required></sl-textarea>
    <sl-button variant="danger" id="submit-report">Submit Emergency Report</sl-button>
    <sl-button id="go-home" variant="success">Back to Home</sl-button>
  `,setTimeout(()=>{document.getElementById("go-home").addEventListener("click",()=>{window.location.hash="home"}),document.getElementById("submit-report").addEventListener("click",async()=>{let e=document.getElementById("location").value,t=document.getElementById("category").value,o=document.getElementById("message").value,n=localStorage.getItem("token");if(["location","category","message"].forEach(e=>{document.getElementById(e).classList.remove("input-error")}),document.getElementById("form-alert").style.display="none",!e||!o||!t){e||document.getElementById("location").classList.add("input-error"),t||document.getElementById("category").classList.add("input-error"),o||document.getElementById("message").classList.add("input-error");let r=document.getElementById("form-alert");r.innerHTML=`
          <sl-icon slot="icon" name="exclamation-triangle"></sl-icon>
          <strong>Error:</strong> Please fill in all fields.
        `,r.style.display="block";return}let a=document.getElementById("submit-report");a.innerHTML="<sl-spinner></sl-spinner> Sending...",a.disabled=!0;let i=await fetch("https://rapidreach-backend-guki.onrender.com/report",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${n}`},body:JSON.stringify({location:e,category:t,message:o})});i.ok?(r.innerHTML=`
          <h2>Report Submitted</h2>
          <p>Thanks! Your emergency report has been successfully sent.</p>
          <sl-button variant="primary" id="go-home">Back to Home</sl-button>
        `,setTimeout(()=>{document.getElementById("go-home").addEventListener("click",()=>{window.location.hash="home"})},0)):(alert((await i.json()).message||"Failed to send report"),a.innerHTML="Submit Emergency Report",a.disabled=!1)})},0)}else if("myreports"===e){let e=localStorage.getItem("token");if(!e){alert("You must be logged in to view your reports."),window.location.hash="signin";return}r.innerHTML=`
    <div class="logo-wrapper">
        <img src="${t}" alt="RapidReach Logo" class="logo-top-right" />
    </div>
    <h2>My Reports</h2><div id="report-list">Loading...</div>
  `,fetch("https://rapidreach-backend-guki.onrender.com/report",{headers:{Authorization:`Bearer ${e}`}}).then(e=>e.json()).then(e=>{let t=document.getElementById("report-list");Array.isArray(e)&&e.length>0?t.innerHTML=e.map(e=>`
          <sl-card class="mb-3">
            <strong>${e.category.toUpperCase()}</strong> - ${e.location}<br/>
            <small>${new Date(e.createdAt).toLocaleString()}</small><br/>
            <p>${e.message}</p>
          </sl-card>
        `).join(""):t.innerHTML="<p>No reports found.</p>"}).catch(e=>{document.getElementById("report-list").innerHTML="Error loading reports.",console.error("Report load error:",e)})}else if("allreports"===e){let e=localStorage.getItem("token");o(e),r.innerHTML=`
    <div class="logo-wrapper">
        <img src="${t}" alt="RapidReach Logo" class="logo-top-right" />
    </div>
    <h2>All Emergency Reports</h2>
    <div id="report-list">Loading...</div>
    <sl-button id="go-home" variant="success">Back to Home</sl-button>
  `,setTimeout(()=>{document.getElementById("go-home").addEventListener("click",()=>{window.location.hash="home"}),fetch("https://rapidreach-backend-guki.onrender.com/report/all",{headers:{Authorization:`Bearer ${e}`}}).then(e=>e.json()).then(t=>{let o=document.getElementById("report-list");if(!Array.isArray(t)){o.innerHTML="No reports available.";return}o.innerHTML=t.map(e=>`
            <sl-card class="report-card">
              <strong>Category:</strong> ${e.category}<br/>
              <strong>Location:</strong> ${e.location}<br/>
              <strong>Message:</strong> ${e.message}<br/>
              <small>Submitted on: ${new Date(e.createdAt).toLocaleString()}</small><br/>
              <small>Submitted by: ${e.userId?.firstName||e.userId?.email}</small><br/>
              <sl-button variant="danger" size="small" data-id="${e._id}" class="delete-report">Delete</sl-button>
            </sl-card><br/>
          `).join(""),document.querySelectorAll(".delete-report").forEach(t=>{t.addEventListener("click",async()=>{let o=t.getAttribute("data-id");confirm("Are you sure you want to delete this report?")&&((await fetch(`https://rapidreach-backend-guki.onrender.com/report/${o}`,{method:"DELETE",headers:{Authorization:`Bearer ${e}`}})).ok?(alert("Report deleted."),window.location.reload()):alert("Failed to delete the report."))})})}).catch(e=>{console.error("Error loading all reports",e),document.getElementById("report-list").innerHTML="Error loading reports."})},0)}else r.innerHTML=` 
      <div class="logo-wrapper">
        <img src="${t}" alt="RapidReach Logo" class="logo-top-right" />
      </div>
      <h2>404 - Page not found</h2>
    `}console.log("Logo path:",t),window.addEventListener("hashchange",()=>{r(location.hash.replace("#",""))}),r(location.hash.replace("#","")||"signin"),localStorage.getItem("token")&&"#signin"===location.hash&&(location.hash="home"),window.parseJwt=o;
//# sourceMappingURL=RapidReach_frontend.4731fee8.js.map
