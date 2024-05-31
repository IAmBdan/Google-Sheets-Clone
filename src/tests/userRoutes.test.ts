import axios from "axios";

const endpoint = "http://localhost:3000/api/trpc";

describe('userRoutes', () => {
    test('gets all users', async () => {
        const users = await axios.get(endpoint + '/user.getAll');
        console.log(users)
        expect(users).toBeDefined();
    });
});