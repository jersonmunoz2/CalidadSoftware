// Sistema de navegación
function showSection(sectionId) {
    const sections = document.querySelectorAll('.content-section');
    const buttons = document.querySelectorAll('.nav-btn');
    
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    buttons.forEach(button => {
        button.classList.remove('active');
    });
    
    document.getElementById(sectionId).classList.add('active');
    event.target.classList.add('active');
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Sistema de sliders
const sliders = ['funcionalidad', 'desempeno', 'compatibilidad', 'usabilidad', 
                'fiabilidad', 'seguridad', 'mantenibilidad', 'portabilidad'];

sliders.forEach(slider => {
    const input = document.getElementById(slider);
    const display = document.getElementById(slider + '-val');
    
    if (input && display) {
        input.addEventListener('input', function() {
            display.textContent = this.value;
        });
    }
});

// Calculadora de calidad
function calculateQuality() {
    const metrics = {
        funcionalidad: parseFloat(document.getElementById('funcionalidad').value),
        desempeno: parseFloat(document.getElementById('desempeno').value),
        compatibilidad: parseFloat(document.getElementById('compatibilidad').value),
        usabilidad: parseFloat(document.getElementById('usabilidad').value),
        fiabilidad: parseFloat(document.getElementById('fiabilidad').value),
        seguridad: parseFloat(document.getElementById('seguridad').value),
        mantenibilidad: parseFloat(document.getElementById('mantenibilidad').value),
        portabilidad: parseFloat(document.getElementById('portabilidad').value)
    };

    // Cálculo del promedio ponderado
    const weights = {
        funcionalidad: 0.15,
        desempeno: 0.12,
        compatibilidad: 0.10,
        usabilidad: 0.15,
        fiabilidad: 0.13,
        seguridad: 0.15,
        mantenibilidad: 0.10,
        portabilidad: 0.10
    };

    let totalScore = 0;
    for (let metric in metrics) {
        totalScore += metrics[metric] * weights[metric];
    }

    // Redondear a 2 decimales
    totalScore = Math.round(totalScore * 100) / 100;

    // Determinar interpretación
    let interpretation = '';
    let recommendation = '';
    let color = '';

    if (totalScore >= 4.5) {
        interpretation = '⭐ EXCELENTE - Calidad superior';
        recommendation = 'El software cumple con los más altos estándares de calidad. Mantener las buenas prácticas y realizar auditorías periódicas para asegurar la sostenibilidad de la calidad.';
        color = '#10b981';
    } else if (totalScore >= 3.5) {
        interpretation = '✅ BUENO - Calidad satisfactoria';
        recommendation = 'El software tiene un nivel de calidad aceptable. Se recomienda identificar las métricas más bajas y establecer un plan de mejora continua para alcanzar la excelencia.';
        color = '#667eea';
    } else if (totalScore >= 2.5) {
        interpretation = '⚠️ REGULAR - Requiere mejoras';
        recommendation = 'El software presenta deficiencias importantes que deben ser atendidas. Es necesario priorizar las áreas críticas y desarrollar un plan de acción inmediato para mejorar la calidad.';
        color = '#f59e0b';
    } else if (totalScore >= 1.5) {
        interpretation = '❌ DEFICIENTE - Acción urgente requerida';
        recommendation = 'El software tiene serias deficiencias que comprometen su funcionalidad y confiabilidad. Se requiere una revisión completa y posiblemente una refactorización importante del sistema.';
        color = '#ef4444';
    } else {
        interpretation = '🚫 CRÍTICO - No apto para producción';
        recommendation = 'El software no cumple con estándares mínimos de calidad y no debe ser utilizado en producción. Se recomienda un rediseño completo o considerar alternativas.';
        color = '#991b1b';
    }

    // Mostrar resultados
    document.getElementById('score').textContent = totalScore.toFixed(2);
    document.getElementById('interpretation').textContent = interpretation;
    document.getElementById('recommendation').textContent = recommendation;
    
    const resultDiv = document.getElementById('result');
    resultDiv.style.background = `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`;
    resultDiv.classList.add('show');

    // Animación del score
    animateScore(0, totalScore, 1500);

    // Destruir el gráfico anterior si existe para evitar solapamientos
    if (window.myQualityChart instanceof Chart) {
        window.myQualityChart.destroy();
    }

    // Crear el gráfico de radar
    const ctx = document.getElementById('qualityChart').getContext('2d');
    const textColor = getComputedStyle(document.body).getPropertyValue('--text-color').trim();
    const gridColor = document.body.classList.contains('dark-mode') ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)';

    window.myQualityChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['Funcionalidad', 'Desempeño', 'Compatibilidad', 'Usabilidad', 'Fiabilidad', 'Seguridad', 'Mantenibilidad', 'Portabilidad'],
            datasets: [{
                label: 'Calidad de Software',
                data: [
                    metrics.funcionalidad,
                    metrics.desempeno,
                    metrics.compatibilidad,
                    metrics.usabilidad,
                    metrics.fiabilidad,
                    metrics.seguridad,
                    metrics.mantenibilidad,
                    metrics.portabilidad
                ],
                backgroundColor: 'rgba(102, 126, 234, 0.2)',
                borderColor: 'rgba(102, 126, 234, 1)',
                borderWidth: 2,
                pointBackgroundColor: 'rgba(102, 126, 234, 1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(102, 126, 234, 1)'
            }]
        },
        options: {
            scales: {
                r: {
                    angleLines: {
                        color: gridColor
                    },
                    grid: {
                        color: gridColor
                    },
                    pointLabels: {
                        color: textColor,
                        font: {
                            size: 12
                        }
                    },
                    ticks: {
                        color: textColor,
                        backdropColor: 'transparent',
                        stepSize: 1
                    },
                    suggestedMin: 0,
                    suggestedMax: 5
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                },
                title: {
                    display: true,
                    text: 'Desglose de Métricas de Calidad',
                    color: textColor
                }
            }
        }
    });

    // Scroll suave al resultado
    resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Animación del puntaje
