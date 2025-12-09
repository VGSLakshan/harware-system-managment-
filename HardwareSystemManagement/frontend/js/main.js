// ------------------------------
// DOMContentLoaded: Load navbar, initial data and handle animations
// ------------------------------
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM fully loaded");

  // Load Navbar
  fetch("component/Navbar.html")
    .then(res => res.text())
    .then(html => {
      document.getElementById("navbar-placeholder").innerHTML = html;

      // Listen for dropdown change
      const select = document.getElementById("hardware-select");
      if(select){
        select.addEventListener("change", (e) => {
          const selected = e.target.value.toLowerCase();
          loadForm(selected);
        });
      }
    })
    .catch(err => console.error("Failed to load navbar:", err));

  // Add basic animation classes
  document.querySelectorAll('.animate-text').forEach(el => {
    el.classList.add('active');
  });
  
  // Simple scroll animation
  window.addEventListener('scroll', () => {
    const scrollElements = document.querySelectorAll('.scroll-animate');
    scrollElements.forEach(el => {
      const elementTop = el.getBoundingClientRect().top;
      const elementVisible = 150;
      
      if (elementTop < window.innerHeight - elementVisible) {
        el.classList.add('active');
      }
    });
  });
  
  // Handle "Back to Home" button
  const backToHomeBtn = document.getElementById('back-to-home');
  if (backToHomeBtn) {
    backToHomeBtn.addEventListener('click', () => {
      // Show all sections again
      document.body.classList.remove('form-only-mode');
      
      // Reset form container
      const formSection = document.getElementById('form-container');
      formSection.classList.remove('expanded');
      
      // Clear the form
      const formContainer = document.querySelector('.form-container');
      formContainer.innerHTML = '';
      removeFormCSS();
      
      // Reset hardware select
      const hardwareSelect = document.getElementById('hardware-select');
      if (hardwareSelect) hardwareSelect.value = '';
      
      // Scroll to top
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
  
  // Trigger initial scroll check
  setTimeout(() => {
    window.dispatchEvent(new Event('scroll'));
  }, 200);

  // Load mouse data immediately
  loadMouseData();
});

// ------------------------------
// Load forms dynamically
// ------------------------------
function loadForm(hardware) {
  const formContainer = document.querySelector(".form-container");
  const formSection = document.getElementById("form-container");
  
  if (!hardware) {
    // If no hardware is selected, show home page again
    document.body.classList.remove('form-only-mode');
    formSection.classList.remove('expanded');
    formContainer.innerHTML = "";
    removeFormCSS();
    return;
  }

  // Hide home page and show only form section
  document.body.classList.add('form-only-mode');
  formSection.classList.add('expanded');

  const formMap = {
    mouse: { html: "component/forms/MouseForm.html", css: "styles/form/MouseForm.css" },
    keyboard: { html: "component/forms/KeyboardForm.html", css: "styles/form/KeyboardForm.css" },
    cmos: { html: "component/forms/CmosBatteryForm.html", css: "styles/form/CmosBatteryForm.css" },
    cpu: { html: "component/forms/CPUFanForm.html", css: "styles/form/CpuFanForm.css" },
    power: { html: "component/forms/PowerSupplyForm.html", css: "styles/form/PowerSupplyForm.css" },
    ram: { html: "component/forms/RamForm.html", css: "styles/form/RamForm.css" },
    harddisk: { html: "component/forms/HardDiskForm.html", css: "styles/form/HardDiskForm.css" },
    networkpci: { html: "component/forms/NetworkPCIForm.html", css: "styles/form/NetworkPCIForm.css" }
  };

  const formData = formMap[hardware];
  if (!formData) {
    formContainer.innerHTML = "<p>Form not found.</p>";
    removeFormCSS();
    return;
  }

  // Load CSS
  loadFormCSS(formData.css);

  // Load HTML
  fetch(formData.html)
    .then(res => res.text())
    .then(html => {
      formContainer.innerHTML = html;

      // If mouse form, load mouse data immediately
      if (hardware === "mouse") {
        loadMouseData();
        setTimeout(initMouseHandlers, 100);
      }
      
      // If keyboard form, initialize keyboard functionality
      if (hardware === "keyboard") {
        initKeyboardHandlers();
        loadKeyboardData();
      }
      
      // If CMOS battery form, initialize CMOS battery functionality
      if (hardware === "cmos") {
        initCmosBatteryHandlers();
        loadCmosBatteryData();
      }
      
      // If Network PCI form, initialize Network PCI functionality
      if (hardware === "networkpci") {
        initNetworkPCIHandlers();
        loadNetworkPCIData();
      }
      
      // If CPU Fan form, initialize CPU Fan functionality
      if (hardware === "cpu") {
        initCPUFanHandlers();
        loadCPUFanData();
      }
      
      // If RAM form, initialize RAM functionality
      if (hardware === "ram") {
        initRamHandlers();
        loadRamData();
      }
      
      // If Hard Disk form, initialize Hard Disk functionality
      if (hardware === "harddisk") {
        initHardDiskHandlers();
        loadHardDiskData();
      }
      
      // If Power Supply form, initialize Power Supply functionality
      if (hardware === "power") {
        initPowerSupplyHandlers();
        loadPowerSupplyData();
      }
      
      // If Hard Disk form, initialize Hard Disk functionality
      if (hardware === "harddisk") {
        initHardDiskHandlers();
        loadHardDiskData();
      }
      
      // Initialize search after form loads
      setTimeout(initializeTableSearches, 300);
    })
    .catch(err => {
      formContainer.innerHTML = "<p>Failed to load form.</p>";
      console.error("Error loading form:", err);
    });
}

// ------------------------------
// Load & remove form CSS
// ------------------------------
function loadFormCSS(cssPath) {
  removeFormCSS();
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = cssPath;
  link.id = "form-css";
  document.head.appendChild(link);
}

function removeFormCSS() {
  const existing = document.getElementById("form-css");
  if(existing) existing.remove();
}







//-------------------------------------------------------------------------mouse ---------------------------------------------------------------

// ------------------------------
// Load mouse data
// ------------------------------
// Initialize Handlers
// ------------------------------
function initMouseHandlers() {
  const mouseForm = document.getElementById("mouseForm");
  const resetBtn = document.getElementById("resetBtn");

  if (mouseForm) {
    mouseForm.addEventListener("submit", handleMouseSubmit);
  }

  if (resetBtn) {
    resetBtn.addEventListener("click", resetMouseForm);
  }
}

// ------------------------------
// Handle Create or Update Mouse
// ------------------------------
function handleMouseSubmit(event) {
  event.preventDefault();

  const id = document.getElementById("id")?.value || "";

  // Collect all form values safely
  const formData = {
    brand_name: document.getElementById("brand_name")?.value.trim() || "",
    model: document.getElementById("model")?.value.trim() || "",
    quantity_available:
      document.getElementById("quantity_available")?.value || "",
    purchase_date: document.getElementById("purchase_date")?.value || "",
    serial_no: document.getElementById("serial_no")?.value.trim() || "",
    su_no: document.getElementById("su_no")?.value.trim() || "",
    remark: document.getElementById("remark")?.value.trim() || "",
  };

  // Decide if create or update
  const url = id
    ? `http://localhost/HardwareSystemManagement/backend/api/mouse.php?action=update&id=${id}`
    : "http://localhost/HardwareSystemManagement/backend/api/mouse.php?action=create";

  fetch(url, {
    method: "POST", // if backend expects PUT for update, change to PUT
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.status === "success") {
        alert(id ? "Mouse updated successfully!" : "Mouse added successfully!");
        resetMouseForm();
        loadMouseData();
      } else {
        alert("Error: " + (data.message || "Unknown error occurred"));
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("An error occurred. Please check the console for details.");
    });
}

// ------------------------------
// Reset Mouse Form
// ------------------------------
function resetMouseForm() {
  const form = document.getElementById("mouseForm");
  if (form) {
    form.reset();
    const idEl = document.getElementById("id");
    if (idEl) idEl.value = "";
    const btn = document.getElementById("submitBtn");
    if (btn) btn.textContent = "Submit";
  }
}

// ------------------------------
// Load Mouse Data from Database
// ------------------------------
function loadMouseData() {
  fetch("http://localhost/HardwareSystemManagement/backend/api/mouse.php?action=read")
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "success") {
        displayMouseData(data.data);
      } else {
        console.error("Failed to load mouse data:", data.message);
        const tbody = document.querySelector("#mouseTable tbody");
        if (tbody) {
          tbody.innerHTML =
            '<tr><td colspan="9" style="text-align:center">Failed to load data</td></tr>';
        }
      }
    })
    .catch((error) => {
      console.error("Error fetching mouse data:", error);
      const tbody = document.querySelector("#mouseTable tbody");
      if (tbody) {
        tbody.innerHTML =
          '<tr><td colspan="9" style="text-align:center">Error loading data</td></tr>';
      }
    });
}

