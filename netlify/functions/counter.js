// netlify/functions/counter.js
// Versão que redireciona para CountAPI (opcional)

exports.handler = async (event, context) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Content-Type': 'application/json'
    };

    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 204,
            headers,
            body: ''
        };
    }

    try {
        // Redirecionar para CountAPI
        const response = await fetch('https://api.countapi.xyz/hit/teupo-tenda/visitas');
        const data = await response.json();

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                count: data.value,
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