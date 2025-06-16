document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("container");

    async function fetchData() {
        const url = "http://climatebot.net/api/current";

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Response status: ' + response.status);
            }

            const data = await response.json();
            console.log(data);
            container.innerHTML = data.temperature;
        } catch (error) {
            console.error(error.message);
        }
    }



    fetchData();
    setInterval(fetchData, 10_000);
});