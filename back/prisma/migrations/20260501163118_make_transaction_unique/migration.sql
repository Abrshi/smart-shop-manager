/*
  Warnings:

  - A unique constraint covering the columns `[transaction_id]` on the table `Payments` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Payments_transaction_id_key" ON "Payments"("transaction_id");
