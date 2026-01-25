document.querySelectorAll('.tool-nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const tool = btn.dataset.tool;
        const section = document.getElementById(tool);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const targetId = btn.dataset.copy;
        const target = document.getElementById(targetId);
        
        let textToCopy = '';
        if (target.tagName === 'TEXTAREA' || target.tagName === 'INPUT') {
            textToCopy = target.value;
        } else {
            textToCopy = target.textContent;
        }
        
        navigator.clipboard.writeText(textToCopy).then(() => {
            const originalText = btn.textContent;
            btn.textContent = 'COPIED!';
            btn.classList.add('copied');
            
            setTimeout(() => {
                btn.textContent = originalText;
                btn.classList.remove('copied');
            }, 2000);
        });
    });
});

const gradientType = document.getElementById('gradient-type');
const gradientAngle = document.getElementById('gradient-angle');
const gradientAngleValue = document.getElementById('gradient-angle-value');
const gradientColor1 = document.getElementById('gradient-color1');
const gradientColor2 = document.getElementById('gradient-color2');
const gradientPreview = document.getElementById('gradient-preview');
const gradientCode = document.getElementById('gradient-code');
const gradientAddColor = document.getElementById('gradient-add-color');
const gradientStopsContainer = document.getElementById('gradient-stops');

let colorStops = [];

function updateGradient() {
    const type = gradientType.value;
    const angle = gradientAngle.value;
    const color1 = gradientColor1.value;
    const color2 = gradientColor2.value;
    
    let gradient;
    let cssCode;
    
    if (type === 'linear') {
        if (colorStops.length > 0) {
            const stops = [
                `${color1} 0%`,
                ...colorStops.map(stop => `${stop.color} ${stop.position}%`),
                `${color2} 100%`
            ].join(', ');
            gradient = `linear-gradient(${angle}deg, ${stops})`;
            cssCode = `background: linear-gradient(${angle}deg, ${stops});`;
        } else {
            gradient = `linear-gradient(${angle}deg, ${color1}, ${color2})`;
            cssCode = `background: linear-gradient(${angle}deg, ${color1}, ${color2});`;
        }
    } else {
        if (colorStops.length > 0) {
            const stops = [
                `${color1} 0%`,
                ...colorStops.map(stop => `${stop.color} ${stop.position}%`),
                `${color2} 100%`
            ].join(', ');
            gradient = `radial-gradient(circle, ${stops})`;
            cssCode = `background: radial-gradient(circle, ${stops});`;
        } else {
            gradient = `radial-gradient(circle, ${color1}, ${color2})`;
            cssCode = `background: radial-gradient(circle, ${color1}, ${color2});`;
        }
    }
    
    gradientPreview.style.background = gradient;
    gradientCode.textContent = cssCode;
}

gradientAngle.addEventListener('input', () => {
    gradientAngleValue.textContent = gradientAngle.value + '°';
    updateGradient();
});

gradientType.addEventListener('change', updateGradient);
gradientColor1.addEventListener('input', updateGradient);
gradientColor2.addEventListener('input', updateGradient);

gradientAddColor.addEventListener('click', () => {
    const newStop = {
        color: '#808080',
        position: 50
    };
    colorStops.push(newStop);
    renderColorStops();
    updateGradient();
});

function renderColorStops() {
    gradientStopsContainer.innerHTML = '';
    colorStops.forEach((stop, index) => {
        const stopDiv = document.createElement('div');
        stopDiv.className = 'color-stop';
        stopDiv.innerHTML = `
            <input type="color" value="${stop.color}" data-index="${index}" class="stop-color">
            <input type="number" value="${stop.position}" min="0" max="100" data-index="${index}" class="stop-position tool-input" style="width: 80px;">
            <span style="color: var(--text-secondary);">%</span>
            <button class="remove-stop" data-index="${index}">✕</button>
        `;
        gradientStopsContainer.appendChild(stopDiv);
    });
    
    document.querySelectorAll('.stop-color').forEach(input => {
        input.addEventListener('input', (e) => {
            const index = e.target.dataset.index;
            colorStops[index].color = e.target.value;
            updateGradient();
        });
    });
    
    document.querySelectorAll('.stop-position').forEach(input => {
        input.addEventListener('input', (e) => {
            const index = e.target.dataset.index;
            colorStops[index].position = e.target.value;
            updateGradient();
        });
    });
    
    document.querySelectorAll('.remove-stop').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = e.target.dataset.index;
            colorStops.splice(index, 1);
            renderColorStops();
            updateGradient();
        });
    });
}

updateGradient();

