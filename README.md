# Wyze Bundle Builder

A multi-step React application for assembling customized security systems, featuring a real-time reactive review panel and client-side persistence.

## Features
- **Data-Driven Architecture:** The entire UI is rendered from a local JSON configuration, separating data from presentation.
- **Dynamic Review Panel:** Implements an "Accumulated State" logic where the review panel reacts to the user's progress through the accordion steps.
- **Complex State Management:** Handles variant-specific quantities and synchronizes them between product cards and the live summary.
- **Client-Side Persistence:** Uses `localStorage` to save and restore the user's configuration, ensuring a seamless return experience.
- **Responsive Design:** Built with Tailwind CSS to ensure a consistent experience across desktop and mobile devices.

## Tech Stack
- **Framework:** Next.js / React
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **State Management:** React Context API

## Implementation Details & Decisions
- **Persistence:** I utilized `localStorage` within a custom `BundleContext`. This ensures the state is serialized and restored efficiently on page load.
- **Review Panel Logic:** Instead of simple static rendering, I implemented a `buildReviewData` helper that filters and categorizes cart items based on the active step, ensuring the panel accumulates data as the user progresses.
- **Variant Handling:** Each product variant is treated as a unique key in the cart state (`productId-variantId`), allowing for precise quantity tracking as requested.

## Setup Instructions
1. Clone the repository:
```bash
   git clone [https://github.com/mo-eldahshoury/wyze-bundle-builder.git](https://github.com/mo-eldahshoury/wyze-bundle-builder.git)


