document.addEventListener('DOMContentLoaded', () => {
  // Scroll to Top
  const scrollTopBtn = document.getElementById('scroll-top');
  if (scrollTopBtn) {
      window.addEventListener('scroll', () => {
          scrollTopBtn.classList.toggle('visible', window.scrollY > 300);
      });
      scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  // Mobile Menu Toggle
  const menuToggle = document.getElementById('menu-toggle');
  const navContainer = document.querySelector('.nav-container');
  if (menuToggle && navContainer) {
      menuToggle.addEventListener('click', () => {
          navContainer.classList.toggle('active');
      });
  }

  // Dynamic Navigation Active State
  const navLinks = document.querySelectorAll('nav a');
  const currentPath = window.location.pathname; // Get the current URL path

  navLinks.forEach(link => {
      if (link.getAttribute('href') === currentPath) {
          link.classList.add('active');
      } else {
          link.classList.remove('active');
      }
  });

  // --- Color Detection Tool ---
  const colorUpload = document.getElementById('color-upload');
  const colorDetectionCanvas = document.getElementById('color-detection-canvas');
  const colorResult = document.getElementById('color-result');
  let colorsData = null; // Store the colors.csv data

  // Load colors.csv data
  fetch('static/colors.csv')
      .then(response => response.text())
      .then(csvData => {
          colorsData = parseCSV(csvData);
      })
      .catch(error => console.error('Error loading colors.csv:', error));

  // Function to parse CSV data
  function parseCSV(csvString) {
      const rows = csvString.split(/\r?\n/);
      return rows.map(row => {
          const values = row.split(',');
          return {
              colour: values[0],
              colour_name: values[1],
              hex: values[2],
              r: parseInt(values[3]),
              g: parseInt(values[4]),
              b: parseInt(values[5])
          };
      });
  }

  if (colorUpload && colorDetectionCanvas && colorResult) {
      colorUpload.addEventListener('change', (e) => {
          const file = e.target.files[0];
          if (file && file.type.startsWith('image/')) {
              const reader = new FileReader();
              reader.onload = (event) => {
                  const img = new Image();
                  img.onload = () => {
                      colorDetectionCanvas.width = img.width;
                      colorDetectionCanvas.height = img.height;
                      const ctx = colorDetectionCanvas.getContext('2d');
                      ctx.drawImage(img, 0, 0);
                      colorDetectionCanvas.style.display = 'block'; // Show the canvas

                      // Add click event listener to the canvas
                      colorDetectionCanvas.addEventListener('click', (clickEvent) => {
                          const x = clickEvent.offsetX;
                          const y = clickEvent.offsetY;
                          const pixelData = ctx.getImageData(x, y, 1, 1).data;
                          const r = pixelData[0];
                          const g = pixelData[1];
                          const b = pixelData[2];

                          // Find closest color name
                          if (colorsData) {
                              const colorName = getColorName(r, g, b);
                              colorResult.textContent = `Clicked color: ${colorName} (R=${r}, G=${g}, B=${b})`;
                              
                          } else {
                              colorResult.textContent = `Clicked color: R=${r}, G=${g}, B=${b} (Colors data not loaded)`;
                          }
                      });
                  };
                  img.src = event.target.result;
              };
              reader.readAsDataURL(file);
          } else {
              colorResult.textContent = 'Please upload a valid image file.';
              colorDetectionCanvas.style.display = 'none';
          }
      });
  }

  function getColorName(r, g, b) {
      let minDistance = Infinity;
      let closestColorName = 'Unknown';

      for (const color of colorsData) {
          const distance = Math.abs(color.r - r) + Math.abs(color.g - g) + Math.abs(color.b - b);
          if (distance < minDistance) {
              minDistance = distance;
              closestColorName = color.colour_name;
          }
      }
      return closestColorName;
  }

  // --- Color Vision Simulator ---
  const simulatorForm = document.getElementById('simulator-form');
  const simulatorUpload = document.getElementById('simulator-upload');
  const simulatorPreview = document.getElementById('simulator-preview');
  const simulatorResult = document.getElementById('simulator-result');
  const visionType = document.getElementById('vision-type');

  if (simulatorForm && simulatorUpload && simulatorPreview && simulatorResult && visionType) {
      simulatorForm.addEventListener('submit', (e) => {
          e.preventDefault(); // Prevent the form from refreshing the page
          const file = simulatorUpload.files[0];

          if (file && file.type.startsWith('image/')) {
              const reader = new FileReader();
              reader.onload = (e) => {
                  simulatorPreview.src = e.target.result;
                  simulatorPreview.style.display = 'block'; // Show the preview image

                  const img = new Image();
                  img.onload = () => {
                      // Create a canvas to manipulate the image
                      const canvas = document.createElement('canvas');
                      canvas.width = img.width;
                      canvas.height = img.height;
                      const ctx = canvas.getContext('2d');
                      ctx.drawImage(img, 0, 0);

                      // Apply the color vision simulation
                      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                      const data = imageData.data;

                      for (let i = 0; i < data.length; i += 4) {
                          let r = data[i];
                          let g = data[i + 1];
                          let b = data[i + 2];

                          if (visionType.value === 'protanopia') {
                              // Simulate protanopia (red blindness) - Simplified
                              const newR = (0.567 * r) + (0.433 * g) + (0 * b);
                              const newG = (0.558 * r) + (0.442 * g) + (0 * b);
                              const newB = (0 * r) + (0.242 * g) + (0.758 * b);

                              data[i] = newR;
                              data[i + 1] = newG;
                              data[i + 2] = newB;

                          } else if (visionType.value === 'deuteranopia') {
                              // Simulate deuteranopia (green blindness) - Simplified
                              const newR = (0.625 * r) + (0.375 * g) + (0 * b);
                              const newG = (0.700 * r) + (0.300 * g) + (0 * b);
                              const newB = (0 * r) + (0.300 * g) + (0.700 * b);

                              data[i] = newR;
                              data[i + 1] = newG;
                              data[i + 2] = newB;

                          } else if (visionType.value === 'tritanopia') {
                              // Simulate tritanopia (blue blindness) - Simplified
                              const newR = (0.950 * r) + (0.050 * g) + (0 * b);
                              const newG = (0 * r) + (0.433 * g) + (0.567 * b);
                              const newB = (0 * r) + (0.475 * g) + (0.525 * b);

                              data[i] = newR;
                              data[i + 1] = newG;
                              data[i + 2] = newB;
                          }
                      }

                      // Apply the modified image data back to the canvas
                      ctx.putImageData(imageData, 0, 0);
                      simulatorPreview.src = canvas.toDataURL(); // Update the preview
                      simulatorResult.textContent = 'Simulation applied successfully!';
                      simulatorResult.style.color = '#2a6fd6';
                  };
                  img.src = e.target.result; // Load the image source
              };
              reader.readAsDataURL(file);
          } else {
              console.error('Invalid file type for simulation. Please upload an image.');
              simulatorResult.textContent = 'Please upload a valid image file.';
              simulatorResult.style.color = '#ff0000';
          }
      });
  }

  // Settings Functionality
  const grayscale = document.getElementById('grayscale');
  const largeFont = document.getElementById('large-font');
  const highContrast = document.getElementById('high-contrast');
  const saveButton = document.querySelector('.save-button');

  if (grayscale && largeFont && highContrast && saveButton) {
      saveButton.addEventListener('click', () => {
          if (grayscale.checked) document.body.classList.add('grayscale');
          else document.body.classList.remove('grayscale');
          if (largeFont.checked) document.body.classList.add('large-font');
          else document.body.classList.remove('large-font');
          if (highContrast.checked) document.body.classList.add('high-contrast');
          else document.body.classList.remove('high-contrast');
          announce('Settings saved successfully!');
      });
  }

  // Live Region for Accessibility
  function announce(message) {
      const liveRegion = document.getElementById('live-notification');
      if (liveRegion) liveRegion.textContent = message;
  }
});