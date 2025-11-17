const states = ['Normal', 'Alerta', 'Peligro'];

const sensorLocations = [
    { id: 'suelo1', type: 'suelo', status: 'Peligro', top: '70%', left: '30%', info: { title: 'Sensor Suelo C1', value: '934 ppm', status: 'Peligro', location: 'Zona C' } },
    { id: 'suelo2', type: 'suelo', status: 'Alerta', top: '55%', left: '15%' },
    { id: 'suelo3', type: 'suelo', status: 'Normal', top: '45%', left: '55%' },
    { id: 'suelo4', type: 'suelo', status: 'Alerta', top: '80%', left: '70%' },
    { id: 'suelo5', type: 'suelo', status: 'Normal', top: '35%', left: '85%' },
    { id: 'agua1', type: 'agua', status: 'Normal', top: '85%', left: '5%' },
    { id: 'agua2', type: 'agua', status: 'Peligro', top: '90%', left: '40%' },
    { id: 'agua3', type: 'agua', status: 'Alerta', top: '60%', left: '5%' },
    { id: 'agua4', type: 'agua', status: 'Normal', top: '55%', left: '35%' },
    { id: 'agua5', type: 'agua', status: 'Alerta', top: '75%', left: '90%' },
    { id: 'aire1', type: 'aire', status: 'Alerta', top: '30%', left: '60%' },
    { id: 'aire2', type: 'aire', status: 'Normal', top: '15%', left: '40%' },
    { id: 'aire3', type: 'aire', status: 'Peligro', top: '5%', left: '20%' },
    { id: 'aire4', type: 'aire', status: 'Alerta', top: '40%', left: '75%' },
    { id: 'aire5', type: 'aire', status: 'Normal', top: '25%', left: '5%' },
];

const initialData = {
    aire: { value: 16.8, unit: 'µg/m³', status: 'Alerta', label: 'PM2.5' },
    agua: { value: 0.037, unit: 'mg/L', status: 'Normal', label: 'Metales' },
    suelo: { value: 934, unit: 'ppm', status: 'Peligro', label: 'pH/Metales' },
};

let currentHistory = [
    { fecha: '8/10/2025, 11:28:33 a. m.', sensor: 'aire', valor: '0.438 mg/L', ubicacion: 'Pozo B2', estado: 'Alerta' },
    { fecha: '8/10/2025, 11:28:33 a. m.', sensor: 'aire', valor: '5.6 µg/m³', ubicacion: 'Sector A1', estado: 'Alerta' },
    { fecha: '8/10/2025, 11:28:33 a. m.', sensor: 'suelo', valor: '167 ppm', ubicacion: 'Zona C', estado: 'Alerta' },
    { fecha: '8/10/2025, 11:28:33 a. m.', sensor: 'agua', valor: '0.03 mg/L', ubicacion: 'Pozo B2', estado: 'Peligro' },
    { fecha: '8/10/2025, 11:28:33 a. m.', sensor: 'aire', valor: '10 µg/m³', ubicacion: 'Sector A1', estado: 'Normal' },
];

let currentAlerts = [
    { status: 'alerta', text: 'PM2.5 elevado en sector A1', time: '11:42:58 a. m.' },
    { status: 'peligro', text: 'contaminación en agua detectada', time: '11:42:50 a. m.' },
    { status: 'alerta', text: 'PM2.5 elevado en sector A1', time: '11:42:58 a. m.' },
    { status: 'alerta', text: 'niveles de metales en agua por encima de lo esperado', time: '11:32:14 a. m.' },
    { status: 'alerta', text: 'metales en suelo en rango medio', time: '11:30:10 a. m.' },
    { status: 'peligro', text: 'PM2.5 muy alto en sector A1', time: '11:15:25 a. m.' },
];


const getRandomValue = (min, max) => (Math.random() * (max - min) + min).toFixed(3);
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;


function updateQualityCards(aireVal, aireStatus, aguaVal, aguaStatus, sueloVal, sueloStatus) {
    document.getElementById('aire-value').textContent = aireVal;
    document.getElementById('aire-status').textContent = aireStatus;
    document.getElementById('aire-status').className = `status-tag ${aireStatus.toLowerCase()}`;

    document.getElementById('agua-value').textContent = aguaVal;
    document.getElementById('agua-status').textContent = aguaStatus;
    document.getElementById('agua-status').className = `status-tag ${aguaStatus.toLowerCase()}`;

    document.getElementById('suelo-value').textContent = sueloVal;
    document.getElementById('suelo-status').textContent = sueloStatus;
    document.getElementById('suelo-status').className = `status-tag ${sueloStatus.toLowerCase()}`;
}

function renderHistoryTable(history, filter = 'Todos') {
    const tbody = document.getElementById('history-body');
    tbody.innerHTML = '';

    const filteredHistory = history.filter(item => {
        if (filter === 'Todos') return true;
        return item.sensor.toLowerCase() === filter.toLowerCase();
    });

    filteredHistory.forEach(item => {
        const row = tbody.insertRow();
        row.innerHTML = `
            <td>${item.fecha}</td>
            <td>${item.sensor}</td>
            <td>${item.valor}</td>
            <td>${item.ubicacion}</td>
            <td class="status-col ${item.estado.toLowerCase()}">${item.estado}</td>
        `;
    });
}

function renderAlerts(alerts) {
    const list = document.getElementById('alert-list');
    list.innerHTML = '';
    alerts.forEach(item => {
        const div = document.createElement('div');
        div.className = `alert-item ${item.status.toLowerCase()}`;
        div.innerHTML = `
            ${item.text}
            <span class="alert-time">Prioridad | ${item.time}</span>
        `;
        list.appendChild(div);
    });
}