// ------------------------------
// Display Mouse Data in Table
// ------------------------------
function displayMouseData(mice) {
  const tbody = document.querySelector("#mouseTable tbody");
  if (!tbody) return;

  if (!mice || mice.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="9" style="text-align:center">No mice found</td></tr>';
    return;
  }

  tbody.innerHTML = "";

  mice.forEach((mouse) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${escapeHtml(mouse.brand_name || "")}</td>
      <td>${escapeHtml(mouse.model || "")}</td>
      <td>${mouse.quantity_available || "0"}</td>
      <td>${mouse.purchase_date || ""}</td>
      <td>${escapeHtml(mouse.serial_no || "")}</td>
      <td>${escapeHtml(mouse.su_no || "")}</td>
      <td>${escapeHtml(mouse.remark || "")}</td>
      <td>
        <button onclick="editMouse(${mouse.id})" class="edit-btn">Edit</button>
        <button onclick="deleteMouse(${mouse.id})" class="delete-btn">Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// ------------------------------
// Edit mouse
// ------------------------------
function editMouse(id) {
  fetch(`http://localhost/HardwareSystemManagement/backend/api/mouse.php?action=get&id=${id}`)
    .then(r => r.json())
    .then(json => {
      if (json.status === "success") {
        const form = document.getElementById("mouseForm");
        
        // Check if the form exists in the DOM
        if (!form) {
          console.error("Mouse form not found in the DOM");
          return;
        }
        
        const m = json.data;

        // Populate form fields including hidden id field
        document.getElementById("id").value = id;
        document.getElementById("brand_name").value = m.brand_name || "";
        document.getElementById("model").value = m.model || "";
        document.getElementById("quantity_available").value = m.quantity_available || "";
        document.getElementById("purchase_date").value = m.purchase_date || "";
        document.getElementById("serial_no").value = m.serial_no || "";
        document.getElementById("su_no").value = m.su_no || "";
        document.getElementById("remark").value = m.remark || "";

        // Store the current mouse ID for form submission
        window.currentMouseId = id;
        
        // Find and update the submit button
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
          submitBtn.textContent = "Update Mouse";
        }
        
        // Scroll to form
        form.scrollIntoView({ behavior: 'smooth' });
      } else {
        alert("Mouse not found");
      }
    })
    .catch(err => {
      console.error("Error in editMouse:", err);
    });
}


// Update mouse - REMOVED (using handleMouseSubmit instead)
// function updateMouse(id) { ... }

// Submit form - REMOVED (using handleMouseSubmit instead)

// Listen for form submit - REMOVED in favor of handleMouseSubmit in initMouseHandlers

// ------------------------------
// Delete Mouse
// ------------------------------
function deleteMouse(id) {
  if (confirm("Are you sure you want to delete this mouse?")) {
    fetch(
      `http://localhost/HardwareSystemManagement/backend/api/mouse.php?action=delete&id=${id}`,
      { method: "DELETE" }
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          alert("Mouse deleted successfully!");
          loadMouseData();
        } else {
          alert("Error: " + (data.message || "Failed to delete mouse"));
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("An error occurred. Please check the console.");
      });
  }
}

// ------------------------------
// Escape HTML Helper
// ------------------------------
function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// ------------------------------
// On Page Load
// ------------------------------
document.addEventListener("DOMContentLoaded", () => {
  loadMouseData();
  initMouseHandlers();
});


//----------------------------------------------------------------------keyboard---------------------------------------------------------------
// Initialize keyboard handlers
function initKeyboardHandlers() {
  const keyboardForm = document.getElementById("keyboardForm");
  const resetBtn = document.getElementById("resetBtn");
  
  if (keyboardForm) {
    keyboardForm.addEventListener("submit", handleKeyboardSubmit);
  }
  
  if (resetBtn) {
    resetBtn.addEventListener("click", resetKeyboardForm);
  }
}

// Handle keyboard form submission
function handleKeyboardSubmit(event) {
  event.preventDefault();
  
  const form = event.target;
  const id = document.getElementById("id").value;
  
  // Collect form data
  const formData = {
    brand_name: document.getElementById("brand_name").value.trim(),
    model: document.getElementById("model").value.trim(),
    quantity_available: document.getElementById("quantity_available").value,
    purchase_date: document.getElementById("purchase_date").value,
    serial_no: document.getElementById("serial_no").value.trim(),
    su_no: document.getElementById("su_no").value.trim(),
    remark: document.getElementById("remarks").value.trim()
  };
  
  // URL for create or update
  const url = id ? 
    `http://localhost/HardwareSystemManagement/backend/api/keyboard.php?action=update&id=${id}` : 
    "http://localhost/HardwareSystemManagement/backend/api/keyboard.php?action=create";
  
  // Make API request
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(formData)
  })
  .then(response => response.json())
  .then(data => {
    if (data.status === "success") {
      alert(id ? "Keyboard updated successfully!" : "Keyboard added successfully!");
      resetKeyboardForm();
      loadKeyboardData();
    } else {
      alert("Error: " + (data.message || "Unknown error occurred"));
    }
  })
  .catch(error => {
    console.error("Error:", error);
    alert("An error occurred. Please check the console for details.");
  });
}

// Reset keyboard form
function resetKeyboardForm() {
  const form = document.getElementById("keyboardForm");
  if (form) {
    form.reset();
    document.getElementById("id").value = "";
    document.getElementById("submitBtn").textContent = "Save";
  }
}

