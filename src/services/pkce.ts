function base64url(buf: ArrayBuffer) {
    return btoa(String.fromCharCode(...new Uint8Array(buf)))
      .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
  }
  
  export async function generatePkcePair() {
    const rand = new Uint8Array(32); crypto.getRandomValues(rand)
    const verifier = base64url(rand.buffer)
    const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier))
    const challenge = base64url(digest)
    return { verifier, challenge, method: 'S256' as const }
  }
  