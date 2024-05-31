import axios from "axios";

const endpoint = "http://localhost:3000/api/trpc";

describe('publisherRoutes', () => {
    test('register publisher', async () => {
        const result = await axios.post(endpoint + '/publisher.register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: 'test' }),
        });
        console.log(result)
        expect(result).toBeDefined();
    });
});