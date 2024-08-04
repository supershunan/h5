export default async function require(path: string, options?: RequestInit) {
    try {
        const response = await fetch('https://ksys.qfyingshi.cn' + path, {
            headers: {
                "Content-Type": 'application/json',
                "Authorization": "eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjpudWxsLCJuYW1lIjpudWxsLCJpc3MiOiJ1c2VyIiwiaWQiOjYzLCJ0eXBlIjoiZXhwZXJ0LHB1YmxpY2l6ZSIsImV4cCI6MTcyMzYyMDc4MCwiaWF0IjoxNzIyMzI0NzgwLCJhY2NvdW50IjoiMTg4OTk5OTY2NjIiLCJqdGkiOiJmNTk3YzI1MC0wNDgyLTQ1YjUtYjgxYy0zZmM1ZjYwMmQ0YTMifQ.cuYJsrhgT8CWjwnbgFsEIAmxGXSONIKn3U5ftpZncDQ",
            },
            ...options,
        });
        const result_1 = await response.text();
        return JSON.parse(result_1);
    } catch (error) {
        console.error(path, error);
    }
}