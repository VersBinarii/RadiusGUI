const ipam_request = require('../lib/ipam_request');

const auth = {
  username: process.env.IPAM_API_USER,
  password: process.env.IPAM_API_PASS,
};

class Subnets {
  static async getToken() {
    let token = {};
    try {
      const { data } = await ipam_request.post(
        '/user/',
        {},
        {
          auth: auth,
        }
      );
      token = data.data;
    } catch (e) {
      console.log(e.response.data);
    }

    return token;
  }

  static async getSections(conn, { token }) {
    let sections = null;
    try {
      const { data } = await ipam_request.get('/sections/', {
        headers: {
          token,
        },
      });
      sections = data.data;
    } catch (e) {
      console.log('Failed to feth sections. ', e.response.data);
    }

    return sections;
  }

  static async getSubnets(conn, { sectionId, token }) {
    let subnets = null;
    const secId = parseInt(sectionId);
    try {
      const { data } = await ipam_request.get(`/sections/${secId}/subnets/`, {
        headers: {
          token,
        },
      });
      /* we want only top level subnets */
      subnets = data.data.filter(
        subnet => parseInt(subnet.masterSubnetId) === 0
      );
    } catch (e) {
      console.log('Failed to fetch subnets', e.response.data);
    }

    return subnets;
  }
}

module.exports = Subnets;