import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:9999',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''), // <-- KEEP THIS LINE!

        // **ADD THESE LINES FOR SSE AND LONG-LIVED CONNECTIONS**
        ws: true, // Crucial for long-lived connections, including SSE sometimes
        configure: (proxy, options) => {
          // This function runs for every proxied request.
          // We need to specifically target the SSE stream endpoint.
          proxy.on('proxyRes', (proxyRes, req, res) => {
            // Check if the request URL is for the SSE stream
            // Note: req.url here will already have the '/api' stripped if rewrite happens before this.
            // So, it should be '/asset/price-stream'
            if (req.url === '/asset/price-stream') { 
              proxyRes.headers['Cache-Control'] = 'no-cache';
              proxyRes.headers['Connection'] = 'keep-alive';
              proxyRes.headers['Content-Type'] = 'text/event-stream';
              // You might not need to explicitly disable buffering here,
              // but if issues persist, you could explore options like:
              // proxy.options.buffer = false; // This might be for the proxy instance itself, not per request.
            }
          });
        }
      }
    }
  }
});