// Load keyboard data
function loadKeyboardData() {
  fetch("http://localhost/HardwareSystemManagement/backend/api/keyboard.php?action=read")
    .then(response => response.json())
    .then(data => {
      if (data.status === "success") {
        displayKeyboardData(data.data);
      } else {
        console.error("Failed to load keyboard data:", data.message);
        const tbody = document.querySelector("#keyboardTable tbody");
        if (tbody) {
          tbody.innerHTML = '<tr><td colspan="9" style="text-align:center">Failed to load data</td></tr>';
        }
      }
    })
    .catch(error => {
      console.error("Error fetching keyboard data:", error);
      const tbody = document.querySelector("#keyboardTable tbody");
      if (tbody) {
        tbody.innerHTML = '<tr><td colspan="9" style="text-align:center">Error loading data</td></tr>';
      }
    });
}

// Display keyboard data in table
function displayKeyboardData(keyboards) {
  const tbody = document.querySelector("#keyboardTable tbody");
  if (!tbody) return;
  
  if (!keyboards || keyboards.length === 0) {
    tbody.innerHTML = '<tr><td colspan="9" style="text-align:center">No keyboards found</td></tr>';
    return;
  }
  
  tbody.innerHTML = '';
  
  keyboards.forEach(keyboard => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${escapeHtml(keyboard.brand_name || '')}</td>
      <td>${escapeHtml(keyboard.model || '')}</td>
      <td>${keyboard.quantity_available || '0'}</td>
      <td>${keyboard.purchase_date || ''}</td>
      <td>${escapeHtml(keyboard.serial_no || '')}</td>
      <td>${escapeHtml(keyboard.su_no || '')}</td>
      <td>${escapeHtml(keyboard.remark || '')}</td>
      <td>
        <button onclick="editKeyboard(${keyboard.id})" class="edit-btn">Edit</button>
        <button onclick="deleteKeyboard(${keyboard.id})" class="delete-btn">Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// Edit keyboard
function editKeyboard(id) {
  fetch(`http://localhost/HardwareSystemManagement/backend/api/keyboard.php?action=get&id=${id}`)
    .then(response => response.json())
    .then(data => {
      if (data.status === "success" && data.data) {
        const keyboard = data.data;
        
        // Populate form fields
        document.getElementById("id").value = keyboard.id;
        document.getElementById("brand_name").value = keyboard.brand_name || '';
        document.getElementById("model").value = keyboard.model || '';
        document.getElementById("quantity_available").value = keyboard.quantity_available || '';
        document.getElementById("purchase_date").value = keyboard.purchase_date || '';
        document.getElementById("serial_no").value = keyboard.serial_no || '';
        document.getElementById("su_no").value = keyboard.su_no || '';
        document.getElementById("remarks").value = keyboard.remark || '';
        
        // Change button text
        document.getElementById("submitBtn").textContent = "Update";
        
        // Scroll to form
        document.getElementById("keyboardForm").scrollIntoView({
          behavior: 'smooth'
        });
      } else {
        alert("Failed to load keyboard data");
      }
    })
    .catch(error => {
      console.error("Error fetching keyboard data:", error);
      alert("An error occurred. Please check the console.");
    });
}

// Delete keyboard
function deleteKeyboard(id) {
  if (confirm("Are you sure you want to delete this keyboard?")) {
    fetch(`http://localhost/HardwareSystemManagement/backend/api/keyboard.php?action=delete&id=${id}`, {
      method: "DELETE"
    })
    .then(response => response.json())
    .then(data => {
      if (data.status === "success") {
        alert("Keyboard deleted successfully!");
        loadKeyboardData();
      } else {
        alert("Error: " + (data.message || "Failed to delete keyboard"));
      }
    })
    .catch(error => {
      console.error("Error:", error);
      alert("An error occurred. Please check the console.");
    });
  }
}

// Helper function to escape HTML
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}


//-------------------------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------------------
//---------------------------------------CMOS BATTRY-----------------------------------------------------------------------------------
// Initialize CMOS Battery handlers
function initCmosBatteryHandlers() {
  const cmosBatteryForm = document.getElementById("cmosBatteryForm");
  const resetBtn = document.getElementById("resetBtn");
  
  if (cmosBatteryForm) {
    cmosBatteryForm.addEventListener("submit", handleCmosBatterySubmit);
  }
  
  if (resetBtn) {
    resetBtn.addEventListener("click", resetCmosBatteryForm);
  }
}

// Handle CMOS Battery form submission
function handleCmosBatterySubmit(event) {
  event.preventDefault();
  
  const form = event.target;
  const id = document.getElementById("id").value;
  
  // Collect form data
  const formData = {
    brand_name: document.getElementById("brand_name").value.trim(),
    model: document.getElementById("model").value.trim(),
    quantity_available: document.getElementById("quantity_available").value,
    purchase_date: document.getElementById("purchase_date").value,
    serial_no: document.getElementById("serial_no").value.trim(),
    su_no: document.getElementById("su_no").value.trim(),
    remark: document.getElementById("remarks").value.trim()
  };
  
  // URL for create or update
  const url = id ? 
    `http://localhost/HardwareSystemManagement/backend/api/cmosbattery.php?action=update&id=${id}` : 
    "http://localhost/HardwareSystemManagement/backend/api/cmosbattery.php?action=create";
  
  // Make API request
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(formData)
  })
  .then(response => response.json())
  .then(data => {
    if (data.status === "success") {
      alert(id ? "CMOS Battery updated successfully!" : "CMOS Battery added successfully!");
      resetCmosBatteryForm();
      loadCmosBatteryData();
    } else {
      alert("Error: " + (data.message || "Unknown error occurred"));
    }
  })
  .catch(error => {
    console.error("Error:", error);
    alert("An error occurred. Please check the console for details.");
  });
}

// Reset CMOS Battery form
function resetCmosBatteryForm() {
  const form = document.getElementById("cmosBatteryForm");
  if (form) {
    form.reset();
    document.getElementById("id").value = "";
    document.getElementById("submitBtn").textContent = "Save";
  }
}

// Load CMOS Battery data
function loadCmosBatteryData() {
  fetch("http://localhost/HardwareSystemManagement/backend/api/cmosbattery.php?action=read")
    .then(response => response.json())
    .then(data => {
      if (data.status === "success") {
        displayCmosBatteryData(data.data);
      } else {
        console.error("Failed to load CMOS Battery data:", data.message);
        const tbody = document.querySelector("#cmosBatteryTable tbody");
        if (tbody) {
          tbody.innerHTML = '<tr><td colspan="9" style="text-align:center">Failed to load data</td></tr>';
        }
      }
    })
    .catch(error => {
      console.error("Error fetching CMOS Battery data:", error);
      const tbody = document.querySelector("#cmosBatteryTable tbody");
      if (tbody) {
        tbody.innerHTML = '<tr><td colspan="9" style="text-align:center">Error loading data</td></tr>';
      }
    });
}

