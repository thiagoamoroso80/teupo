// netlify/functions/counter.js
// Versão simplificada sem depender de Blobs

// Simular um banco de dados em memória
const counterStore = {};

exports.handler = async (event, context) => {
    // Configurar headers CORS
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Content-Type': 'application/json'
    };

    // Responder a preflight requests
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    try {
        // Obter a página da query string
        const page = event.queryStringParameters?.page || 'home';
        const action = event.queryStringParameters?.action || 'increment';

        // Chave única para a página
        const key = `page_${page}`;

        // Inicializar se não existir
        if (!counterStore[key]) {
            counterStore[key] = 1000; // Começa em 1000 (número base)
        }

        let count = counterStore[key];

        // Se for para incrementar (nova visita)
        if (action === 'increment') {
            count = counterStore[key] + 1;
            counterStore[key] = count;
        }

        // Log para debugging
        console.log(`Página: ${page}, Ação: ${action}, Contador: ${count}`);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                page: page,
                count: count,
                timestamp: new Date().toISOString()
            })
        };

    } catch (error) {
        console.error('Erro no contador:', error);
        
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                success: false,
                error: error.message
            })
        };
    }
};