function animateScore(start, end, duration) {
    const scoreElement = document.getElementById('score');
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = start + (end - start) * easeOutQuart;
        
        scoreElement.textContent = current.toFixed(2);
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

// Ejemplo automático al cargar
window.addEventListener('load', function() {
    // Aplicar valores de ejemplo (comentado para que usuario configure)
});

// Atajos de teclado
document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.key === 'Enter') {
        const evaluatorSection = document.getElementById('evaluador');
        if (evaluatorSection.classList.contains('active')) {
            calculateQuality();
        }
    }
});

// Validación de navegación
document.querySelectorAll('.nav-btn').forEach(button => {
    button.addEventListener('click', function() {
        const evaluatorSection = document.getElementById('evaluador');
        if (evaluatorSection.classList.contains('active')) {
            const values = {};
            sliders.forEach(slider => {
                values[slider] = document.getElementById(slider).value;
            });
            sessionStorage.setItem('evaluatorValues', JSON.stringify(values));
        }
    });
});

// Restaurar valores si existen
const savedValues = sessionStorage.getItem('evaluatorValues');
if (savedValues) {
    const values = JSON.parse(savedValues);
    Object.keys(values).forEach(key => {
        const input = document.getElementById(key);
        const display = document.getElementById(key + '-val');
        if (input && display) {
            input.value = values[key];
            display.textContent = values[key];
        }
    });
}

// Generar reporte (función adicional)
function generateReport() {
    const metrics = {
        'Adecuación Funcional': document.getElementById('funcionalidad').value,
        'Eficiencia de Desempeño': document.getElementById('desempeno').value,
        'Compatibilidad': document.getElementById('compatibilidad').value,
        'Usabilidad': document.getElementById('usabilidad').value,
        'Fiabilidad': document.getElementById('fiabilidad').value,
        'Seguridad': document.getElementById('seguridad').value,
        'Mantenibilidad': document.getElementById('mantenibilidad').value,
        'Portabilidad': document.getElementById('portabilidad').value
    };

    const reportData = {
        title: 'Reporte de Evaluación de Calidad de Software',
        date: new Date().toLocaleDateString(),
        metrics: metrics,
        finalScore: document.getElementById('score').textContent,
        interpretation: document.getElementById('interpretation').textContent,
        recommendation: document.getElementById('recommendation').textContent
    };

    return reportData;
}