// Display CMOS Battery data in table
function displayCmosBatteryData(cmosBatteries) {
  const tbody = document.querySelector("#cmosBatteryTable tbody");
  if (!tbody) return;
  
  if (!cmosBatteries || cmosBatteries.length === 0) {
    tbody.innerHTML = '<tr><td colspan="9" style="text-align:center">No CMOS Batteries found</td></tr>';
    return;
  }
  
  tbody.innerHTML = '';
  
  cmosBatteries.forEach(cmosBattery => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${escapeHtml(cmosBattery.brand_name || '')}</td>
      <td>${escapeHtml(cmosBattery.model || '')}</td>
      <td>${cmosBattery.quantity_available || '0'}</td>
      <td>${cmosBattery.purchase_date || ''}</td>
      <td>${escapeHtml(cmosBattery.serial_no || '')}</td>
      <td>${escapeHtml(cmosBattery.su_no || '')}</td>
      <td>${escapeHtml(cmosBattery.remark || '')}</td>
      <td>
        <button onclick="editCmosBattery(${cmosBattery.id})" class="edit-btn">Edit</button>
        <button onclick="deleteCmosBattery(${cmosBattery.id})" class="delete-btn">Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// Edit CMOS Battery
function editCmosBattery(id) {
  fetch(`http://localhost/HardwareSystemManagement/backend/api/cmosbattery.php?action=get&id=${id}`)
    .then(response => response.json())
    .then(data => {
      if (data.status === "success" && data.data) {
        const cmosBattery = data.data;
        
        // Populate form fields
        document.getElementById("id").value = cmosBattery.id;
        document.getElementById("brand_name").value = cmosBattery.brand_name || '';
        document.getElementById("model").value = cmosBattery.model || '';
        document.getElementById("quantity_available").value = cmosBattery.quantity_available || '';
        document.getElementById("purchase_date").value = cmosBattery.purchase_date || '';
        document.getElementById("serial_no").value = cmosBattery.serial_no || '';
        document.getElementById("su_no").value = cmosBattery.su_no || '';
        document.getElementById("remarks").value = cmosBattery.remark || '';
        
        // Change button text
        document.getElementById("submitBtn").textContent = "Update";
        
        // Scroll to form
        document.getElementById("cmosBatteryForm").scrollIntoView({
          behavior: 'smooth'
        });
      } else {
        alert("Failed to load CMOS Battery data");
      }
    })
    .catch(error => {
      console.error("Error fetching CMOS Battery data:", error);
      alert("An error occurred. Please check the console.");
    });
}

// Delete CMOS Battery
function deleteCmosBattery(id) {
  if (confirm("Are you sure you want to delete this CMOS Battery?")) {
    fetch(`http://localhost/HardwareSystemManagement/backend/api/cmosbattery.php?action=delete&id=${id}`, {
      method: "DELETE"
    })
    .then(response => response.json())
    .then(data => {
      if (data.status === "success") {
        alert("CMOS Battery deleted successfully!");
        loadCmosBatteryData();
      } else {
        alert("Error: " + (data.message || "Failed to delete CMOS Battery"));
      }
    })
    .catch(error => {
      console.error("Error:", error);
      alert("An error occurred. Please check the console.");
    });
  }
}

//-------------------------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------------------
//---------------------------------------NETWORK PCI-----------------------------------------------------------------------------------
// Initialize Network PCI handlers
function initNetworkPCIHandlers() {
  const networkPCIForm = document.getElementById("networkPCIForm");
  const resetBtn = document.getElementById("resetBtn");
  
  if (networkPCIForm) {
    networkPCIForm.addEventListener("submit", handleNetworkPCISubmit);
  }
  
  if (resetBtn) {
    resetBtn.addEventListener("click", resetNetworkPCIForm);
  }
}

// Handle Network PCI form submission
function handleNetworkPCISubmit(event) {
  event.preventDefault();
  
  const form = event.target;
  const id = document.getElementById("id").value;
  
  // Collect form data
  const formData = {
    brand_name: document.getElementById("brand_name").value.trim(),
    model: document.getElementById("model").value.trim(),
    quantity_available: document.getElementById("quantity_available").value,
    purchase_date: document.getElementById("purchase_date").value,
    serial_no: document.getElementById("serial_no").value.trim(),
    su_no: document.getElementById("su_no").value.trim(),
    remark: document.getElementById("remarks").value.trim()
  };
  
  // URL for create or update
  const url = id ? 
    `http://localhost/HardwareSystemManagement/backend/api/networkpci.php?action=update&id=${id}` : 
    "http://localhost/HardwareSystemManagement/backend/api/networkpci.php?action=create";
  
  // Make API request
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(formData)
  })
  .then(response => response.json())
  .then(data => {
    if (data.status === "success") {
      alert(id ? "Network PCI updated successfully!" : "Network PCI added successfully!");
      resetNetworkPCIForm();
      loadNetworkPCIData();
    } else {
      alert("Error: " + (data.message || "Unknown error occurred"));
    }
  })
  .catch(error => {
    console.error("Error:", error);
    alert("An error occurred. Please check the console for details.");
  });
}

// Reset Network PCI form
function resetNetworkPCIForm() {
  const form = document.getElementById("networkPCIForm");
  if (form) {
    form.reset();
    document.getElementById("id").value = "";
    document.getElementById("submitBtn").textContent = "Save";
  }
}

// Load Network PCI data
function loadNetworkPCIData() {
  fetch("http://localhost/HardwareSystemManagement/backend/api/networkpci.php?action=read")
    .then(response => response.json())
    .then(data => {
      if (data.status === "success") {
        displayNetworkPCIData(data.data);
      } else {
        console.error("Failed to load Network PCI data:", data.message);
        const tbody = document.querySelector("#networkPCITable tbody");
        if (tbody) {
          tbody.innerHTML = '<tr><td colspan="9" style="text-align:center">Failed to load data</td></tr>';
        }
      }
    })
    .catch(error => {
      console.error("Error fetching Network PCI data:", error);
      const tbody = document.querySelector("#networkPCITable tbody");
      if (tbody) {
        tbody.innerHTML = '<tr><td colspan="9" style="text-align:center">Error loading data</td></tr>';
      }
    });
}

