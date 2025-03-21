// import { relations } from "drizzle-orm/relations";
// import { startups, financial_rounds, investors, contracts, financial_details_requests, usersInAuth, users, cap_tables, notifications, bank_accounts, pitch_decks, tax_returns, financial_statements, legal_documents, startups_owners, payments, transactions } from "./schema";

// export const financial_roundsRelations = relations(financial_rounds, ({one}) => ({
// 	startup: one(startups, {
// 		fields: [financial_rounds.startup_id],
// 		references: [startups.id]
// 	}),
// }));

// export const startupsRelations = relations(startups, ({one, many}) => ({
// 	financial_rounds: many(financial_rounds),
// 	contracts: many(contracts),
// 	financial_details_requests: many(financial_details_requests),
// 	cap_tables: many(cap_tables),
// 	user: one(users, {
// 		fields: [startups.user_id],
// 		references: [users.id]
// 	}),
// 	pitch_decks: many(pitch_decks),
// 	tax_returns: many(tax_returns),
// 	financial_statements: many(financial_statements),
// 	legal_documents: many(legal_documents),
// 	startups_owners: many(startups_owners),
// }));

// export const contractsRelations = relations(contracts, ({one, many}) => ({
// 	investor: one(investors, {
// 		fields: [contracts.investor_id],
// 		references: [investors.id]
// 	}),
// 	startup: one(startups, {
// 		fields: [contracts.startup_id],
// 		references: [startups.id]
// 	}),
// 	payments: many(payments),
// }));

// export const investorsRelations = relations(investors, ({one, many}) => ({
// 	contracts: many(contracts),
// 	financial_details_requests: many(financial_details_requests),
// 	user: one(users, {
// 		fields: [investors.user_id],
// 		references: [users.id]
// 	}),
// }));

// export const financial_details_requestsRelations = relations(financial_details_requests, ({one}) => ({
// 	investor: one(investors, {
// 		fields: [financial_details_requests.investor_id],
// 		references: [investors.id]
// 	}),
// 	startup: one(startups, {
// 		fields: [financial_details_requests.startup_id],
// 		references: [startups.id]
// 	}),
// }));

// export const usersRelations = relations(users, ({one, many}) => ({
// 	usersInAuth: one(usersInAuth, {
// 		fields: [users.id],
// 		references: [usersInAuth.id]
// 	}),
// 	startups: many(startups),
// 	notifications: many(notifications),
// 	bank_accounts: many(bank_accounts),
// 	investors: many(investors),
// 	transactions_receiver_id: many(transactions, {
// 		relationName: "transactions_receiver_id_users_id"
// 	}),
// 	transactions_sender_id: many(transactions, {
// 		relationName: "transactions_sender_id_users_id"
// 	}),
// }));

// export const usersInAuthRelations = relations(usersInAuth, ({many}) => ({
// 	users: many(users),
// }));

// export const cap_tablesRelations = relations(cap_tables, ({one}) => ({
// 	startup: one(startups, {
// 		fields: [cap_tables.startup_id],
// 		references: [startups.id]
// 	}),
// }));

// export const notificationsRelations = relations(notifications, ({one}) => ({
// 	user: one(users, {
// 		fields: [notifications.user_id],
// 		references: [users.id]
// 	}),
// }));

// export const bank_accountsRelations = relations(bank_accounts, ({one}) => ({
// 	user: one(users, {
// 		fields: [bank_accounts.user_id],
// 		references: [users.id]
// 	}),
// }));

// export const pitch_decksRelations = relations(pitch_decks, ({one}) => ({
// 	startup: one(startups, {
// 		fields: [pitch_decks.startup_id],
// 		references: [startups.id]
// 	}),
// }));

// export const tax_returnsRelations = relations(tax_returns, ({one}) => ({
// 	startup: one(startups, {
// 		fields: [tax_returns.startup_id],
// 		references: [startups.id]
// 	}),
// }));

// export const financial_statementsRelations = relations(financial_statements, ({one}) => ({
// 	startup: one(startups, {
// 		fields: [financial_statements.startup_id],
// 		references: [startups.id]
// 	}),
// }));

// export const legal_documentsRelations = relations(legal_documents, ({one}) => ({
// 	startup: one(startups, {
// 		fields: [legal_documents.startup_id],
// 		references: [startups.id]
// 	}),
// }));

// export const startups_ownersRelations = relations(startups_owners, ({one}) => ({
// 	startup: one(startups, {
// 		fields: [startups_owners.startup_id],
// 		references: [startups.id]
// 	}),
// }));

// export const paymentsRelations = relations(payments, ({one}) => ({
// 	contract: one(contracts, {
// 		fields: [payments.contract_id],
// 		references: [contracts.id]
// 	}),
// }));

// export const transactionsRelations = relations(transactions, ({one}) => ({
// 	user_receiver_id: one(users, {
// 		fields: [transactions.receiver_id],
// 		references: [users.id],
// 		relationName: "transactions_receiver_id_users_id"
// 	}),
// 	user_sender_id: one(users, {
// 		fields: [transactions.sender_id],
// 		references: [users.id],
// 		relationName: "transactions_sender_id_users_id"
// 	}),
// }));