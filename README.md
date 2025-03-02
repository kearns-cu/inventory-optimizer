# Inventory Optimizer

A Next.js application that helps logistics managers optimize inventory thresholds based on historical data.

## Loom Demonstration
https://www.loom.com/share/2b4ba094a7b64a97854d24f2615f5245?sid=ecf043a9-0a7d-481a-9822-1bc76f82d2bc

## Features

- CSV file upload for historical inventory data
- Dynamic threshold calculations based on:
  - Lead time
  - Safety stock percentage
  - Average daily sales
- Interactive visualization of inventory levels and thresholds
- Responsive design for desktop and mobile use

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. Prepare your CSV file with the following columns:
   - product_id
   - product_name
   - date
   - inventory_level
   - orders
   - lead_time_days

2. Upload your CSV file using the drag-and-drop interface

3. Adjust parameters:
   - Lead Time: Number of days required to restock inventory
   - Safety Stock: Percentage buffer above minimum threshold

4. View the calculated thresholds and visualization

## Threshold Calculation Algorithm

The application calculates three threshold levels:

1. Low Threshold = Average Daily Sales × Lead Time
2. Medium Threshold = Low Threshold × (1 + Safety Stock %)
3. High Threshold = Medium Threshold × 1.5

## Tech Stack

- Next.js
- React
- TypeScript
- Recharts
- React-Dropzone
- Papa Parse

## Sample Data

A sample CSV file is provided in the `public` directory for testing purposes.
