import { Options } from '@mikro-orm/core';

type ConfigCallback = { database: Options };
export default (): ConfigCallback => ({
  database: {
    type: 'postgresql',
    host: process.env.DATABASE_HOST as string,
    port: parseInt(process.env.DATABASE_PORT as string, 10) || 5432,
    user: process.env.DATABASE_USER as string,
    password: process.env.DATABASE_PASSWORD as string,
    dbName: process.env.DATABASE_DATABASE as string,
    entities: ['dist/**/*.entity.js'],
    entitiesTs: ['src/**/*.entity.ts'],
    // driverOptions: {
    //   connection: {
    //     ssl: true,
    //   },
    // },
    seeder: {
      path: 'dist/seeders',
      pathTs: 'src/seeders',
    },
  },
});
