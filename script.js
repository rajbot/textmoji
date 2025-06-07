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
    const downloadBtn = document.getElementById('download-btn');
    
    // Initial render
    updateSliderValues();
    renderEmoji();
    
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
    downloadBtn.addEventListener('click', downloadEmoji);
    
    function updateSliderValues() {
        fontSizeValue.textContent = `${fontSizeInput.value}px`;
        paddingValue.textContent = `${paddingInput.value}px`;
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
        
        // Calculate background size based on padding
        const bgSize = canvas.width - (padding * 2);
        const cornerRadius = Math.min(20, padding + 5);
        
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
            // Two lines of text - space them apart based on font size
            const lineSpacing = fontSize * 0.8;
            ctx.fillText(line1, canvas.width / 2, canvas.height / 2 - lineSpacing / 2);
            ctx.fillText(line2, canvas.width / 2, canvas.height / 2 + lineSpacing / 2);
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