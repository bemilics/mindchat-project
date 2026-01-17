// Test endpoint para verificar que las serverless functions funcionan

export default async function handler(req, res) {
  return res.status(200).json({
    status: 'ok',
    message: 'Serverless functions funcionando correctamente',
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url
  });
}
