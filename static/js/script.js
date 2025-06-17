/* For reference: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch */
document.addEventListener("DOMContentLoaded", () => {
    const currentTempBox = document.getElementById("currentTemp");
    const currentHumidityBox = document.getElementById("currentHumidity");
    const lastUpdated = document.querySelector(".lastUpdated");
    const temporaryTempCanvas = document.getElementById("tempChart").getContext("2d");
    const temporaryHumidityCanvas = document.getElementById("humidityChart").getContext("2d");
    const temporaryAllDataCanvas = document.getElementById("allDataChart").getContext("2d");
    // const avgHumiditySelector = document.getElementById("avgHumidity");

    //let avgHumidity = 0;


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
            // labels: data.map(row => row.data.timestamp.toLocaleTimeString()),
            datasets: [
                {
                    label: 'Temperature (°C)',
                    data: [],
                    backgroundColor: '#ff6b6b',
                    //data: data.map(row => row.temperature)
                }
            ]
        }, options: {
            animation: false,
            scales: {
                x: { title: { display: true, text: 'Time' } },
                y: { beginAtZero: true, title: { display: true, text: '°C' } }
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

    const tempChart = new Chart(temporaryTempCanvas, {
        type: 'line',
        data: {
            labels: [],
            // labels: data.map(row => row.data.timestamp.toLocaleTimeString()),
            datasets: [
                {
                    label: 'Temperature (°C)',
                    data: [],
                    backgroundColor: '#ff6b6b',
                    //data: data.map(row => row.temperature)
                }
            ]
        }, options: {
            animation: false,
            scales: {
                x: { title: { display: true, text: 'Time' } },
                y: { beginAtZero: true, title: { display: true, text: '°C' } }
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
                }
            ]
        }, options: {
            animation: false,
            scales: {
                x: { title: { display: true, text: 'Time' } },
                y: { beginAtZero: true, title: { display: true, text: '%' } }
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
            console.log(dataRows);


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
            console.log(data);

            console.log(data.timestamp);

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
            console.log(dataRows);


            dataRows.forEach(row => {
                const time = new Date(row.timestamp).toLocaleTimeString();
                tempChart.data.labels.push(time);
                tempChart.data.datasets[0].data.push(row.temperature)

                // humidityChart.data.labels.push(time);
                // humidityChart.data.datasets[0].data.push(row.humidity);
            });

            allDataChart.update();
        } catch (error) {
            console.error(error.message);
        }
    }

    fetchAllData();
});