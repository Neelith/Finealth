import { DBConfig } from 'ngx-indexed-db';

export const indexedDbConfig: DBConfig = {
  name: 'Finealth',
  version: 1,
  objectStoresMeta: [
    {
      store: 'CashMovements',
      storeConfig: {
        keyPath: 'cashMovementId',
        autoIncrement: true,
        options: { unique: true },
      },
      storeSchema: [
        {
          name: 'description',
          keypath: 'description',
          options: { unique: false },
        },
        { name: 'date', keypath: 'date', options: { unique: false } },
        { name: 'amount', keypath: 'amount', options: { unique: false } },
        {
          name: 'categoryId',
          keypath: 'categoryId',
          options: { unique: false },
        },
      ],
    },
    {
      store: 'Categories',
      storeConfig: {
        keyPath: 'categoryId',
        autoIncrement: true,
        options: { unique: true },
      },
      storeSchema: [
        { name: 'name', keypath: 'name', options: { unique: false } },
        { name: 'iconUrl', keypath: 'iconUrl', options: { unique: false } },
      ],
    },
  ],
};
