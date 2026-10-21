import { useEffect, useState } from 'react'
import axios from 'axios'

const API_URL = 'https://jsonplaceholder.typicode.com/users'

function UserList() {
  const [listOfUsers, setListOfUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [expandedId, setExpandedId] = useState(null)

  useEffect(() => {
    const controller = new AbortController()

    axios
      .get(API_URL, { signal: controller.signal })
      .then((response) => {
        setListOfUsers(response.data)
        setLoading(false)
      })
      .catch((err) => {
        if (axios.isCancel(err)) return
        setError(err.message || 'Something went wrong')
        setLoading(false)
      })

    return () => controller.abort()
  }, [])

  const filteredUsers = listOfUsers.filter((user) =>
    user.name.toLowerCase().includes(search.trim().toLowerCase())
  )

  const toggleUser = (id) => {
    setExpandedId((current) => (current === id ? null : id))
  }

  return (
    <main className="page">
      <header className="masthead">
        <h1>USERS_</h1>
        <p className="tagline">
          RAW DATA FROM JSONPLACEHOLDER. CLICK A CARD FOR DETAILS.
        </p>
      </header>

      <label className="search">
        <span className="search-label">SEARCH BY NAME</span>
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="TYPE A NAME..."
          disabled={loading || !!error}
        />
      </label>

      {loading && <p className="status">LOADING USERS...</p>}

      {error && (
        <p className="status status-error" role="alert">
          ERROR: FAILED TO LOAD USERS ({error})
        </p>
      )}

      {!loading && !error && (
        <>
          <p className="count">
            {filteredUsers.length} / {listOfUsers.length} SHOWN
          </p>

          {filteredUsers.length === 0 ? (
            <p className="status">NO USERS MATCH "{search}"</p>
          ) : (
            <ul className="user-grid">
              {filteredUsers.map((user) => {
                const isOpen = expandedId === user.id
                const { street, suite, city, zipcode } = user.address

                return (
                  <li key={user.id} className={`card ${isOpen ? 'card-open' : ''}`}>
                    <button
                      type="button"
                      className="card-toggle"
                      onClick={() => toggleUser(user.id)}
                      aria-expanded={isOpen}
                      aria-controls={`details-${user.id}`}
                    >
                      <span className="card-id">#{String(user.id).padStart(2, '0')}</span>
                      <span className="card-name">{user.name}</span>
                      <span className="card-email">{user.email}</span>
                      <span className="card-company">{user.company.name}</span>
                      <span className="card-indicator" aria-hidden="true">
                        {isOpen ? '[ − ]' : '[ + ]'}
                      </span>
                    </button>

                    {isOpen && (
                      <dl id={`details-${user.id}`} className="details">
                        <dt>ADDRESS</dt>
                        <dd>
                          {street}, {suite}
                          <br />
                          {city} {zipcode}
                        </dd>
                        <dt>PHONE</dt>
                        <dd>{user.phone}</dd>
                        <dt>WEBSITE</dt>
                        <dd>
                          <a href={`https://${user.website}`} target="_blank" rel="noreferrer">
                            {user.website}
                          </a>
                        </dd>
                        <dt>USERNAME</dt>
                        <dd>@{user.username}</dd>
                      </dl>
                    )}
                  </li>
                )
              })}
            </ul>
          )}
        </>
      )}
    </main>
  )
}

export default UserList