const loremType = document.getElementById('lorem-type');
const loremCount = document.getElementById('lorem-count');
const loremStart = document.getElementById('lorem-start');
const loremGenerate = document.getElementById('lorem-generate');
const loremOutput = document.getElementById('lorem-output');

const loremWords = [
    'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
    'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
    'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
    'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
    'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
    'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
    'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia',
    'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum'
];

const loremStart1 = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit';

function generateWords(count, startWithLorem) {
    let words = [];
    if (startWithLorem) {
        words = loremStart1.toLowerCase().split(' ');
        count = Math.max(0, count - words.length);
    }
    for (let i = 0; i < count; i++) {
        words.push(loremWords[Math.floor(Math.random() * loremWords.length)]);
    }
    return words.join(' ');
}

function generateSentence() {
    const length = Math.floor(Math.random() * 10) + 8;
    let sentence = generateWords(length, false);
    sentence = sentence.charAt(0).toUpperCase() + sentence.slice(1) + '.';
    return sentence;
}

function generateParagraph() {
    const sentenceCount = Math.floor(Math.random() * 4) + 3;
    let sentences = [];
    for (let i = 0; i < sentenceCount; i++) {
        sentences.push(generateSentence());
    }
    return sentences.join(' ');
}

function generateLorem() {
    const type = loremType.value;
    const count = parseInt(loremCount.value);
    const startWith = loremStart.checked;
    let result = '';
    
    if (type === 'words') {
        result = generateWords(count, startWith);
        loremOutput.innerHTML = `<p>${result}</p>`;
    } else if (type === 'sentences') {
        let sentences = [];
        if (startWith) {
            sentences.push(loremStart1 + '.');
        }
        for (let i = startWith ? 1 : 0; i < count; i++) {
            sentences.push(generateSentence());
        }
        result = sentences.join(' ');
        loremOutput.innerHTML = `<p>${result}</p>`;
    } else {
        let paragraphs = [];
        if (startWith) {
            paragraphs.push(`<p>${loremStart1}. ${generateParagraph()}</p>`);
        }
        for (let i = startWith ? 1 : 0; i < count; i++) {
            paragraphs.push(`<p>${generateParagraph()}</p>`);
        }
        loremOutput.innerHTML = paragraphs.join('');
    }
}

loremGenerate.addEventListener('click', generateLorem);

const spacingValue = document.getElementById('spacing-value');
const spacingDisplay = document.getElementById('spacing-display');
const spacingFontSize = document.getElementById('spacing-font-size');
const spacingFontDisplay = document.getElementById('spacing-font-display');
const spacingText = document.getElementById('spacing-text');
const spacingPreview = document.getElementById('spacing-preview');
const spacingCode = document.getElementById('spacing-code');

function updateSpacing() {
    const spacing = spacingValue.value;
    const fontSize = spacingFontSize.value;
    const text = spacingText.value;
    
    spacingDisplay.textContent = spacing + 'px';
    spacingFontDisplay.textContent = fontSize + 'px';
    
    spacingPreview.style.letterSpacing = spacing + 'px';
    spacingPreview.style.fontSize = fontSize + 'px';
    spacingPreview.textContent = text;
    
    spacingCode.textContent = `letter-spacing: ${spacing}px;`;
}

spacingValue.addEventListener('input', updateSpacing);
spacingFontSize.addEventListener('input', updateSpacing);
spacingText.addEventListener('input', updateSpacing);

const qrContent = document.getElementById('qr-content');
const qrSize = document.getElementById('qr-size');
const qrGenerate = document.getElementById('qr-generate');
const qrPreview = document.getElementById('qr-preview');
const qrDownload = document.getElementById('qr-download');

let qrCode = null;

function generateQRCode() {
    const content = qrContent.value.trim();
    const size = parseInt(qrSize.value);
    
    if (!content) {
        return;
    }

    qrPreview.innerHTML = '';

    qrCode = new QRCode(qrPreview, {
        text: content,
        width: size,
        height: size,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
    });
}

qrGenerate.addEventListener('click', generateQRCode);

qrDownload.addEventListener('click', () => {
    const canvas = qrPreview.querySelector('canvas');
    if (canvas) {
        const link = document.createElement('a');
        link.download = 'qrcode.png';
        link.href = canvas.toDataURL();
        link.click();
    }
});

generateQRCode();

const cssInput = document.getElementById('css-input');
const cssMinify = document.getElementById('css-minify');
const cssOutput = document.getElementById('css-output');
const minifyStats = document.getElementById('minify-stats');