function updateSensorInfoBox(info) {
    const box = document.getElementById('sensor-info-box');
    box.querySelector('.box-title').textContent = info.title;
    document.getElementById('box-value').textContent = info.value;
    document.getElementById('box-status').textContent = info.status;
    document.getElementById('box-location').textContent = info.location;

    const statusColor = getComputedStyle(document.documentElement).getPropertyValue(`--${info.status.toLowerCase()}-color`).trim() || '#f44336';
    box.style.borderLeft = `5px solid ${statusColor}`;
}


function renderSensorPoints(locations) {
    const mapContainer = document.querySelector('.map-container');
    mapContainer.querySelectorAll('.sensor-point').forEach(p => p.remove());

    locations.forEach(sensor => {
        const point = document.createElement('div');

        point.className = `sensor-point ${sensor.type} ${sensor.status.toLowerCase()}`;
        point.style.top = sensor.top;
        point.style.left = sensor.left;
        point.dataset.id = sensor.id;

        point.addEventListener('click', () => {
            let value;
            if (sensor.type === 'aire') {
                value = initialData.aire.value + ' ' + initialData.aire.unit;
            } else if (sensor.type === 'agua') {
                value = initialData.agua.value + ' ' + initialData.agua.unit;
            } else { // suelo
                value = initialData.suelo.value + ' ' + initialData.suelo.unit;
            }

            updateSensorInfoBox({
                title: `Sensor ${sensor.type.toUpperCase()}`,
                value: value,
                status: sensor.status,
                location: sensor.id.toUpperCase()
            });
        });

        mapContainer.appendChild(point);
    });

    const initialSensor = locations.find(s => s.info) || locations[0];
    updateSensorInfoBox({
        title: initialSensor.info?.title || `Sensor ${initialSensor.type.toUpperCase()}`,
        value: initialSensor.info?.value || initialData[initialSensor.type].value + ' ' + initialData[initialSensor.type].unit,
        status: initialSensor.info?.status || initialSensor.status,
        location: initialSensor.info?.location || initialSensor.id.toUpperCase(),
    });
}


function simulateNewData() {
    const newaireValue = getRandomValue(5, 150);
    const newaireStatus = newaireValue > 100 ? 'Peligro' : (newaireValue > 25 ? 'Alerta' : 'Normal');

    const newaguaValue = getRandomValue(0.01, 1);
    const newaguaStatus = newaguaValue > 0.5 ? 'Peligro' : (newaguaValue > 0.1 ? 'Alerta' : 'Normal');

    const newsueloValue = getRandomInt(100, 1500);
    const newsueloStatus = newsueloValue > 1200 ? 'Peligro' : (newsueloValue > 800 ? 'Alerta' : 'Normal');

    updateQualityCards(newaireValue, newaireStatus, newaguaValue, newaguaStatus, newsueloValue, newsueloStatus);

    const sensorTypes = ['Aire', 'Agua', 'Suelo'];
    const randomSensor = sensorTypes[getRandomInt(0, 2)];
    const randomLocation = ['Sector A1', 'Pozo B2', 'Zona C', 'Sector D'][getRandomInt(0, 3)];
    const randomStatus = states[getRandomInt(0, 2)];
    const alertTextMap = {
        'Peligro': `Contaminación crítica de ${randomSensor.toLowerCase()} detectada`,
        'Alerta': `Niveles de ${randomSensor.toLowerCase()} por encima del rango medio`,
        'Normal': `Sistema de ${randomSensor.toLowerCase()} restaurado a niveles seguros`
    };

    const newAlert = {
        status: randomStatus.toLowerCase(),
        text: alertTextMap[randomStatus],
        time: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }),
    };

    currentAlerts = [newAlert, ...currentAlerts.slice(0, 5)];
    renderAlerts(currentAlerts);

    const newHistoryEntry = {
        fecha: new Date().toLocaleString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }),
        sensor: randomSensor.toLowerCase(),
        valor: randomSensor === 'Aire' ? `${getRandomValue(5, 50)} µg/m³` : (randomSensor === 'Agua' ? `${getRandomValue(0.01, 0.5)} mg/L` : `${getRandomInt(100, 1000)} ppm`),
        ubicacion: randomLocation,
        estado: randomStatus,
    };

    currentHistory = [newHistoryEntry, ...currentHistory.slice(0, 4)];
    renderHistoryTable(currentHistory);

    const newSensorLocations = sensorLocations.map(s => {
        const newStatus = states[getRandomInt(0, 2)];
        s.status = newStatus; 
        return s;
    });
    renderSensorPoints(newSensorLocations);

    document.getElementById('last-update').textContent = `Última actualización: ${new Date().toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'medium', hour12: true })}`;
}


document.addEventListener('DOMContentLoaded', () => {
    updateQualityCards(initialData.aire.value, initialData.aire.status, initialData.agua.value, initialData.agua.status, initialData.suelo.value, initialData.suelo.status);
    renderHistoryTable(currentHistory);
    renderAlerts(currentAlerts);
    renderSensorPoints(sensorLocations);

    const updateButton = document.getElementById('update-data-btn');
    if (updateButton) {
        updateButton.addEventListener('click', simulateNewData);
    }
    
    const filterDropdown = document.querySelector('.filter-dropdown');

    filterDropdown.addEventListener('click', (event) => {
        const target = event.target;
        
        if (target.tagName === 'A' && target.hasAttribute('data-filter')) {
            event.preventDefault();

            const filterValue = target.getAttribute('data-filter');
            
            renderHistoryTable(currentHistory, filterValue);
            
            const filterTextNode = filterDropdown.firstChild;
            if (filterTextNode && filterTextNode.nodeType === 3) {
                filterTextNode.textContent = `Filtro: ${filterValue}`;
            }
        }
    });

});