// Display Network PCI data in table
function displayNetworkPCIData(networkPCIs) {
  const tbody = document.querySelector("#networkPCITable tbody");
  if (!tbody) return;
  
  if (!networkPCIs || networkPCIs.length === 0) {
    tbody.innerHTML = '<tr><td colspan="9" style="text-align:center">No Network PCIs found</td></tr>';
    return;
  }
  
  tbody.innerHTML = '';
  
  networkPCIs.forEach(networkPCI => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${escapeHtml(networkPCI.brand_name || '')}</td>
      <td>${escapeHtml(networkPCI.model || '')}</td>
      <td>${networkPCI.quantity_available || '0'}</td>
      <td>${networkPCI.purchase_date || ''}</td>
      <td>${escapeHtml(networkPCI.serial_no || '')}</td>
      <td>${escapeHtml(networkPCI.su_no || '')}</td>
      <td>${escapeHtml(networkPCI.remark || '')}</td>
      <td>
        <button onclick="editNetworkPCI(${networkPCI.id})" class="edit-btn">Edit</button>
        <button onclick="deleteNetworkPCI(${networkPCI.id})" class="delete-btn">Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// Edit Network PCI
function editNetworkPCI(id) {
  fetch(`http://localhost/HardwareSystemManagement/backend/api/networkpci.php?action=get&id=${id}`)
    .then(response => response.json())
    .then(data => {
      if (data.status === "success" && data.data) {
        const networkPCI = data.data;
        
        // Populate form fields
        document.getElementById("id").value = networkPCI.id;
        document.getElementById("brand_name").value = networkPCI.brand_name || '';
        document.getElementById("model").value = networkPCI.model || '';
        document.getElementById("quantity_available").value = networkPCI.quantity_available || '';
        document.getElementById("purchase_date").value = networkPCI.purchase_date || '';
        document.getElementById("serial_no").value = networkPCI.serial_no || '';
        document.getElementById("su_no").value = networkPCI.su_no || '';
        document.getElementById("remarks").value = networkPCI.remark || '';
        
        // Change button text
        document.getElementById("submitBtn").textContent = "Update";
        
        // Scroll to form
        document.getElementById("networkPCIForm").scrollIntoView({
          behavior: 'smooth'
        });
      } else {
        alert("Failed to load Network PCI data");
      }
    })
    .catch(error => {
      console.error("Error fetching Network PCI data:", error);
      alert("An error occurred. Please check the console.");
    });
}

// Delete Network PCI
function deleteNetworkPCI(id) {
  if (confirm("Are you sure you want to delete this Network PCI?")) {
    fetch(`http://localhost/HardwareSystemManagement/backend/api/networkpci.php?action=delete&id=${id}`, {
      method: "DELETE"
    })
    .then(response => response.json())
    .then(data => {
      if (data.status === "success") {
        alert("Network PCI deleted successfully!");
        loadNetworkPCIData();
      } else {
        alert("Error: " + (data.message || "Failed to delete Network PCI"));
      }
    })
    .catch(error => {
      console.error("Error:", error);
      alert("An error occurred. Please check the console.");
    });
  }
}

//-------------------------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------------------
//---------------------------------------CPU FAN-----------------------------------------------------------------------------------
// Initialize CPU Fan handlers
function initCPUFanHandlers() {
  const cpuFanForm = document.getElementById("cpuFanForm");
  const resetBtn = document.getElementById("resetBtn");
  
  if (cpuFanForm) {
    cpuFanForm.addEventListener("submit", handleCPUFanSubmit);
  }
  
  if (resetBtn) {
    resetBtn.addEventListener("click", resetCPUFanForm);
  }
}

// Handle CPU Fan form submission
function handleCPUFanSubmit(event) {
  event.preventDefault();
  
  const form = event.target;
  const id = document.getElementById("id").value;
  
  // Collect form data
  const formData = {
    brand_name: document.getElementById("brand_name").value.trim(),
    model: document.getElementById("model").value.trim(),
    quantity_available: document.getElementById("quantity_available").value,
    purchase_date: document.getElementById("purchase_date").value,
    serial_no: document.getElementById("serial_no").value.trim(),
    su_no: document.getElementById("su_no").value.trim(),
    remark: document.getElementById("remarks").value.trim()
  };
  
  // URL for create or update
  const url = id ? 
    `http://localhost/HardwareSystemManagement/backend/api/cpufan.php?action=update&id=${id}` : 
    "http://localhost/HardwareSystemManagement/backend/api/cpufan.php?action=create";
  
  // Make API request
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(formData)
  })
  .then(response => response.json())
  .then(data => {
    if (data.status === "success") {
      alert(id ? "CPU Fan updated successfully!" : "CPU Fan added successfully!");
      resetCPUFanForm();
      loadCPUFanData();
    } else {
      alert("Error: " + (data.message || "Unknown error occurred"));
    }
  })
  .catch(error => {
    console.error("Error:", error);
    alert("An error occurred. Please check the console for details.");
  });
}

// Reset CPU Fan form
function resetCPUFanForm() {
  const form = document.getElementById("cpuFanForm");
  if (form) {
    form.reset();
    document.getElementById("id").value = "";
    document.getElementById("submitBtn").textContent = "Save";
  }
}

// Load CPU Fan data
function loadCPUFanData() {
  fetch("http://localhost/HardwareSystemManagement/backend/api/cpufan.php?action=read")
    .then(response => response.json())
    .then(data => {
      if (data.status === "success") {
        displayCPUFanData(data.data);
      } else {
        console.error("Failed to load CPU Fan data:", data.message);
        const tbody = document.querySelector("#cpuFanTable tbody");
        if (tbody) {
          tbody.innerHTML = '<tr><td colspan="9" style="text-align:center">Failed to load data</td></tr>';
        }
      }
    })
    .catch(error => {
      console.error("Error fetching CPU Fan data:", error);
      const tbody = document.querySelector("#cpuFanTable tbody");
      if (tbody) {
        tbody.innerHTML = '<tr><td colspan="9" style="text-align:center">Error loading data</td></tr>';
      }
    });
}

// Display CPU Fan data in table
function displayCPUFanData(cpuFans) {
  const tbody = document.querySelector("#cpuFanTable tbody");
  if (!tbody) return;
  
  if (!cpuFans || cpuFans.length === 0) {
    tbody.innerHTML = '<tr><td colspan="9" style="text-align:center">No CPU Fans found</td></tr>';
    return;
  }
  
  tbody.innerHTML = '';
  
  cpuFans.forEach(cpuFan => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${escapeHtml(cpuFan.brand_name || '')}</td>
      <td>${escapeHtml(cpuFan.model || '')}</td>
      <td>${cpuFan.quantity_available || '0'}</td>
      <td>${cpuFan.purchase_date || ''}</td>
      <td>${escapeHtml(cpuFan.serial_no || '')}</td>
      <td>${escapeHtml(cpuFan.su_no || '')}</td>
      <td>${escapeHtml(cpuFan.remark || '')}</td>
      <td>
        <button onclick="editCPUFan(${cpuFan.id})" class="edit-btn">Edit</button>
        <button onclick="deleteCPUFan(${cpuFan.id})" class="delete-btn">Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// Edit CPU Fan
function editCPUFan(id) {
  fetch(`http://localhost/HardwareSystemManagement/backend/api/cpufan.php?action=get&id=${id}`)
    .then(response => response.json())
    .then(data => {
      if (data.status === "success" && data.data) {
        const cpuFan = data.data;
        
        // Populate form fields
        document.getElementById("id").value = cpuFan.id;
        document.getElementById("brand_name").value = cpuFan.brand_name || '';
        document.getElementById("model").value = cpuFan.model || '';
        document.getElementById("quantity_available").value = cpuFan.quantity_available || '';
        document.getElementById("purchase_date").value = cpuFan.purchase_date || '';
        document.getElementById("serial_no").value = cpuFan.serial_no || '';
        document.getElementById("su_no").value = cpuFan.su_no || '';
        document.getElementById("remarks").value = cpuFan.remark || '';
        
        // Change button text
        document.getElementById("submitBtn").textContent = "Update";
        
        // Scroll to form
        document.getElementById("cpuFanForm").scrollIntoView({
          behavior: 'smooth'
        });
      } else {
        alert("Failed to load CPU Fan data");
      }
    })
    .catch(error => {
      console.error("Error fetching CPU Fan data:", error);
      alert("An error occurred. Please check the console.");
    });
}

// Delete CPU Fan
function deleteCPUFan(id) {
  if (confirm("Are you sure you want to delete this CPU Fan?")) {
    fetch(`http://localhost/HardwareSystemManagement/backend/api/cpufan.php?action=delete&id=${id}`, {
      method: "DELETE"
    })
    .then(response => response.json())
    .then(data => {
      if (data.status === "success") {
        alert("CPU Fan deleted successfully!");
        loadCPUFanData();
      } else {
        alert("Error: " + (data.message || "Failed to delete CPU Fan"));
      }
    })
    .catch(error => {
      console.error("Error:", error);
      alert("An error occurred. Please check the console.");
    });
  }
}





//----------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------
//---------------------------------------Ram-----------------------------------------------------------------------------

// Initialize RAM handlers
function initRamHandlers() {
  const ramForm = document.getElementById("ramForm");
  const resetBtn = document.getElementById("resetBtn");
  
  if (ramForm) {
    ramForm.addEventListener("submit", handleRamSubmit);
  }
  
  if (resetBtn) {
    resetBtn.addEventListener("click", resetRamForm);
  }
}

// Handle RAM form submission
function handleRamSubmit(event) {
  event.preventDefault();
  
  const form = event.target;
  const id = document.getElementById("id").value;
  
  // Collect form data
  const formData = {
    brand_name: document.getElementById("brand_name").value.trim(),
    model: document.getElementById("model").value.trim(),
    quantity_available: document.getElementById("quantity_available").value,
    purchase_date: document.getElementById("purchase_date").value,
    serial_no: document.getElementById("serial_no").value.trim(),
    su_no: document.getElementById("su_no").value.trim(),
    remark: document.getElementById("remarks").value.trim()
  };
  
  // URL for create or update
  const url = id ? 
    `http://localhost/HardwareSystemManagement/backend/api/ram.php?action=update&id=${id}` : 
    "http://localhost/HardwareSystemManagement/backend/api/ram.php?action=create";
  
  // Make API request
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(formData)
  })
  .then(response => response.json())
  .then(data => {
    if (data.status === "success") {
      alert(id ? "RAM updated successfully!" : "RAM added successfully!");
      resetRamForm();
      loadRamData();
    } else {
      alert("Error: " + (data.message || "Unknown error occurred"));
    }
  })
  .catch(error => {
    console.error("Error:", error);
    alert("An error occurred. Please check the console for details.");
  });
}

