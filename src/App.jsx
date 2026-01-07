import { useState } from 'react'
import './App.css'

function App() {
  const [inputText, setInputText] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingLabels, setLoadingLabels] = useState(false)
  const [results, setResults] = useState(null)
  const [labels, setLabels] = useState(null)
  const [error, setError] = useState(null)

  const handleAnalyse = async () => {
    if (!inputText.trim()) {
      setError('Please enter some text to analyze')
      return
    }

    setLoading(true)
    setLoadingLabels(false)
    setError(null)
    setResults(null)
    setLabels(null)

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:7071';
      
      // First, call the complaints endpoint
      const response = await fetch(`${apiUrl}/api/complaints`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: inputText
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setResults(data)
      setLoading(false)

      // Then, call the labels endpoint in the background
      setLoadingLabels(true)
      try {
        // Transform keyPhrases from objects to strings
        const keyPhrasesArray = (data.keyPhrases || []).map(phrase => 
          typeof phrase === 'string' ? phrase : phrase.text || phrase
        )

        const labelsResponse = await fetch(`${apiUrl}/api/complaints/labels`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            complaint: inputText,
            sentiment: data.sentiment,
            keyPhrases: keyPhrasesArray,
            entities: data.entities || []
          })
        })

        if (!labelsResponse.ok) {
          throw new Error(`HTTP error! status: ${labelsResponse.status}`)
        }

        const labelsData = await labelsResponse.json()
        setLabels(labelsData)
      } catch (labelsErr) {
        console.error('Error fetching labels:', labelsErr)
        setError(`Failed to fetch labels: ${labelsErr.message}`)
      } finally {
        setLoadingLabels(false)
      }
    } catch (err) {
      setError(err.message || 'Failed to analyze complaint. Please check if the service is running.')
      console.error('Error:', err)
      setLoading(false)
      setLoadingLabels(false)
    }
  }

  return (
    <div className="app">
      <div className="container">
        <h1 className="title">Complaints Analyzer</h1>
        
        <div className="input-section">
          <label htmlFor="complaint-input" className="label">
            Complain
          </label>
          <textarea
            id="complaint-input"
            className="textarea"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Enter your complaint here..."
            rows={6}
          />
          <button
            className="button"
            onClick={handleAnalyse}
            disabled={loading}
          >
            {loading ? 'Analyzing...' : 'Analyse'}
          </button>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {results && (
          <div className="results-section">
            <div className="results-grid">
              <div className="result-column">
                <h2 className="column-title">Sentiment</h2>
                <div className={`sentiment-badge sentiment-${results.sentiment.toLowerCase()}`}>
                  {results.sentiment}
                </div>
                {results.requestId && (
                  <div className="metadata">
                    <p className="metadata-item">
                      <span className="metadata-label">Request ID:</span>
                      <span className="metadata-value">{results.requestId}</span>
                    </p>
                    {results.timestamp && (
                      <p className="metadata-item">
                        <span className="metadata-label">Timestamp:</span>
                        <span className="metadata-value">
                          {new Date(results.timestamp).toLocaleString()}
                        </span>
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div className="result-column">
                <h2 className="column-title">Key Phrases</h2>
                {results.keyPhrases && results.keyPhrases.length > 0 ? (
                  <div className="phrases-list">
                    {results.keyPhrases.map((phrase, index) => (
                      <div key={index} className="phrase-item">
                        <span className="phrase-text">{phrase.text}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="no-data">No key phrases found</p>
                )}
              </div>

              <div className="result-column">
                <h2 className="column-title">Labels</h2>
                {loadingLabels ? (
                  <div className="labels-loading">
                    <p className="loading-text">Processing labels, please wait...</p>
                  </div>
                ) : labels && labels.labels && labels.labels.length > 0 ? (
                  <div className="labels-list">
                    {labels.labels.map((label, index) => (
                      <div key={index} className="label-item">
                        <span className="label-name">{label.displayName || label.id}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="no-data">No labels available</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App

