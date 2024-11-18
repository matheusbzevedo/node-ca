import pgp from 'pg-promise';

export default interface DatabaseConnection {
  query(statement: string, params: any): Promise<any>;
  close(): Promise<void>;
}

export class PgPromiseAdapter implements DatabaseConnection {
  connection: any;

  constructor() {
    this.connection = pgp()(
      'postgres://matheusbzevedo@localhost:5432/matheusbzevedo',
    );
  }

  query(statement: string, params: any): Promise<any> {
    return this.connection.query(statement, params);
  }

  close(): Promise<void> {
    return this.connection.$pool.end();
  }
}
