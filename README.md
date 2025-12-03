# Colour Insights

A personality assessment web application that helps users discover their personality colour profile through a comprehensive 40-question assessment.

## Features

- **User Registration**: Simple sign-up with username and email
- **40-Question Assessment**: Questions displayed one at a time in randomized order with progress tracking
- **Results Dashboard**: Interactive pie chart showing personality colour breakdown (Red, Yellow, Blue, Green)
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL with Prisma ORM
- **Charts**: Chart.js with react-chartjs-2
- **Hosting**: Railway.app

## Colour Categories

- **Red**: Results-driven, decisive, competitive
- **Yellow**: Social, creative, enthusiastic
- **Blue**: Analytical, detail-oriented, systematic
- **Green**: Supportive, harmonious, patient

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database

### Local Development

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd colour-wheel
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up your environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your PostgreSQL connection string
   ```

4. Run database migrations:
   ```bash
   npx prisma migrate dev
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000)

## Railway Deployment

1. Create a new project on Railway
2. Add a PostgreSQL database service
3. Connect your GitHub repository
4. Railway will automatically:
   - Detect the Next.js application
   - Use the `DATABASE_URL` from the PostgreSQL service
   - Run the build command which includes Prisma migrations

### Environment Variables

Railway automatically provides:
- `DATABASE_URL` - Connection string for PostgreSQL

## Database Schema

```
users
├── id (PK)
├── username
├── email (unique)
└── created_at

results
├── id (PK)
├── user_id (FK)
├── red_score
├── yellow_score
├── blue_score
├── green_score
├── red_percent
├── yellow_percent
├── blue_percent
├── green_percent
└── completed_at

answers
├── id (PK)
├── result_id (FK)
├── question_id
├── colour
└── answer_value
```

## Scoring System

- **Strongly Disagree**: 1 point
- **Disagree**: 2 points
- **Neutral**: 3 points
- **Agree**: 4 points
- **Strongly Agree**: 5 points

Each colour has 10 questions, with a maximum of 50 points per colour and 200 points total.

## License

MIT
