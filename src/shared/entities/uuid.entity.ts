import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { v4 } from 'uuid';

@Entity({ abstract: true })
export abstract class UUIDEntity {
  @PrimaryKey({ type: 'uuid' })
  id: string = v4();

  @Property({ type: 'timestamptz' })
  created: Date = new Date();

  @Property({ type: 'timestamptz', onUpdate: () => new Date() })
  updated: Date = new Date();
}
