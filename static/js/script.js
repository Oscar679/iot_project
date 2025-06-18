/* For reference: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch */
document.addEventListener("DOMContentLoaded", () => {
    const temporaryTempCanvas = document.getElementById("tempChart").getContext("2d");
    const temporaryHumidityCanvas = document.getElementById("humidityChart").getContext("2d");
    const temporaryAllDataCanvas = document.getElementById("allDataChart").getContext("2d");

    if (temporaryTempCanvas == null) {
        console.error('Could not find the temperature canvas');
        return;
    }

    if (temporaryHumidityCanvas == null) {
        console.error('Could not find the humidity canvas');
        return;
    }

    if (temporaryAllDataCanvas == null) {
        console.error('Could not find the all-time-data canvas');
        return;
    }

    const allDataChart = new Chart(temporaryAllDataCanvas, {
        type: 'line',
        data: {
            labels: [],
            datasets: [
                {
                    label: 'Temperature (°C)',
                    data: [],
                    backgroundColor: '#ff6b6b',
                    borderColor: '#ff6b6b',
                    borderWidth: 2,
                    pointRadius: 0,
                    order: 1,
                },
                {
                    label: 'Percentage (%)',
                    data: [],
                    backgroundColor: '#20c997',
                    borderColor: '#20c997',
                    borderWidth: 2,
                    pointRadius: 0,
                    order: 2,
                }

            ]
        }, options: {
            animation: false,
            scales: {
                x:
                {
                    title: { display: true, text: 'Time' },
                    ticks: {
                        autoSkip: true,
                        maxTicksLimit: 1
                    }
                },
                y: {
                    beginAtZero: true,
                    title: { display: true, text: '°C' },
                    max: 100,
                }
            }
        }
    });

    const tempChart = new Chart(temporaryTempCanvas, {
        type: 'line',
        data: {
            labels: [],
            datasets: [
                {
                    label: 'Temperature (°C)',
                    data: [],
                    backgroundColor: '#ff6b6b',
                    borderColor: '#ff6b6b',
                    borderWidth: 4,
                    pointRadius: 4,
                }
            ]
        }, options: {
            animation: false,
            scales: {
                x: { title: { display: true, text: 'Time' } },
                y: {
                    beginAtZero: true,
                    title: { display: true, text: '°C' },
                    max: 50,
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    enabled: false
                }
            }
        }
    });

    const humidityChart = new Chart(temporaryHumidityCanvas, {
        type: 'line',
        data: {
            labels: [],
            datasets: [
                {
                    label: 'Percentage (%)',
                    data: [],
                    backgroundColor: '#20c997',
                    borderColor: '#20c997',
                    borderWidth: 4,
                    pointRadius: 4,
                }
            ]
        }, options: {
            animation: false,
            scales: {
                x: { title: { display: true, text: 'Time' } },
                y: {
                    beginAtZero: true,
                    title: { display: true, text: '%' },
                    max: 100,
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    enabled: false
                }
            }
        }
    });

    async function fetchHistoricalData() {
        const url = "/api/history";

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Response status: ' + response.status);
            }

            const dataRows = await response.json();

            dataRows.reverse().forEach(row => {
                const time = new Date(row.timestamp).toLocaleTimeString();
                tempChart.data.labels.push(time);
                tempChart.data.datasets[0].data.push(row.temperature)

                humidityChart.data.labels.push(time);
                humidityChart.data.datasets[0].data.push(row.humidity);
            });

            tempChart.update();
            humidityChart.update();

        } catch (error) {
            console.error(error.message);
        }
    }

    fetchHistoricalData();

    async function fetchData() {
        const url = "/api/current";

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Response status: ' + response.status);
            }

            const data = await response.json();

            const time = new Date(data.timestamp).toLocaleTimeString();
            tempChart.data.labels.push(time);
            tempChart.data.datasets[0].data.push(data.temperature)

            if (tempChart.data.labels.length > 5) {
                tempChart.data.labels.shift();
                tempChart.data.datasets[0].data.shift();
            }

            humidityChart.data.labels.push(time);
            humidityChart.data.datasets[0].data.push(data.humidity);

            if (humidityChart.data.labels.length > 5) {
                humidityChart.data.labels.shift();
                humidityChart.data.datasets[0].data.shift();
            }

            tempChart.update();
            humidityChart.update();

        } catch (error) {
            console.error(error.message);
        }
    }

    fetchData();
    setInterval(fetchData, 5000);

    async function fetchAllData() {
        const url = "/api/allData"

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Response status: ' + response.status);
            }

            const dataRows = await response.json();
            dataRows.forEach(row => {
                const time = new Date(row.timestamp).toLocaleDateString();
                allDataChart.data.labels.push(time);
                allDataChart.data.datasets[0].data.push(row.temperature)

                allDataChart.data.datasets[1].data.push(row.humidity);
            });

            allDataChart.update();
        } catch (error) {
            console.error(error.message);
        }
    }

    fetchAllData();
});