// Reset RAM form
function resetRamForm() {
  const form = document.getElementById("ramForm");
  if (form) {
    form.reset();
    document.getElementById("id").value = "";
    document.getElementById("submitBtn").textContent = "Save";
  }
}

// Load RAM data
function loadRamData() {
  fetch("http://localhost/HardwareSystemManagement/backend/api/ram.php?action=read")
    .then(response => response.json())
    .then(data => {
      if (data.status === "success") {
        displayRamData(data.data);
      } else {
        console.error("Failed to load RAM data:", data.message);
        const tbody = document.querySelector("#ramTable tbody");
        if (tbody) {
          tbody.innerHTML = '<tr><td colspan="8" style="text-align:center">Failed to load data</td></tr>';
        }
      }
    })
    .catch(error => {
      console.error("Error fetching RAM data:", error);
      const tbody = document.querySelector("#ramTable tbody");
      if (tbody) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align:center">Error loading data</td></tr>';
      }
    });
}

// Display RAM data in table
function displayRamData(rams) {
  const tbody = document.querySelector("#ramTable tbody");
  if (!tbody) return;
  
  if (!rams || rams.length === 0) {
    tbody.innerHTML = '<tr><td colspan="8" style="text-align:center">No RAM found</td></tr>';
    return;
  }
  
  tbody.innerHTML = '';
  
  rams.forEach(ram => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${escapeHtml(ram.brand_name || '')}</td>
      <td>${escapeHtml(ram.model || '')}</td>
      <td>${ram.quantity_available || '0'}</td>
      <td>${ram.purchase_date || ''}</td>
      <td>${escapeHtml(ram.serial_no || '')}</td>
      <td>${escapeHtml(ram.su_no || '')}</td>
      <td>${escapeHtml(ram.remark || '')}</td>
      <td>
        <button onclick="editRam(${ram.id})" class="edit-btn">Edit</button>
        <button onclick="deleteRam(${ram.id})" class="delete-btn">Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// Edit RAM
function editRam(id) {
  fetch(`http://localhost/HardwareSystemManagement/backend/api/ram.php?action=get&id=${id}`)
    .then(response => response.json())
    .then(data => {
      if (data.status === "success" && data.data) {
        const ram = data.data;
        
        // Populate form fields
        document.getElementById("id").value = ram.id;
        document.getElementById("brand_name").value = ram.brand_name || '';
        document.getElementById("model").value = ram.model || '';
        document.getElementById("quantity_available").value = ram.quantity_available || '';
        document.getElementById("purchase_date").value = ram.purchase_date || '';
        document.getElementById("serial_no").value = ram.serial_no || '';
        document.getElementById("su_no").value = ram.su_no || '';
        document.getElementById("remarks").value = ram.remark || '';
        
        // Change button text
        document.getElementById("submitBtn").textContent = "Update";
        
        // Scroll to form
        document.getElementById("ramForm").scrollIntoView({
          behavior: 'smooth'
        });
      } else {
        alert("Failed to load RAM data");
      }
    })
    .catch(error => {
      console.error("Error fetching RAM data:", error);
      alert("An error occurred. Please check the console.");
    });
}

// Delete RAM
function deleteRam(id) {
  if (confirm("Are you sure you want to delete this RAM?")) {
    fetch(`http://localhost/HardwareSystemManagement/backend/api/ram.php?action=delete&id=${id}`, {
      method: "DELETE"
    })
    .then(response => response.json())
    .then(data => {
      if (data.status === "success") {
        alert("RAM deleted successfully!");
        loadRamData();
      } else {
        alert("Error: " + (data.message || "Failed to delete RAM"));
      }
    })
    .catch(error => {
      console.error("Error:", error);
      alert("An error occurred. Please check the console.");
    });
  }
}

//-------------------------------------------------------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
//---------------------------------------POWER SUPPLY-----------------------------------------------------------------------------------

// Initialize Power Supply handlers
function initPowerSupplyHandlers() {
  const powerSupplyForm = document.getElementById("powerSupplyForm");
  const resetBtn = document.getElementById("resetBtn");
  
  if (powerSupplyForm) {
    powerSupplyForm.addEventListener("submit", handlePowerSupplySubmit);
  }
  
  if (resetBtn) {
    resetBtn.addEventListener("click", resetPowerSupplyForm);
  }
}

// Handle Power Supply form submission
function handlePowerSupplySubmit(event) {
  event.preventDefault();
  
  const form = event.target;
  const id = document.getElementById("id").value;
  
  // Collect form data
  const formData = {
    power_supply_no: document.getElementById("power_supply_no").value.trim(),
    date: document.getElementById("date").value,
    model: document.getElementById("model").value.trim(),
    serial_no: document.getElementById("serial_no").value.trim(),
    su_no: document.getElementById("su_no").value.trim(),
    job_no: document.getElementById("job_no").value.trim(),
    division: document.getElementById("division").value.trim(),
    remarks: document.getElementById("remarks").value.trim()
  };
  
  // URL for create or update
  const url = id ? 
    `http://localhost/HardwareSystemManagement/backend/api/powersupply.php?action=update&id=${id}` : 
    "http://localhost/HardwareSystemManagement/backend/api/powersupply.php?action=create";
  
  // Make API request
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(formData)
  })
  .then(response => response.json())
  .then(data => {
    if (data.status === "success") {
      alert(id ? "Power Supply updated successfully!" : "Power Supply added successfully!");
      resetPowerSupplyForm();
      loadPowerSupplyData();
    } else {
      alert("Error: " + (data.message || "Unknown error occurred"));
    }
  })
  .catch(error => {
    console.error("Error:", error);
    alert("An error occurred. Please check the console for details.");
  });
}

