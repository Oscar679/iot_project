/* For reference: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch */
document.addEventListener("DOMContentLoaded", () => {
    const currentTempBox = document.getElementById("currentTemp");
    const currentHumidityBox = document.getElementById("currentHumidity");
    const lastUpdated = document.querySelector(".lastUpdated");
    const temporaryTempCanvas = document.getElementById("tempChart").getContext("2d");

    if (temporaryTempCanvas == null) {
        return;
    }

    const tempChart = new Chart(temporaryTempCanvas, {
        type: 'line',
        data: {
            labels: [],
            // labels: data.map(row => row.data.timestamp.toLocaleTimeString()),
            datasets: [
                {
                    label: 'Temperature (°C)',
                    data: [],
                    borderColor: '#ff6b6b',
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

            const time = new Date(data.timestamp).toLocaleDateString() + " " + new Date(data.timestamp).toLocaleTimeString();
            tempChart.data.labels.push(time);
            tempChart.data.datasets[0].data.push(data.temperature)

            if (tempChart.data.labels.length > 3) {
                tempChart.data.labels.shift();
                tempChart.data.datasets[0].data.shift();
            }

            tempChart.update();
        } catch (error) {
            console.error(error.message);
        }
    }

    fetchData();
    setInterval(fetchData, 5000);

});