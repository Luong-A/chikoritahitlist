import { integer, sqliteTable } from "drizzle-orm/sqlite-core";
import { createId } from "@paralleldrive/cuid2";
import { text, primaryKey } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";

export const example = sqliteTable("example", {
  id: integer("id").primaryKey({ autoIncrement: true }),
});

export const bounty = sqliteTable("bounty",{
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()), 
  image: text("image").notNull(),
  date: integer("created", {mode: "timestamp"}).notNull(),
  msg: text("message"),


})

//Relation bountyRelations 
export const bountyRelations = relations(bounty, ({many}) => ({
  bountiesToPersons: many(bountiesToPersons),
}))

export const person = sqliteTable("person",{
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()), 
  name: text("name").notNull(),
})

//Relation Person relations
export const personRelations = relations(person,({many}) => ({
  bountiesToPersons: many(bountiesToPersons),
}))
export const bountiesToPersons = sqliteTable("bounties_to_persons", {
  bountyId: integer("bountyId")
    .notNull()
    .references(() => bounty.id),
  personId: integer("person_id")
    .notNull()
    .references(() => person.id),
},
(t) => [
  primaryKey({columns: [t.bountyId,t.personId]})
],

);
export const bountiesToPersonsRelations = relations(bountiesToPersons, ({one}) => ({
  bounty: one(bounty, {
    fields: [bountiesToPersons.bountyId],
    references: [bounty.id],
  }),
  person: one(person,{
    fields: [bountiesToPersons.personId],
    references: [person.id],
  }),
}) );


export const user = sqliteTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: integer("email_verified", { mode: "boolean" }).notNull(),
  image: text("image"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const session = sqliteTable("session", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  token: text("token").notNull().unique(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = sqliteTable("account", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: integer("access_token_expires_at", {
    mode: "timestamp",
  }),
  refreshTokenExpiresAt: integer("refresh_token_expires_at", {
    mode: "timestamp",
  }),
  scope: text("scope"),
  password: text("password"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const verification = sqliteTable("verification", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }),
  updatedAt: integer("updated_at", { mode: "timestamp" }),
});