// Reset Power Supply form
function resetPowerSupplyForm() {
  const form = document.getElementById("powerSupplyForm");
  if (form) {
    form.reset();
    document.getElementById("id").value = "";
    document.getElementById("submitBtn").textContent = "Save";
  }
}

// Load Power Supply data
function loadPowerSupplyData() {
  fetch("http://localhost/HardwareSystemManagement/backend/api/powersupply.php?action=read")
    .then(response => response.json())
    .then(data => {
      if (data.status === "success") {
        displayPowerSupplyData(data.data);
      } else {
        console.error("Failed to load power supply data:", data.message);
        const tbody = document.querySelector("#powerSupplyTable tbody");
        if (tbody) {
          tbody.innerHTML = '<tr><td colspan="9" style="text-align:center">Failed to load data</td></tr>';
        }
      }
    })
    .catch(error => {
      console.error("Error fetching power supply data:", error);
      const tbody = document.querySelector("#powerSupplyTable tbody");
      if (tbody) {
        tbody.innerHTML = '<tr><td colspan="9" style="text-align:center">Error loading data</td></tr>';
      }
    });
}

// Display Power Supply data in table
function displayPowerSupplyData(powerSupplies) {
  const tbody = document.querySelector("#powerSupplyTable tbody");
  if (!tbody) return;
  
  if (!powerSupplies || powerSupplies.length === 0) {
    tbody.innerHTML = '<tr><td colspan="9" style="text-align:center">No power supplies found</td></tr>';
    return;
  }
  
  tbody.innerHTML = '';
  
  powerSupplies.forEach(powerSupply => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${escapeHtml(powerSupply.power_supply_no || '')}</td>
      <td>${powerSupply.date || ''}</td>
      <td>${escapeHtml(powerSupply.model || '')}</td>
      <td>${escapeHtml(powerSupply.serial_no || '')}</td>
      <td>${escapeHtml(powerSupply.su_no || '')}</td>
      <td>${escapeHtml(powerSupply.job_no || '')}</td>
      <td>${escapeHtml(powerSupply.division || '')}</td>
      <td>${escapeHtml(powerSupply.remarks || '')}</td>
      <td>
        <button onclick="editPowerSupply(${powerSupply.id})" class="edit-btn">Edit</button>
        <button onclick="deletePowerSupply(${powerSupply.id})" class="delete-btn">Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// Edit Power Supply
function editPowerSupply(id) {
  fetch(`http://localhost/HardwareSystemManagement/backend/api/powersupply.php?action=get&id=${id}`)
    .then(response => response.json())
    .then(data => {
      if (data.status === "success" && data.data) {
        const powerSupply = data.data;
        
        // Populate form fields
        document.getElementById("id").value = powerSupply.id;
        document.getElementById("power_supply_no").value = powerSupply.power_supply_no || '';
        document.getElementById("date").value = powerSupply.date || '';
        document.getElementById("model").value = powerSupply.model || '';
        document.getElementById("serial_no").value = powerSupply.serial_no || '';
        document.getElementById("su_no").value = powerSupply.su_no || '';
        document.getElementById("job_no").value = powerSupply.job_no || '';
        document.getElementById("division").value = powerSupply.division || '';
        document.getElementById("remarks").value = powerSupply.remarks || '';
        
        // Change button text
        document.getElementById("submitBtn").textContent = "Update";
        
        // Scroll to form
        document.getElementById("powerSupplyForm").scrollIntoView({
          behavior: 'smooth'
        });
      } else {
        alert("Failed to load power supply data");
      }
    })
    .catch(error => {
      console.error("Error fetching power supply data:", error);
      alert("An error occurred. Please check the console.");
    });
}

// Delete Power Supply
function deletePowerSupply(id) {
  if (confirm("Are you sure you want to delete this power supply?")) {
    fetch(`http://localhost/HardwareSystemManagement/backend/api/powersupply.php?action=delete&id=${id}`, {
      method: "DELETE"
    })
    .then(response => response.json())
    .then(data => {
      if (data.status === "success") {
        alert("Power Supply deleted successfully!");
        loadPowerSupplyData();
      } else {
        alert("Error: " + (data.message || "Failed to delete power supply"));
      }
    })
    .catch(error => {
      console.error("Error:", error);
      alert("An error occurred. Please check the console.");
    });
  }
}

// =====================================
// Hard Disk CRUD Functions
// =====================================

// Initialize Hard Disk Handlers
function initHardDiskHandlers() {
  const hardDiskForm = document.getElementById("hardDiskForm");
  const resetBtn = document.getElementById("resetBtn");
  
  if (hardDiskForm) {
    hardDiskForm.addEventListener("submit", handleHardDiskSubmit);
  }
  
  if (resetBtn) {
    resetBtn.addEventListener("click", resetHardDiskForm);
  }
}

// Handle Hard Disk Form Submit (Create or Update)
function handleHardDiskSubmit(event) {
  event.preventDefault();
  
  const formData = {
    hard_no: document.getElementById("hard_no").value,
    date: document.getElementById("date").value,
    model: document.getElementById("model").value,
    serial_no: document.getElementById("serial_no").value,
    su_no: document.getElementById("su_no").value,
    job_no: document.getElementById("job_no").value,
    section_division: document.getElementById("section_division").value,
    user: document.getElementById("user").value,
    remarks: document.getElementById("remarks").value
  };

  const id = document.getElementById("id").value;
  const isUpdate = id !== "";
  
  // API URL based on operation (update or create)
  const apiUrl = isUpdate ? 
    `http://localhost/HardwareSystemManagement/backend/api/harddisk.php?action=update&id=${id}` : 
    "http://localhost/HardwareSystemManagement/backend/api/harddisk.php?action=create";
  
  // Send request to API
  fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData)
  })
  .then(response => response.json())
  .then(data => {
    if (data.status === "success") {
      alert(isUpdate ? "Hard disk updated successfully!" : "Hard disk added successfully!");
      resetHardDiskForm();
      loadHardDiskData();
    } else {
      alert("Error: " + (data.message || "Failed to save hard disk"));
    }
  })
  .catch(error => {
    console.error("Error:", error);
    alert("An error occurred. Please check the console.");
  });
}

// Reset Hard Disk Form
function resetHardDiskForm() {
  const form = document.getElementById("hardDiskForm");
  if (form) {
    form.reset();
    document.getElementById("id").value = "";
    document.getElementById("submitBtn").textContent = "Save";
  }
}

// Load Hard Disk Data
function loadHardDiskData() {
  fetch("http://localhost/HardwareSystemManagement/backend/api/harddisk.php?action=read")
    .then(response => response.json())
    .then(data => {
      if (data.status === "success") {
        displayHardDiskData(data.data);
      } else {
        console.error("Failed to load hard disk data:", data.message);
        const tbody = document.querySelector("#hardDiskTable tbody");
        if (tbody) {
          tbody.innerHTML = '<tr><td colspan="11" style="text-align:center">Failed to load data</td></tr>';
        }
      }
    })
    .catch(error => {
      console.error("Error fetching hard disk data:", error);
      const tbody = document.querySelector("#hardDiskTable tbody");
      if (tbody) {
        tbody.innerHTML = '<tr><td colspan="11" style="text-align:center">Error loading data</td></tr>';
      }
    });
}

