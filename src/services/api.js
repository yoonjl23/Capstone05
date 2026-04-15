async function request(url, options = {}) {
  const token = localStorage.getItem('accessToken')

  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    ...options,
  })

  const contentType = response.headers.get('content-type') || ''

  let data
  if (contentType.includes('application/json')) {
    data = await response.json()
  } else {
    data = await response.text()
  }

  if (!response.ok) {
    if (response.status === 500) {
      throw new Error('입력값을 다시 확인해주세요.')
    }

    if (typeof data === 'string') {
      throw new Error(data || '요청 처리 중 오류가 발생했습니다.')
    }

    throw new Error(data.message || '요청 처리 중 오류가 발생했습니다.')
  }

  return data
}

export const api = {
  register: async ({ userId, password, confirmPassword, username }) => {
    return request('/api/users/register', {
      method: 'POST',
      body: JSON.stringify({
        userId,
        password,
        confirmPassword,
        username,
      }),
    })
  },

  login: async ({ userId, password }) => {
    return request('/api/users/login', {
      method: 'POST',
      body: JSON.stringify({
        userId,
        password,
      }),
    })
  },

  getProgress: async (userId) => {
    return request(`/api/progress/${userId}`, {
      method: 'GET',
    })
  },
}