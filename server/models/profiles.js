class Profiles {
  static async listProfiles(conn, {
    sortBy,
    descending,
  }) {
    sortBy = sortBy || 'groupname';
    const order = descending ? 'DESC' : 'ASC';

    let sql = `SELECT groupname, (SELECT count(username) FROM radusergroup as rug WHERE rug.groupname = rgr.groupname) as count FROM radius.radgroupreply as rgr GROUP BY groupname ORDER BY ${sortBy} ${order};`;

    const [data] = await conn.query(sql);
    return {
      pageData: data,
    }
  }

  static async saveProfile(conn, {
    name,
    rows
  }) {

    let sql_insert = 'INSERT INTO radgroupreply (groupname, attribute, op, value) VALUES ';
    // Fields are sent as array af values
    for (let i = 0; i < rows.length; i++) {
      sql_insert += `(${conn.escape(name)}, ${conn.escape(rows[i].attribute)}, ${conn.escape(rows[i].op)}, ${conn.escape(rows[i].value)}),`;
    }
    // remove last comma
    sql_insert = sql_insert.slice(0, -1);

    await Profiles.deleteProfile(conn, {
      name
    });
    await conn.query(sql_insert);
  }

  static async deleteProfile(conn, {
    name
  }) {
    let sql_delete = 'DELETE FROM radgroupreply WHERE groupname=?';
    await conn.query(sql_delete, [name]);
  }

  static async getProfile(conn, {
    name
  }) {
    const sql = 'SELECT * FROM radgroupreply WHERE groupname=?';

    const [profile] = await conn.query(sql, [name]);
    return {
      pageData: profile
    }
  }

  static async wizardProfile(conn, {
    profileName,
    qosProfile,
    serviceId
  }) {
    await Profiles.deleteProfile(conn, {
      profileName
    });

    /* Subscriber profile differs depending on the Service ID */
    /* TODO: store this data in database so it can be obtained dynamically */
    const subsProfile = Number(serviceId) === 5000 ? 'Siro-WL:01' : 'Openeir-WL:01';

    const sql_profile = 'INSERT INTO radgroupreply(groupname,attribute,op,value)' +
      `VALUES ('${profileName}', 'Alc-Serv-Id', ':=', ${serviceId}), ('${profileName}', 'Alc-Subsc-Prof-Str', ':=', '${subsProfile}'), ('${profileName}', 'Alc-SLA-Prof-Str', ':=', '${qosProfile} '),('${ profileName } ', 'Client - DNS - Pri', ':=', '8.8.8.8'),('${ profileName } ', 'Client - DNS - Sec', ':=', '8.8.4.4'),('${ profileName } ', 'Alc - IPv6 - Primary - Dns', ':=', '2001: bbb:: 2000'),('${ profileName } ', 'Alc - IPv6 - Secondary - Dns', ':=', '2001: bbb:: 2001')`;

    await conn.query(sql_profile);
  }
}

module.exports = Profiles;
