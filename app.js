const clientId = 'a1aa31999d39463fbafdd9143ce7d0b7';
const redirect_uri = 'https://alexlato18.github.io/alexlato/';
const playlistId = '2rBfiegwfKG1J8q9rTw0h5?si=35a3a224d4bb4fd3';
const authEndpoint = 'https://accounts.spotify.com/api/token';

document.getElementById('play-random').addEventListener('click', async () => {
    try {
        // Obtén el token de acceso
        const token = await getAccessToken();

        // Obtén las canciones de la lista de reproducción
        const tracks = await getPlaylistTracks(token);

        // Selecciona una canción aleatoria
        const randomTrack = tracks[Math.floor(Math.random() * tracks.length)];
        const trackId = randomTrack.track.id;

        // Obtén los detalles de la canción
        const trackDetails = await getTrackDetails(token, trackId);

        // Actualiza la interfaz con los detalles de la canción
        document.getElementById('text').innerText = `Categoría: ${randomTrack.track.name}`;
        document.getElementById('song-list').innerHTML = `
            <li><strong>Nombre:</strong> ${trackDetails.name}</li>
            <li><strong>Álbum:</strong> ${trackDetails.album.name}</li>
            <li><strong>Año:</strong> ${new Date(trackDetails.album.release_date).getFullYear()}</li>
            <li><strong>Autores:</strong> ${trackDetails.artists.map(artist => artist.name).join(', ')}</li>
        `;
    } catch (error) {
        console.error('Error:', error);
    }
});

// Función para obtener el token de acceso
async function getAccessToken() {
    const response = await fetch(authEndpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(clientId)
        },
        body: new URLSearchParams({
            'grant_type': 'client_credentials'
        })
    });
    const data = await response.json();
    return data.access_token;
}

// Función para obtener las canciones de la lista de reproducción
async function getPlaylistTracks(token) {
    const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    const data = await response.json();
    return data.items;
}

// Función para obtener los detalles de una canción
async function getTrackDetails(token, trackId) {
    const response = await fetch(`https://api.spotify.com/v1/tracks/${trackId}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    const data = await response.json();
    return data;
}
