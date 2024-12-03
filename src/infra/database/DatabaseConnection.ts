import pgp from 'pg-promise';

export default interface DatabaseConnection {
  query(statement: string, parameters: any): Promise<any>;
  close(): Promise<void>;
}

export class PgPromiseAdapter implements DatabaseConnection {
  connection: any;

  constructor() {
    this.connection = pgp()(
      'postgres://matheusbzevedo@localhost:5432/matheusbzevedo',
    );
  }

  query(statement: string, parameters: any): Promise<any> {
    return this.connection.query(statement, parameters);
  }

  close(): Promise<void> {
    return this.connection.$pool.end();
  }
}
