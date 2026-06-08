/**
 * Base URL for all API calls.
 * In development, Vite proxy handles /api → localhost:5000
 * In production, VITE_API_URL points to the deployed backend.
 */
const API_BASE = import.meta.env.VITE_API_URL || '';

/**
 * Wrapper around fetch that automatically prepends the API base URL.
 * Also safely parses JSON responses and provides better error messages.
 * Usage: apiFetch('/api/auth/login', { method: 'POST', ... })
 */
export const apiFetch = async (path, options = {}) => {
    const url = `${API_BASE}${path}`;

    try {
        const res = await fetch(url, options);

        // Attach a safe json parser to the response
        const originalJson = res.json.bind(res);
        res.json = async () => {
            const text = await res.clone().text();
            if (!text) {
                console.error(`[API] Empty response from ${url} (status: ${res.status})`);
                return { message: `Le serveur n'a pas répondu (status: ${res.status}). Vérifiez que le backend est en ligne.` };
            }
            try {
                return JSON.parse(text);
            } catch (e) {
                console.error(`[API] Invalid JSON from ${url}:`, text.substring(0, 200));
                return { message: `Réponse invalide du serveur.` };
            }
        };

        return res;
    } catch (err) {
        // Network error (CORS blocked, backend down, DNS failure, etc.)
        console.error(`[API] Network error for ${url}:`, err.message);
        // Return a fake Response-like object so calling code doesn't crash
        return {
            ok: false,
            status: 0,
            json: async () => ({ message: `Impossible de contacter le serveur. Vérifiez votre connexion ou l'URL du backend.` }),
            text: async () => '',
        };
    }
};
