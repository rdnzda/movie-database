# Movie Database

A web app to browse movies, TV series and people, built with Next.js and the [TMDB](https://www.themoviedb.org/) API.

🔗 **Live demo: [moviedatabase-eta.vercel.app](https://moviedatabase-eta.vercel.app)**

## Features

- Home page with trending, popular and top-rated movies and series, plus recent trailers
- Search with debounced input (`use-debounce`) and a filter bar to sort and filter results
- Detail pages for each movie or series (`/[type]/[id]`) and for each person (`/person/[id]`)
- Dedicated pages: popular, top rated, popular series, top series, people
- Language switch and responsive layout

## Tech stack

- **Next.js** (App Router) and **React**
- **Tailwind CSS**
- **TMDB REST API** (JSON data fetched, filtered, sorted and rendered dynamically)
- Lucide and React Icons, SimpleBar

## Getting started

1. Install the dependencies:

   ```bash
   npm install
   ```

2. Create a `.env.local` file at the project root with your TMDB read access token. Never commit this file.

   ```env
   NEXT_PUBLIC_TMDB_BEARER_TOKEN=your_tmdb_token
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

Then open [http://localhost:3000](http://localhost:3000).

## Project structure

```text
src/app/                   pages (home, /popular, /top, /series/*, /people, /person/[id], /[type]/[id], /about)
src/components/cards/      movie and media cards
src/components/galleries/  trending, popular, top-rated and trailer galleries
src/components/forms/      search bars and filter bar
src/components/navigation/ navbar, footer, language switch
```

This product uses the TMDB API but is not endorsed or certified by TMDB.
