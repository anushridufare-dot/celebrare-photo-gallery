
import { useState, useReducer, useCallback, useMemo, useEffect } from 'react'
import useFetchPhotos from './hooks/useFetchPhotos'

function favoritesReducer(state, action) {
  switch (action.type) {
    case 'TOGGLE': {
      if (state.includes(action.id)) {
        return state.filter((id) => id !== action.id)
      }
      return [...state, action.id]
    }
    default:
      return state
  }
}

function App() {
  const { photos, loading, error } = useFetchPhotos()
  const [search, setSearch] = useState('')

  const [favorites, dispatch] = useReducer(
    favoritesReducer,
    [],
    () => {
      try {
        return JSON.parse(localStorage.getItem('gallery-favorites')) || []
      } catch {
        return []
      }
    }
  )

  useEffect(() => {
    localStorage.setItem('gallery-favorites', JSON.stringify(favorites))
  }, [favorites])

  const handleSearch = useCallback((event) => {
    setSearch(event.target.value)
  }, [])

  const filteredPhotos = useMemo(() => {
    return photos.filter((photo) =>
      photo.author.toLowerCase().includes(search.toLowerCase())
    )
  }, [photos, search])

  function toggleFavorite(id) {
    dispatch({ type: 'TOGGLE', id })
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <h1 className="text-2xl font-bold tracking-tight">
            Snap<span className="text-violet-600">Gallery</span>
          </h1>
          <span className="rounded-full bg-violet-100 px-4 py-2 text-sm font-medium text-violet-700">
            ♥ {favorites.length} Favourites
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-violet-600">
            Discover something beautiful
          </p>
          <h2 className="text-3xl font-bold sm:text-4xl">Explore the gallery</h2>
          <p className="mt-3 text-slate-500">
            A collection of moments, captured around the world.
          </p>
        </div>

        <input
          type="text"
          placeholder="Search by author name..."
          value={search}
          onChange={handleSearch}
          className="mb-8 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100 sm:max-w-md"
        />

        {loading && (
          <div className="flex flex-col items-center py-16" role="status">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-violet-200 border-t-violet-600" />
            <p className="mt-4 text-slate-500">Loading photos...</p>
          </div>
        )}

        {error && (
          <div className="rounded-xl bg-red-50 p-5 text-red-700" role="alert">
            Failed to load photos: {error}. Please refresh and try again.
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {filteredPhotos.map((photo) => (
                <article
                  key={photo.id}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <img
                    src={photo.download_url}
                    alt={`Photo by ${photo.author}`}
                    loading="lazy"
                    className="h-52 w-full object-cover"
                  />
                  <div className="flex items-center justify-between p-4">
                    <div className="min-w-0">
                      <p className="truncate font-semibold">{photo.author}</p>
                      <p className="mt-1 text-sm text-slate-500">Photographer</p>
                    </div>
                    <button
                      onClick={() => toggleFavorite(photo.id)}
                      aria-label={
                        favorites.includes(photo.id)
                          ? 'Remove from favourites'
                          : 'Add to favourites'
                      }
                      aria-pressed={favorites.includes(photo.id)}
                      className={`ml-3 text-2xl transition hover:scale-110 ${
                        favorites.includes(photo.id)
                          ? 'text-rose-500'
                          : 'text-slate-300 hover:text-rose-400'
                      }`}
                    >
                      {favorites.includes(photo.id) ? '♥' : '♡'}
                    </button>
                  </div>
                </article>
              ))}
            </div>

            {filteredPhotos.length === 0 && (
              <p className="py-12 text-center text-slate-500">
                No photos found. Try another author name.
              </p>
            )}
          </>
        )}
      </main>
    </div>
  )
}

export default App