function minifyCSS(css) {
    let minified = css;

    minified = minified.replace(/\/\*[\s\S]*?\*\//g, '');

    minified = minified.replace(/\s+/g, ' ');

    minified = minified.replace(/\s*{\s*/g, '{');
    minified = minified.replace(/\s*}\s*/g, '}');
    minified = minified.replace(/\s*:\s*/g, ':');
    minified = minified.replace(/\s*;\s*/g, ';');
    minified = minified.replace(/\s*,\s*/g, ',');

    minified = minified.replace(/;}/g, '}');
    
    return minified.trim();
}

cssMinify.addEventListener('click', () => {
    const input = cssInput.value;
    const output = minifyCSS(input);
    
    cssOutput.value = output;
    
    const originalSize = new Blob([input]).size;
    const minifiedSize = new Blob([output]).size;
    const savings = ((originalSize - minifiedSize) / originalSize * 100).toFixed(1);
    
    minifyStats.innerHTML = `
        Original: ${originalSize} bytes<br>
        Minified: ${minifiedSize} bytes<br>
        Saved: ${savings}% (${originalSize - minifiedSize} bytes)
    `;
});

const lightboxCount = document.getElementById('lightbox-count');
const lightboxLayout = document.getElementById('lightbox-layout');
const lightboxGap = document.getElementById('lightbox-gap');
const lightboxGapValue = document.getElementById('lightbox-gap-value');
const lightboxRadius = document.getElementById('lightbox-radius');
const lightboxRadiusValue = document.getElementById('lightbox-radius-value');
const lightboxCaptions = document.getElementById('lightbox-captions');
const lightboxControls = document.getElementById('lightbox-controls');
const lightboxGenerate = document.getElementById('lightbox-generate');
const lightboxPreview = document.getElementById('lightbox-preview');
const lightboxHtmlOutput = document.getElementById('lightbox-html-output');
const lightboxCssOutput = document.getElementById('lightbox-css-output');
const lightboxJsOutput = document.getElementById('lightbox-js-output');
const lightboxHtmlCode = document.getElementById('lightbox-html-code');
const lightboxCssCode = document.getElementById('lightbox-css-code');
const lightboxJsCode = document.getElementById('lightbox-js-code');
const lightboxCopyButtons = document.getElementById('lightbox-copy-buttons');

const lightboxBgColor = document.getElementById('lightbox-bg-color');
const lightboxBgOpacity = document.getElementById('lightbox-bg-opacity');
const lightboxBgOpacityValue = document.getElementById('lightbox-bg-opacity-value');
const lightboxImageBorder = document.getElementById('lightbox-image-border');
const lightboxImageBorderValue = document.getElementById('lightbox-image-border-value');
const lightboxImageBorderColor = document.getElementById('lightbox-image-border-color');
const lightboxShadow = document.getElementById('lightbox-shadow');
const lightboxCloseBtnColor = document.getElementById('lightbox-close-btn-color');
const lightboxNavBtnColor = document.getElementById('lightbox-nav-btn-color');
const lightboxNavBtnBg = document.getElementById('lightbox-nav-btn-bg');
const lightboxCaptionColor = document.getElementById('lightbox-caption-color');

lightboxGap.addEventListener('input', () => {
    lightboxGapValue.textContent = lightboxGap.value + 'px';
});

lightboxRadius.addEventListener('input', () => {
    lightboxRadiusValue.textContent = lightboxRadius.value + 'px';
});

lightboxBgOpacity.addEventListener('input', () => {
    lightboxBgOpacityValue.textContent = lightboxBgOpacity.value + '%';
});

lightboxImageBorder.addEventListener('input', () => {
    lightboxImageBorderValue.textContent = lightboxImageBorder.value + 'px';
});

