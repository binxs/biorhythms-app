import init, { BiorhythmCalculator } from './pkg/biorhythms_wasm.js';

let calculator = null;

async function initWasm() {
    await init();
    
    const birthdateInput = document.getElementById('birthdate');
    const calculateButton = document.getElementById('calculate');
    
    calculateButton.addEventListener('click', calculateAndPlot);
    
    // Calculate on page load with default date
    calculateAndPlot();
}

async function calculateAndPlot() {
    const birthdateInput = document.getElementById('birthdate');
    const birthdate = birthdateInput.value;
    
    try {
        calculator = new BiorhythmCalculator(birthdate);
        const data = calculator.calculate_biorhythms(60); // 60 days of data
        
        plotBiorhythms(data);
    } catch (error) {
        console.error('Error calculating biorhythms:', error);
        document.getElementById('chart').innerHTML = `
            <div class="loading">Error: ${error}</div>
        `;
    }
}

function plotBiorhythms(data) {
    const dates = data.map(d => d.date);
    const physical = data.map(d => d.physical);
    const emotional = data.map(d => d.emotional);
    const intellectual = data.map(d => d.intellectual);
    
    const traces = [
        {
            x: dates,
            y: physical,
            type: 'scatter',
            mode: 'lines',
            name: 'Physical (23 days)',
            line: { color: '#e74c3c', width: 3 }
        },
        {
            x: dates,
            y: emotional,
            type: 'scatter',
            mode: 'lines',
            name: 'Emotional (28 days)',
            line: { color: '#3498db', width: 3 }
        },
        {
            x: dates,
            y: intellectual,
            type: 'scatter',
            mode: 'lines',
            name: 'Intellectual (33 days)',
            line: { color: '#2ecc71', width: 3 }
        }
    ];
    
    const layout = {
        title: {
            text: 'Your Biorhythm Cycles',
            font: { size: 24, color: '#333' }
        },
        xaxis: {
            title: 'Date',
            gridcolor: '#e9ecef',
            tickangle: -45
        },
        yaxis: {
            title: 'Cycle Value',
            range: [-1.2, 1.2],
            gridcolor: '#e9ecef',
            zeroline: true,
            zerolinecolor: '#666',
            zerolinewidth: 2
        },
        plot_bgcolor: '#ffffff',
        paper_bgcolor: '#ffffff',
        legend: {
            x: 0.02,
            y: 0.98,
            bgcolor: 'rgba(255, 255, 255, 0.8)',
            bordercolor: '#ddd',
            borderwidth: 1
        },
        margin: { t: 60, r: 40, b: 100, l: 80 },
        hovermode: 'x unified'
    };
    
    const config = {
        responsive: true,
        displayModeBar: true,
        modeBarButtonsToRemove: ['pan2d', 'lasso2d', 'select2d']
    };
    
    Plotly.newPlot('chart', traces, layout, config);
}

// Initialize the application
initWasm().catch(console.error);