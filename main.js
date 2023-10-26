const URL = 'https://pokeapi.co/api/v2/pokemon/';
const evolutionURL = 'https://pokeapi.co/api/v2/evolution-chain/';
let currentPokemon = null;

const searchInput = document.getElementById('search');
const pokedexContainer = document.getElementById('pokedex');

function showError(message) {
    pokedexContainer.innerHTML = `<p class="error">${message}</p>`;
}

async function loadPokemonData(pokemonName) {
    try {
        const response = await fetch(URL + pokemonName);
        if (!response.ok) {
            showError(`No se encontró ningún Pokémon llamado "${pokemonName}"`);
            return;
        }

        const data = await response.json();

        const speciesResponse = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${data.id}/`);
        const speciesData = await speciesResponse.json();

        const evolutionChainURL = speciesData.evolution_chain.url;

        const evolutionResponse = await fetch(evolutionChainURL);
        const evolutionData = await evolutionResponse.json();

        var evolvesTo = '';

        if (evolutionData.chain.evolves_to[0].species.name == speciesData.name) {
            evolvesTo = evolutionData.chain.evolves_to[0].evolves_to[0];
        } else if (evolutionData.chain.evolves_to[0].evolves_to[0].species.name == speciesData.name) {
            evolvesTo = evolutionData.chain.evolves_to[0].evolves_to[0].evolves_to[0];
        } else {
            evolvesTo = evolutionData.chain.evolves_to[0];
        }

        pokedexContainer.innerHTML =
        `
        <div class="card pokemon-card">
            <img src="${data.sprites.front_default}" class="card-img-top" alt="${data.name}">
            <div class="card-body">
                <h5 class="card-title">${data.name.toUpperCase()}</h5>
                <p class="card-text">Number: ${data.id}</p>
                <p class="card-text">Height: ${data.height / 10}m</p>
                <p class="card-text">Weight: ${data.weight / 10}kg</p>
                <p class="card-text">Description: ${speciesData.flavor_text_entries[0].flavor_text}</p>
                <p class="card-text">Skills: ${data.abilities.map(ability => ability.ability.name).join(', ')}</p>
                <p class="card-text">Movements: ${data.moves.slice(0, 5).map(move => move.move.name).join(', ')}</p>
                ${evolvesTo ? `<button class="btn btn-primary evolve-button">Evolucionar a ${evolvesTo.species.name.toUpperCase()}</button>` : ''}
            </div>
        </div>
        `;
        

        if (evolvesTo) {
            const evolveButton = document.querySelector('.evolve-button');
            evolveButton.addEventListener('click', () => loadPokemonData(evolvesTo.species.name));
        }
    } catch (error) {
        showError('Ha ocurrido un error al buscar el Pokémon');
        console.error(error);
    }
}

document.querySelector('button').addEventListener('click', () => {
    const searchedPokemon = searchInput.value.toLowerCase();
    loadPokemonData(searchedPokemon);
});

function clearSearchInput() {
    searchInput.value = '';
}

const clearButton = document.getElementById('clear-button');
clearButton.addEventListener('click', clearSearchInput);