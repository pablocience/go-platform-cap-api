export interface RequestWithUser extends Request {
  user: {email: string};
  query: {dashboard: string};
}

export interface ISelectQueryResult {
  command: 'SELECT';
  rowCount: 0;
  oid: null;
  rows: [object];
  fields: [
    {
      name: 'id';
      tableID: 16451;
      columnID: 1;
      dataTypeID: 23;
      dataTypeSize: 4;
      dataTypeModifier: -1;
      format: 'text';
    },
    {
      name: 'customer_id';
      tableID: 16451;
      columnID: 2;
      dataTypeID: 1043;
      dataTypeSize: -1;
      dataTypeModifier: 104;
      format: 'text';
    },
    {
      name: 'file_name';
      tableID: 16451;
      columnID: 3;
      dataTypeID: 1043;
      dataTypeSize: -1;
      dataTypeModifier: 104;
      format: 'text';
    },
    {
      name: 'file_extension';
      tableID: 16451;
      columnID: 4;
      dataTypeID: 1043;
      dataTypeSize: -1;
      dataTypeModifier: 104;
      format: 'text';
    },
    {
      name: 'created_at';
      tableID: 16451;
      columnID: 5;
      dataTypeID: 1184;
      dataTypeSize: 8;
      dataTypeModifier: -1;
      format: 'text';
    },
    {
      name: 'updated_at';
      tableID: 16451;
      columnID: 6;
      dataTypeID: 1184;
      dataTypeSize: 8;
      dataTypeModifier: -1;
      format: 'text';
    },
    {
      name: 'file_key';
      tableID: 16451;
      columnID: 7;
      dataTypeID: 1043;
      dataTypeSize: -1;
      dataTypeModifier: 259;
      format: 'text';
    },
    {
      name: 'status';
      tableID: 16451;
      columnID: 8;
      dataTypeID: 1043;
      dataTypeSize: -1;
      dataTypeModifier: 104;
      format: 'text';
    }
  ];
  _parsers: [null, null, null, null, null, null, null, null];
  _types: {
    _types: {
      arrayParser: object;
      builtins: {
        BOOL: 16;
        BYTEA: 17;
        CHAR: 18;
        INT8: 20;
        INT2: 21;
        INT4: 23;
        REGPROC: 24;
        TEXT: 25;
        OID: 26;
        TID: 27;
        XID: 28;
        CID: 29;
        JSON: 114;
        XML: 142;
        PG_NODE_TREE: 194;
        SMGR: 210;
        PATH: 602;
        POLYGON: 604;
        CIDR: 650;
        FLOAT4: 700;
        FLOAT8: 701;
        ABSTIME: 702;
        RELTIME: 703;
        TINTERVAL: 704;
        CIRCLE: 718;
        MACADDR8: 774;
        MONEY: 790;
        MACADDR: 829;
        INET: 869;
        ACLITEM: 1033;
        BPCHAR: 1042;
        VARCHAR: 1043;
        DATE: 1082;
        TIME: 1083;
        TIMESTAMP: 1114;
        TIMESTAMPTZ: 1184;
        INTERVAL: 1186;
        TIMETZ: 1266;
        BIT: 1560;
        VARBIT: 1562;
        NUMERIC: 1700;
        REFCURSOR: 1790;
        REGPROCEDURE: 2202;
        REGOPER: 2203;
        REGOPERATOR: 2204;
        REGCLASS: 2205;
        REGTYPE: 2206;
        UUID: 2950;
        TXID_SNAPSHOT: 2970;
        PG_LSN: 3220;
        PG_NDISTINCT: 3361;
        PG_DEPENDENCIES: 3402;
        TSVECTOR: 3614;
        TSQUERY: 3615;
        GTSVECTOR: 3642;
        REGCONFIG: 3734;
        REGDICTIONARY: 3769;
        JSONB: 3802;
        REGNAMESPACE: 4089;
        REGROLE: 4096;
      };
    };
    text: object;
    binary: object;
  };
  RowCtor: null;
  rowAsArray: false;
}
export interface ILookerFeatUserInterface {
  id: string;
  role: string;
  first_name: string;
  last_name: string;
  email: string;
}
