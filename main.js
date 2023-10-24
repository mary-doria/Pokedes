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
        cont = 0;

        const evolutionResponse = await fetch(evolutionChainURL);
        const evolutionData = await evolutionResponse.json();
        console.log(data.id);


        
        //EVOLUCION 1
        if(evolutionData.chain.evolves_to[0]){
            cont1 =cont + 1;
            console.log("CONTADOR1", cont)
            //console.log("hola", evolutionData.chain.evolves_to[0].species.url.split("/")[6])
            //var evolvesTo = evolutionData.chain.evolves_to[0];
        }
        //EVOLUCION2
        if(evolutionData.chain.evolves_to[0].evolves_to[0]){
            cont =cont1+ 1
            console.log("CONTADOR2", cont1)
            console.log("hola11111111111111111", evolutionData.chain.evolves_to[0].evolves_to[0].species.url.split("/")[6])
            //var evolvesTo = evolutionData.chain.evolves_to[0].evolves_to[0];
        }

        var evolutions = cont
        if(cont==2){
            var evolvesTo = evolutionData.chain.evolves_to[0];
            cont-=1
            console.log("CONTADORreducido", cont)

        }
        else if(cont==1){
            var evolvesTo = evolutionData.chain.evolves_to[0].evolves_to[0];
            console.log("CONTADORreducido2", cont)

        }

       
        

        /*console.log("CONTADOR3", cont)
        var evolvesTo = evolutionData.chain.evolves_to[0]
        console.log("hola" , evolutionData.chain.evolves_to[0])
        console.log("hosdsssla" , evolutionData.chain.evolves_to[0].evolves_to[0].species.url)
        console.log("hosdssslaaaa2222a" , evolutionData.chain.evolves_to[0].evolves_to[0])
        console.log("hosdssslaaaa8888882a" , evolutionData.chain.evolves_to[0])
*/


        pokedexContainer.innerHTML = 
        `
            <h2>${data.name.toUpperCase()}</h2>
            <img src="${data.sprites.front_default}" alt="${data.name}">
            <p>Número: ${data.id}</p>
            <p>Altura: ${data.height / 10}m</p>
            <p>Peso: ${data.weight / 10}kg</p>
            <p>Descripción: ${speciesData.flavor_text_entries[0].flavor_text}</p>
            <p>Habilidades: ${data.abilities.map(ability => ability.ability.name).join(', ')}</p>
            <p>Movimientos: ${data.moves.slice(0, 5).map(move => move.move.name).join(', ')}</p>
            ${evolvesTo ? `<button id="evolveBtn">Evolucionar a ${evolvesTo.species.name.toUpperCase()}</button>` : ''}
        `;

        if (evolvesTo) {
            const evolveButton = document.getElementById('evolveBtn');
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
