/* Funcion de cambio de placeholder */
function updatePlaceholders() {
    const formato = document.getElementById('formato').value;
    const latInput = document.getElementById('latitud');
    const lngInput = document.getElementById('longitud');

    if (formato === 'DD') {
        latInput.placeholder = 'Ej: 41.40338';
        lngInput.placeholder = 'Ej: 2.17403';
    } else if (formato === 'DMS') {
        latInput.placeholder = 'Ej: 41 24 12.2';
        lngInput.placeholder = 'Ej: 2 10 26.5';
    } else if (formato === 'DMM') {
        latInput.placeholder = 'Ej: 41 24.2028';
        lngInput.placeholder = 'Ej: 2 10.4418';
    }
}

function convertCoordinates() {
    /* Leo valores de lat, long y los hemisferios */
    const latInput = document.getElementById('latitud').value.trim();
    const lngInput = document.getElementById('longitud').value.trim();
    const hemiLat = document.getElementById('hemisferioLat').value;
    const hemiLng = document.getElementById('hemisferioLng').value;

    

    const lat = processCoordinate(latInput, hemiLat);
    const lng = processCoordinate(lngInput, hemiLng);

    console.log(hemiLat);
    console.log(hemiLng);
    console.log(lat);
    console.log(lng);

    console.log(`Decimales (DD): ${lat.toFixed(5)}, ${lng.toFixed(5)}`);
    console.log(`Grados, minutos y segundos (DMS): ${convertToDMS(lat)}, ${convertToDMS(lng)}`)

    document.getElementById('dd').innerText = `Decimales (DD): ${lat.toFixed(5)}, ${lng.toFixed(5)}`;
    document.getElementById('dms').innerText = `Grados, minutos y segundos (DMS): ${convertToDMS(lat, hemiLat)}, ${convertToDMS(lng, hemiLng)}`;
    document.getElementById('dmm').innerText = `Grados y minutos decimales (DMM): ${convertToDMM(lat, hemiLat)}, ${convertToDMM(lng, hemiLng)}`;
    document.getElementById('utm').innerText = `UTM: ${convertToUTM(lat, lng)}`;
    document.getElementById('ups').innerText = `UPS: ${convertToUPS(lat, lng)}`;
    document.getElementById('mgrs').innerText = `MGRS: ${convertToMGRS(lat, lng)}`;
    document.getElementById('geohash').innerText = `GeoHash: ${convertToGeoHash(lat, lng)}`;
    document.getElementById('olc').innerText = `OLC: ${convertToOLC(lat, lng)}`;

    updateMap(lat, lng);
}

function processCoordinate(input, hemisphere) {
    const parts = input.split(' ').map(Number);
    if (parts.length === 3) {
        const degrees = parts[0];
        const minutes = parts[1] / 60;
        const seconds = parts[2] / 3600;
        return (hemisphere === "S" || hemisphere === "W") ? -(degrees + minutes + seconds) : (degrees + minutes + seconds);
    }
    return (hemisphere === "S" || hemisphere === "W") ? -parseFloat(input) : parseFloat(input);
}

function convertToDMS(coordinate, hemi) {
    const absolute = Math.abs(coordinate);
    const degrees = Math.floor(absolute);
    const minutesNotTruncated = (absolute - degrees) * 60;
    const minutes = Math.floor(minutesNotTruncated);
    const seconds = ((minutesNotTruncated - minutes) * 60).toFixed(1);
    return `${degrees}°${minutes}'${seconds}" ${hemi}`;
}

function convertToDMM(coordinate, hemi) {
    const absolute = Math.abs(coordinate);
    const degrees = Math.floor(absolute);
    const minutes = ((absolute - degrees) * 60).toFixed(4);
    return `${degrees} ${minutes}' ${hemi}`;
}

function convertToUTM(lat, lng) {
    const zone = Math.floor((lng + 180) / 6) + 1;
    const hemisphere = lat >= 0 ? 'N' : 'S';
    return `${zone}${hemisphere} ${Math.floor(lng * 1000000)} ${Math.floor(lat * 1000000)}`;
}

function convertToUPS(lat, lng) {
    const zone = lat >= 0 ? 'X' : 'Y';
    return `${zone} ${Math.floor(lng * 1000000)} ${Math.floor(lat * 1000000)}`;
}

function convertToMGRS(lat, lng) {
    // Simplified MGRS conversion
    const zone = Math.floor((lng + 180) / 6) + 1;
    const grid = Math.floor(lat * 1000000) % 100000;
    return `${zone}${grid}`;
}

function convertToGeoHash(lat, lng) {
    // Simplified GeoHash conversion
    return 'ezpm92'; // Example static value for demonstration
}

function convertToOLC(lat, lng) {
    // Simplified OLC conversion
    return '87JCJW5M+X2'; // Example static value for demonstration
}

function updateMap(lat, lng) {
    const map = L.map('map').setView([lat, lng], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap'
    }).addTo(map);

    L.marker([lat, lng]).addTo(map)
        .bindPopup(`Lat: ${lat.toFixed(5)}, Lng: ${lng.toFixed(5)}`)
        .openPopup();
}
