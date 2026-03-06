// netlify/functions/counter/counter.js
export default async (req) => {
    try {
        // Configurar CORS
        const headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Content-Type': 'application/json'
        };

        // Para requisições OPTIONS (preflight)
        if (req.method === 'OPTIONS') {
            return new Response(null, { headers, status: 204 });
        }

        // Obter a página sendo visitada
        const url = new URL(req.url);
        const page = url.searchParams.get('page') || 'home';

        // Usar Netlify Blobs para armazenar o contador
        const store = process.env.NETLIFY_BLOBS_TOKEN 
            ? await NetlifyBlobs.getStore('counter-store')
            : null;

        let count = 0;
        
        if (store) {
            // Ler contador atual
            const data = await store.get(page, { type: 'json' });
            count = (data?.count || 0) + 1;
            
            // Salvar novo valor
            await store.set(page, { count });
        } else {
            // Fallback para desenvolvimento local
            count = Math.floor(Math.random() * 1000) + 100;
        }

        return new Response(JSON.stringify({
            success: true,
            page,
            count
        }), { headers });

    } catch (error) {
        return new Response(JSON.stringify({
            success: false,
            error: error.message
        }), { 
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};