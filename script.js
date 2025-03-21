let currentPokemonId = 1;
let pokemonList = [];

async function loadPokemonList() {
    const response = await fetch("http://localhost:3000/api/pokemon");
    pokemonList = await response.json();
    
    ["pokemon-list", "pokemon-list-1", "pokemon-list-2"].forEach(listId => {
        const dataList = document.getElementById(listId);
        dataList.innerHTML = "";
        pokemonList.forEach(pokemon => {
            const option = document.createElement("option");
            option.value = pokemon;
            dataList.appendChild(option);
        });
    });
}

function filterDropdown() {
    const input = document.getElementById("search").value.toLowerCase();
    const dataList = document.getElementById("pokemon-list");
    dataList.innerHTML = "";

    if (input.length < 4) return;

    const filtered = pokemonList.filter(pokemon => pokemon.includes(input));
    filtered.forEach(pokemon => {
        const option = document.createElement("option");
        option.value = pokemon;
        dataList.appendChild(option);
    });
}

async function searchPokemon() {
    const name = document.getElementById("search").value.toLowerCase();
    if (name.length < 4) return;

    const response = await fetch(`http://localhost:3000/api/pokemon/${name}`);
    if (!response.ok) {
        document.getElementById("pokemon-info").innerHTML = "<p>Pokémon not found</p>";
        return;
    }

    const data = await response.json();
    currentPokemonId = data.id;
    updateNavButtons();
    displayPokemon(data);
}

async function surpriseMe() {
    const response = await fetch("http://localhost:3000/api/pokemon/random");
    const data = await response.json();
    currentPokemonId = data.id;
    updateNavButtons();
    displayPokemon(data);
}

async function battlePokemon() {
    const pokemon1 = document.getElementById("pokemon1").value.toLowerCase();
    const pokemon2 = document.getElementById("pokemon2").value.toLowerCase();

    const response = await fetch("http://localhost:3000/api/battle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pokemon1, pokemon2 })
    });

    const data = await response.json();
    document.getElementById("battle-result").innerHTML = data.result;
}

async function playPokemonCry(name) {
    const response = await fetch(`http://localhost:3000/api/pokemon/cry/${name}`);
    const data = await response.json();
    if (data.cry) {
        const audio = new Audio(data.cry);
        audio.play();
    }
}

function changeBackgroundColor(color) {
    const colorMap = {
        red: "#FF6961", blue: "#77B5FE", yellow: "#FFD700", green: "#77DD77",
        black: "#555555", brown: "#A52A2A", purple: "#B19CD9", pink: "#FFB6C1",
        gray: "#D3D3D3", white: "#FFFFFF"
    };
    document.body.style.backgroundColor = colorMap[color] || "#f4f4f4";
}

function displayPokemon(data) {
    playPokemonCry(data.name);
    changeBackgroundColor(data.color);

    document.getElementById("pokemon-info").innerHTML = `
        <h3>${data.name.toUpperCase()}</h3>
        <img src="${data.image}" alt="${data.name}">
        <p><strong>Abilities:</strong> ${data.abilities.join(", ")}</p>
        <p><strong>Score:</strong> ${data.score}</p>
        <p><strong>Ranking:</strong> ${data.rank}</p>
        <div class="stats-box">
            <h4>Stats:</h4>
            ${data.stats.map(stat => `<p><strong>${stat.name}:</strong> ${stat.value}</p>`).join("")}
        </div>
    `;

    updateNavButtons();
}

async function navigatePokemon(direction) {
    let newId = currentPokemonId + direction;

    if (newId < 1 || newId > 898) return;

    const response = await fetch(`http://localhost:3000/api/pokemon/id/${newId}`);
    if (!response.ok) return;

    const data = await response.json();
    currentPokemonId = newId;
    displayPokemon(data);
}

function updateNavButtons() {
    document.getElementById("prev-btn").disabled = currentPokemonId <= 1;
    document.getElementById("next-btn").disabled = currentPokemonId >= 898;
}

document.addEventListener("DOMContentLoaded", loadPokemonList);
