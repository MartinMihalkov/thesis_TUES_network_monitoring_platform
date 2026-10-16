import netconf from 'node-netconf';

export class NetconfClient {
    constructor(deviceIp, username, password) {
        this.params = {
            host: deviceIp,
            username: username,
            password: password,
            port: 830
        };
    }

    /**
     * Помощен метод за обвиване на netconf връзката в Promise
     */
    async _connectAndExecute(action) {
        return new Promise((resolve, reject) => {
            const client = new netconf.Client(this.params);
            
            client.open((err) => {
                if (err) return reject(new Error(`NETCONF Connection Error: ${err.message}`));
                
                action(client, (actionErr, result) => {
                    client.close(() => {
                        if (actionErr) reject(actionErr);
                        else resolve(result);
                    });
                });
            });
        });
    }

    /**
     * Извличане на интерфейсна информация чрез директен RPC метод
     */
    async getInterfaces() {
        return this._connectAndExecute((client, callback) => {
            // Създаваме пълния RPC XML обект за заявката
            const rpcRequest = {
                'get-config': {
                    source: {
                        running: {}
                    },
                    filter: {
                        '\$': { type: 'subtree' },
                        'interfaces': {
                            '\$': { xmlns: 'urn:ietf:params:xml:ns:yang:ietf-interfaces' }
                        }
                    }
                }
            };

            // Използваме директния .rpc() метод, който винаги съществува в node-netconf
            client.rpc(rpcRequest, (err, reply) => {
                if (err) return callback(err);
                
                // Проверяваме дали имаме върнати данни в отговора
                if (reply && reply.data) {
                    callback(null, reply.data);
                } else {
                    callback(null, reply);
                }
            });
        });
    }

    /**
     * Обновяване на конфигурацията (edit-config) през суров RPC
     */
    async updateConfig(xmlYangData) {
        return this._connectAndExecute((client, callback) => {
            // xmlYangData трябва да бъде готов XML стринг или обект, съответстващ на структурата
            const rpcRequest = {
                'edit-config': {
                    target: {
                        running: {}
                    },
                    config: xmlYangData
                }
            };

            client.rpc(rpcRequest, (err, reply) => {
                if (err) return callback(err);
                
                // Връщаме 204 HTTP статус (Успешно обновяване без съдържание)
                callback(null, 204);
            });
        });
    }

// async getLLDPNeighbors() {
//         return this._connectAndExecute((client, callback) => {
//             // Структуриране на RPC заявката за поддървото на ietf-lldp
//             const rpcRequest = {
//                 'get': {
//                     filter: {
//                         '\$': { type: 'subtree' },
//                         'lldp': {
//                             '\$': { xmlns: 'urn:ietf:params:xml:ns:yang:ietf-lldp' }
//                         }
//                     }
//                 }
//             };

//             // Изпълнение на суровата RPC заявка
//             client.rpc(rpcRequest, (err, reply) => {
//                 if (err) return callback(err);
                
//                 // Връщане на парснатите данни
//                 if (reply && reply.data) {
//                     callback(null, reply.data);
//                 } else {
//                     callback(null, reply);
//                 }
//             });
//         });
//     }


// }


    async getLLDPNeighbors() {
        return this._connectAndExecute((client, callback) => {
            const rpcRequest = {
                'get': {
                    filter: {
                        '\$': { type: 'subtree' },
                        // Промяна към Cisco спецификацията за LLDP оперативни данни
                        'lldp-entries': {
                            '\$': { xmlns: 'http://cisco.com' }
                        }
                    }
                }
            };

            client.rpc(rpcRequest, (err, reply) => {
                if (err) return callback(err);
                
                if (reply && reply.data) {
                    callback(null, reply.data);
                } else {
                    callback(null, reply);
                }
            });
        });
    }