function generateLightbox() {
    const count = parseInt(lightboxCount.value);
    const layout = lightboxLayout.value;
    const gap = lightboxGap.value;
    const radius = lightboxRadius.value;
    const showCaptions = lightboxCaptions.checked;
    const showControls = lightboxControls.checked;
    const bgColor = lightboxBgColor.value;
    const bgOpacity = parseInt(lightboxBgOpacity.value) / 100;
    const imageBorder = lightboxImageBorder.value;
    const imageBorderColor = lightboxImageBorderColor.value;
    const shadowEnabled = lightboxShadow.checked;
    const closeBtnColor = lightboxCloseBtnColor.value;
    const navBtnColor = lightboxNavBtnColor.value;
    const navBtnBg = lightboxNavBtnBg.value;
    const captionColor = lightboxCaptionColor.value;

    let html = '<div class="gallery">\n';
    for (let i = 1; i <= count; i++) {
        html += `  <img src="https://picsum.photos/400/300?random=${i}" alt="Gallery image ${i}" class="gallery-item" data-index="${i-1}">\n`;
    }
    html += '</div>\n\n';
    html += '<div id="lightbox" class="lightbox-modal">\n';
    html += '  <button class="lightbox-close">&times;</button>\n';
    html += '  <div class="lightbox-content">\n';
    if (showControls) {
        html += '    <button class="lightbox-nav lightbox-prev">&#8249;</button>\n';
        html += '    <button class="lightbox-nav lightbox-next">&#8250;</button>\n';
    }
    html += '    <img src="" alt="" class="lightbox-image">\n';
    if (showCaptions) {
        html += '    <div class="lightbox-caption"></div>\n';
    }
    html += '  </div>\n';
    html += '</div>';

    const hexToRgb = (hex) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    };
    
    const bgRgb = hexToRgb(bgColor);
    const bgRgba = `rgba(${bgRgb.r}, ${bgRgb.g}, ${bgRgb.b}, ${bgOpacity})`;
    
    let layoutCSS = '';
    if (layout === 'grid') {
        layoutCSS = `  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${gap}px;`;
    } else if (layout === 'masonry') {
        layoutCSS = `  column-count: 3;
  column-gap: ${gap}px;`;
    } else {
        layoutCSS = `  display: flex;
  gap: ${gap}px;
  overflow-x: auto;
  padding-bottom: 1rem;`;
    }
    
    let css = `.gallery {
${layoutCSS}
}

.gallery-item {
  cursor: pointer;
  width: 100%;
  ${layout === 'masonry' ? 'margin-bottom: ' + gap + 'px;' : ''}
  ${layout === 'horizontal' ? 'flex-shrink: 0; width: 300px;' : ''}
  border-radius: ${radius}px;
  transition: transform 0.2s;
}

.gallery-item:hover {
  transform: scale(1.05);
}

.lightbox-modal {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: ${bgRgba};
  z-index: 100000;
  align-items: center;
  justify-content: center;
}

.lightbox-modal.active {
  display: flex;
}

.lightbox-content {
  position: relative;
  max-width: 90%;
  max-height: 90%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.lightbox-image {
  max-width: 90vw;
  max-height: 85vh;
  display: block;
  border-radius: ${radius}px;${imageBorder > 0 ? `
  border: ${imageBorder}px solid ${imageBorderColor};` : ''}${shadowEnabled ? `
  box-shadow: 0 10px 40px rgba(0,0,0,0.5);` : ''}
}

.lightbox-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  color: ${closeBtnColor};
  font-size: 3rem;
  cursor: pointer;
  padding: 0.5rem;
  line-height: 1;
  z-index: 10;
  font-weight: 300;
}

.lightbox-close:hover {
  opacity: 0.7;
}`;

    if (showControls) {
        css += `

.lightbox-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: ${navBtnBg};
  border: none;
  color: ${navBtnColor};
  font-size: 3rem;
  padding: 1rem 1.5rem;
  cursor: pointer;
  font-weight: 300;
  z-index: 10;
  border-radius: 4px;
}

.lightbox-nav:hover {
  opacity: 0.8;
}

.lightbox-prev {
  left: 2rem;
}

.lightbox-next {
  right: 2rem;
}`;
    }
    
    if (showCaptions) {
        css += `

.lightbox-caption {
  text-align: center;
  padding: 1.5rem 2rem;
  color: ${captionColor};
  font-size: 1.1rem;
  margin-top: 1rem;
}`;
    }

    let js = `const lightbox = document.getElementById('lightbox');
const lightboxImg = document.querySelector('.lightbox-image');
${showCaptions ? "const lightboxCaption = document.querySelector('.lightbox-caption');" : ""}
const closeBtn = document.querySelector('.lightbox-close');
${showControls ? `const prevBtn = document.querySelector('.lightbox-prev');
const nextBtn = document.querySelector('.lightbox-next');` : ""}
const galleryItems = document.querySelectorAll('.gallery-item');

let currentIndex = 0;

galleryItems.forEach((item, index) => {
  item.addEventListener('click', () => {
    currentIndex = index;
    openLightbox(item.src, item.alt);
  });
});

function openLightbox(src, alt) {
  lightbox.classList.add('active');
  lightboxImg.src = src;
  lightboxImg.alt = alt;
  ${showCaptions ? "lightboxCaption.textContent = alt;" : ""}
}

closeBtn.addEventListener('click', () => {
  lightbox.classList.remove('active');
});

lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) {
    lightbox.classList.remove('active');
  }
});

${showControls ? `
prevBtn.addEventListener('click', () => {
  currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
  const item = galleryItems[currentIndex];
  openLightbox(item.src, item.alt);
});

nextBtn.addEventListener('click', () => {
  currentIndex = (currentIndex + 1) % galleryItems.length;
  const item = galleryItems[currentIndex];
  openLightbox(item.src, item.alt);
});

