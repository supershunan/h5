export default async function require(path: string, options?: RequestInit) {
    try {
        const response = await fetch('https://ksys.qfyingshi.cn' + path, {
            headers: {
                "Content-Type": 'application/json',
                "Authorization": "eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjpudWxsLCJuYW1lIjpudWxsLCJpc3MiOiJ1c2VyIiwiaWQiOjYwLCJ0eXBlIjoiZXhwZXJ0LHB1YmxpY2l6ZSIsImV4cCI6MTcyMzQzMzY4OCwiaWF0IjoxNzIyMTM3Njg4LCJhY2NvdW50IjoiMTg4OTk5OTY2NjYiLCJqdGkiOiI4NjgyNWNlOC0wMTQ4LTQ4ZmEtODA2MS0wYjBjZmRlMzBiYzUifQ.G_K-8HgG8qbwGXmNvdejc8DBNVYCw_J4dIsQ69-zQ1c",
            },
            ...options,
        });
        const result_1 = await response.text();
        return JSON.parse(result_1);
    } catch (error) {
        console.error(path, error);
    }
}