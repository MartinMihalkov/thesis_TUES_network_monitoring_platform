import axios from 'axios';
import https from 'https';

const agent = new https.Agent({ rejectUnauthorized: false });

export class RestconfClient {
    constructor(deviceIp, username, password) {
        this.baseURL = `https://${deviceIp}/restconf`;
        this.auth = { username, password };
    }

    async getInterfaces() {
        const response = await axios.get(`${this.baseURL}/data/ietf-interfaces:interfaces`, {
            auth: this.auth,
            httpsAgent: agent,
            headers: { 'Accept': 'application/yang-data+json' }
        });
        return response.data;
    }

    async updateConfig(yangData) {
        const response = await axios.patch(`${this.baseURL}/data/ietf-interfaces:interfaces`, yangData, {
            auth: this.auth,
            httpsAgent: agent,
            headers: { 
                'Accept': 'application/yang-data+json',
                'Content-Type': 'application/yang-data+json'
            }
        });
        return response.status;
    }
}