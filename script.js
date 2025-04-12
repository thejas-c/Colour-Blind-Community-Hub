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
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            navLinks.forEach(a => a.classList.remove('active'));
            link.classList.add('active');
            if (navContainer.classList.contains('active')) {
                navContainer.classList.remove('active');
            }
        });
    });

    // Color Detection Tool (Only if elements exist)
    const dropZone = document.getElementById('drop-zone');
    const colorUpload = document.getElementById('color-upload');
    const imagePreview = document.getElementById('image-preview');
    const colorSwatches = document.getElementById('color-swatches');
    const colorResult = document.getElementById('color-result');

    if (dropZone && colorUpload && imagePreview && colorSwatches && colorResult) {
        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.classList.add('dragover');
        });

        dropZone.addEventListener('dragleave', () => {
            dropZone.classList.remove('dragover');
        });

        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('dragover');
            const file = e.dataTransfer.files[0];
            if (file) handleImageUpload(file);
        });

        colorUpload.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) handleImageUpload(file);
        });

        function handleImageUpload(file) {
            if (file && file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    imagePreview.src = e.target.result;
                    imagePreview.style.display = 'block';
                    const img = new Image();
                    img.onload = () => {
                        const canvas = document.createElement('canvas');
                        canvas.width = img.width;
                        canvas.height = img.height;
                        const ctx = canvas.getContext('2d');
                        ctx.drawImage(img, 0, 0);
                        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
                        const colors = {};
                        for (let i = 0; i < imageData.length; i += 4) {
                            const r = imageData[i];
                            const g = imageData[i + 1];
                            const b = imageData[i + 2];
                            const color = rgb($,{r}, $,{g}, $,{b});
                            colors[color] = (colors[color] || 0) + 1;
                        }
                        colorSwatches.innerHTML = '';
                        Object.keys(colors)
                            .sort((a, b) => colors[b] - colors[a])
                            .slice(0, 5)
                            .forEach(color => {
                                const swatch = document.createElement('div');
                                swatch.className = 'color-swatch';
                                swatch.style.backgroundColor = color;
                                swatch.title = color;
                                colorSwatches.appendChild(swatch);
                            });
                        colorResult.textContent = 'Top 5 dominant colors detected!';
                        colorResult.style.color = '#2a6fd6';
                    };
                    img.src = e.target.result;
                };
                reader.readAsDataURL(file);
            } else {
                console.error('Invalid file type. Please upload an image.');
                colorResult.textContent = 'Please upload a valid image file.';
                colorResult.style.color = '#ff0000';
            }
        }
    }

    // Color Vision Simulator (Only if elements exist)
    const simulatorForm = document.getElementById('simulator-form');
    const simulatorUpload = document.getElementById('simulator-upload');
    const simulatorPreview = document.getElementById('simulator-preview');
    const simulatorResult = document.getElementById('simulator-result');
    const visionType = document.getElementById('vision-type');

    if (simulatorForm && simulatorUpload && simulatorPreview && simulatorResult && visionType) {
        simulatorForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const file = simulatorUpload.files[0];
            if (file && file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    simulatorPreview.src = e.target.result;
                    simulatorPreview.style.display = 'block';
                    const img = new Image();
                    img.onload = () => {
                        const canvas = document.createElement('canvas');
                        canvas.width = img.width;
                        canvas.height = img.height;
                        const ctx = canvas.getContext('2d');
                        ctx.drawImage(img, 0, 0);
                        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                        const data = imageData.data;
                        for (let i = 0; i < data.length; i += 4) {
                            if (visionType.value === 'protanopia') {
                                data[i] *= 0.5; // Reduce red
                            } else if (visionType.value === 'deuteranopia') {
                                data[i + 1] *= 0.5; // Reduce green
                            }
                        }
                        ctx.putImageData(imageData, 0, 0);
                        simulatorPreview.src = canvas.toDataURL();
                        simulatorResult.textContent = 'Simulation applied!';
                        simulatorResult.style.color = '#2a6fd6';
                    };
                    img.src = e.target.result;
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