const STORAGE_KEY = 'tm_history'
const MAX_ENTRIES = 50

export function loadHistory() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
            .sort((a, b) => b.updatedAt - a.updatedAt)
    } catch {
        return []
    }
}

export function saveConversation(id, configLabel, systemPrompt, messages) {
    const history = loadHistory()
    const now = Date.now()
    const existing = history.find(e => e.id === id)
    const entry = existing
        ? { ...existing, configLabel, systemPrompt, messages, updatedAt: now }
        : { id, configLabel, systemPrompt, messages, createdAt: now, updatedAt: now }
    const updated = [entry, ...history.filter(e => e.id !== id)].slice(0, MAX_ENTRIES)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
}

export function deleteConversation(id) {
    const updated = loadHistory().filter(e => e.id !== id)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
}

export function clearHistory() {
    localStorage.removeItem(STORAGE_KEY)
}