// Display Hard Disk data in table
function displayHardDiskData(hardDisks) {
  const tbody = document.querySelector("#hardDiskTable tbody");
  if (!tbody) return;
  
  if (!hardDisks || hardDisks.length === 0) {
    tbody.innerHTML = '<tr><td colspan="11" style="text-align:center">No hard disks found</td></tr>';
    return;
  }
  
  tbody.innerHTML = '';
  
  hardDisks.forEach(hardDisk => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${escapeHtml(hardDisk.hard_no || '')}</td>
      <td>${hardDisk.date || ''}</td>
      <td>${escapeHtml(hardDisk.model || '')}</td>
      <td>${escapeHtml(hardDisk.serial_no || '')}</td>
      <td>${escapeHtml(hardDisk.su_no || '')}</td>
      <td>${escapeHtml(hardDisk.job_no || '')}</td>
      <td>${escapeHtml(hardDisk.section_division || '')}</td>
      <td>${escapeHtml(hardDisk.user || '')}</td>
      <td>${escapeHtml(hardDisk.remarks || '')}</td>
      <td>${hardDisk.created_at || ''}</td>
      <td>
        <button onclick="editHardDisk(${hardDisk.id})" class="edit-btn">Edit</button>
        <button onclick="deleteHardDisk(${hardDisk.id})" class="delete-btn">Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// Edit Hard Disk
function editHardDisk(id) {
  fetch(`http://localhost/HardwareSystemManagement/backend/api/harddisk.php?action=get&id=${id}`)
    .then(response => response.json())
    .then(data => {
      if (data.status === "success") {
        const hardDisk = data.data;
        
        // Set form values
        document.getElementById("id").value = hardDisk.id;
        document.getElementById("hard_no").value = hardDisk.hard_no;
        document.getElementById("date").value = hardDisk.date;
        document.getElementById("model").value = hardDisk.model;
        document.getElementById("serial_no").value = hardDisk.serial_no;
        document.getElementById("su_no").value = hardDisk.su_no;
        document.getElementById("job_no").value = hardDisk.job_no;
        document.getElementById("section_division").value = hardDisk.section_division;
        document.getElementById("user").value = hardDisk.user;
        document.getElementById("remarks").value = hardDisk.remarks;
        
        // Change button text
        document.getElementById("submitBtn").textContent = "Update";
        
        // Scroll to form
        document.getElementById("hardDiskForm").scrollIntoView();
      } else {
        alert("Error: " + (data.message || "Failed to load hard disk details"));
      }
    })
    .catch(error => {
      console.error("Error:", error);
      alert("An error occurred. Please check the console.");
    });
}

// Delete Hard Disk
function deleteHardDisk(id) {
  if (confirm("Are you sure you want to delete this hard disk?")) {
    fetch(`http://localhost/HardwareSystemManagement/backend/api/harddisk.php?id=${id}`, {
      method: "DELETE"
    })
    .then(response => response.json())
    .then(data => {
      if (data.status === "success") {
        alert("Hard Disk deleted successfully!");
        loadHardDiskData();
      } else {
        alert("Error: " + (data.message || "Failed to delete hard disk"));
      }
    })
    .catch(error => {
      console.error("Error:", error);
      alert("An error occurred. Please check the console.");
    });
  }
}

// ============================================================
// TABLE SEARCH FUNCTIONALITY
// ============================================================

function setupTableSearch(searchInputId, tableId) {
  const searchInput = document.getElementById(searchInputId);
  if (!searchInput) return;
  
  searchInput.addEventListener('keyup', function() {
    filterTable(tableId, this.value);
  });
}

function filterTable(tableId, searchTerm) {
  const table = document.getElementById(tableId);
  if (!table) return;
  
  const tbody = table.querySelector('tbody');
  if (!tbody) return;
  
  const rows = tbody.querySelectorAll('tr');
  const term = searchTerm.toLowerCase();
  
  rows.forEach(row => {
    const text = row.textContent.toLowerCase();
    if (text.includes(term)) {
      row.style.display = '';
    } else {
      row.style.display = 'none';
    }
  });
}

function initializeTableSearches() {
  setTimeout(() => {
    setupTableSearch('mouseSearch', 'mouseTable');
    setupTableSearch('keyboardSearch', 'keyboardTable');
    setupTableSearch('cmosBatterySearch', 'cmosBatteryTable');
    setupTableSearch('networkPCISearch', 'networkPCITable');
    setupTableSearch('cpuFanSearch', 'cpuFanTable');
    setupTableSearch('ramSearch', 'ramTable');
    setupTableSearch('hardDiskSearch', 'hardDiskTable');
    setupTableSearch('powerSupplySearch', 'powerSupplyTable');
  }, 200);
}

// ============================================================
// PDF DOWNLOAD FUNCTIONALITY
// ============================================================

function downloadTablePDF(tableId, fileName) {
  const table = document.getElementById(tableId);
  if (!table) {
    alert('Table not found');
    return;
  }

  // Get all visible rows (not hidden by search)
  const rows = [];
  const thead = table.querySelector('thead');
  const tbody = table.querySelector('tbody');
  
  if (thead) {
    rows.push(thead.querySelectorAll('tr'));
  }
  if (tbody) {
    rows.push(tbody.querySelectorAll('tr:not([style*="display: none"])'));
  }

  // Build HTML table for PDF
  let htmlTable = '<table border="1" cellpadding="8" cellspacing="0" style="width: 100%; border-collapse: collapse;">';
  
  if (thead) {
    htmlTable += '<thead><tr style="background-color: #144566; color: white;">';
    thead.querySelectorAll('th').forEach(th => {
      htmlTable += '<th style="padding: 10px; text-align: left;">' + (th.textContent || '') + '</th>';
    });
    htmlTable += '</tr></thead>';
  }

  htmlTable += '<tbody>';
  if (tbody) {
    tbody.querySelectorAll('tr').forEach(row => {
      if (row.style.display !== 'none') {
        htmlTable += '<tr>';
        row.querySelectorAll('td').forEach(td => {
          // Skip action buttons
          if (!td.innerHTML.includes('onclick')) {
            htmlTable += '<td style="padding: 8px; text-align: left;">' + (td.textContent || '') + '</td>';
          }
        });
        htmlTable += '</tr>';
      }
    });
  }
  htmlTable += '</tbody></table>';

  // Create PDF using simple HTML to PDF
  const pdfWindow = window.open('', '_blank');
  pdfWindow.document.write(`
    <html>
      <head>
        <title>${fileName}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1 { color: #144566; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #144566; color: white; }
          tr:nth-child(even) { background-color: #f9f9f9; }
        </style>
      </head>
      <body>
        <h1>${fileName}</h1>
        <p>Generated on: ${new Date().toLocaleString()}</p>
        ${htmlTable}
      </body>
    </html>
  `);
  pdfWindow.document.close();
  
  // Wait a moment for content to render, then print to PDF
  setTimeout(() => {
    pdfWindow.print();
  }, 250);
}



