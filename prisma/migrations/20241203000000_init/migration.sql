-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "results" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "red_score" INTEGER NOT NULL,
    "yellow_score" INTEGER NOT NULL,
    "blue_score" INTEGER NOT NULL,
    "green_score" INTEGER NOT NULL,
    "red_percent" DOUBLE PRECISION NOT NULL,
    "yellow_percent" DOUBLE PRECISION NOT NULL,
    "blue_percent" DOUBLE PRECISION NOT NULL,
    "green_percent" DOUBLE PRECISION NOT NULL,
    "completed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "answers" (
    "id" SERIAL NOT NULL,
    "result_id" INTEGER NOT NULL,
    "question_id" INTEGER NOT NULL,
    "colour" TEXT NOT NULL,
    "answer_value" INTEGER NOT NULL,

    CONSTRAINT "answers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "results" ADD CONSTRAINT "results_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "answers" ADD CONSTRAINT "answers_result_id_fkey" FOREIGN KEY ("result_id") REFERENCES "results"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
