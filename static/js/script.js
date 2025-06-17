/* For reference: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch */
document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementsByClassName("row");
    const currentTempBox = document.getElementById("currentTemp");
    const currentHumidityBox = document.getElementById("currentHumidity");
    const lastUpdated = document.querySelector(".lastUpdated");

    async function fetchData() {
        const url = "/api/current";

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Response status: ' + response.status);
            }

            const data = await response.json();
            console.log(data);
            currentTempBox.textContent = "";
            currentTempBox.textContent = data.temperature + " °C";

            currentHumidityBox.textContent = "";
            currentHumidityBox.textContent = data.humidity + " %";

            lastUpdated.textContent = "";
            lastUpdated.textContent = new Date(data.timestamp).toLocaleTimeString();
            console.log(data.timestamp);
        } catch (error) {
            console.error(error.message);
        }
    }

    fetchData();
    setInterval(fetchData, 10_000);
});