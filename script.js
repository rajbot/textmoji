document.addEventListener('DOMContentLoaded', () => {
    // Get DOM elements
    const canvas = document.getElementById('emoji-canvas');
    const ctx = canvas.getContext('2d');
    const line1Input = document.getElementById('line1');
    const line2Input = document.getElementById('line2');
    const fontSelect = document.getElementById('font-select');
    const textColorInput = document.getElementById('text-color');
    const bgColorInput = document.getElementById('bg-color');
    const fontSizeInput = document.getElementById('font-size');
    const fontSizeValue = document.getElementById('font-size-value');
    const paddingInput = document.getElementById('padding');
    const paddingValue = document.getElementById('padding-value');
    const lineSpacingInput = document.getElementById('line-spacing');
    const lineSpacingValue = document.getElementById('line-spacing-value');
    const cornerRadiusInput = document.getElementById('corner-radius');
    const cornerRadiusValue = document.getElementById('corner-radius-value');
    const downloadBtn = document.getElementById('download-btn');
    
    // Create a load fonts button
    createLoadFontsButton();
    
    // Initial render
    updateSliderValues();
    renderEmoji();
    
    // Create a button to load fonts (needed for user activation)
    function createLoadFontsButton() {
        // Create container for the button
        const fontButtonContainer = document.createElement('div');
        fontButtonContainer.className = 'font-button-container';
        
        // Create button
        const loadFontsBtn = document.createElement('button');
        loadFontsBtn.id = 'load-fonts-btn';
        loadFontsBtn.textContent = 'Load System Fonts';
        loadFontsBtn.className = 'action-button';
        
        // Add button before the font select
        const fontControlGroup = fontSelect.closest('.control-group');
        fontButtonContainer.appendChild(loadFontsBtn);
        fontControlGroup.insertBefore(fontButtonContainer, fontControlGroup.firstChild);
        
        // Add click event listener
        loadFontsBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            loadFontsBtn.textContent = 'Loading...';
            loadFontsBtn.disabled = true;
            
            try {
                await loadLocalFonts();
                loadFontsBtn.textContent = 'Fonts Loaded';
            } catch (error) {
                console.error('Error:', error);
                loadFontsBtn.textContent = 'Failed to Load Fonts';
                loadFontsBtn.disabled = false;
            }
        });
    }
    
    // Function to load and populate fonts from user's system
    async function loadLocalFonts() {
        // Check if the API is supported
        if (!('queryLocalFonts' in window)) {
            console.log('Local Font Access API is not supported in this browser');
            alert('Local Font Access API is not supported in this browser');
            return;
        }
        
        try {
            // Request permission and get fonts with user activation (triggered by button click)
            const availableFonts = await window.queryLocalFonts();
            
            if (availableFonts.length === 0) {
                console.log('No fonts were returned');
                alert('No fonts could be loaded from your system');
                return;
            }
            
            // Create a Set to avoid duplicate font family names
            const fontFamilies = new Set();
            
            // Store existing options to preserve them
            const existingOptions = Array.from(fontSelect.options).map(option => ({
                value: option.value,
                text: option.textContent
            }));
            
            // Clear existing options
            fontSelect.innerHTML = '';
            
            // Add back the existing options first
            existingOptions.forEach(option => {
                fontFamilies.add(option.value);
                const optionEl = document.createElement('option');
                optionEl.value = option.value;
                optionEl.textContent = option.text;
                fontSelect.appendChild(optionEl);
            });
            
            // Add new fonts from local system
            let addedCount = 0;
            availableFonts.forEach(fontData => {
                if (!fontFamilies.has(fontData.family)) {
                    fontFamilies.add(fontData.family);
                    addedCount++;
                }
            });
            
            // Sort and add all fonts to select
            [...fontFamilies].sort().forEach(font => {
                const option = document.createElement('option');
                option.value = font;
                option.textContent = font;
                fontSelect.appendChild(option);
            });
            
            // Set default selection (Arial or first available font)
            const defaultFont = 'Arial';
            if ([...fontFamilies].includes(defaultFont)) {
                fontSelect.value = defaultFont;
            }
            
            // Render with the selected font
            renderEmoji();
            
            console.log(`${addedCount} fonts added from your system`);
            alert(`${addedCount} fonts have been added to the dropdown menu`);
            
        } catch (error) {
            console.error('Error loading local fonts:', error);
            alert('Error loading fonts: ' + error.message);
            throw error;
        }
    }
    
    // Add event listeners
    line1Input.addEventListener('input', renderEmoji);
    line2Input.addEventListener('input', renderEmoji);
    fontSelect.addEventListener('change', renderEmoji);
    textColorInput.addEventListener('input', renderEmoji);
    bgColorInput.addEventListener('input', renderEmoji);
    fontSizeInput.addEventListener('input', () => {
        updateSliderValues();
        renderEmoji();
    });
    paddingInput.addEventListener('input', () => {
        updateSliderValues();
        renderEmoji();
    });
    lineSpacingInput.addEventListener('input', () => {
        updateSliderValues();
        renderEmoji();
    });
    cornerRadiusInput.addEventListener('input', () => {
        updateSliderValues();
        renderEmoji();
    });
    downloadBtn.addEventListener('click', downloadEmoji);
    
    function updateSliderValues() {
        fontSizeValue.textContent = `${fontSizeInput.value}px`;
        paddingValue.textContent = `${paddingInput.value}px`;
        lineSpacingValue.textContent = lineSpacingInput.value;
        cornerRadiusValue.textContent = `${cornerRadiusInput.value}px`;
    }
    
    function renderEmoji() {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Get current values
        const line1 = line1Input.value;
        const line2 = line2Input.value;
        const font = fontSelect.value;
        const textColor = textColorInput.value;
        const bgColor = bgColorInput.value;
        const fontSize = parseInt(fontSizeInput.value);
        const padding = parseInt(paddingInput.value);
        const lineSpacing = parseFloat(lineSpacingInput.value);
        const cornerRadius = parseInt(cornerRadiusInput.value);
        
        // Calculate background size based on padding
        const bgSize = canvas.width - (padding * 2);
        
        // Draw background
        ctx.fillStyle = bgColor;
        drawRoundedRect(ctx, padding, padding, bgSize, bgSize, cornerRadius);
        
        // Draw text
        ctx.fillStyle = textColor;
        ctx.font = `bold ${fontSize}px ${font}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Position text based on whether we have 1 or 2 lines
        if (line1 && line2) {
            // Two lines of text - space them apart based on font size and lineSpacing factor
            const spaceBetweenLines = fontSize * lineSpacing;
            ctx.fillText(line1, canvas.width / 2, canvas.height / 2 - spaceBetweenLines / 2);
            ctx.fillText(line2, canvas.width / 2, canvas.height / 2 + spaceBetweenLines / 2);
        } else if (line1) {
            // Just line 1
            ctx.fillText(line1, canvas.width / 2, canvas.height / 2);
        } else if (line2) {
            // Just line 2
            ctx.fillText(line2, canvas.width / 2, canvas.height / 2);
        }
    }
    
    function drawRoundedRect(context, x, y, width, height, radius) {
        context.beginPath();
        context.moveTo(x + radius, y);
        context.arcTo(x + width, y, x + width, y + height, radius);
        context.arcTo(x + width, y + height, x, y + height, radius);
        context.arcTo(x, y + height, x, y, radius);
        context.arcTo(x, y, x + width, y, radius);
        context.closePath();
        context.fill();
    }
    
    function downloadEmoji() {
        // Create temporary link
        const link = document.createElement('a');
        link.download = 'textmoji.png';
        
        // Convert canvas to data URL
        const dataURL = canvas.toDataURL('image/png');
        link.href = dataURL;
        
        // Trigger download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
});