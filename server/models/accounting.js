class Accounting {

  static async showAccounting(conn, {
    page,
    size,
    sortBy,
    descending,
    searchString
  }) {
    sortBy = sortBy || 'username';
    const order = descending ? 'DESC' : 'ASC';
    let optionalSearch = '';
    if (searchString) {
      optionalSearch = ` AND (acctsessionid LIKE '%${searchString}%' OR username LIKE '%${searchString}%' OR nasipaddress LIKE '%${searchString}%' OR nasporttype LIKE '%${searchString}%' OR acctstarttime LIKE '%${searchString}%' OR acctstoptime LIKE '%${searchString}%' OR framedipaddress LIKE '%${searchString}%' OR framedipv6address LIKE '%${searchString}%' OR clientmac LIKE '%${searchString}%' OR clientvendor LIKE '%${searchString}%' OR slaprofile LIKE '%${searchString}%' OR subscprofile LIKE '%${searchString}%' OR  callingstationid LIKE '%${searchString}%') `;
    }
    // We want username != '' so we can filter out the empty accounting entries
    let sql_accounts = `SELECT * FROM radacct WHERE username != '' ${optionalSearch}  ORDER BY ${sortBy} ${order} LIMIT ? OFFSET ?;`;
    let sql_count = `SELECT COUNT(radacctid) as count FROM radacct WHERE username != '' ${optionalSearch};`;

    const [accounting] = await conn.query(sql_accounts, [size, (page - 1) * size]);
    const [count] = await conn.query(sql_count);
    return {
      pageData: accounting,
      total_count: count[0].count,
    }
  }
}

module.exports = Accounting;
