/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
// @author giastina
import axios from 'axios';

// Constants for server URL and authentication
const SERVER_URL = 'https://husksheets.fly.dev/api/v1';
const USERNAME = 'team19';
const PASSWORD = 'HDqSU5L28!;X$OzA';

// Test to check if data can be retrieved from the server
it('should retrieve data from the server', async () => {
  try {
    const response = await axios.get(`${SERVER_URL}/register`, {
      auth: {
        username: USERNAME,
        password: PASSWORD
      }
    });

    expect(response.status).toBe(200);
    expect(response.data).toBeDefined();
    
  } catch (error) {
    console.error('Error retrieving data:', error);
    throw error;
  }
});

describe('Husksheet Server API', () => {
  // Test to register a new publisher
  it('should register a new publisher', async () => {
    try {
      const response = await axios.get(`${SERVER_URL}/register`, {
        auth: {
          username: USERNAME,
          password: PASSWORD
        }
      });

      expect(response.status).toBe(200);
      expect(response.data).toBeDefined();
      expect(response.data.success).toBe(true);
    } catch (error) {
      console.error('Error registering publisher:', error);
      throw error;
    }
  });

    // Test to get all publishers
  it('should get all publishers', async () => {
    try {
      const response = await axios.get(`${SERVER_URL}/getPublishers`, {
        auth: {
          username: USERNAME,
          password: PASSWORD
        }
      });

      expect(response.status).toBe(200);
      expect(response.data).toBeDefined();
      expect(response.data.success).toBe(true);
      expect(response.data.value).toBeInstanceOf(Array);
    } catch (error) {
      console.error('Error getting publishers:', error);
      throw error;
    }
  });

    // Test to create a new sheet
  it('should create a new sheet', async () => {
    try {
      // Ensure the sheet does not already exist by deleting it first
      await axios.post(`${SERVER_URL}/deleteSheet`, { publisher: 'team19', sheet: 'TestSheet' }, {
        auth: {
          username: USERNAME,
          password: PASSWORD
        }
      }).catch(() => {});

      const argument = { publisher: 'team19', sheet: 'TestSheet' };
      const response = await axios.post(`${SERVER_URL}/createSheet`, argument, {
        auth: {
          username: USERNAME,
          password: PASSWORD
        }
      });

      expect(response.status).toBe(200);
      expect(response.data).toBeDefined();
      expect(response.data.success).toBe(true);
    } catch (error) {
      console.error('Error creating sheet:', error);
      throw error;
    }
  });

 // Test to get all sheets for a publisher
  it('should get all sheets for a publisher', async () => {
    try {
      const argument = { publisher: 'team19' };
      const response = await axios.post(`${SERVER_URL}/getSheets`, argument, {
        auth: {
          username: USERNAME,
          password: PASSWORD
        }
      });

      expect(response.status).toBe(200);
      expect(response.data).toBeDefined();
      expect(response.data.success).toBe(true);
      expect(response.data.value).toBeInstanceOf(Array);
    } catch (error) {
      console.error('Error getting sxheets:', error);
      throw error;
    }
  });
// Test to delete a sheet
  it('should delete a sheet', async () => {
    try {
      const argument = { publisher: 'team19', sheet: 'TestSheet' };
      const response = await axios.post(`${SERVER_URL}/deleteSheet`, argument, {
        auth: {
          username: USERNAME,
          password: PASSWORD
        }
      });
 
      expect(response.status).toBe(200);
      expect(response.data).toBeDefined();
      expect(response.data.success).toBe(true);
    } catch (error) {
      console.error('Error deleting sheet:', error);
      throw error;
    }
  }); 
 // Test to get updates for a subscription
  it('should get updates for a subscription', async () => {
    try {
  
      await axios.post(`${SERVER_URL}/createSheet`, { publisher: 'team19', sheet: 'TestSheet' }, {
        auth: {
          username: USERNAME,
          password: PASSWORD
        }
      });
  
      // Test: Get updates for the subscription
      const argument = { publisher: 'team19', sheet: 'TestSheet', id: '0' };
      const response = await axios.post(`${SERVER_URL}/getUpdatesForSubscription`, argument, {
        auth: {
          username: USERNAME,
          password: PASSWORD
        }
      });
  
      console.log('Response status:', response.status);
      console.log('Response data:', response.data);
  
      expect(response.status).toBe(200);
      expect(response.data).toBeDefined();
      expect(response.data.success).toBe(true);
      expect(response.data.value).toBeDefined();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error getting updates for subscription:', error.response?.data);
      } else {
        console.error('Error getting updates for subscription:', error);
      }
      throw error;
    }
  });
  
  // Test to get updates for published sheets
  it('should get updates for published sheets', async () => {
    try {
  
      await axios.post(`${SERVER_URL}/createSheet`, { publisher: 'team19', sheet: 'TestSheet' }, {
        auth: {
          username: USERNAME,
          password: PASSWORD
        }
      });
  
      // Test: Get updates for the published sheets
      const argument = { publisher: 'team19', sheet: 'TestSheet', id: '0' };
      const response = await axios.post(`${SERVER_URL}/getUpdatesForPublished`, argument, {
        auth: {
          username: USERNAME,
          password: PASSWORD
        }
      });
  
      console.log('Response status:', response.status);
      console.log('Response data:', response.data);
  
      expect(response.status).toBe(200);
      expect(response.data).toBeDefined();
      expect(response.data.success).toBe(true);
      expect(response.data.value).toBeDefined();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error getting updates for published sheets:', error.response?.data);
      } else {
        console.error('Error getting updates for published sheets:', error);
      }
      throw error;
    }
  });
 // Test to update a published sheet
  it('should update a published sheet', async () => {
    try {
      const argument = { publisher: 'team19', sheet: 'TestSheet', payload: 'New update' };
      const response = await axios.post(`${SERVER_URL}/updatePublished`, argument, {
        auth: {
          username: USERNAME,
          password: PASSWORD
        }
      });

      expect(response.status).toBe(200);
      expect(response.data).toBeDefined();
      expect(response.data.success).toBe(true);
    } catch (error) {
      console.error('Error updating published sheet:', error);
      throw error;
    }
  });

  // Test to update a subscription
  it('should update a subscription', async () => {
    try {
      const argument = { publisher: 'team19', sheet: 'TestSheet', payload: 'New request' };
      const response = await axios.post(`${SERVER_URL}/updateSubscription`, argument, {
        auth: {
          username: USERNAME,
          password: PASSWORD
        }
      });
  
      expect(response.status).toBe(200);
      expect(response.data).toBeDefined();
      console.log('Response:', response.data); // Log the response for debugging
      expect(response.data.success).toBe(true);
    } catch (error) {
      console.error('Error updating subscription:', error);
      throw error;
    }
  });
  
  // Test to ensure unauthorized requests return 401 status
  it('should return 401 for unauthorized requests', async () => {
    try {
      await axios.get(`${SERVER_URL}/getPublishers`);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        expect(error.response.status).toBe(401);
      } else {
        throw error;
      }
    }
  });
});