// Función para descargar reporte en PDF
async function downloadReport() {
    const { jsPDF } = window.jspdf;
    const reportData = generateReport();

    if (!reportData.finalScore || reportData.finalScore === '0.0') {
        alert('Por favor, calcule la calidad primero antes de descargar el reporte.');
        return;
    }

    const isDarkMode = document.body.classList.contains('dark-mode');

    const themeColors = {
        light: {
            primary: '#4858d3',
            text: '#343a40',
            textSecondary: '#6c757d',
            bg: '#ffffff',
            cardBg: '#ffffff',  //f8f9fa
            grid: 'rgba(0, 0, 0, 0.1)'
        },
        dark: {
            primary: '#829dff',
            text: '#e0e0e0',
            textSecondary: '#adb5bd',
            bg: '#121212',
            cardBg: '#1e1e1e',
            grid: 'rgba(255, 255, 255, 0.2)'
        }
    };

    const colors = isDarkMode ? themeColors.dark : themeColors.light;

    // --- Create a temporary chart for PDF export ---
    let chartImage = null;
    if (window.myQualityChart) {
        const hiddenCanvas = document.createElement('canvas');
        hiddenCanvas.style.display = 'none';
        hiddenCanvas.width = 800; // Increased size for better quality
        hiddenCanvas.height = 600;
        document.body.appendChild(hiddenCanvas);

        const pdfChartCtx = hiddenCanvas.getContext('2d');
        
        pdfChartCtx.fillStyle = colors.bg;
        pdfChartCtx.fillRect(0, 0, 800, 600);

        const pdfChart = new Chart(pdfChartCtx, {
            type: 'radar',
            data: window.myQualityChart.data,
            options: {
                scales: {
                    r: {
                        angleLines: { color: colors.grid },
                        grid: { color: colors.grid },
                        pointLabels: { color: colors.text, font: { size: 16 } }, // Increased font size
                        ticks: { color: colors.text, backdropColor: 'transparent', stepSize: 1, font: { size: 12 } },
                        suggestedMin: 0,
                        suggestedMax: 5
                    }
                },
                plugins: {
                    legend: { labels: { color: colors.text, font: { size: 14 } } },
                    title: { display: true, text: 'Desglose de Métricas de Calidad', color: colors.text, font: { size: 20 } }
                },
                animation: {
                    duration: 0
                }
            }
        });

        await new Promise(resolve => setTimeout(resolve, 250));
        chartImage = pdfChart.toBase64Image();
        pdfChart.destroy();
        document.body.removeChild(hiddenCanvas);
    }

    // --- Now, build the PDF ---
    const doc = new jsPDF('p', 'mm', 'a4');
    const margin = 15;
    const pageWidth = doc.internal.pageSize.getWidth();
    let yPosition = 25;

    doc.setFillColor(colors.bg);
    doc.rect(0, 0, pageWidth, doc.internal.pageSize.getHeight(), 'F');

    // Título
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(24);
    doc.setTextColor(colors.primary);
    doc.text(reportData.title, pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 12;

    // Fecha
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(colors.text);
    doc.text('Fecha de generación: ' + reportData.date, pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 20;

    // --- Box for results ---
    doc.setFillColor(colors.cardBg);
    doc.roundedRect(margin, yPosition, pageWidth - (margin * 2), 55, 3, 3, 'F');
    
    doc.setFontSize(14);
    doc.setTextColor(colors.textSecondary);
    doc.text('CALIFICACIÓN FINAL', margin + 15, yPosition + 15);
    doc.setFontSize(36);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(colors.primary);
    doc.text(reportData.finalScore + ' / 5.0', margin + 15, yPosition + 32);

    doc.setFontSize(14);
    doc.setTextColor(colors.textSecondary);
    doc.text('INTERPRETACIÓN', margin + 90, yPosition + 15);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(colors.text);
    const interpretationLines = doc.splitTextToSize(reportData.interpretation, pageWidth - (margin * 2) - 100);
    doc.text(interpretationLines, margin + 90, yPosition + 22);

    yPosition += 65;

    // --- Chart ---
    if (chartImage) {
        doc.setFontSize(20);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(colors.primary);
        doc.text('Desglose de Métricas', margin, yPosition);
        yPosition += 12;

        const pdfImageWidth = pageWidth - (margin * 2);
        const pdfImageHeight = (600 / 800) * pdfImageWidth;

        doc.addImage(chartImage, 'PNG', margin, yPosition, pdfImageWidth, pdfImageHeight);
        yPosition += pdfImageHeight + 15;
    }

    // --- Metrics Table ---
    if (yPosition > 220) { 
        doc.addPage();
        yPosition = 25;
        doc.setFillColor(colors.bg);
        doc.rect(0, 0, pageWidth, doc.internal.pageSize.getHeight(), 'F');
    }
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(colors.primary);
    doc.text('Puntuación de Métricas', margin, yPosition);
    yPosition += 12;

    doc.autoTable({
        startY: yPosition,
        head: [['Característica', 'Puntuación']],
        body: Object.entries(reportData.metrics).map(([key, value]) => [key, `${value} / 5.0`]),
        theme: 'grid',
        headStyles: {
            fillColor: colors.primary,
            textColor: isDarkMode ? colors.text : '#ffffff',
            fontSize: 14
        },
        styles: {
            fillColor: colors.cardBg,
            textColor: colors.text,
            fontSize: 12
        },
        alternateRowStyles: {
            fillColor: colors.bg
        },
        margin: { left: margin, right: margin }
    });

    yPosition = doc.lastAutoTable.finalY + 15;

    // --- Recommendation ---
    if (yPosition > 260) {
        doc.addPage();
        yPosition = 25;
        doc.setFillColor(colors.bg);
        doc.rect(0, 0, pageWidth, doc.internal.pageSize.getHeight(), 'F');
    }
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(colors.primary);
    doc.text('Recomendación', margin, yPosition);
    yPosition += 10;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(colors.text);
    const recommendationLines = doc.splitTextToSize(reportData.recommendation, pageWidth - (margin * 2));
    doc.text(recommendationLines, margin, yPosition);

    // Footer
    const pageCount = doc.internal.getNumberOfPages();
    for(let j = 1; j <= pageCount; j++) {
        doc.setPage(j);
        doc.setFontSize(10);
        doc.setTextColor(colors.textSecondary);
        doc.text(`Página ${j} de ${pageCount}`, pageWidth / 2, 287, { align: 'center' });
    }

    doc.save('reporte_calidad_software_' + new Date().getTime() + '.pdf');
}

// Preset de configuraciones
function loadPreset(preset) {
    const presets = {
        excelente: { funcionalidad: 4.8, desempeno: 4.7, compatibilidad: 4.9, usabilidad: 4.6, fiabilidad: 4.8, seguridad: 4.9, mantenibilidad: 4.5, portabilidad: 4.7 },
        bueno: { funcionalidad: 4.2, desempeno: 3.8, compatibilidad: 4.5, usabilidad: 4.0, fiabilidad: 3.5, seguridad: 4.3, mantenibilidad: 3.9, portabilidad: 4.2 },
        regular: { funcionalidad: 3.2, desempeno: 2.8, compatibilidad: 3.0, usabilidad: 3.5, fiabilidad: 2.5, seguridad: 3.3, mantenibilidad: 2.9, portabilidad: 3.0 },
        deficiente: { funcionalidad: 2.0, desempeno: 1.8, compatibilidad: 2.2, usabilidad: 2.5, fiabilidad: 1.5, seguridad: 2.0, mantenibilidad: 1.8, portabilidad: 2.1 }
    };

    const values = presets[preset];
    if (values) {
        Object.keys(values).forEach(key => {
            const input = document.getElementById(key);
            const display = document.getElementById(key + '-val');
            if (input && display) {
                input.value = values[key];
                display.textContent = values[key];
            }
        });
    }
}

// Tooltip helper (unused)
function showTooltip(element, message) {
    // This function is not currently used in the application.
}

// Validación de entrada
sliders.forEach(slider => {
    const input = document.getElementById(slider);
    if(input) {
        input.addEventListener('change', function() {
            if (this.value < 0) this.value = 0;
            if (this.value > 5) this.value = 5;
            document.getElementById(slider + '-val').textContent = this.value;
        });
    }
});

// Inicialización
console.log('Sistema de Evaluación de Calidad de Software cargado correctamente');
console.log('Versión 1.0 - Basado en ISO/IEC 25010');

// Scroll to top button logic
document.addEventListener('DOMContentLoaded', function() {
    const scrollToTopBtn = document.getElementById("scrollToTopBtn");
    if (!scrollToTopBtn) return;

    window.onscroll = function() {
        if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
            scrollToTopBtn.style.display = "flex";
        } else {
            scrollToTopBtn.style.display = "none";
        }
    };

    scrollToTopBtn.addEventListener("click", function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});

// Theme toggle logic
document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    // Check for saved theme preference
    if (localStorage.getItem('theme') === 'dark') {
        body.classList.add('dark-mode');
    }

    themeToggle.addEventListener('click', function() {
        body.classList.toggle('dark-mode');
        
        // Save theme preference
        if (body.classList.contains('dark-mode')) {
            localStorage.setItem('theme', 'dark');
        } else {
            localStorage.removeItem('theme');
        }

        // Redraw chart if it exists and the evaluator section is active
        if (document.getElementById('evaluador').classList.contains('active') && window.myQualityChart) {
            calculateQuality();
        }
    });
});
