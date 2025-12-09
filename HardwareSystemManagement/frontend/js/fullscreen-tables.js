// Fullscreen Table Enhancement Script
document.addEventListener('DOMContentLoaded', function() {
  // Apply full screen optimizations to tables
  function enhanceTablesForFullscreen() {
    // Find all tables
    const tables = document.querySelectorAll('table');
    
    // Apply fullscreen optimizations to each table
    tables.forEach(table => {
      // Make sure table takes full width
      table.style.width = '100%';
      
      // Add responsive wrapper if not already present
      if (!table.parentElement.classList.contains('table-responsive')) {
        const wrapper = document.createElement('div');
        wrapper.classList.add('table-responsive');
        wrapper.style.width = '100%';
        wrapper.style.overflowX = 'auto';
        table.parentNode.insertBefore(wrapper, table);
        wrapper.appendChild(table);
      }
      
      // Add modern styling to table
      table.classList.add('fullscreen-table');
    });
    
    // Make the form container and section full width
    const formContainers = document.querySelectorAll('.form-container');
    formContainers.forEach(container => {
      container.style.maxWidth = '100%';
      container.style.width = '100%';
      container.style.margin = '0 auto';
    });
    
    // Make the container divs full width
    const containers = document.querySelectorAll('.container');
    containers.forEach(container => {
      container.style.maxWidth = '100%';
      container.style.width = '100%';
      container.style.padding = '0 15px';
    });
    
    // Enhance form sections
    const formSections = document.querySelectorAll('.form-section');
    formSections.forEach(section => {
      section.style.width = '100%';
    });
  }
  
  // Apply fullscreen to specific hardware tables
  function enhanceHardwareTables() {
    // List of all hardware table IDs
    const hardwareTables = [
      '#mouseTable',
      '#keyboardTable', 
      '#cmosBatteryTable', 
      '#networkPCITable',
      '#cpuFanTable',
      '#ramTable',
      '#hardDiskTable',
      '#powerSupplyTable'
    ];
    
    // Apply fullscreen to each table if it exists
    hardwareTables.forEach(tableId => {
      const table = document.querySelector(tableId);
      if (table) {
        table.classList.add('fullscreen-table');
        
        // If not already wrapped, add responsive wrapper
        if (!table.parentElement.classList.contains('table-responsive')) {
          const wrapper = document.createElement('div');
          wrapper.classList.add('table-responsive');
          table.parentNode.insertBefore(wrapper, table);
          wrapper.appendChild(table);
        }
      }
    });
  }

  // Call this function when a form with a table is loaded
  const originalLoadForm = window.loadForm;
  if (originalLoadForm) {
    window.loadForm = function(hardware) {
      originalLoadForm(hardware);
      
      // Wait for the form to be loaded
      setTimeout(() => {
        enhanceTablesForFullscreen();
        enhanceHardwareTables();
      }, 300);
    };
  }
  
  // Hook into the display data functions
  const displayFunctions = [
    'displayMouseData', 
    'displayKeyboardData', 
    'displayCmosBatteryData',
    'displayNetworkPCIData',
    'displayCPUFanData',
    'displayRamData',
    'displayHardDiskData',
    'displayPowerSupplyData'
  ];
  
  // Override each display function to enhance tables after data is loaded
  displayFunctions.forEach(funcName => {
    if (window[funcName]) {
      const originalFunc = window[funcName];
      window[funcName] = function(...args) {
        // Call original function
        originalFunc.apply(this, args);
        
        // Enhance tables
        setTimeout(() => {
          enhanceTablesForFullscreen();
          enhanceHardwareTables();
        }, 100);
      };
    }
  });
  
  // Also call it on initial page load
  setTimeout(() => {
    enhanceTablesForFullscreen();
    enhanceHardwareTables();
  }, 500);
});