document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('active')) return;
  
  if (e.key === 'ArrowLeft') {
    prevBtn.click();
  } else if (e.key === 'ArrowRight') {
    nextBtn.click();
  } else if (e.key === 'Escape') {
    closeBtn.click();
  }
});` : `
document.addEventListener('keydown', (e) => {
  if (lightbox.classList.contains('active') && e.key === 'Escape') {
    closeBtn.click();
  }
});`}`;

    lightboxHtmlCode.textContent = html;
    lightboxCssCode.textContent = css;
    lightboxJsCode.textContent = js;
    
    lightboxHtmlOutput.style.display = 'block';
    lightboxCssOutput.style.display = 'block';
    lightboxJsOutput.style.display = 'block';
    lightboxCopyButtons.style.display = 'flex';

    createLightboxPreview(count, layout, gap, radius, showCaptions, showControls, bgRgba, imageBorder, imageBorderColor, shadowEnabled, closeBtnColor, navBtnColor, navBtnBg, captionColor);
}

function createLightboxPreview(count, layout, gap, radius, showCaptions, showControls, bgRgba, imageBorder, imageBorderColor, shadowEnabled, closeBtnColor, navBtnColor, navBtnBg, captionColor) {
    let previewHTML = '<div class="gallery" style="';
    
    if (layout === 'grid') {
        previewHTML += `display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: ${gap}px;`;
    } else if (layout === 'masonry') {
        previewHTML += `column-count: 2; column-gap: ${gap}px;`;
    } else {
        previewHTML += `display: flex; gap: ${gap}px; overflow-x: auto;`;
    }
    
    previewHTML += '">';
    
    for (let i = 1; i <= count; i++) {
        let itemStyle = 'cursor: pointer; width: 100%; aspect-ratio: 4/3; display: flex; align-items: center; justify-content: center; font-size: 3rem; font-weight: 900; border-radius: ' + radius + 'px; transition: transform 0.2s; background: var(--bg-secondary); color: var(--text-primary);';
        
        if (layout === 'masonry') {
            itemStyle += ' margin-bottom: ' + gap + 'px;';
        } else if (layout === 'horizontal') {
            itemStyle += ' flex-shrink: 0; width: 150px;';
        }
        
        itemStyle += ' border: 3px solid var(--border); box-shadow: 4px 4px 0 var(--shadow);';
        
        previewHTML += `<div class="preview-gallery-item" data-preview-index="${i-1}" data-preview-number="${i}" style="${itemStyle}">${i}</div>`;
    }
    
    previewHTML += '</div>';

    let contentWrapperStyle = 'position: relative; max-width: 95vw; max-height: 95vh; display: flex; flex-direction: column; align-items: center;';

    let imageContainerStyle = 'width: 400px; height: 300px; display: flex; align-items: center; justify-content: center; font-size: 8rem; font-weight: 900; color: var(--text-primary); background: var(--bg-secondary);';
    imageContainerStyle += ` border-radius: ${radius}px;`;
    if (imageBorder > 0) {
        imageContainerStyle += ` border: ${imageBorder}px solid ${imageBorderColor};`;
    }
    if (shadowEnabled) {
        imageContainerStyle += ' box-shadow: 0 10px 40px rgba(0,0,0,0.5);';
    }

    let closeStyle = `position: absolute; top: 1rem; right: 1rem; background: none; border: none; font-size: 3rem; cursor: pointer; padding: 0.5rem; line-height: 1; z-index: 10001; font-weight: 300; color: ${closeBtnColor};`;

    let navStyle = `position: absolute; top: 50%; transform: translateY(-50%); border: none; font-size: 3rem; padding: 1rem 1.5rem; cursor: pointer; font-weight: 300; z-index: 10001; background: ${navBtnBg}; color: ${navBtnColor}; border-radius: 4px;`;

    let captionStyle = `text-align: center; padding: 1.5rem 2rem; font-size: 1.1rem; margin-top: 1rem; color: ${captionColor};`;
    
    previewHTML += `
        <div id="preview-lightbox" class="lightbox-modal" style="display: none; background: ${bgRgba};">
            <button class="lightbox-close" id="preview-close" style="${closeStyle}">&times;</button>
            <div class="lightbox-content" style="${contentWrapperStyle}">
                ${showControls ? `<button class="lightbox-nav lightbox-prev" id="preview-prev" style="${navStyle} left: 2rem;">&#8249;</button>` : ''}
                ${showControls ? `<button class="lightbox-nav lightbox-next" id="preview-next" style="${navStyle} right: 2rem;">&#8250;</button>` : ''}
                <div style="${imageContainerStyle}">
                    <div id="preview-image">1</div>
                </div>
                ${showCaptions ? `<div class="lightbox-caption" id="preview-caption" style="${captionStyle}">Image 1</div>` : ''}
            </div>
        </div>
    `;
    previewHTML += '<p style="margin-top: 1rem; color: var(--text-secondary); text-align: center; font-size: 0.9rem;">Preview is fully functional - click images to test!</p>';
    
    lightboxPreview.innerHTML = previewHTML;
    
    const previewItems = document.querySelectorAll('.preview-gallery-item');
    const previewLightbox = document.getElementById('preview-lightbox');
    const previewImage = document.getElementById('preview-image');
    const previewCaption = document.getElementById('preview-caption');
    const previewClose = document.getElementById('preview-close');
    const previewPrev = document.getElementById('preview-prev');
    const previewNext = document.getElementById('preview-next');
    
    let currentPreviewIndex = 0;
    
    previewItems.forEach((item) => {
        item.addEventListener('click', () => {
            currentPreviewIndex = parseInt(item.dataset.previewIndex);
            const number = item.dataset.previewNumber;
            previewImage.textContent = number;
            if (showCaptions && previewCaption) {
                previewCaption.textContent = `Image ${number}`;
            }
            previewLightbox.style.display = 'flex';
        });
    });
    
    if (previewClose) {
        previewClose.addEventListener('click', () => {
            previewLightbox.style.display = 'none';
        });
    }
    
    previewLightbox.addEventListener('click', (e) => {
        if (e.target === previewLightbox) {
            previewLightbox.style.display = 'none';
        }
    });

    const handleEscape = (e) => {
        if (e.key === 'Escape' && previewLightbox && previewLightbox.style.display === 'flex') {
            previewLightbox.style.display = 'none';
        }
    };
    document.addEventListener('keydown', handleEscape);
    
    if (showControls && previewPrev && previewNext) {
        previewPrev.addEventListener('click', () => {
            currentPreviewIndex = (currentPreviewIndex - 1 + previewItems.length) % previewItems.length;
            const item = previewItems[currentPreviewIndex];
            const number = item.dataset.previewNumber;
            previewImage.textContent = number;
            if (showCaptions && previewCaption) {
                previewCaption.textContent = `Image ${number}`;
            }
        });
        
        previewNext.addEventListener('click', () => {
            currentPreviewIndex = (currentPreviewIndex + 1) % previewItems.length;
            const item = previewItems[currentPreviewIndex];
            const number = item.dataset.previewNumber;
            previewImage.textContent = number;
            if (showCaptions && previewCaption) {
                previewCaption.textContent = `Image ${number}`;
            }
        });
    }
}

lightboxGenerate.addEventListener('click', generateLightbox);

const tooltipPosition = document.getElementById('tooltip-position');
const tooltipText = document.getElementById('tooltip-text');
const tooltipTrigger = document.getElementById('tooltip-trigger');
const tooltipWidth = document.getElementById('tooltip-width');
const tooltipWidthValue = document.getElementById('tooltip-width-value');
const tooltipArrow = document.getElementById('tooltip-arrow');
const tooltipArrowValue = document.getElementById('tooltip-arrow-value');
const tooltipShowArrow = document.getElementById('tooltip-show-arrow');
const tooltipGenerate = document.getElementById('tooltip-generate');
const tooltipPreview = document.getElementById('tooltip-preview');
const tooltipHtmlOutput = document.getElementById('tooltip-html-output');
const tooltipCssOutput = document.getElementById('tooltip-css-output');
const tooltipHtmlCode = document.getElementById('tooltip-html-code');
const tooltipCssCode = document.getElementById('tooltip-css-code');
const tooltipCopyButtons = document.getElementById('tooltip-copy-buttons');

const tooltipBgColor = document.getElementById('tooltip-bg-color');
const tooltipTextColor = document.getElementById('tooltip-text-color');
const tooltipBorderWidth = document.getElementById('tooltip-border-width');
const tooltipBorderWidthValue = document.getElementById('tooltip-border-width-value');
const tooltipBorderColor = document.getElementById('tooltip-border-color');
const tooltipBorderRadius = document.getElementById('tooltip-border-radius');
const tooltipBorderRadiusValue = document.getElementById('tooltip-border-radius-value');
const tooltipShadow = document.getElementById('tooltip-shadow');
const tooltipArrowColor = document.getElementById('tooltip-arrow-color');

tooltipWidth.addEventListener('input', () => {
    tooltipWidthValue.textContent = tooltipWidth.value + 'px';
});

tooltipArrow.addEventListener('input', () => {
    tooltipArrowValue.textContent = tooltipArrow.value + 'px';
});

tooltipBorderWidth.addEventListener('input', () => {
    tooltipBorderWidthValue.textContent = tooltipBorderWidth.value + 'px';
});

tooltipBorderRadius.addEventListener('input', () => {
    tooltipBorderRadiusValue.textContent = tooltipBorderRadius.value + 'px';
});

function generateTooltip() {
    const position = tooltipPosition.value;
    const text = tooltipText.value;
    const trigger = tooltipTrigger.value;
    const width = tooltipWidth.value;
    const arrow = tooltipArrow.value;
    const showArrow = tooltipShowArrow.checked;
    const bgColor = tooltipBgColor.value;
    const textColor = tooltipTextColor.value;
    const borderWidth = tooltipBorderWidth.value;
    const borderColor = tooltipBorderColor.value;
    const borderRadius = tooltipBorderRadius.value;
    const shadowEnabled = tooltipShadow.checked;
    const arrowColor = tooltipArrowColor.value;

    const html = `<span class="tooltip-trigger">
  ${trigger}
  <span class="tooltip tooltip-${position}">${text}</span>
</span>`;

    let css = `.tooltip-trigger {
  position: relative;
  display: inline-block;
  cursor: help;
}

.tooltip {
  visibility: hidden;
  opacity: 0;
  position: absolute;
  max-width: ${width}px;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  line-height: 1.4;
  text-align: center;
  transition: opacity 0.3s, visibility 0.3s;
  z-index: 1000;
  white-space: normal;
  word-wrap: break-word;
  background: ${bgColor};
  color: ${textColor};${borderWidth > 0 ? `
  border: ${borderWidth}px solid ${borderColor};` : ''}
  border-radius: ${borderRadius}px;${shadowEnabled ? `
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);` : ''}
}

.tooltip-trigger:hover .tooltip {
  visibility: visible;
  opacity: 1;
}`;

    if (position === 'top') {
        css += `

.tooltip-top {
  bottom: calc(100% + ${arrow}px);
  left: 50%;
  transform: translateX(-50%);
}`;
    } else if (position === 'bottom') {
        css += `

.tooltip-bottom {
  top: calc(100% + ${arrow}px);
  left: 50%;
  transform: translateX(-50%);
}`;
    } else if (position === 'left') {
        css += `

.tooltip-left {
  right: calc(100% + ${arrow}px);
  top: 50%;
  transform: translateY(-50%);
}`;
    } else if (position === 'right') {
        css += `

.tooltip-right {
  left: calc(100% + ${arrow}px);
  top: 50%;
  transform: translateY(-50%);
}`;
    }

    if (showArrow && parseInt(arrow) > 0) {
        css += `

.tooltip::after {
  content: '';
  position: absolute;
  border-style: solid;
  border-width: ${arrow}px;
}`;
        
        if (position === 'top') {
            css += `

.tooltip-top::after {
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border-color: ${arrowColor} transparent transparent transparent;
}`;
        } else if (position === 'bottom') {
            css += `

.tooltip-bottom::after {
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  border-color: transparent transparent ${arrowColor} transparent;
}`;
        } else if (position === 'left') {
            css += `

.tooltip-left::after {
  left: 100%;
  top: 50%;
  transform: translateY(-50%);
  border-color: transparent transparent transparent ${arrowColor};
}`;
        } else if (position === 'right') {
            css += `

.tooltip-right::after {
  right: 100%;
  top: 50%;
  transform: translateY(-50%);
  border-color: transparent ${arrowColor} transparent transparent;
}`;
        }
    }

    tooltipHtmlCode.textContent = html;
    tooltipCssCode.textContent = css;
    
    tooltipHtmlOutput.style.display = 'block';
    tooltipCssOutput.style.display = 'block';
    tooltipCopyButtons.style.display = 'flex';

    createTooltipPreview(position, text, trigger, width, arrow, showArrow, bgColor, textColor, borderWidth, borderColor, borderRadius, shadowEnabled, arrowColor);
}

function createTooltipPreview(position, text, trigger, width, arrow, showArrow, bgColor, textColor, borderWidth, borderColor, borderRadius, shadowEnabled, arrowColor) {
    let containerStyle = 'width: 100%; height: 100%; min-height: 300px; display: flex; align-items: center; justify-content: center; padding: 2rem;';
    
    let triggerStyle = 'position: relative; cursor: help; display: inline-block; padding: 0.5rem 1rem; background: var(--bg-primary); color: var(--text-primary); border: 3px solid var(--border); font-weight: 700;';
    
    let tooltipStyle = `visibility: hidden; opacity: 0; position: absolute; width: max-content; max-width: ${width}px; padding: 0.5rem 0.75rem; font-size: 0.875rem; line-height: 1.4; text-align: center; z-index: 1000; transition: opacity 0.3s, visibility 0.3s; word-wrap: break-word; white-space: normal; background: ${bgColor}; color: ${textColor}; border-radius: ${borderRadius}px;`;
    
    if (borderWidth > 0) {
        tooltipStyle += ` border: ${borderWidth}px solid ${borderColor};`;
    }
    
    if (shadowEnabled) {
        tooltipStyle += ' box-shadow: 0 4px 12px rgba(0,0,0,0.15);';
    }
    
    if (position === 'top') {
        tooltipStyle += ` bottom: calc(100% + ${arrow}px); left: 50%; transform: translateX(-50%);`;
    } else if (position === 'bottom') {
        tooltipStyle += ` top: calc(100% + ${arrow}px); left: 50%; transform: translateX(-50%);`;
    } else if (position === 'left') {
        tooltipStyle += ` right: calc(100% + ${arrow}px); top: 50%; transform: translateY(-50%);`;
    } else if (position === 'right') {
        tooltipStyle += ` left: calc(100% + ${arrow}px); top: 50%; transform: translateY(-50%);`;
    }
    
    let arrowHTML = '';
    if (showArrow && parseInt(arrow) > 0) {
        let arrowBorderStyle = '';
        if (position === 'top') {
            arrowBorderStyle = `width: 0; height: 0; border-left: ${arrow}px solid transparent; border-right: ${arrow}px solid transparent; border-top: ${arrow}px solid ${arrowColor}; position: absolute; top: 100%; left: 50%; transform: translateX(-50%);`;
        } else if (position === 'bottom') {
            arrowBorderStyle = `width: 0; height: 0; border-left: ${arrow}px solid transparent; border-right: ${arrow}px solid transparent; border-bottom: ${arrow}px solid ${arrowColor}; position: absolute; bottom: 100%; left: 50%; transform: translateX(-50%);`;
        } else if (position === 'left') {
            arrowBorderStyle = `width: 0; height: 0; border-top: ${arrow}px solid transparent; border-bottom: ${arrow}px solid transparent; border-left: ${arrow}px solid ${arrowColor}; position: absolute; left: 100%; top: 50%; transform: translateY(-50%);`;
        } else if (position === 'right') {
            arrowBorderStyle = `width: 0; height: 0; border-top: ${arrow}px solid transparent; border-bottom: ${arrow}px solid transparent; border-right: ${arrow}px solid ${arrowColor}; position: absolute; right: 100%; top: 50%; transform: translateY(-50%);`;
        }
        
        arrowHTML = `<span style="${arrowBorderStyle}"></span>`;
    }
    
    const previewHTML = `
        <div style="${containerStyle}">
            <span class="preview-tooltip-trigger" style="${triggerStyle}">
                ${trigger}
                <span class="preview-tooltip-content" style="${tooltipStyle}">
                    ${text}
                    ${arrowHTML}
                </span>
            </span>
        </div>
    `;
    
    tooltipPreview.innerHTML = previewHTML;

    const textBelow = document.createElement('p');
    textBelow.style.cssText = 'margin-top: 1rem; color: var(--text-secondary); text-align: center; font-size: 0.9rem;';
    textBelow.textContent = 'Preview is fully functional - hover to test!';
    tooltipPreview.parentElement.appendChild(textBelow);

    const existingTexts = tooltipPreview.parentElement.querySelectorAll('p');
    if (existingTexts.length > 1) {
        for (let i = 0; i < existingTexts.length - 1; i++) {
            if (existingTexts[i].textContent.includes('Preview is fully functional')) {
                existingTexts[i].remove();
            }
        }
    }

    const tooltipTriggerElement = document.querySelector('.preview-tooltip-trigger');
    const tooltipContentElement = document.querySelector('.preview-tooltip-content');
    
    if (tooltipTriggerElement && tooltipContentElement) {
        tooltipTriggerElement.addEventListener('mouseenter', () => {
            tooltipContentElement.style.visibility = 'visible';
            tooltipContentElement.style.opacity = '1';
        });
        
        tooltipTriggerElement.addEventListener('mouseleave', () => {
            tooltipContentElement.style.visibility = 'hidden';
            tooltipContentElement.style.opacity = '0';
        });
    }
}

tooltipGenerate.addEventListener('click', generateTooltip);

const backToTopBtn = document.getElementById('back-to-top');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        backToTopBtn.classList.add('show');
    } else {
        backToTopBtn.classList.remove('show');
    }
});

backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});