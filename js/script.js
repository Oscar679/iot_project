document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("container");

    async function fetchData() {
        const url = "http://climatebot.net/api/current";

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Response status: ' + response.status);
            }

            const json = await response.json();
            console.log(json);
            container.innerHTML = json[0];
        } catch (error) {
            console.error(error.message);
        }
    }




});