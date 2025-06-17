/* For reference: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch */
document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementsByClassName("row");
    currentTempBox = document.getElementById("currentTemp");
    currentHumidityBox = document.getElementById("currentHumidity");
    lastUpdated = document.getElementsByClassName(".lastUpdated");

    async function fetchData() {
        const url = "/api/current";

        try {
            const response = await fetch(url);  
            if (!response.ok) {
                throw new Error('Response status: ' + response.status);
            }

            const data = await response.json();
            console.log(data);
            currentTempBox.innerHTML = "";
            currentTempBox.innerHTML = data.temperature + " °C";

            currentHumidityBox.innerHTML = "";
            currentHumidityBox.innerHTML = data.humidity + " %";

            lastUpdated.innerHTML = "";
            lastUpdatedBox.innerText = new Date(data.timestamp).toLocaleTimeString();
            console.log(data.timestamp);
        } catch (error) {
            console.error(error.message);
        }
    }

    fetchData();
    setInterval(fetchData, 10_000);
});