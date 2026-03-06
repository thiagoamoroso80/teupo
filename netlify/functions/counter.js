// netlify/functions/counter.js
// Versão com funções de reset e controle

const counterStore = {};

exports.handler = async (event, context) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Content-Type': 'application/json'
    };

    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    try {
        const page = event.queryStringParameters?.page || 'home';
        const action = event.queryStringParameters?.action || 'increment';
        const adminKey = event.queryStringParameters?.admin; // Para ações administrativas

        const key = `page_${page}`;

        // Ações administrativas (protegidas por senha simples)
        if (adminKey === 'tenda2026') { // Mude para uma senha de sua preferência
            if (action === 'reset') {
                counterStore[key] = 0;
                return {
                    statusCode: 200,
                    headers,
                    body: JSON.stringify({
                        success: true,
                        message: 'Contador resetado com sucesso',
                        count: 0
                    })
                };
            }
            
            if (action === 'set') {
                const newValue = parseInt(event.queryStringParameters?.value) || 0;
                counterStore[key] = newValue;
                return {
                    statusCode: 200,
                    headers,
                    body: JSON.stringify({
                        success: true,
                        message: `Contador ajustado para ${newValue}`,
                        count: newValue
                    })
                };
            }
        }

        // Inicializar se não existir
        if (!counterStore[key]) {
            counterStore[key] = 0;
        }

        let count = counterStore[key];

        if (action === 'increment') {
            count = counterStore[key] + 1;
            counterStore[key] = count;
        }

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