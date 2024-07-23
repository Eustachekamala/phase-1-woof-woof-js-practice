document.addEventListener("DOMContentLoaded", () => {
    let allDogs = [];
    let dogBar = document.querySelector("#dog-bar");
    const dogInfo = document.querySelector("#dog-info");
    const goodDogsFilterBtn = document.querySelector("#good-dog-filter");

    // Fetch dogs data from an API
    fetch("http://localhost:3000/pups")
        .then(response => response.json())
        .then(data => {
            allDogs = data;
            renderDogBar(allDogs);
        })
        .catch(error => {
            console.error("Error fetching dogs:", error);
            alert("Failed to fetch dogs. Please try again later.");
        });

    // Render the dog bar with all dogs
    function renderDogBar(dogs) {
        dogBar.innerHTML = '';
        dogs.forEach(dog => {
            const dogSpan = document.createElement("span");
            dogSpan.textContent = dog.name;
            dogSpan.addEventListener("click", () => showDogInfo(dog));
            dogBar.appendChild(dogSpan);
        });
    }

    // Show dog information in the dog info section
    function showDogInfo(dog) {
        let dogImage = document.createElement("img");
        dogImage.src = dog.image;

        let dogGoodnessBtn = document.createElement("button");
        dogGoodnessBtn.textContent = dog.isGoodDog ? "Good Dog" : "Bad Dog";
        dogGoodnessBtn.addEventListener("click", () => toggleDogGoodness(dog, dogGoodnessBtn));

        dogInfo.innerHTML = `
            <img src="${dog.image}">
            <p>${dog.name}</p>
        `;
        dogInfo.appendChild(dogGoodnessBtn);
        dogInfo.style.display = "block";
    }

    // Toggle dog goodness (good/bad) and update in database
    function toggleDogGoodness(dog, button) {
        dog.isGoodDog = !dog.isGoodDog;
        button.textContent = dog.isGoodDog ? "Good Dog" : "Bad Dog";
        button.className = dog.isGoodDog ? "" : "bad"; // Update button class
        updateDogInDatabase(dog);
    }

    // Update the dog in the database via PATCH request
    function updateDogInDatabase(dog) {
        fetch(`http://localhost:3000/pups/${dog.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                isGoodDog: dog.isGoodDog
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to update dog in database");
            }
            console.log("Dog updated successfully in database");
        })
        .catch(error => {
            console.error("Error updating dog in database:", error);
            alert("Failed to update dog in database. Please try again later.");
        });
    }

    // Filter good dogs
    goodDogsFilterBtn.addEventListener("click", () => {
        const goodDogs = allDogs.filter(dog => dog.isGoodDog);
        renderDogBar(goodDogs);
    });
});
